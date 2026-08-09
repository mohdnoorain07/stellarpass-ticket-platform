<div align="center">

# 🎟️ StellarPass

### Decentralized event ticketing on the **Stellar** network

[![CI](https://github.com/mohdnoorain07/stellarpass-ticket-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/mohdnoorain07/stellarpass-ticket-platform/actions/workflows/ci.yml)
[![Rust](https://img.shields.io/badge/tests-16%20passing-2ea44f?logo=rust&logoColor=white&label=Rust)](https://github.com/mohdnoorain07/stellarpass-ticket-platform/actions)
[![Frontend](https://img.shields.io/badge/tests-41%20passing-2ea44f?logo=react&logoColor=white&label=Frontend)](https://github.com/mohdnoorain07/stellarpass-ticket-platform/actions)
[![Soroban](https://img.shields.io/badge/Soroban-sdk%2021.7-7b16ff?logo=stellar&logoColor=white)](https://soroban.stellar.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Create events, mint verifiable tickets, transfer ownership, check in with QR codes,
> and settle secondary-market royalties — **all on-chain** with Soroban smart contracts.

GitHub username → `mohdnoorain07`
GitHub repo → https://github.com/mohdnoorain07/stellarpass-ticket-platform

</div>

---

## ✨ What is this?

**StellarPass** is a full-stack **Level 3 (Orange Belt)** Stellar dApp: a React/TypeScript
frontend talks to three deployed Soroban smart contracts that handle the entire ticket
lifecycle — event registry, minting, transfers, resale with automatic royalty splits, and
QR gate check-in — with **16 passing Rust contract tests**, **41 passing frontend tests**,
a GitHub Actions CI pipeline, and Vercel deployment configuration.

---

## 🚀 Live Links & Testnet Deployments

| | |
|---|---|
| **Live deployed link** | [Live demo](https://stellarpass-ticket-platform.vercel.app) |
| **Demo video link** | → _(coming soon)_ |
| **GitHub repository** | → https://github.com/mohdnoorain07/stellarpass-ticket-platform |

**Deployed contract IDs (Stellar testnet):**

| Contract | ID |
|----------|----|
|`VITE_EVENT_CONTRACT_ID` | `CB2VJVDIMGZ4IRMSCGM56AYC6EBWCYMLX62VJ6PYNWLIPH2H3OG2OPV7` |
| `VITE_TICKET_CONTRACT_ID` | `CCIWDM4VQZU34BE44S5IDAGTV75QLBCE3MKLTEEDBJCAT3FPPIOH4CIL` |
| `VITE_TICKET_ADMIN_ADDRESS` | `GDNCIK6JATAXQ2QFGWAMKJKDEAOXBZMDAD6ZMRZOAEHBRI3Y5N2ONTSU` |


**On-chain interaction proof** — `create_event` via the admin wallet:

- **Transaction hash:** `ba699dbe7dd354efbbbe74344041b562d162ce6a9ca51f72fcd6673b15a1e351`
- **Explorer:** https://stellar.expert/explorer/testnet/tx/ba699dbe7dd354efbbbe74344041b562d162ce6a9ca51f72fcd6673b15a1e351
- **Result:** event `#2` "StellarPass Orange Belt Demo" (price 10,000,000 stroops = 1 XLM, supply 100)

---

## 📸 Screenshots

_(Add mobile responsive UI, CI/CD pipeline, and test output screenshots here.)_

---

## ✨ Features

- **🔗 Connect & reconnect** a Freighter wallet.
- **📅 Create on-chain events** with title, price (stroops), supply, and organizer.
- **💳 Purchase primary tickets** — atomic capacity reservation, token payment, and minting in one Soroban transaction.
- **🎫 Mint verifiable tickets** with QR codes and transferable ownership.
- **🔄 Secondary-market resale** — seller lists a ticket, a different buyer purchases it with their own wallet signature.
- **💸 Automatic royalty engine** — creator and platform basis-point splits settled on-chain on every resale.
- **🎟️ QR gate check-in** — scan to validate a ticket; the contract permanently rejects duplicate admission.
- **⚡ Real-time updates** — live Soroban contract event streaming (`event`, `mint`, `xfer`, `used`, `checkin`, `listed`, `sold`).
- **🌗 Dark/Light theme** with system preference detection.
- **⚙️ Configurable Stellar testnet/mainnet settings** through Vite environment variables.

---

## 🧱 Tech Stack

| Layer | Technologies |
|-------|-------------|
| 🌐 Frontend | React, TypeScript, Vite, Tailwind CSS, qrcode.react, @zxing/browser |
| 👛 Wallet | Freighter Wallet API |
| ⛓️ Blockchain | Stellar Soroban |
| 🦀 Smart contracts | Rust, soroban-sdk 21.7 |
| 🧪 Tests | Cargo test (16), Vitest + Testing Library (41) |
| 🚀 CI/CD | GitHub Actions, Vercel |

---

## 🧪 Test Status

> **Test output with 3+ passing tests** ✅ — real run, `cargo test --workspace`:

```text
Running unittests src\lib.rs (target\debug\deps\stellarpass_event_contract-bea4ac417a6078ab.exe)

running 4 tests
test test::get_missing_event_returns_error ... ok
test test::create_and_read_event ... ok
test test::reservation_enforces_event_supply ... ok
test test::test_multiple_events ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.06s

Running unittests src\lib.rs (target\debug\deps\stellarpass_royalty_contract-d886ef13ff178686.exe)

running 3 tests
test test::calculates_royalty_split ... ok
test test::calculate_payouts_across_multiple_prices ... ok
test test::configures_recipients_and_rejects_invalid_share_total ... ok

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s

Running unittests src\lib.rs (target\debug\deps\stellarpass_ticket_contract-764c82681bf4002f.exe)

running 9 tests
test test::get_missing_ticket_returns_error ... ok
test test::mint_and_read_ticket ... ok
test test::use_ticket_marks_it_used ... ok
test test::using_twice_returns_error ... ok
test test::transfer_used_ticket_returns_error ... ok
test test::transfer_ticket_updates_owner ... ok
test test::administrator_can_check_in_ticket_once ... ok
test test::mint_multiple_tickets_increments_ids ... ok
test test::listed_resale_transfers_ownership_and_distributes_payment ... ok

test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.10s
```

> **Note:** captured from a local Windows run — binary hashes and paths vary by platform
> (Linux CI produces no `.exe`). The three doc-test harnesses report `0 passed`.

| Suite | Result |
|-------|--------|
| `cargo test --workspace` | ✅ **16 passed, 0 failed** (Rust contract tests) |
| `cargo fmt --all -- --check` | ✅ clean (checked in CI) |
| `npm test` | ✅ 41 passed, 0 failed (Vitest + Testing Library) |

---

## 🏗️ Smart Contracts

The workspace contains **three Soroban contracts that talk to each other**:

| Contract | Responsibility |
|----------|---------------|
| **event_contract** | Stores event metadata, supply, price, organizer; reserves capacity during purchases. |
| **ticket_contract** | Ticket lifecycle: primary purchase, mint, transfer, resale listing, QR check-in. |
| **royalty_contract** | Stores creator/platform recipients and calculates validated basis-point splits. |

**Main ticketing flow:**

1. 🏁 Admin initializes the event, ticket, and royalty contracts.
2. 🧾 Admin configures royalty recipients and shares (must total 10,000 bps).
3. 🔌 Admin wires the ticket contract to the royalty contract, payment-token SAC, and event contract.
4. 📅 Organizer creates an event on-chain.
5. 💳 Buyer purchases a primary ticket — capacity reservation, token payment, and minting are atomic.
6. 🔄 Seller lists a ticket for resale; a buyer purchases it — token transfers, royalties, listing removal, and ownership change settle in one transaction.
7. 🎟️ Gate admin scans the QR code; the contract marks the ticket used and rejects duplicates.

---

## 🔧 Prerequisites

- Node.js 20+
- npm
- Rust stable toolchain with `wasm32-unknown-unknown` target
- Soroban/Stellar CLI for contract deployment
- Freighter browser wallet
- Stellar testnet account funded with testnet XLM

---

## ⚙️ Environment Variables

Copy `frontend/.env.example` to `frontend/.env.local` and configure:

| Variable | Description |
|----------|-------------|
| `VITE_SOROBAN_RPC_URL` | Soroban RPC endpoint (default: testnet) |
| `VITE_EVENT_CONTRACT_ID` | Deployed EventContract ID |
| `VITE_TICKET_CONTRACT_ID` | Deployed TicketContract ID |
| `VITE_TICKET_ADMIN_ADDRESS` | Ticket contract admin public key |

---

## 💻 Run Locally

Install frontend dependencies:

```bash
cd frontend
npm ci
```

Start the frontend dev server:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Run frontend tests:

```bash
npm test
```

Run smart contract tests (from the repository root):

```bash
cargo test --workspace
```

Build contract WASM artifacts:

```bash
./deploy.sh
```

> **💡 Windows note:** `.cargo/config.toml` pins the MSYS2 MinGW-w64 linker and strips the
> DLL export table (`-Wl,--exclude-all-symbols`), which fixes the "export ordinal too large"
> error when Soroban contract test binaries are linked on Windows. The MSYS2 path is
> machine-specific — adjust it if your MinGW-w64 lives elsewhere. Linux/macOS are unaffected.

---

## 🌐 Deployment

This repository is configured for Vercel with `vercel.json`:

```json
{
  "framework": "vite",
  "installCommand": "npm ci --prefix frontend",
  "buildCommand": "npm run build --prefix frontend",
  "outputDirectory": "frontend/dist"
}
```

**Recommended Vercel setup:**

1. Connect the GitHub repository to Vercel.
2. Keep the project root as the repository root.
3. Add all required `VITE_` environment variables in Vercel.
4. Push to `main` to trigger production deployment.

For smart contract deployment to Stellar testnet, follow the [testnet deployment guide](docs/testnet-deploy.md).

---

## 🔄 CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml`

The CI pipeline runs on every push and pull request. Jobs:

- **contracts** — installs Rust, checks formatting (`cargo fmt --all -- --check`), runs `cargo test --workspace` (16 tests), and builds deployment WASM.
- **frontend** — installs Node.js 20, runs `npm ci`, `npm test` (41 tests), and `npm run build`.

Current delivery flow:

```
push to GitHub
  -> GitHub Actions validates contracts and frontend build
  -> Vercel builds frontend/dist
  -> Vercel deploys the live app
```

---

## 📁 Project Structure

```
stellarpass/
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- .cargo/
|   `-- config.toml            Windows GNU linker + test-binary workaround
|-- contracts/
|   |-- event_contract/
|   |   `-- src/lib.rs         4 tests
|   |-- ticket_contract/
|   |   `-- src/lib.rs         9 tests
|   |-- royalty_contract/
|   |   `-- src/lib.rs         3 tests
|   |-- Cargo.toml
|   `-- Cargo.lock
|-- frontend/
|   |-- src/
|   |   |-- components/        Reusable UI components
|   |   |-- pages/             Route pages (Home, Events, Check-in, Wallet)
|   |   |-- lib/               Wallet, contracts, live events, theme
|   |   |-- data/              Starter events
|   |   |-- App.tsx
|   |   `-- main.tsx
|   |-- package.json
|   |-- vite.config.js
|   `-- .env.example
|-- docs/
|   |-- architecture.md
|   |-- demo-runbook.md
|   `-- testnet-deploy.md
|-- deploy.sh                  Build WASM artifacts
|-- vercel.json
|-- SUBMISSION_CHECKLIST.md
`-- README.md
```

---

## 🎬 Demo Flow

1. Open the app and connect Freighter on `/wallet`.
2. Create an on-chain event on `/events` using the admin wallet.
3. Purchase/mint a ticket, confirm Freighter, and show the transaction hash and QR code.
4. Transfer the ticket and show the updated owner after final confirmation.
5. List a ticket for resale from the seller wallet; purchase it from a buyer wallet and show royalty payouts.
6. Scan the QR code at `/check-in` and confirm the ticket is marked used.
7. Scan the same code again to demonstrate the contract rejects duplicate admission.

See the [demo runbook](docs/demo-runbook.md) for full presenter notes.

---

## ✅ Submission Checklist

See [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md) for the final project checklist.

---

## 📄 About

This is the Stellar **Level 3 (Orange Belt)** program project.

## License

MIT
