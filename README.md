# 🚴 CycleSync

A modern cycling platform built with Next.js, Supabase, and Mapbox. Plan routes, track rides, create clubs, and connect with cyclists.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/cyclesync.git
cd cyclesync
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Fill in your `.env.local`:
| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com](https://supabase.com) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Same as above (keep secret!) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | [account.mapbox.com](https://account.mapbox.com/access-tokens) |
| `NEXT_PUBLIC_OPENWEATHER_KEY` | [openweathermap.org/api](https://home.openweathermap.org/api_keys) |

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Go to **Authentication → Providers** and enable:
   - Google (add Client ID & Secret from Google Cloud Console)
   - Apple (add Service ID, Team ID, Key ID from Apple Developer)
4. Set **Redirect URL** in Auth settings:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-app.vercel.app/auth/callback` (production)
5. Enable **Realtime** for tables: `rides`, `club_posts`, `ride_likes`

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
cyclesync/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/              # Auth page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── ride/               # Live ride tracking
│   │   ├── routes/             # Route planner & saved routes
│   │   ├── clubs/              # Cycling clubs
│   │   ├── bikes/              # Bike garage
│   │   ├── devices/            # Device management
│   │   ├── profile/            # User profile & stats
│   │   └── settings/           # App settings
│   ├── components/
│   │   ├── shared/             # AppShell, StatCard, WeatherWidget, etc.
│   │   ├── dashboard/          # DashboardTiles (drag & drop)
│   │   ├── map/                # MapView (Mapbox GL)
│   │   └── ride/               # Ride components
│   ├── hooks/
│   │   ├── useRide.ts          # Live ride tracking logic
│   │   ├── useAuth.ts          # Auth state
│   │   └── useGeolocation.ts   # GPS tracking
│   ├── lib/
│   │   ├── supabase/           # Client, server, middleware
│   │   ├── mapbox/             # Map utilities
│   │   └── weather/            # Weather API
│   └── types/                  # TypeScript types
├── supabase/
│   └── migrations/             # Database schema SQL
├── .env.example                # Environment variable template
└── vercel.json                 # Vercel deployment config
```

---

## 🌐 Deploy to Vercel

### Option A: Vercel Dashboard (recommended)
1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. Add all environment variables from `.env.example`
4. Deploy!

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
# Follow prompts, add env vars when asked
```

### Environment Variables in Vercel
In your Vercel project → Settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_OPENWEATHER_KEY`

---

## 🗺️ Feature Roadmap

### Phase 1 (Current — No API keys needed)
- [x] Full UI with mock data
- [x] Dashboard with draggable tiles
- [x] Route planner (UI)
- [x] Live ride simulation
- [x] Bike garage
- [x] Device management UI
- [x] Cycling clubs
- [x] Weather widget
- [x] Auth UI (login page)

### Phase 2 (Add API keys)
- [ ] Connect Supabase — real auth, data persistence
- [ ] Connect Mapbox — real interactive maps
- [ ] Connect OpenWeatherMap — live weather
- [ ] GPS tracking from phone

### Phase 3 (Advanced)
- [ ] Garmin Connect integration
- [ ] Apple Health / HealthKit
- [ ] GPX export/import
- [ ] Segment detection & PRs
- [ ] Push notifications
- [ ] PWA / offline support

---

## 🔑 API Keys Guide

### Mapbox (Free tier: 50,000 map loads/month)
1. Sign up at mapbox.com
2. Go to Account → Access tokens
3. Create a new **public** token
4. Add as `NEXT_PUBLIC_MAPBOX_TOKEN`

### OpenWeatherMap (Free tier: 1,000 calls/day)
1. Sign up at openweathermap.org
2. Go to API keys section
3. Copy your default key
4. Add as `NEXT_PUBLIC_OPENWEATHER_KEY`

### Supabase (Free tier: 500MB DB, 2GB storage)
1. Create project at supabase.com
2. Settings → API → copy URL and anon key
3. Run the SQL migration
4. Enable Google/Apple auth providers

---

## 🛡️ Security

- All tables have Row Level Security (RLS) enabled
- Users can only access their own private data
- Public rides/routes are visible to all authenticated users
- Service role key is server-side only
- Auth tokens managed by Supabase SSR helpers

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Animation | Framer Motion |
| Maps | Mapbox GL JS |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |
| Backend | Supabase (Postgres + Auth + Storage) |
| Deployment | Vercel |
