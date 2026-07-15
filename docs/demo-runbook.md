# StellarPass demo runbook

## Prerequisites

- Deployed current Event, Ticket, and Royalty contract WASM on Stellar testnet.
- Ticket contract configured with the Royalty contract and payment-token SAC.
- `frontend/.env.local` populated with the deployed IDs and ticket administrator public key.
- Freighter installed and connected to the funded testnet wallet.

## Demo flow

1. Open `/wallet` and connect Freighter.
2. Open `/events`; create an event on-chain using the administrator wallet.
3. Mint a ticket, confirm Freighter, and show the confirmed transaction hash and QR code.
4. Transfer the ticket from its owner wallet, then show the updated owner after final confirmation.
5. From the seller wallet, list a ticket for resale and show the `listed` on-chain event in an RPC explorer/indexer.
6. Switch to a buyer wallet and purchase the listing. Show the final transaction and the creator/platform payment balances.
7. Open `/check-in`, scan the QR code with the administrator gate wallet, and confirm the ticket is marked used.
8. Scan the same code again to demonstrate the contract rejects duplicate admission.

## Presenter notes

- Do not promise primary-sale payment collection: the current payment settlement covers resale only.
- Use real testnet transaction links/hashes in the final presentation.
- Explain that all UI success messages follow final Soroban RPC status, not only wallet approval.
