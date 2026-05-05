# TrueDegree

A decentralized academic credentialing platform built on the [Stellar](https://stellar.org) network using [Soroban](https://soroban.stellar.org) smart contracts. TrueDegree creates permanent, verifiable digital records of student achievements as non-transferable tokens, eliminating forgery and loss of traditional paper certificates.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

---

## The Problem

Traditional paper certificates are prone to loss and forgery. Employers struggle to verify authenticity, and students risk losing irreplaceable credentials.

## The Solution

TrueDegree uses Soroban's State Archiving and low-cost infrastructure to create an immutable, on-chain record of academic achievements. Universities mint unique, non-transferable tokens representing diplomas and transcripts. Employers verify authenticity instantly by checking the contract address.

---

## How It Works

1. A University (authorized by multi-sig address) deploys and initializes the credentialing contract.
2. When a student completes a course, the University triggers the contract to mint a non-transferable achievement token.
3. The student's digital record is permanently updated on-chain.
4. Employers query the contract to instantly verify the authenticity and details of a degree.

---

## Why Soroban?

- **State Archiving** — Sustainable long-term storage of thousands of student records over decades
- **Low Cost** — Minimal maintenance fees make it economical for educational institutions
- **Immutability** — Permanent, tamper-proof records
- **Instant Verification** — Employers verify credentials in real-time

---

## Monorepo Structure

```
TrueDegree/
├── apps/
│   └── interface/          # Frontend application
├── contracts/
│   └── credentialing/      # Soroban smart contract (Rust)
│       ├── src/
│       │   └── lib.rs      # Core contract logic
│       └── Cargo.toml
├── scripts/
│   └── deploy.sh           # Automated deploy + initialize script
├── .github/
│   └── workflows/          # CI/CD pipelines
├── Cargo.toml              # Rust workspace config
└── README.md
```

---

## Smart Contract

The Soroban contract lives in `contracts/credentialing/src/lib.rs` and exposes the following interface:

| Function | Description |
|----------|-------------|
| `initialize(university, admin_key)` | Initialize the credentialing contract |
| `mint_credential(student, course_id, grade, timestamp)` | Mint a non-transferable achievement token |
| `verify_credential(student, course_id)` | Verify a student's credential |
| `get_transcript(student)` | Retrieve a student's complete transcript |
| `revoke_credential(student, course_id)` | Revoke a credential (if authorized) |

---

## Prerequisites

### Contracts

| Requirement | Version | Installation |
|---|---|---|
| Rust | 1.70+ | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| wasm32 target | - | `rustup target add wasm32-unknown-unknown` |
| Stellar CLI | 21.0+ | [Installation Guide](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli) |

### Frontend

| Requirement | Version | Installation |
|---|---|---|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Included with Node.js |
| Freighter | Latest | [freighter.app](https://www.freighter.app/) |

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/TrueDegree/TrueDegree.git
cd TrueDegree
```

### 2. Build & test the contract

```bash
# Build WASM
cargo build --release --target wasm32-unknown-unknown

# Run tests
cargo test --workspace
```

### 3. Deploy to testnet

```bash
./scripts/deploy.sh <UNIVERSITY_ADDRESS> <ADMIN_KEY>
```

Save the printed `Contract ID` — you'll need it in frontend config.

### 4. Configure frontend environment

```bash
cp apps/interface/.env.example apps/interface/.env.local
# Edit .env.local with your contract ID
```

### 5. Run the frontend

```bash
cd apps/interface
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit with conventional commits: `git commit -m "feat: add X"`
4. Open a pull request

---

## License

MIT — see [LICENSE](./LICENSE).

---

## Built on Stellar

TrueDegree is powered by the Stellar network and Soroban smart contracts.

- [Stellar Docs](https://developers.stellar.org)
- [Soroban Docs](https://soroban.stellar.org)
- [Freighter Wallet](https://www.freighter.app)
