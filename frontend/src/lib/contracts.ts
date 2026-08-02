import {
  Address,
  BASE_FEE,
  Contract,
  nativeToScVal,
  Networks,
  scValToNative,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';
import { Server } from '@stellar/stellar-sdk/rpc';
import { signTransaction } from '@stellar/freighter-api';

const NETWORK_PASSPHRASE = Networks.TESTNET;
const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

type ContractArgument =
  | { type: 'address'; value: string }
  | { type: 'string'; value: string }
  | { type: 'u32'; value: number }
  | { type: 'u128'; value: number | bigint }
  | { type: 'native'; value: boolean | number | bigint };

/** Error returned when environment variables for contract IDs are missing. */
export class MissingContractConfigError extends Error {
  constructor(variableName: string) {
    super(`${variableName} is not configured. Deploy contracts and add their IDs to .env.local.`);
    this.name = 'MissingContractConfigError';
  }
}

export type ContractActionResult = {
  ok: boolean;
  txHash?: string;
  returnValue?: unknown;
  error?: string;
};

function configuredContractId(value: string | undefined, name: string): string {
  if (!value || !/^C[A-Z2-7]{55}$/.test(value)) {
    throw new MissingContractConfigError(name);
  }

  return value;
}

function toScVal(argument: ContractArgument): xdr.ScVal {
  if (argument.type === 'address') {
    return new Address(argument.value).toScVal();
  }
  if (argument.type === 'string') {
    return xdr.ScVal.scvString(argument.value);
  }
  if (argument.type === 'u32') {
    return nativeToScVal(argument.value, { type: 'u32' });
  }
  if (argument.type === 'u128') {
    return nativeToScVal(argument.value, { type: 'u128' });
  }
  return nativeToScVal(argument.value);
}

export function getEventContractId(): string {
  return configuredContractId(import.meta.env.VITE_EVENT_CONTRACT_ID, 'VITE_EVENT_CONTRACT_ID');
}

export function getTicketContractId(): string {
  return configuredContractId(import.meta.env.VITE_TICKET_CONTRACT_ID, 'VITE_TICKET_CONTRACT_ID');
}

export function getTicketAdminAddress(): string {
  const address = import.meta.env.VITE_TICKET_ADMIN_ADDRESS;
  if (!address || !/^G[A-Z2-7]{55}$/.test(address)) {
    throw new Error('VITE_TICKET_ADMIN_ADDRESS is not configured with a valid Stellar account address.');
  }

  return address;
}

/** Simulates, signs, submits, and confirms a Soroban contract invocation. */
export async function submitContractAction(options: {
  contractId: string;
  method: string;
  args: ContractArgument[];
  source: string;
}): Promise<ContractActionResult> {
  try {
    const server = new Server(RPC_URL, { allowHttp: false });
    const sourceAccount = await server.getAccount(options.source);
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(new Contract(options.contractId).call(options.method, ...options.args.map(toScVal)))
      .setTimeout(60)
      .build();

    const preparedTransaction = await server.prepareTransaction(transaction);
    const signed = await signTransaction(preparedTransaction.toXDR(), {
      address: options.source,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    if (signed.error || !signed.signedTxXdr) {
      return { ok: false, error: signed.error?.message || 'Wallet signing was cancelled.' };
    }

    const signedTransaction = TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK_PASSPHRASE);
    const submitted = await server.sendTransaction(signedTransaction);
    if (submitted.status !== 'PENDING' && submitted.status !== 'DUPLICATE') {
      return { ok: false, txHash: submitted.hash, error: `RPC rejected the transaction (${submitted.status}).` };
    }

    const finalResult = await server.pollTransaction(submitted.hash, { attempts: 15 });
    if (finalResult.status !== 'SUCCESS') {
      return { ok: false, txHash: submitted.hash, error: `Transaction ${finalResult.status.toLowerCase()} on Stellar testnet.` };
    }

    return {
      ok: true,
      txHash: submitted.hash,
      returnValue: finalResult.returnValue ? scValToNative(finalResult.returnValue) : undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to submit the contract action.',
    };
  }
}

/** Creates an event on-chain using the event contract. */
export async function submitEventCreation(options: {
  organizer: string;
  title: string;
  price: number;
  totalSupply: number;
  source: string;
}): Promise<ContractActionResult> {
  const priceInStroops = BigInt(Math.round(options.price * 10_000_000));
  if (priceInStroops <= 0n) {
    return { ok: false, error: 'Event price must be greater than zero.' };
  }
  return submitContractAction({
    contractId: getEventContractId(),
    method: 'create_event',
    args: [
      { type: 'address', value: options.organizer },
      { type: 'string', value: options.title },
      { type: 'u128', value: priceInStroops },
      { type: 'u32', value: options.totalSupply },
    ],
    source: options.source,
  });
}

/** Purchases a primary ticket using the configured payment-token SAC. */
export async function submitPrimaryTicketPurchase(options: {
  eventId: number;
  buyer: string;
  metadata: string;
  source: string;
}): Promise<ContractActionResult> {
  return submitContractAction({
    contractId: getTicketContractId(),
    method: 'purchase_ticket',
    args: [
      { type: 'u32', value: options.eventId },
      { type: 'address', value: options.buyer },
      { type: 'string', value: options.metadata },
    ],
    source: options.source,
  });
}

/** Completes a seller-authorized on-chain listing with buyer-only authorization. */
export async function submitTicketResale(options: {
  ticketId: number;
  buyer: string;
  source: string;
}): Promise<ContractActionResult> {
  return submitContractAction({
    contractId: getTicketContractId(),
    method: 'buy_listed_ticket',
    args: [
      { type: 'u32', value: options.ticketId },
      { type: 'address', value: options.buyer },
    ],
    source: options.source,
  });
}

/** Owner self-check-in: marks a ticket as used by its owner. */
export async function submitOwnerCheckIn(options: {
  ticketId: number;
  owner: string;
  source: string;
}): Promise<ContractActionResult> {
  return submitContractAction({
    contractId: getTicketContractId(),
    method: 'use_ticket',
    args: [
      { type: 'u32', value: options.ticketId },
      { type: 'address', value: options.owner },
    ],
    source: options.source,
  });
}

/** Creates a seller-authorized listing that a different wallet can purchase. */
export async function submitTicketListing(options: {
  ticketId: number;
  seller: string;
  salePrice: number;
  source: string;
}): Promise<ContractActionResult> {
  return submitContractAction({
    contractId: getTicketContractId(),
    method: 'list_for_resale',
    args: [
      { type: 'u32', value: options.ticketId },
      { type: 'address', value: options.seller },
      { type: 'u128', value: BigInt(options.salePrice) },
    ],
    source: options.source,
  });
}
