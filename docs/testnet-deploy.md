# Testnet deployment checklist

## Current deployment (Level 3 – Orange Belt)

All contracts are deployed to **Stellar testnet** and verified live:

| Contract | Address | Explorer |
|----------|---------|----------|
| EventContract | `CBTDF6MLVMO6A6QCI2GS5KDABMQZI24DB2M7CYAWSASBK6JB4MTKJ6IP` | [stellar.expert](https://stellar.expert/explorer/testnet/contract/CBTDF6MLVMO6A6QCI2GS5KDABMQZI24DB2M7CYAWSASBK6JB4MTKJ6IP) |
| TicketContract | `CDRQWUNCR6Y2PRRXD5ZP7E7EHPEVON6XZ22KXIZVARHTCN5LEEX4N3WK` | [stellar.expert](https://stellar.expert/explorer/testnet/contract/CDRQWUNCR6Y2PRRXD5ZP7E7EHPEVON6XZ22KXIZVARHTCN5LEEX4N3WK) |
| Ticket admin (Freighter) | `GDNCIK6JATAXQ2QFGWAMKJKDEAOXBZMDAD6ZMRZOAEHBRI3Y5N2ONTSU` | [stellar.expert](https://stellar.expert/explorer/testnet/account/GDNCIK6JATAXQ2QFGWAMKJKDEAOXBZMDAD6ZMRZOAEHBRI3Y5N2ONTSU) |

### Sample on-chain interaction (proof of contract interaction)

`create_event` invoked against EventContract from the admin wallet:

- **Transaction hash:** `ba699dbe7dd354efbbbe74344041b562d162ce6a9ca51f72fcd6673b15a1e351`
- **Explorer:** https://stellar.expert/explorer/testnet/tx/ba699dbe7dd354efbbbe74344041b562d162ce6a9ca51f72fcd6673b15a1e351
- **Result:** created event `#2` "StellarPass Orange Belt Demo" (price 10,000,000 stroops = 1 XLM, supply 100, organizer = admin wallet)

1. Install the Stellar CLI:
   - https://developers.stellar.org/docs/build/soroban/getting-started/setup
2. Authenticate a funded testnet account:
   - `soroban keys generate --network testnet --global stellarpass`
   - `soroban keys fund --network testnet stellarpass`
3. Optimize the built wasm:
   - `soroban contract optimize --wasm target/wasm32-unknown-unknown/release/stellarpass_event_contract.wasm`
   - `soroban contract optimize --wasm target/wasm32-unknown-unknown/release/stellarpass_ticket_contract.wasm`
   - `soroban contract optimize --wasm target/wasm32-unknown-unknown/release/stellarpass_royalty_contract.wasm`
4. Deploy each contract:
   - `soroban contract deploy --wasm <optimized.wasm> --source stellarpass --network testnet`
5. Create `frontend/.env.local` from `frontend/.env.example` and set:
   - `VITE_EVENT_CONTRACT_ID` to the deployed event contract ID.
   - `VITE_TICKET_CONTRACT_ID` to the deployed ticket contract ID.
   - `VITE_TICKET_ADMIN_ADDRESS` to the Stellar public key that initialized the ticket contract.

## Browser transaction flow

The ticket action in the frontend calls `mint_ticket`. The configured administrator wallet must be connected in Freighter because the current contract requires both the administrator and ticket owner to authorize the call; therefore it can only mint to the same wallet that initialized the ticket contract. The app simulates the transaction, asks Freighter to sign the assembled XDR, submits it to Soroban RPC, and waits for a final `SUCCESS` result before recording the ticket locally.

This contract does not implement payment collection or public ticket purchases. Do not describe the current mint operation as a purchase until that on-chain feature is added and redeployed.

## Resale configuration

The updated resale method settles payments through a Stellar Asset Contract (SAC). After deploying the updated contracts, the ticket-contract administrator must:

1. Call `RoyaltyContract.configure` with the creator and platform public keys plus shares totaling exactly 10,000 basis points.
2. Call `TicketContract.set_royalty_contract` with the royalty contract ID.
3. Call `TicketContract.set_payment_token` with the SAC contract ID for the accepted payment asset.
4. Call `TicketContract.set_event_contract` with the Event contract ID.

The resale lifecycle is now two on-chain operations:

1. The seller calls `list_for_resale` once, authorizing the price and listing.
2. A buyer calls `buy_listed_ticket` with only their own wallet signature.

The purchase transfers the configured token to seller/creator/platform, removes the listing, and changes ticket ownership atomically. This is the browser flow implemented in the Events page.

## Primary ticket purchase

Events store their price in stroops (7 decimal places for XLM). The frontend converts the organizer's XLM input to stroops before publishing. A buyer calls `TicketContract.purchase_ticket`; it reads the event, reserves one unit of supply through an Event-contract invocation, transfers the configured payment-token amount to the organizer, and mints the ticket atomically.

## Real-time event stream

The current contracts emit lifecycle events. After deployment, subscribe an indexer or backend worker to the Soroban RPC event stream for the Event and Ticket contract IDs. Use the published `event`, `mint`, `xfer`, `used`, `checkin`, `listed`, and `sold` topics to update the event catalogue, ownership, listings, and gate dashboard without polling local browser storage.

## Gate check-in

Redeploy the ticket contract after adding `check_in_ticket`. The `/check-in` route accepts a `stellarpass:ticket:<id>` QR payload and submits `check_in_ticket` through Freighter. It intentionally requires the configured ticket-contract administrator wallet, then the contract permanently marks the ticket used. A second check-in fails on-chain.
