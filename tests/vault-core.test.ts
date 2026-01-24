import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

describe("vault-core contract", () => {
  it("allows users to deposit STX", () => {
    const accounts = simnet.getAccounts();
    const wallet_1 = accounts.get("wallet_1")!;


    // Call deposit with 1000 STX from wallet_1
    const depositAmount = 1000;
    const { result } = simnet.callPublicFn(
      "vault-core",
      "deposit",
      [Cl.uint(depositAmount)],
      wallet_1
    );

    // Verify result is ok
    expect(result).toBeOk(Cl.bool(true));

    // Verify get-user-deposit returns 1000
    const userDepositResponse = simnet.callReadOnlyFn(
      "vault-core",
      "get-user-deposit",
      [Cl.principal(wallet_1)],
      wallet_1
    );
    expect(userDepositResponse.result).toBeUint(depositAmount);
  });

  it("allows users to withdraw their deposits", () => {
    const accounts = simnet.getAccounts();
    const wallet_1 = accounts.get("wallet_1")!;

    // Deposit 1000 STX
    const depositAmount = 1000;
    const depositResponse = simnet.callPublicFn(
      "vault-core",
      "deposit",
      [Cl.uint(depositAmount)],
      wallet_1
    );
    expect(depositResponse.result).toBeOk(Cl.bool(true));

    // Withdraw 500 STX
    const withdrawAmount = 500;
    const withdrawResponse = simnet.callPublicFn(
      "vault-core",
      "withdraw",
      [Cl.uint(withdrawAmount)],
      wallet_1
    );

    // Verify both transactions succeed
    expect(withdrawResponse.result).toBeOk(Cl.bool(true));

    // Verify remaining balance is 500
    const userDepositResponse = simnet.callReadOnlyFn(
      "vault-core",
      "get-user-deposit",
      [Cl.principal(wallet_1)],
      wallet_1
    );
    expect(userDepositResponse.result).toBeUint(depositAmount - withdrawAmount);
  });

  it("prevents users from withdrawing more than deposited", () => {
    const accounts = simnet.getAccounts();
    const wallet_1 = accounts.get("wallet_1")!;

    // Deposit 1000 STX
    const depositAmount = 1000;
    const depositResponse = simnet.callPublicFn(
      "vault-core",
      "deposit",
      [Cl.uint(depositAmount)],
      wallet_1
    );
    expect(depositResponse.result).toBeOk(Cl.bool(true));

    // Try to withdraw 2000 STX
    const withdrawAmount = 2000;
    const withdrawResponse = simnet.callPublicFn(
      "vault-core",
      "withdraw",
      [Cl.uint(withdrawAmount)],
      wallet_1
    );

    // Verify transaction fails with error u101
    expect(withdrawResponse.result).toBeErr(Cl.uint(101));
  });

  it("tracks total deposits correctly", () => {
    const accounts = simnet.getAccounts();
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;

    // Have wallet_1 deposit 1000
    const wallet1Amount = 1000;
    const deposit1 = simnet.callPublicFn(
      "vault-core",
      "deposit",
      [Cl.uint(wallet1Amount)],
      wallet_1
    );
    expect(deposit1.result).toBeOk(Cl.bool(true));

    // Have wallet_2 deposit 2000
    const wallet2Amount = 2000;
    const deposit2 = simnet.callPublicFn(
      "vault-core",
      "deposit",
      [Cl.uint(wallet2Amount)],
      wallet_2
    );
    expect(deposit2.result).toBeOk(Cl.bool(true));

    // Verify get-total-deposits returns 3000
    const totalDepositsResponse = simnet.callReadOnlyFn(
      "vault-core",
      "get-total-deposits",
      [],
      wallet_1
    );
    expect(totalDepositsResponse.result).toBeUint(wallet1Amount + wallet2Amount);
  });
});

describe("loan management", () => {
  it("allows users to borrow against sufficient collateral", () => {
    const accounts = simnet.getAccounts();
    const wallet_1 = accounts.get("wallet_1")!;

    // wallet_1 deposits 1500 STX
    const depositAmount = 1500;
    simnet.callPublicFn(
      "vault-core",
      "deposit",
      [Cl.uint(depositAmount)],
      wallet_1
    );

    // wallet_1 borrows 1000 STX at 5% interest for 30 days
    // Get current block height right before borrow
    const startBlock = simnet.blockHeight;
    const borrowAmount = 1000;
    const interestRate = 5;
    const termDays = 30;
    const borrowResponse = simnet.callPublicFn(
      "vault-core",
      "borrow",
      [Cl.uint(borrowAmount), Cl.uint(interestRate), Cl.uint(termDays)],
      wallet_1
    );

    // Verify borrow transaction returns ok(true)
    expect(borrowResponse.result).toBeOk(Cl.bool(true));

    // Verify get-user-loan returns correct loan details
    const loanResponse = simnet.callReadOnlyFn(
      "vault-core",
      "get-user-loan",
      [Cl.principal(wallet_1)],
      wallet_1
    );

    expect(loanResponse.result).toBeSome(
      Cl.tuple({
        amount: Cl.uint(borrowAmount),
        "interest-rate": Cl.uint(interestRate),
        "term-end": Cl.uint(startBlock + 1 + termDays * 144),
      })
    );
  });

  it("prevents borrowing without sufficient collateral", () => {
    const accounts = simnet.getAccounts();
    const wallet_1 = accounts.get("wallet_1")!;

    // wallet_1 deposits 1000 STX (insufficient for borrowing 1000)
    const depositAmount = 1000;
    simnet.callPublicFn(
      "vault-core",
      "deposit",
      [Cl.uint(depositAmount)],
      wallet_1
    );

    // wallet_1 tries to borrow 1000 STX (requires 1500 collateral)
    const borrowAmount = 1000;
    const borrowResponse = simnet.callPublicFn(
      "vault-core",
      "borrow",
      [Cl.uint(borrowAmount), Cl.uint(5), Cl.uint(30)],
      wallet_1
    );

    // Verify transaction fails with error u105 (err-insufficient-collateral)
    expect(borrowResponse.result).toBeErr(Cl.uint(105));
  });

  it("prevents users from having multiple active loans", () => {
    const accounts = simnet.getAccounts();
    const wallet_1 = accounts.get("wallet_1")!;

    // wallet_1 deposits 3000 STX
    simnet.callPublicFn(
      "vault-core",
      "deposit",
      [Cl.uint(3000)],
      wallet_1
    );

    // wallet_1 successfully borrows 1000 STX
    const firstBorrow = simnet.callPublicFn(
      "vault-core",
      "borrow",
      [Cl.uint(1000), Cl.uint(5), Cl.uint(30)],
      wallet_1
    );
    expect(firstBorrow.result).toBeOk(Cl.bool(true));

    // wallet_1 tries to borrow another 500 STX
    const secondBorrow = simnet.callPublicFn(
      "vault-core",
      "borrow",
      [Cl.uint(500), Cl.uint(5), Cl.uint(30)],
      wallet_1
    );

    // Verify second borrow fails with error u103 (err-already-has-loan)
    expect(secondBorrow.result).toBeErr(Cl.uint(103));
  });

  it("correctly calculates required collateral", () => {
    const accounts = simnet.getAccounts();
    const wallet_1 = accounts.get("wallet_1")!;

    // Test calculate-required-collateral with different amounts
    // Input: 1000 → Expected: 1500
    const collateral1 = simnet.callReadOnlyFn(
      "vault-core",
      "calculate-required-collateral",
      [Cl.uint(1000)],
      wallet_1
    );
    expect(collateral1.result).toBeUint(1500);

    // Input: 2000 → Expected: 3000
    const collateral2 = simnet.callReadOnlyFn(
      "vault-core",
      "calculate-required-collateral",
      [Cl.uint(2000)],
      wallet_1
    );
    expect(collateral2.result).toBeUint(3000);

    // Input: 500 → Expected: 750
    const collateral3 = simnet.callReadOnlyFn(
      "vault-core",
      "calculate-required-collateral",
      [Cl.uint(500)],
      wallet_1
    );
    expect(collateral3.result).toBeUint(750);
  });

  it("correctly calculates loan term-end block height", () => {
    const accounts = simnet.getAccounts();
    const wallet_1 = accounts.get("wallet_1")!;

    // wallet_1 deposits 1500 and borrows 1000 for 30 days
    simnet.callPublicFn(
      "vault-core",
      "deposit",
      [Cl.uint(1500)],
      wallet_1
    );

    // Get current block height right before borrow
    const startBlock = simnet.blockHeight;
    const termDays = 30;
    simnet.callPublicFn(
      "vault-core",
      "borrow",
      [Cl.uint(1000), Cl.uint(5), Cl.uint(termDays)],
      wallet_1
    );

    // Verify loan term-end = starting block + 4320 blocks (30 * 144)
    const loanResponse = simnet.callReadOnlyFn(
      "vault-core",
      "get-user-loan",
      [Cl.principal(wallet_1)],
      wallet_1
    );

    const expectedTermEnd = startBlock + 1 + termDays * 144; // +1 for transaction block
    expect(loanResponse.result).toBeSome(
      Cl.tuple({
        amount: Cl.uint(1000),
        "interest-rate": Cl.uint(5),
        "term-end": Cl.uint(expectedTermEnd),
      })
    );
  });
});
