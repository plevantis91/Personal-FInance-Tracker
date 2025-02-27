'use client'

import { format } from 'date-fns'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  type: string
  description: string | null
  date: string
  category: {
    name: string
    color: string
  } | null
  account: {
    name: string
  }
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  onRefresh: () => void
}

export default function RecentTransactions({ transactions, onRefresh }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <div className="text-center">
          <p className="text-sm">No recent transactions</p>
          <p className="text-xs">Add your first transaction to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {transaction.type === 'INCOME' ? (
                <TrendingUp className={`h-4 w-4 ${
                  transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                }`} />
              ) : (
                <TrendingDown className={`h-4 w-4 ${
                  transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                }`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {transaction.description || 'No description'}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{transaction.account.name}</span>
                {transaction.category && (
                  <>
                    <span>•</span>
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${transaction.category.color}20`,
                        color: transaction.category.color 
                      }}
                    >
                      {transaction.category.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${
              transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>
      ))}
      
      {transactions.length >= 5 && (
        <div className="text-center pt-2">
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all transactions
          </button>
        </div>
      )}
    </div>
  )
}
