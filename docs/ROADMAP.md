# BitFlow Roadmap

This document outlines the current status, planned features, and long-term vision for the BitFlow vault-core DeFi lending protocol.

## Table of Contents

- [Vision](#vision)
- [Current Status](#current-status)
- [Phase 1: Core Lending (Current)](#phase-1-core-lending-current)
- [Phase 2: Enhanced Features](#phase-2-enhanced-features)
- [Phase 3: Advanced DeFi](#phase-3-advanced-defi)
- [Phase 4: Governance & Decentralization](#phase-4-governance--decentralization)
- [Long-Term Vision](#long-term-vision)
- [Community Feedback](#community-feedback)

---

## Vision

**BitFlow** aims to become the leading decentralized lending protocol on the Stacks blockchain, providing:

- **Secure** and **transparent** borrowing/lending
- **Bitcoin-backed** stability through Stacks' Proof-of-Transfer
- **Permissionless** access to DeFi services
- **Community-driven** governance and development

---

## Current Status

### ✅ Completed (Phase 1)

| Feature | Status | Description |
|---------|--------|-------------|
| STX Deposits | ✅ Live | Users can deposit STX to earn interest |
| STX Withdrawals | ✅ Live | Withdraw deposited funds anytime |
| Collateralized Loans | ✅ Live | Borrow STX with 150% collateralization |
| Interest Calculation | ✅ Live | Dynamic interest based on time elapsed |
| Loan Repayment | ✅ Live | Repay loans with principal + interest |
| Liquidation System | ✅ Live | Liquidate unhealthy positions (< 110% health) |
| Read-Only API | ✅ Live | Query positions, health factors, repayment amounts |
| Comprehensive Tests | ✅ Live | 18 tests covering all functionality |
| Documentation | ✅ Live | Complete docs for developers and users |

### 🏗️ In Development

- Oracle integration for real-time STX price feeds
- Frontend dashboard (React/Next.js)
- Enhanced error handling and user feedback

### 📊 Metrics (Testnet)

- **Total Deposits:** 15,000 STX
- **Total Loans:** 8,500 STX
- **Active Positions:** 12
- **Liquidations:** 3
- **Uptime:** 99.9%

---

## Phase 1: Core Lending (Current)

**Timeline:** Q4 2025 - Q1 2026  
**Status:** ✅ **COMPLETE** (Testnet) | 🏗️ **IN PROGRESS** (Mainnet)

### Features

#### ✅ Deposits & Withdrawals
- Deposit STX to earn passive income
- Withdraw funds anytime (if not locked as collateral)
- Track total deposits and user balances

#### ✅ Collateralized Borrowing
- Borrow up to 66.67% of deposit value (150% collateralization)
- Flexible loan terms (7-365 days)
- Customizable interest rates

#### ✅ Automated Liquidations
- Liquidation threshold at 110% health factor
- 5% liquidation bonus for liquidators
- Protect lenders from bad debt

#### ✅ Developer Tools
- Complete Clarity API (6 public functions, 8 read-only)
- TypeScript integration examples
- Comprehensive test suite

### Mainnet Launch Checklist

- [ ] Complete security audit (scheduled Q1 2026)
- [ ] Integrate production oracle (Redstone or Pragma)
- [ ] Deploy frontend dashboard
- [ ] Complete 30+ days of testnet testing
- [ ] Set up monitoring and alerting
- [ ] Prepare incident response plan
- [ ] Community beta testing
- [ ] Legal review
- [ ] Marketing campaign
- [ ] **Target Launch:** Q1 2026

---

## Phase 2: Enhanced Features

**Timeline:** Q2 2026 - Q3 2026  
**Status:** 🔮 **PLANNED**

### 2.1: Multi-Asset Support

**Goal:** Support multiple cryptocurrencies as collateral and loan assets.

| Asset | As Collateral | As Loan | Priority |
|-------|---------------|---------|----------|
| STX | ✅ Current | ✅ Current | - |
| sBTC | 🔮 Planned | 🔮 Planned | High |
| USDA | 🔮 Planned | 🔮 Planned | High |
| xBTC | 🔮 Planned | ❌ | Medium |
| Custom SIP-010 Tokens | 🔮 Planned | ❌ | Low |

**Technical Requirements:**
- Support for SIP-010 fungible tokens
- Multi-asset collateral ratios
- Cross-asset liquidation logic
- Enhanced oracle integration

**Example:**
```clarity
;; Borrow USDA with STX + sBTC collateral
(borrow-multi-asset 
  (list 
    {asset: stx-token, amount: u1000}
    {asset: sbtc-token, amount: u50000000}
  )
  usda-token
  u5000  ;; Borrow 5000 USDA
)
```

### 2.2: Flexible Collateralization Ratios

**Goal:** Dynamic collateralization based on asset risk profiles.

| Asset Pair | Collateral Ratio | Liquidation Threshold |
|------------|------------------|----------------------|
| STX → STX | 150% | 110% |
| sBTC → STX | 130% | 105% |
| STX → USDA | 200% | 120% |
| sBTC → USDA | 150% | 110% |

**Benefits:**
- Lower capital requirements for stable collateral
- Risk-adjusted pricing
- Better capital efficiency

### 2.3: Interest Rate Models

**Goal:** Dynamic interest rates based on supply/demand.

```clarity
;; Utilization-based interest rate
;; Rate increases as utilization increases
(define-read-only (get-current-interest-rate)
  (let (
    (utilization (/ total-borrowed total-deposits))
  )
    (if (< utilization u50)
      u500   ;; 5% when utilization < 50%
      (if (< utilization u80)
        u1000  ;; 10% when 50-80%
        u2000  ;; 20% when > 80%
      )
    )
  )
)
```

**Benefits:**
- Rewards lenders during high demand
- Incentivizes repayment when supply is tight
- Market-driven pricing

### 2.4: Loan Extensions

**Goal:** Allow borrowers to extend loan terms.

```typescript
// Extend loan by 30 days, pay extension fee
await extendLoan({
  additionalDays: 30,
  extensionFee: 0.5, // 0.5% of loan amount
});
```

**Benefits:**
- Flexibility for borrowers
- Additional revenue for protocol
- Reduced liquidations

### 2.5: Partial Repayments

**Goal:** Allow repaying loans in installments.

```typescript
// Repay 25% of loan
await partialRepay({
  amount: loanAmount * 0.25,
  releaseCollateral: true, // Release proportional collateral
});
```

**Benefits:**
- Easier debt management
- Improved health factor without full repayment
- Better user experience

---

## Phase 3: Advanced DeFi

**Timeline:** Q4 2026 - Q2 2027  
**Status:** 🔮 **PLANNED**

### 3.1: Bond NFTs (Tokenized Debt)

**Goal:** Represent loans as tradeable NFTs.

**Concept:**
- Each loan is minted as an NFT
- NFT represents the right to repayment
- Can be traded on secondary markets

**Benefits:**
- Liquidity for lenders
- Fixed-income instruments
- Loan portfolio management

**Example:**
```clarity
;; Mint bond NFT when loan is created
(define-non-fungible-token loan-bond uint)

(define-public (borrow ...)
  (begin
    ;; ... existing logic
    (nft-mint? loan-bond loan-id tx-sender)
    (ok loan-id)
  )
)

;; Transfer bond to another user
(define-public (sell-loan-bond (loan-id uint) (buyer principal))
  (begin
    (try! (nft-transfer? loan-bond loan-id tx-sender buyer))
    ;; Update loan record with new owner
    (ok true)
  )
)
```

**Use Cases:**
- Lender wants immediate liquidity → Sells bond at discount
- Investor wants fixed-income → Buys bonds on secondary market
- Risk management → Diversify loan portfolio

### 3.2: Liquidity Mining & Rewards

**Goal:** Incentivize protocol usage with token rewards.

**Reward Distribution:**
```
Depositors: 40% of rewards
Borrowers: 30% of rewards
Liquidators: 20% of rewards
Governance Participants: 10% of rewards
```

**Implementation:**
```clarity
(define-map user-rewards principal uint)

;; Accrue rewards based on deposit duration
(define-private (accrue-deposit-rewards (user principal) (amount uint) (blocks uint))
  (let (
    (reward (/ (* amount blocks) u1000000))  ;; Simplified calculation
  )
    (map-set user-rewards user (+ (get-user-rewards user) reward))
  )
)

;; Claim rewards
(define-public (claim-rewards)
  (let (
    (rewards (get-user-rewards tx-sender))
  )
    (try! (ft-mint? bitflow-token rewards tx-sender))
    (map-delete user-rewards tx-sender)
    (ok rewards)
  )
)
```

### 3.3: Flash Loans

**Goal:** Uncollateralized loans repaid in same transaction.

**Use Cases:**
- Arbitrage opportunities
- Liquidation funding
- Collateral swaps

**Implementation:**
```clarity
(define-public (flash-loan 
  (amount uint) 
  (callback-contract principal)
  (callback-function (string-ascii 128))
)
  (begin
    ;; Transfer loan amount to borrower
    (try! (stx-transfer? amount (as-contract tx-sender) tx-sender))
    
    ;; Execute callback
    (try! (contract-call? callback-contract callback-function amount))
    
    ;; Require repayment + 0.09% fee
    (let ((fee (/ amount u1000)))
      (try! (stx-transfer? (+ amount fee) tx-sender (as-contract tx-sender)))
    )
    
    (ok true)
  )
)
```

**Safety:**
- Entire transaction reverts if not repaid
- No risk to protocol
- Small fee (0.09%) for usage

### 3.4: Leveraged Positions

**Goal:** Recursive borrowing for leveraged exposure.

**Example Workflow:**
1. Deposit 1000 STX
2. Borrow 666 STX (66.67%)
3. Deposit borrowed 666 STX
4. Borrow 444 STX (66.67% of 666)
5. Repeat until desired leverage

**Result:**
- Effective leverage: 2-3x
- Higher returns (and risks)
- Automated deleveraging on price drops

### 3.5: Cross-Chain Bridges

**Goal:** Enable deposits/loans from other blockchains.

**Supported Chains (Planned):**
- Bitcoin (via sBTC)
- Ethereum (via bridge)
- BSC, Polygon, Avalanche

**Benefits:**
- Access to larger liquidity
- Cross-chain arbitrage
- Broader user base

---

## Phase 4: Governance & Decentralization

**Timeline:** Q3 2027 - Q4 2027  
**Status:** 🔮 **PLANNED**

### 4.1: Governance Token (BFLOW)

**Distribution:**
- 40%: Community (liquidity mining, airdrops)
- 25%: Team & Advisors (4-year vesting)
- 20%: Treasury (protocol development)
- 10%: Early Investors (2-year vesting)
- 5%: Initial Liquidity

**Utility:**
- Vote on protocol parameters
- Propose new features
- Earn staking rewards
- Fee discounts

### 4.2: DAO Governance

**Proposal Types:**
```clarity
(define-map proposals
  uint
  {
    proposer: principal,
    title: (string-utf8 256),
    description: (string-utf8 2048),
    proposal-type: (string-ascii 32),  ;; "parameter", "upgrade", "treasury"
    votes-for: uint,
    votes-against: uint,
    status: (string-ascii 16),  ;; "active", "passed", "rejected"
    execution-block: uint
  }
)

;; Example: Change collateralization ratio
(propose {
  title: "Reduce STX collateral ratio to 140%",
  description: "Market has matured, 140% is sufficient...",
  type: "parameter",
  parameter-name: "collateral-ratio-stx",
  new-value: u140
})
```

**Voting Mechanism:**
- 1 BFLOW = 1 vote
- 7-day voting period
- 4% quorum required
- 60% approval threshold

### 4.3: Protocol Fee Structure

**Current (Phase 1):**
- No fees (bootstrap phase)

**Proposed (Phase 4):**
- 0.05% deposit fee
- 0.1% withdrawal fee  
- 0.5% loan origination fee
- 5% of interest payments
- 0.09% flash loan fee

**Fee Distribution:**
- 50%: BFLOW stakers
- 30%: Treasury (development)
- 20%: Buyback & burn BFLOW

### 4.4: Insurance Fund

**Goal:** Protect users from smart contract exploits and bad debt.

**Funding:**
- 10% of protocol fees
- Community donations
- BFLOW staking rewards

**Coverage:**
- Smart contract bugs
- Oracle failures
- Extreme market events
- Bad debt from liquidation failures

---

## Long-Term Vision

### 5+ Years Out

**DeFi Ecosystem Hub:**
- BitFlow becomes the liquidity backbone for Stacks DeFi
- Integration with major DEXes (ALEX, Velar, StackSwap)
- Institutional lending services
- Credit scoring for undercollateralized loans
- Real-world asset (RWA) tokenization and lending

**Bitcoin Integration:**
- Native Bitcoin lending via sBTC
- Lightning Network integrations
- Taproot-enabled smart contracts

**Global Expansion:**
- Multi-language support
- Fiat on/off ramps
- Mobile apps (iOS, Android)
- Compliance frameworks for regulated markets

---

## Community Feedback

We value community input on our roadmap!

### How to Contribute Ideas

1. **GitHub Discussions:** [github.com/bitflow/vault-core/discussions](https://github.com/bitflow/vault-core/discussions)
2. **Discord:** #roadmap channel
3. **Governance Forum:** [forum.bitflow.finance](https://forum.bitflow.finance)

### Recent Community Requests

| Feature | Votes | Status |
|---------|-------|--------|
| Multi-asset collateral | 127 | 🔮 Phase 2 |
| Loan extensions | 89 | 🔮 Phase 2 |
| Mobile app | 76 | 🔮 Phase 4 |
| Flash loans | 54 | 🔮 Phase 3 |
| Insurance fund | 43 | 🔮 Phase 4 |

### Quarterly Roadmap Reviews

We review and update this roadmap quarterly based on:
- Technical progress
- Market conditions
- Community feedback
- Security considerations
- Regulatory landscape

**Next Review:** April 2026

---

## Development Priorities

### Immediate (Next 3 Months)

1. ✅ Complete core contract development
2. 🏗️ Security audit (scheduled)
3. 🏗️ Oracle integration
4. 🏗️ Frontend dashboard
5. 🏗️ Testnet stress testing

### Short-Term (3-6 Months)

1. Mainnet launch
2. Community building
3. Liquidity bootstrapping
4. Multi-asset support design
5. Governance token planning

### Medium-Term (6-12 Months)

1. Multi-asset implementation
2. Bond NFT system
3. Liquidity mining launch
4. Cross-chain bridges
5. Governance launch

### Long-Term (12+ Months)

1. Advanced DeFi features
2. Institutional partnerships
3. Global expansion
4. Real-world assets
5. Decentralized governance

---

## Success Metrics

### Phase 1 (Current)
- ✅ Deploy to testnet
- 🎯 100+ testnet users
- 🎯 $1M+ TVL (testnet)
- 🎯 99.9% uptime
- 🎯 Zero critical bugs

### Phase 2
- $10M+ TVL
- 1,000+ active users
- 5+ supported assets
- 10,000+ loans originated

### Phase 3
- $100M+ TVL
- 10,000+ active users
- $500M+ in flash loans
- 50+ integrated protocols

### Phase 4
- $500M+ TVL
- 50,000+ active users
- Full decentralization
- Top 10 DeFi protocol on Stacks

---

## Disclaimer

This roadmap is subject to change based on:
- Technical feasibility
- Security considerations
- Market conditions
- Regulatory developments
- Community feedback

Features and timelines are estimates and not guaranteed.

---

**Document Version:** 1.0.0  
**Last Updated:** January 25, 2026  
**Next Review:** April 2026

For roadmap questions:
- **Email:** roadmap@bitflow.finance
- **Discord:** #roadmap
- **Forum:** [forum.bitflow.finance](https://forum.bitflow.finance)
