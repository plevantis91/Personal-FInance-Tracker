import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, week, year

    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Get total income and expenses for the period
    const [incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: 'INCOME',
          date: { gte: startDate }
        },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: 'EXPENSE',
          date: { gte: startDate }
        },
        _sum: { amount: true }
      })
    ])

    const totalIncome = incomeResult._sum.amount || 0
    const totalExpenses = expenseResult._sum.amount || 0
    const netIncome = totalIncome - totalExpenses

    // Get spending by category
    const spendingByCategory = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId: session.user.id,
        type: 'EXPENSE',
        date: { gte: startDate }
      },
      _sum: { amount: true },
      _count: true,
    })

    const categoryDetails = await Promise.all(
      spendingByCategory.map(async (item) => {
        const category = item.categoryId 
          ? await prisma.category.findUnique({ where: { id: item.categoryId } })
          : null
        
        return {
          categoryId: item.categoryId,
          categoryName: category?.name || 'Uncategorized',
          categoryColor: category?.color || '#6B7280',
          amount: item._sum.amount || 0,
          count: item._count
        }
      })
    )

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      include: {
        category: true,
        account: true,
      },
      orderBy: { date: 'desc' },
      take: 5,
    })

    // Get account balances
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
      orderBy: { balance: 'desc' },
    })

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netIncome,
        period
      },
      spendingByCategory: categoryDetails,
      recentTransactions,
      accounts
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
