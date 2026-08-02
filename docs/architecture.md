# StellarPass architecture

## On-chain responsibilities

| Component | Responsibility |
| --- | --- |
| Event contract | Stores event metadata, supply, price, organizer, and emits `event` on creation. |
| Ticket contract | Owns ticket lifecycle: primary purchase, transfer, seller-authorized listing, buyer purchase, QR check-in, and lifecycle events. |
| Royalty contract | Stores creator/platform payout recipients and calculates validated basis-point splits. |
| Stellar Asset Contract | Holds the accepted payment asset used by ticket resale settlement. |

The ticket contract invokes the royalty contract during purchase and calls the configured Stellar Asset Contract to distribute payment. All three payment transfers, the listing removal, and ticket ownership update are part of the same Soroban transaction.

For a primary purchase, the ticket contract reads the Event contract, reserves event capacity through `reserve_ticket`, transfers the configured payment token to the organizer, and mints the ticket atomically.

## Resale authorization model

1. Seller calls `list_for_resale(ticket_id, seller, sale_price)`.
2. Buyer calls `buy_listed_ticket(ticket_id, buyer)`.
3. Ticket contract validates the listing, invokes the royalty contract, transfers payment from buyer to seller/creator/platform, changes ownership, and removes the listing.

This avoids asking one browser wallet to sign as both seller and buyer.

## Real-time updates

Contracts publish Soroban events for `event`, `mint`, `xfer`, `used`, `checkin`, `listed`, and `sold`. A production deployment should run an indexer that consumes these events from Soroban RPC, stores a queryable projection, and pushes updates to browser clients through WebSocket or Server-Sent Events. The frontend must treat on-chain event data over optimistic local state as the source of truth.

## Security boundaries

- Secret keys never enter the frontend or repository; Freighter signs user transactions.
- Contract IDs and public administrator addresses are Vite public configuration, not secrets.
- Payment-token and royalty-contract configuration are administrator-only contract operations.
- The client waits for final RPC transaction status before applying a local success state.
- QR payloads carry only a ticket identifier; the gate verifies validity against the ticket contract before admission.
