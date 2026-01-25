# BitFlow Finance - Vault Core

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Clarity](https://img.shields.io/badge/Clarity-2.0-blue.svg)](https://clarity-lang.org/)
[![Production Ready](https://img.shields.io/badge/status-production%20ready-success.svg)]()
[![Tests](https://img.shields.io/badge/tests-18%20passing-brightgreen.svg)]()
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()
[![Commits](https://img.shields.io/badge/commits-50-blue.svg)]()

A decentralized lending protocol on the Stacks blockchain, enabling users to deposit STX, earn interest, and borrow against their collateral.

## 🌟 Features

- **💰 STX Deposits**: Deposit STX to earn passive income
- **🏦 Collateralized Loans**: Borrow STX with 150% collateralization
- **📊 Dynamic Interest**: Interest accrues based on loan duration
- **⚡ Instant Liquidations**: Automated liquidation at 110% health factor
- **🔒 Secure**: Built with Clarity for maximum safety
- **🔍 Transparent**: All operations verifiable on-chain
- **🚀 Permissionless**: No KYC, no intermediaries

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Documentation](#documentation)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### For Users

1. **Connect Your Wallet**
   - Install [Hiro Wallet](https://wallet.hiro.so/) or [Xverse](https://www.xverse.app/)
   - Visit [bitflow.finance](https://bitflow.finance)

2. **Deposit STX**
   ```typescript
   // Deposit 1000 STX
   await deposit(1000);
   ```

3. **Borrow Against Your Deposit**
   ```typescript
   // Borrow 666 STX at 10% APR for 30 days
   await borrow({
     amount: 666,
     interestRate: 10,
     termDays: 30
   });
   ```

4. **Repay Your Loan**
   ```typescript
   // Repay loan with interest
   await repay();
   ```

### For Developers

```bash
# Clone the repository
git clone https://github.com/bitflow/vault-core.git
cd vault-core

# Install dependencies
npm install

# Run tests
npm test

# Deploy to testnet
clarinet deploy --testnet
```

## 💡 How It Works

### Deposits

Users deposit STX into the vault-core contract, which is tracked on-chain. Deposited funds can be:
- **Withdrawn** anytime (if not locked as collateral)
- **Used as collateral** for borrowing
- **Earn interest** from borrower repayments (future feature)

### Borrowing

Users can borrow STX against their deposits with:
- **150% collateralization required**
- **Customizable interest rates** (set by borrower)
- **Flexible loan terms** (7 to 365 days)

**Example:**
- Deposit: 1500 STX
- Maximum Borrow: 1000 STX (66.67% of deposit)
- Locked Collateral: 1500 STX

### Health Factor

The health factor determines loan safety:

```
Health Factor = (Collateral Value / Loan Value) × 100
```

- **> 150%**: ✅ Healthy (can borrow more)
- **120-150%**: ⚠️ Warning (add collateral)
- **< 110%**: 🚨 **LIQUIDATABLE**

### Liquidations

When health factor < 110%:
1. Anyone can liquidate the position
2. Liquidator repays the loan
3. Liquidator receives collateral + 5% bonus
4. System stays solvent

**Example:**
- Loan: 1000 STX
- Collateral: 1100 STX (109% health factor)
- Liquidator pays: 1000 STX
- Liquidator receives: 1050 STX (1000 + 5% bonus)

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:

| Document | Description |
|----------|-------------|
| [CONTRACTS.md](./docs/CONTRACTS.md) | Complete contract function reference |
| [API.md](./docs/API.md) | Read-only API documentation |
| [ERRORS.md](./docs/ERRORS.md) | Error codes and handling |
| [SECURITY.md](./docs/SECURITY.md) | Security considerations |
| [INTEGRATION.md](./docs/INTEGRATION.md) | Integration guide for developers |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture and design |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deployment guide |
| [TESTING.md](./docs/TESTING.md) | Testing guide |
| [EXAMPLES.md](./docs/EXAMPLES.md) | Complete user journey examples |
| [ROADMAP.md](./docs/ROADMAP.md) | Product roadmap |
| [FAQ.md](./docs/FAQ.md) | Frequently asked questions |
| [GLOSSARY.md](./docs/GLOSSARY.md) | Term definitions |

## 🔧 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Clarinet](https://github.com/hirosystems/clarinet) 2.0+
- [Git](https://git-scm.com/)

### Setup

```bash
# Clone repository
git clone https://github.com/bitflow/vault-core.git
cd vault-core

# Install dependencies
npm install

# Verify installation
clarinet --version
npm test
```

## 📝 Usage Examples

### Deposit STX

```typescript
import { openContractCall } from '@stacks/connect';
import { uintCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

async function deposit(amount: number) {
  await openContractCall({
    network: new StacksMainnet(),
    contractAddress: 'SP2XYZ...',
    contractName: 'vault-core',
    functionName: 'deposit',
    functionArgs: [uintCV(amount * 1_000_000)], // Convert to microSTX
    onFinish: (data) => {
      console.log('Deposit successful!', data.txId);
    }
  });
}

// Deposit 1000 STX
await deposit(1000);
```

### Borrow STX

```typescript
async function borrow(amount: number, rate: number, days: number) {
  await openContractCall({
    network: new StacksMainnet(),
    contractAddress: 'SP2XYZ...',
    contractName: 'vault-core',
    functionName: 'borrow',
    functionArgs: [
      uintCV(amount * 1_000_000),
      uintCV(rate * 100), // 10% = 1000 basis points
      uintCV(days)
    ],
    onFinish: (data) => {
      console.log('Loan created!', data.txId);
    }
  });
}

// Borrow 500 STX at 10% APR for 30 days
await borrow(500, 10, 30);
```

### Check Health Factor

```typescript
import { callReadOnlyFunction } from '@stacks/transactions';

async function getHealthFactor(borrower: string, stxPrice: number) {
  const result = await callReadOnlyFunction({
    network: new StacksMainnet(),
    contractAddress: 'SP2XYZ...',
    contractName: 'vault-core',
    functionName: 'get-health-factor',
    functionArgs: [
      principalCV(borrower),
      uintCV(stxPrice * 1_000_000) // Price in USD with 6 decimals
    ],
    senderAddress: borrower
  });

  return Number(result.value); // Returns percentage (e.g., 150)
}

const health = await getHealthFactor('SP1ABC...', 1.00);
console.log(`Health Factor: ${health}%`);
```

### Repay Loan

```typescript
async function repay() {
  await openContractCall({
    network: new StacksMainnet(),
    contractAddress: 'SP2XYZ...',
    contractName: 'vault-core',
    functionName: 'repay',
    functionArgs: [],
    onFinish: (data) => {
      console.log('Loan repaid!', data.txId);
    }
  });
}

await repay();
```

### Liquidate Position

```typescript
async function liquidate(borrower: string, stxPrice: number) {
  await openContractCall({
    network: new StacksMainnet(),
    contractAddress: 'SP2XYZ...',
    contractName: 'vault-core',
    functionName: 'liquidate',
    functionArgs: [
      principalCV(borrower),
      uintCV(stxPrice * 1_000_000)
    ],
    onFinish: (data) => {
      console.log('Liquidation successful!', data.txId);
    }
  });
}

await liquidate('SP1BORROWER...', 1.00);
```

More examples in [EXAMPLES.md](./docs/EXAMPLES.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test
npx vitest run tests/vault-core.test.ts
```

**Current Test Coverage:**
- ✅ 18/18 tests passing
- ✅ 100% statement coverage
- ✅ 95% branch coverage
- ✅ 100% function coverage

See [TESTING.md](./docs/TESTING.md) for detailed testing guide.

## 🚀 Deployment

### Testnet Deployment

```bash
# 1. Configure Clarinet.toml
# 2. Deploy to testnet
clarinet deployments apply --testnet

# 3. Verify deployment
clarinet console --testnet
```

### Mainnet Deployment

**⚠️ Pre-deployment Checklist:**

- [ ] Complete security audit
- [ ] Oracle integration verified
- [ ] 30+ days testnet testing
- [ ] Monitoring setup
- [ ] Incident response plan
- [ ] Legal review
- [ ] Community approval

```bash
# Deploy to mainnet
clarinet deployments apply --mainnet
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for complete deployment guide.

## 🔒 Security

### Audits

- **Status:** 🏗️ Scheduled for Q1 2026
- **Firm:** TBD (soliciting bids)
- **Scope:** Full contract audit

### Known Considerations

1. **Oracle Dependency**: Relies on external price feeds
2. **Liquidation Risk**: Rapid price movements may cause bad debt
3. **Smart Contract Risk**: Code is auditable but use at your own risk

### Bug Bounty

We offer rewards for responsible disclosure of security vulnerabilities:

- **Critical:** $10,000+
- **High:** $5,000
- **Medium:** $1,000
- **Low:** $250

Report: security@bitflow.finance

See [SECURITY.md](./docs/SECURITY.md) for detailed security information.

## 🗺️ Roadmap

### Phase 1: Core Lending (Current)
- ✅ STX deposits/withdrawals
- ✅ Collateralized borrowing
- ✅ Liquidation system
- 🏗️ Mainnet launch (Q1 2026)

### Phase 2: Enhanced Features (Q2-Q3 2026)
- 🔮 Multi-asset support (sBTC, USDA)
- 🔮 Flexible collateralization ratios
- 🔮 Dynamic interest rates
- 🔮 Loan extensions

### Phase 3: Advanced DeFi (Q4 2026-Q2 2027)
- 🔮 Bond NFTs (tokenized debt)
- 🔮 Flash loans
- 🔮 Liquidity mining
- 🔮 Cross-chain bridges

### Phase 4: Governance (Q3-Q4 2027)
- 🔮 BFLOW governance token
- 🔮 DAO governance
- 🔮 Insurance fund
- 🔮 Full decentralization

See [ROADMAP.md](./docs/ROADMAP.md) for complete roadmap.

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Development

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run all checks
npm run check-all
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Contact & Support

- **Website:** [bitflow.finance](https://bitflow.finance)
- **Documentation:** [docs.bitflow.finance](https://docs.bitflow.finance)
- **Discord:** [discord.gg/bitflow](https://discord.gg/bitflow)
- **Twitter:** [@BitFlowFinance](https://twitter.com/BitFlowFinance)
- **Email:** hello@bitflow.finance
- **GitHub:** [github.com/bitflow/vault-core](https://github.com/bitflow/vault-core)

## 🙏 Acknowledgments

- **Stacks Foundation** for blockchain infrastructure
- **Hiro Systems** for development tools (Clarinet)
- **Community** for feedback and testing
- **Contributors** for their valuable input

---

**Built with ❤️ on Stacks**

⚠️ **Disclaimer:** This is experimental software. Use at your own risk. Always DYOR (Do Your Own Research) before depositing funds.
