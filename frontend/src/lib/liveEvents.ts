import { scValToNative } from '@stellar/stellar-sdk';
import { Server } from '@stellar/stellar-sdk/rpc';

const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
const contractIds = [import.meta.env.VITE_EVENT_CONTRACT_ID, import.meta.env.VITE_TICKET_CONTRACT_ID]
  .filter((value): value is string => /^C[A-Z2-7]{55}$/.test(value ?? ''));

export type LiveContractEvent = {
  id: string;
  action: string;
  ledger: number;
  transactionHash: string;
  occurredAt: string;
};

export async function fetchRecentContractEvents(): Promise<LiveContractEvent[]> {
  if (contractIds.length === 0) {
    return [];
  }

  const server = new Server(RPC_URL, { allowHttp: false });
  const latest = await server.getLatestLedger();
  const response = await server.getEvents({
    startLedger: Math.max(latest.sequence - 100, 1),
    filters: [{ type: 'contract', contractIds }],
    limit: 50,
  });

  return response.events
    .map((event) => ({
      id: event.id,
      action: String(scValToNative(event.topic[0])),
      ledger: event.ledger,
      transactionHash: event.txHash,
      occurredAt: event.ledgerClosedAt,
    }))
    .reverse();
}
