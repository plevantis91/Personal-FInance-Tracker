import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      }
    })

    // Create default categories
    const defaultCategories = [
      { name: 'Food & Dining', type: 'EXPENSE', color: '#EF4444' },
      { name: 'Transportation', type: 'EXPENSE', color: '#F59E0B' },
      { name: 'Shopping', type: 'EXPENSE', color: '#8B5CF6' },
      { name: 'Entertainment', type: 'EXPENSE', color: '#EC4899' },
      { name: 'Bills & Utilities', type: 'EXPENSE', color: '#06B6D4' },
      { name: 'Healthcare', type: 'EXPENSE', color: '#10B981' },
      { name: 'Salary', type: 'INCOME', color: '#22C55E' },
      { name: 'Freelance', type: 'INCOME', color: '#84CC16' },
      { name: 'Investment', type: 'INCOME', color: '#F97316' },
    ]

    await prisma.category.createMany({
      data: defaultCategories.map(category => ({
        ...category,
        userId: user.id,
      }))
    })

    // Create default account
    await prisma.account.create({
      data: {
        name: 'Main Account',
        type: 'CHECKING',
        balance: 0,
        userId: user.id,
      }
    })

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
