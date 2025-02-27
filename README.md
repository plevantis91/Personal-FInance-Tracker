# FinTracker - Personal Finance Tracker

A modern, full-stack personal finance tracker built with Next.js, TypeScript, PostgreSQL, and Prisma. Track your income, expenses, and financial health with beautiful visualizations.

## Features

- 🔐 **Secure Authentication** - Sign up/sign in with email or Google OAuth
- 💰 **Transaction Management** - Log income and expenses with categories
- 📊 **Financial Visualizations** - Interactive charts showing spending patterns
- 🏦 **Account Management** - Multiple account support (checking, savings, credit cards)
- 🏷️ **Category System** - Custom categories with color coding
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 📈 **Dashboard Analytics** - Real-time financial summaries and insights

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts for data visualization
- **Authentication**: NextAuth.js with Google OAuth and credentials
- **Styling**: Tailwind CSS with Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/fin_tracker?schema=public"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main entities:

- **Users** - User accounts with authentication
- **Accounts** - Financial accounts (checking, savings, credit cards)
- **Categories** - Transaction categories (income/expense types)
- **Transactions** - Individual financial transactions

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Transactions
- `GET /api/transactions` - Fetch transactions with filtering
- `POST /api/transactions` - Create new transaction

### Categories
- `GET /api/categories` - Fetch user categories
- `POST /api/categories` - Create new category

### Accounts
- `GET /api/accounts` - Fetch user accounts
- `POST /api/accounts` - Create new account

### Dashboard
- `GET /api/dashboard` - Fetch dashboard analytics

## Features Overview

### Dashboard
- Financial summary cards (income, expenses, net income)
- Interactive pie chart showing spending by category
- Recent transactions list
- Account balance overview
- Period filtering (week, month, year)

### Transaction Management
- Add income and expense transactions
- Categorize transactions
- Assign to specific accounts
- Date selection
- Description field

### Category Management
- Pre-defined categories for common expenses
- Custom category creation
- Color coding for visual distinction
- Separate categories for income and expenses

### Account Management
- Multiple account types (checking, savings, credit cards, etc.)
- Real-time balance tracking
- Account-specific transaction history

## Development

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── dashboard.tsx      # Main dashboard component
│   ├── transaction-form.tsx
│   ├── financial-chart.tsx
│   └── recent-transactions.tsx
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # NextAuth configuration
└── prisma/               # Database schema
    └── schema.prisma
```

### Key Components

- **Dashboard** - Main application interface with financial overview
- **TransactionForm** - Modal for adding new transactions
- **FinancialChart** - Recharts-based spending visualization
- **RecentTransactions** - List of recent financial activity

## Deployment

### Environment Setup
1. Set up a PostgreSQL database (local or cloud)
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Vercel, Netlify, etc.)

### Database Migration
```bash
npx prisma migrate deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.