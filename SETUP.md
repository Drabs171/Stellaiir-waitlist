# 🚀 Stellaiir Waitlist - Quick Setup Guide

## Prerequisites

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

## 📦 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```bash
# Required - hCaptcha (already configured)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=91324b5c-45c0-4d2a-a5fa-7eb8bf6a1340

# Optional - Email settings (for production)
# RESEND_API_KEY=your_resend_api_key_here
# FROM_EMAIL=Stellaiir <noreply@stellaiir.com>
# ADMIN_EMAILS=admin@stellaiir.com

# Optional - Database (for production)
# DATABASE_URL=your_database_url_here
```

### 3. Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

## 🏗️ Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 Key Features Configured

- ✅ **Stellaiir Branding** - Complete rebrand from GenomeAI
- ✅ **hCaptcha Protection** - Spam prevention configured
- ✅ **Responsive Design** - Mobile & desktop optimized
- ✅ **Email System** - Welcome emails (needs Resend API key)
- ✅ **Referral System** - Built-in viral mechanics
- ✅ **Admin Dashboard** - User management at `/admin`
- ✅ **Analytics Ready** - Track signups and referrals

## 🔧 Optional Configuration

### Email Setup (Production)
1. Get API key from [resend.com](https://resend.com)
2. Add `RESEND_API_KEY` to `.env.local`
3. Verify your domain at resend.com/domains
4. Update `FROM_EMAIL` to use your domain

### Database Setup (Production)
1. Set up PostgreSQL database
2. Add `DATABASE_URL` to `.env.local`
3. Run migrations: `npx prisma db push`

## 🚀 Deployment

Ready to deploy to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Any Node.js hosting**

## 📚 Project Structure

```
src/
├── app/           # Next.js 14 App Router
├── components/    # React components
├── lib/          # Utilities & services
└── styles/       # CSS files

emails/           # Email templates
public/           # Static assets
prisma/           # Database schema
```

## 🆘 Troubleshooting

**Build errors?** Make sure you're using Node.js 18+
**Modal issues?** Clear browser cache with Ctrl+Shift+R
**Directory errors?** Make sure you're in the project root

---

🌟 **Your Stellaiir waitlist is ready to collect signups!**