# StellarPass
CI/CD Badge - [![CI](https://github.com/mohdnoorain07/stellarpass-ticket-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/mohdnoorain07/stellarpass-ticket-platform/actions/workflows/ci.yml)
> **Decentralized event ticketing on the Stellar network using Soroban smart contracts.**

Create events, mint verifiable tickets, transfer ownership, check in with QR codes, and settle secondary market royalties on-chain.

## Features

- **Event Registry** - Deploy events on Stellar with full on-chain transparency
- **Smart Tickets** - Mint tokenized passes as verifiable, transferable tickets
- **Royalty Engine** - Automatic royalty distribution on secondary market resales
- **QR Check-in** - Gate verification via QR scanning with on-chain validation
- **Wallet Integration** - Freighter wallet for signing Soroban transactions
- **Real-time Updates** - Live contract event streaming from Soroban RPC
- **Dark/Light Theme** - Full theme support with system preference detection

## Architecture

Three Soroban smart contracts with inter-contract communication:

| Contract | Responsibility |
|----------|---------------|
| **EventContract** | Store event metadata, supply, pricing, organizer |
| **TicketContract** | Ticket lifecycle: mint, transfer, resale, check-in |
| **RoyaltyContract** | Calculate and distribute resale royalty splits |

The TicketContract calls the RoyaltyContract during every resale settlement, and interacts with the EventContract for capacity reservation during primary purchases.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Blockchain | Stellar, Soroban, Soroban SDK |
| Smart Contracts | Rust |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Wallet | Freighter |
| Testing | Vitest, React Testing Library, Rust tests |
| CI/CD | GitHub Actions |

## Project Structure

```
stellarpass/
  contracts/
    event_contract/     Event registry contract
    ticket_contract/    Ticket lifecycle contract
    royalty_contract/   Royalty distribution contract
  frontend/
    src/
      components/       Reusable UI components
      pages/            Route pages
      lib/              Wallet, contracts, events, theme
      data/             Starter data
  docs/                 Architecture, deployment, demo guides
  .github/workflows/    CI/CD pipeline
  deploy.sh             Build WASM artifacts
```

## Getting Started

### Prerequisites

- Rust with `wasm32-unknown-unknown` target
- Node.js 20+
- Freighter browser extension
- Stellar CLI (for deployment)

### Build Contracts

```bash
./deploy.sh
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### Run Tests

```bash
# Frontend tests
cd frontend && npm test

# Rust contract tests
cargo test --workspace
```

### Deploy to Testnet

See the [testnet deployment guide](docs/testnet-deploy.md) for step-by-step instructions.

## Environment Variables

Copy `frontend/.env.example` to `frontend/.env.local` and configure:

| Variable | Description |
|----------|-------------|
| `VITE_SOROBAN_RPC_URL` | Soroban RPC endpoint |
| `VITE_EVENT_CONTRACT_ID` | Deployed EventContract ID |
| `VITE_TICKET_CONTRACT_ID` | Deployed TicketContract ID |
| `VITE_TICKET_ADMIN_ADDRESS` | Ticket contract admin public key |

## Demo

See the [demo runbook](docs/demo-runbook.md) for presentation flow and presenter notes.

## Future Improvements

- On-chain indexer with WebSocket push for real-time event streaming
- Primary sale payment collection with Stellar Asset Contract
- Event discovery and search
- Bulk ticket minting for organizers
- Multi-event support with ticket type variants
- NFT-style ticket metadata with IPFS storage
- Mobile native app with embedded wallet

## License

MIT
