# FinTracker Setup Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up your database**
   - Create a PostgreSQL database
   - Update the `DATABASE_URL` in `.env.local` with your database credentials

3. **Generate Prisma client and run migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Make sure to set up these environment variables in `.env.local`:

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

## Database Setup

The application will automatically create the necessary tables when you run the migration. Default categories and a main account will be created for new users.

## Features Available

- ✅ User authentication (email/password + Google OAuth)
- ✅ Transaction management (income/expense tracking)
- ✅ Category management with color coding
- ✅ Account management (multiple account types)
- ✅ Financial dashboard with charts
- ✅ Responsive design for mobile and desktop
- ✅ Real-time balance tracking
- ✅ Spending analytics and visualizations

## Next Steps

1. Create your account by signing up
2. Add your first account (checking, savings, etc.)
3. Start logging transactions
4. View your financial health on the dashboard
5. Customize categories to match your spending patterns

Enjoy tracking your finances! 🐷💰
