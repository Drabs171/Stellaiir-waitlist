# Stellaiir Waitlist Landing Page

A modern, responsive waitlist landing page for Stellaiir - an AI-powered genetic analysis platform built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
npm run setup
npm run dev
```

### Option 2: Using Setup Script
```bash
./setup.sh
npm run dev
```

### Option 3: Manual Setup
```bash
npm install
npm run build
npm run dev
```

Visit **http://localhost:3000** 🎉

📚 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## Features

- **Modern Design**: Dark theme with gradient backgrounds and smooth animations
- **Responsive**: Mobile-first design that works on all devices
- **Email Collection**: Secure waitlist signup with validation and duplicate prevention
- **Database Integration**: PostgreSQL with Prisma ORM for data persistence
- **Rate Limiting**: API protection against spam and abuse
- **Animations**: Smooth page transitions and micro-interactions with Framer Motion
- **SEO Optimized**: Meta tags, Open Graph, and Twitter Card support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or SQLite for development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local .env.local.example
```

Edit `.env.local` and add your database URL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/stellaiir_waitlist"
```

3. Generate Prisma client and push schema:
```bash
npm run db:generate
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Database Setup

### Using PostgreSQL

1. Create a PostgreSQL database:
```sql
CREATE DATABASE stellaiir_waitlist;
```

2. Update your `DATABASE_URL` in `.env.local`

### Using SQLite (Development)

For development, you can use SQLite:
```env
DATABASE_URL="file:./dev.db"
```

## API Endpoints

### POST /api/waitlist

Submit email to join the waitlist.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Responses:**
- `201`: Successfully added to waitlist
- `409`: Email already exists
- `429`: Rate limit exceeded
- `400`: Invalid email format
- `500`: Server error

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Color Scheme

- **Primary**: #6366f1 (indigo)
- **Primary Dark**: #4f46e5
- **Secondary**: #22d3ee (cyan)
- **Success**: #10b981
- **Warning**: #f59e0b
- **Danger**: #ef4444
- **Background**: #0a0a0a (near black)
- **Card backgrounds**: rgba(255, 255, 255, 0.02)
- **Borders**: rgba(255, 255, 255, 0.1)

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```
