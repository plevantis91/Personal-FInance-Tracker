'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  LogOut,
  BarChart3,
  CreditCard,
  PiggyBank
} from 'lucide-react'
import TransactionForm from './transaction-form'
import FinancialChart from './financial-chart'
import RecentTransactions from './recent-transactions'

interface DashboardData {
  summary: {
    totalIncome: number
    totalExpenses: number
    netIncome: number
    period: string
  }
  spendingByCategory: Array<{
    categoryId: string | null
    categoryName: string
    categoryColor: string
    amount: number
    count: number
  }>
  recentTransactions: Array<{
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
  }>
  accounts: Array<{
    id: string
    name: string
    type: string
    balance: number
  }>
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/dashboard?period=${selectedPeriod}`)
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <PiggyBank className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">FinTracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {session?.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.summary.totalIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.summary.totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                dashboardData.summary.netIncome >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <DollarSign className={`h-6 w-6 ${
                  dashboardData.summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className={`text-2xl font-bold ${
                  dashboardData.summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(dashboardData.summary.netIncome)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <button
            onClick={() => setShowTransactionForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Transaction
          </button>
        </div>

        {/* Charts and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Spending by Category
            </h3>
            <FinancialChart data={dashboardData.spendingByCategory} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Recent Transactions
            </h3>
            <RecentTransactions 
              transactions={dashboardData.recentTransactions}
              onRefresh={fetchDashboardData}
            />
          </div>
        </div>

        {/* Accounts Overview */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Balances</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.accounts.map((account) => (
                <div key={account.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{account.type.toLowerCase()}</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          onSuccess={() => {
            setShowTransactionForm(false)
            fetchDashboardData()
          }}
        />
      )}
    </div>
  )
}
