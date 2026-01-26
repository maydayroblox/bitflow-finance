# Testing Your Testnet Contract

## Contract Address
**ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-core**

---

## Method 1: Stacks Explorer (Easiest) ⭐

### Step 1: Get Testnet STX
1. Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet
2. Request testnet STX to any wallet address
3. Save your wallet address for testing

### Step 2: View Contract
1. Visit: https://explorer.hiro.so/address/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM?chain=testnet
2. Click on the "vault-core" contract
3. Go to "Functions" tab

### Step 3: Test Read-Only Functions (No STX needed)
Try these functions to verify deployment:
- `get-contract-version` - Should return "1.0.0"
- `get-total-deposits` - Should return u0 (no deposits yet)
- `get-protocol-stats` - Should return stats object

### Step 4: Test Write Functions (Needs testnet STX)
Connect your testnet wallet and try:

1. **Deposit STX**
   - Function: `deposit`
   - Parameter: `amount` = `1000000` (1 STX in micro-STX)
   - Expected: (ok true)

2. **Check Your Deposit**
   - Function: `get-user-deposit`
   - Parameter: `user` = YOUR_WALLET_ADDRESS
   - Expected: u1000000

3. **Borrow Against Collateral**
   - Function: `borrow`
   - Parameters:
     - `amount` = `600000` (0.6 STX)
     - `interest-rate` = `10` (0.1% APR)
     - `term-days` = `30`
   - Expected: (ok true)

4. **Check Loan Details**
   - Function: `get-user-loan`
   - Parameter: `user` = YOUR_WALLET_ADDRESS
   - Expected: Loan details object

5. **Repay Loan**
   - Function: `repay`
   - No parameters
   - Expected: (ok { principal, interest, total })

6. **Withdraw STX**
   - Function: `withdraw`
   - Parameter: `amount` = `1000000`
   - Expected: (ok true)

---

## Method 2: Local Console with Remote Data

```bash
clarinet console --enable-remote-data --remote-data-api-url https://api.testnet.hiro.so
```

Then run:
```clarity
;; Check contract version
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-core get-contract-version)

;; Check total deposits
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-core get-total-deposits)
```

---

## Method 3: Using @stacks/transactions (JavaScript)

Install dependencies:
```bash
npm install @stacks/transactions @stacks/network
```

Create test script:
```javascript
import { makeContractCall, broadcastTransaction } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const network = new StacksTestnet();
const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const contractName = 'vault-core';

// Test read-only call
const response = await fetch(
  'https://api.testnet.hiro.so/v2/contracts/call-read/' + 
  contractAddress + '/' + contractName + '/get-contract-version',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: contractAddress,
      arguments: []
    })
  }
);

console.log(await response.json());
```

---

## Quick Verification Checklist

✅ Contract deploys successfully  
✅ Read functions return expected values  
✅ Deposit function accepts STX  
✅ Borrow enforces 150% collateral ratio  
✅ Repay calculates interest correctly  
✅ Liquidation works for underwater positions  
✅ Withdraw returns STX after repayment  

---

## Next Steps

Once all functions work on testnet:
1. ✅ Verify gas costs are acceptable
2. ✅ Test edge cases (insufficient collateral, etc.)
3. ✅ Prepare mainnet mnemonic
4. 🚀 Deploy to mainnet with `./scripts/deploy-mainnet-safe.sh`
