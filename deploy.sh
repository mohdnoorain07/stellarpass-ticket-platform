#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/event_contract/Cargo.toml
cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/ticket_contract/Cargo.toml
cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/royalty_contract/Cargo.toml

echo "Contracts built."
echo "Next step: use soroban contract optimize and deploy with the Stellar CLI."
