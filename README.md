# Tourist Guide – Your Personal Travel Companion 🧭

[![Built with React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Deploy on Vercel](https://img.shields.io/badge/Vercel-Deploy%20Ready-000000?logo=vercel&logoColor=white)](https://vercel.com)

A modern, responsive, full-stack travel guide booking platform that connects tourists with verified local guides. Designed for seamless destination discovery, transparent pricing in INR (₹), personalized day-wise itineraries, interactive budget calculations, direct traveler-guide messaging, and post-trip verified reviews.

---

## 🌟 Key Features

1. **Destination Discovery**
   - Curated cards for **Tirupati**, **Hyderabad**, **Goa**, **Jaipur**, **Kerala**, and **Bengaluru**.
   - Dynamic search by city, attractions, or category (Spiritual & Heritage, Beach & Leisure, Royal & Culture, Nature, City Culture).
   - Indicative budget ranges, suggested durations, and guide counts.

2. **Verified Local Guides & Transparency**
   - Detailed guide cards with photo, bio, years of experience, languages, and specializations.
   - **Verification Badge Guarantee:** Badge is only awarded upon administrator approval of government credentials.
   - Demo profiles and reviews explicitly labeled.
   - Snapshot pricing locking: daily guide fees are captured at request time to protect against rate fluctuations.
   - Concurrency-safe overlap prevention: guides cannot be double-booked on confirmed dates.

3. **Complete 3-Role Architecture & Dashboards**
   - **Tourist:** Discover guides, submit bookings, review itineraries, chat in real-time, and post 1–5 star reviews.
   - **Local Guide:** Manage incoming requests (Accept / Decline), create and edit day-wise itineraries, track estimated earnings, and update trip progress.
   - **Administrator:** Review government ID verification queue, approve or reject guides, moderate user reviews, and manage destination catalogs.

4. **Personalized Day-Wise Trip Itineraries**
   - Guides can curate day-by-day attraction schedules, visiting timings, elder-friendly pacing, recommended local food, accommodation, and emergency contact details.
   - Tourists view the live updated itinerary in their dashboard.

5. **Interactive Trip Budget Calculator (INR ₹)**
   - Category breakdowns: Guide fee, accommodation, food, local transport, entry tickets, and contingency buffer.
   - Real-time gauge: Under Budget vs. Exceeds Budget with remaining balance calculations.

6. **Local Food & Stays Advisory**
   - Curated guide recommendations for pure vegetarian restaurants, iconic street delicacies, and mid-range hotels.
   - Strict advisory notice: informational advice only, without misleading fake reservation claims.

7. **In-App Messaging**
   - Secure communication between tourists and booked guides with conversation history and timestamped bubbles.

8. **Dual-Backend Support: Production Supabase & Interactive Demo Mode**
   - When Supabase credentials are configured, connects to Supabase PostgreSQL & Auth with Row Level Security (RLS).
   - In demo mode or when credentials are not yet set, an in-memory + LocalStorage reactive store powers a complete simulated journey.
   - Includes a quick **Role Switcher** and **Reset Demo Data** button for reliable hackathon presentations.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, Lucide React Icons
- **Forms & Validation:** React Hook Form, Zod
- **Backend & Database:** Supabase (PostgreSQL, Row Level Security, Auth)
- **Deployment:** Vercel (with SPA rewrite support in `vercel.json`)

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

### Installation Commands

```bash
# 1. Clone repository or navigate to project directory
cd "Tourism Application"

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Start local development server
npm run dev
```

The application will be live at `http://localhost:5173`.

---

## 🔐 Environment Configuration

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note on Demo Mode:** If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are left blank or omitted, the app will automatically launch in **"Demo Mode – Sample Data"** with full interactive functionality enabled.

---

## 🗄️ Supabase PostgreSQL Setup & Migrations

To connect a live Supabase database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project Settings** -> **API** to copy your **Project URL** and **anon public key**.
3. Paste these into your `.env` file.
4. Navigate to the **SQL Editor** in your Supabase dashboard.
5. Open [`supabase/migrations/20250101000000_initial_schema.sql`](supabase/migrations/20250101000000_initial_schema.sql).
6. Copy and paste the entire script into the SQL Editor and click **Run**.

### Schema Summary:
- Tables created: `profiles`, `guide_profiles`, `guide_verification_requests`, `destinations`, `guide_destinations`, `guide_availability`, `bookings`, `itineraries`, `itinerary_items`, `recommendations`, `conversations`, `messages`, `reviews`.
- Automatic guide rating recalculation trigger on review insertions/updates.
- Concurrency constraint: `idx_guide_no_overlap_confirmed` preventing overlapping bookings for the same guide.
- Complete Row Level Security (RLS) policies enforcing tourist, guide, and admin access boundaries.

---

## ☁️ Vercel Deployment

1. Push this project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: Tourist Guide complete full-stack platform"
   git remote add origin https://github.com/your-username/tourist-guide.git
   git push -u origin main
   ```
2. Import the project in [vercel.com](https://vercel.com).
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. The deployment will automatically use `vercel.json` for SPA client-side routing.
5. Click **Deploy**.

---

## 🎭 13-Step College Hackathon Presentation Journey

Follow this sequence to demonstrate the complete user flow to evaluators:

1. **Homepage:** Open the landing page and showcase "Explore More, Worry Less", key benefits, and the responsive navigation.
2. **Search Destination:** Enter `"Tirupati"` in the hero search bar and view the destination card with attractions (Sri Venkateswara, Silathoranam, Chandragiri Fort).
3. **Compare Guides:** Navigate to **Find Guides**, filter by Telugu/English languages and budget.
4. **Open Guide Profile:** Open **Ramesh Sharma**’s profile. Highlight verified badge, bio, pricing (₹1,800/day), and included/excluded services.
5. **Book Guide:** Click **Book This Guide**, choose a 2-day date range and traveler count (2), and submit the request.
6. **Switch to Guide Role:** In the top Demo banner, click **Guide (Ramesh)** and navigate to the **Guide Dashboard**.
7. **Accept Request:** View the new pending request and click **Accept Request**.
8. **Edit Itinerary:** Click **Edit Itinerary**, customize Day 1 & Day 2 timings and emergency info, and click **Save Itinerary**.
9. **Switch back to Tourist:** Click **Tourist (Ananya)** in the banner to view the saved itinerary in **My Bookings**.
10. **Budget Planner:** Open the **Budget Planner** to review estimated guide costs against accommodation, food, and transport.
11. **In-App Chat:** Navigate to **Messages** and exchange a message with Ramesh regarding senior-citizen pacing.
12. **Complete Trip & Review:** Switch to Guide, mark the trip **In Progress** then **Completed**. Switch back to Tourist, click **Submit Review**, rate 5 stars, and trigger the confetti celebration!
13. **Rating Recalculation:** Verify that Ramesh's average rating and review count update immediately across the platform.

---

## 📋 Comprehensive Feature Checklist

### ✅ Fully Implemented Features
- [x] Responsive modern travel UI with deep blue, teal, white, and subtle orange accents.
- [x] Searchable destinations (Tirupati, Hyderabad, Goa, Jaipur, Kerala, Bengaluru) with category & budget filters.
- [x] Verified local guide discovery with language, experience, and price filters.
- [x] Detailed guide profiles with daily pricing snapshots and included/excluded services.
- [x] Complete booking workflow with date validation and overlapping booking prevention.
- [x] Day-wise itinerary builder and viewer with food and accommodation suggestions.
- [x] Interactive trip budget calculator with category-wise cost breakdowns in INR (₹).
- [x] Guide-curated food and accommodation recommendations.
- [x] Database-backed in-app messaging between tourists and assigned guides.
- [x] Verified post-trip review and rating system with average rating recalculation.
- [x] Role-based Tourist Dashboard, Guide Dashboard, and Admin Dashboard.
- [x] Complete Supabase PostgreSQL schema with RLS policies, triggers, and migrations.
- [x] Full interactive Demo Mode with quick role switcher and data reset option.
- [x] Production build tested with code splitting and zero TypeScript errors.

### 🟡 Demo-Only Features
- **Simulated Payment:** Bookings record estimated guide fee snapshots; real credit card/UPI payment processing is bypassed for hackathon safety.
- **Fast Role Switcher:** Top demo bar enables instant switching between Tourist (Ananya), Guide (Ramesh), and Admin.

### 🔌 Features Requiring External Integration
- **Live SMS/OTP Gateway:** SMS notifications for darshan queue tickets (can be plugged into Twilio/MSG91).
- **Payment Gateway:** Razorpay or Stripe integration for actual transaction payouts.
- **Official TTD / Monument APIs:** Real-time temple darshan queue waiting times.

### ⚠️ Known Limitations
- Accommodation and transport recommendations are curated informational tips; third-party hotel or taxi booking requires external API partnerships.
- In demo mode without Supabase environment variables, changes persist in browser `localStorage`.
