# 🗄️ Supabase Database Setup

## Option 1: Quick Setup Script (Recommended)

```bash
# Replace YOUR_PASSWORD with your actual Supabase password
./setup-supabase.sh YOUR_SUPABASE_PASSWORD
```

## Option 2: Manual Setup

### Step 1: Get Your Supabase Password
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Find your database password

### Step 2: Update Environment
1. Open `.env.local`
2. Replace `[YOUR-PASSWORD]` with your actual password:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.vyzrjfxdodiyxdyipdda.supabase.co:5432/postgres"
   ```

### Step 3: Setup Database
```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Create all tables in Supabase
npx prisma db push

# Verify connection (optional)
npx prisma studio
```

## ✅ Verification

After setup, check that everything works:

```bash
# Check configuration status
curl http://localhost:3000/api/config/status

# Should return: "status":"ready"
```

## 🚀 You're Ready!

Your Stellaiir waitlist now has:
- ✅ **Resend Email**: Welcome emails, milestone updates
- ✅ **hCaptcha**: Bot protection for signups  
- ✅ **Supabase**: Production PostgreSQL database
- ✅ **All Features**: Referrals, admin dashboard, analytics

**Test it now at: http://localhost:3000**