#!/bin/bash

set -e

if [ $# -lt 2 ]; then
    echo "Usage: ./scripts/deploy.sh <UNIVERSITY_ADDRESS> <ADMIN_KEY>"
    exit 1
fi

UNIVERSITY_ADDRESS=$1
ADMIN_KEY=$2
NETWORK=${NETWORK:-testnet}

echo "Building contract..."
cargo build --release --target wasm32-unknown-unknown

WASM_PATH="target/wasm32-unknown-unknown/release/credentialing.wasm"

echo "Deploying to $NETWORK..."
CONTRACT_ID=$(stellar contract deploy \
    --wasm "$WASM_PATH" \
    --source-account "$ADMIN_KEY" \
    --network "$NETWORK" \
    2>&1 | grep -oP 'Contract ID: \K[A-Z0-9]+')

echo "Contract deployed: $CONTRACT_ID"

echo "Initializing contract..."
stellar contract invoke \
    --id "$CONTRACT_ID" \
    --source-account "$ADMIN_KEY" \
    --network "$NETWORK" \
    -- initialize \
    --university "$UNIVERSITY_ADDRESS" \
    --admin_key "$ADMIN_KEY"

echo "✓ Deployment complete"
echo "Contract ID: $CONTRACT_ID"
