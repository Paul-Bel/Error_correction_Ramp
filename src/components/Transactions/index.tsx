import { useCallback, useEffect, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams, Transaction } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions, disabledButton }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()
  const [transactionsState, setTransactionsState] = useState<Transaction[] | null>(transactions)
  const [sortOrder, setSortOrder] = useState<"abc" | "zyx">("zyx");
  console.log('transactions', transactions)
  useEffect(() => {
    setTransactionsState(transactions)
  }, [transactions])

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
    },
    [fetchWithoutCache]
  )

  if (transactions === null || transactionsState === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  const sortButton = disabledButton ? disabledButton : null

  const sortEmployeeByName = () => {
    const sortedTransactions = [...transactionsState].sort((a, b) => {
      const firstNameA = a.employee.firstName.toUpperCase();
      const firstNameB = b.employee.firstName.toUpperCase();
      return sortOrder === "abc"
        ? firstNameA.localeCompare(firstNameB)
        : firstNameB.localeCompare(firstNameA);
    });

    setTransactionsState(sortedTransactions);
    setSortOrder(sortOrder === "abc" ? "zyx" : "abc"); // Toggle order
  };

  return (

    <div data-testid="transaction-container">
      {!sortButton &&
      <button
        className="RampButton"
        onClick={sortEmployeeByName}
      >
        Sort by Name ⇅
      </button>}
      {transactionsState.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
