# Slide — Claude Code Project Instructions

## What you are building

Slide is a UGC creator talent platform with an embedded rewards and discounts engine. It is being built by Make Agency as an internal product first, with a roadmap to open to external brands and eventually become a white-label SaaS product.

The core concept: Tinder for UGC. Brands swipe through verified creators. Creators swipe through live briefs. When it is a match, the brief drops. Creators get paid for jobs and earn retail discounts and perks simply by being members.

This is not a generic marketplace. The two things that make it different are:

1. The swipe mechanic — a Tinder-style browse experience for both sides of the platform
2. The rewards engine — a Reward Gateway-style perks layer that keeps creators active and loyal between briefs

---

## Platform overview

Slide has three sides:

**Creators**
Sign up, get verified, build a profile, link social accounts, select content niches, swipe through live briefs, apply or get approached directly, submit work, get paid via escrow, access a rewards wallet with discounts from major retailers and brand partners.

**Brands and agencies**
Sign up, search and swipe through verified creators, post briefs, invite creators directly, agree terms, fund escrow, receive and approve content, release payment.

**Rewards partners**
List discount codes and exclusive offers on the platform. Creators unlock these simply by being members, with deeper perks available at higher tiers.

---

## Tech stack

Use the following unless there is a strong technical reason to deviate:

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (Postgres, Auth, Storage, Realtime)
- **Styling:** Tailwind CSS
- **UI components:** shadcn/ui
- **Payments/escrow:** Stripe Connect
- **File uploads:** Supabase Storage
- **Social OAuth:** next-auth with Instagram, TikTok, YouTube, LinkedIn providers
- **Deployment:** Vercel
- **Email:** Resend
- **Background jobs:** Inngest or Supabase Edge Functions

---

## Brand and design system

Apply these consistently across every UI component, page, and email.

**Colours**
- Background: `#151515`
- Card/surface: `#1c1c1c`
- Primary accent: `#1ee231` (green)
- Primary text: `#ffffff`
- Secondary text: `#d4d4d4`
- Muted/captions: `#a3a3a3`
- Border: `#2a2a2a`
- Destructive/pass: `#ef4444` (red)

**Typography**
- Font: Inter (Google Fonts)
- Headings: bold, tight tracking
- Body: regular weight, relaxed line height
- Labels and tags: uppercase, wide tracking, small size

**Design principles**
- Dark theme throughout, no light mode in MVP
- Minimal chrome, maximum content
- Circular creator profile images as a consistent motif
- Green accents for primary actions, confirmations, and positive states
- Red for pass/reject actions only
- Cards with subtle border (`#2a2a2a`) and no drop shadows on dark backgrounds
- Rounded corners: `rounded-xl` as the default

---

## Database schema (core tables)

Build with these tables as the foundation. Add columns as needed.

```sql
-- Users (extended by Supabase Auth)
profiles (
  id uuid references auth.users primary key,
  role text check (role in ('creator', 'brand', 'admin')),
  display_name text,
  avatar_url text,
  bio text,
  location text,
  created_at timestamptz default now()
)

-- Creator profiles
creator_profiles (
  id uuid references profiles primary key,
  niches text[],
  follower_count_instagram int,
  follower_count_tiktok int,
  follower_count_youtube int,
  follower_count_linkedin int,
  avg_engagement_rate numeric,
  verification_status text check (status in ('pending', 'approved', 'rejected')),
  tier text check (tier in ('rising', 'verified', 'elite', 'ambassador')),
  sample_video_urls text[],
  portfolio_urls text[],
  day_rate numeric,
  created_at timestamptz default now()
)

-- Brand profiles
brand_profiles (
  id uuid references profiles primary key,
  company_name text,
  website text,
  industry text,
  subscription_tier text check (tier in ('free', 'pro', 'enterprise')),
  created_at timestamptz default now()
)

-- Briefs
briefs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references profiles,
  title text,
  description text,
  deliverables text[],
  budget numeric,
  currency text default 'GBP',
  deadline date,
  niches text[],
  status text check (status in ('draft', 'live', 'closed', 'completed')),
  created_at timestamptz default now()
)

-- Swipes (both creator swiping briefs and brand swiping creators)
swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid references profiles,
  target_id uuid, -- either a brief id or creator profile id
  target_type text check (target_type in ('brief', 'creator')),
  direction text check (direction in ('pass', 'slide')),
  created_at timestamptz default now()
)

-- Applications
applications (
  id uuid references profiles primary key,
  brief_id uuid references briefs,
  creator_id uuid references profiles,
  pitch text,
  proposed_rate numeric,
  status text check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz default now()
)

-- Deals (agreed briefs)
deals (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references briefs,
  creator_id uuid references profiles,
  brand_id uuid references profiles,
  agreed_fee numeric,
  stripe_payment_intent_id text,
  escrow_funded_at timestamptz,
  content_submitted_at timestamptz,
  approved_at timestamptz,
  status text check (status in ('pending', 'funded', 'delivered', 'approved', 'disputed', 'cancelled')),
  created_at timestamptz default now()
)

-- Rewards
rewards (
  id uuid primary key default gen_random_uuid(),
  partner_name text,
  offer_description text,
  discount_code text,
  discount_value text,
  minimum_tier text check (tier in ('rising', 'verified', 'elite', 'ambassador')),
  expires_at date,
  is_active boolean default true,
  created_at timestamptz default now()
)

-- Creator reward redemptions
reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles,
  reward_id uuid references rewards,
  redeemed_at timestamptz default now()
)
```

---

## Page structure and routes

```
/                          Landing page (marketing)
/sign-up                   Role selection (Creator or Brand)
/sign-up/creator           Creator registration flow
/sign-up/brand             Brand registration flow
/onboarding/creator        Profile builder, social linking, niche selection
/onboarding/brand          Company profile, billing setup

/dashboard                 Redirects to role-appropriate dashboard
/dashboard/creator         Creator home: open briefs, active deals, rewards
/dashboard/brand           Brand home: creator search, active campaigns

/swipe                     Creator swipe feed (live briefs)
/swipe/brands              Brand swipe feed (verified creators)

/briefs                    Brand: list of own briefs
/briefs/new                Brand: create a brief
/briefs/[id]               Brief detail page
/briefs/[id]/applications  Brand: manage applications for a brief

/creators                  Brand: searchable creator directory
/creators/[id]             Creator public profile

/deals                     Active deals for both roles
/deals/[id]                Deal detail, content submission, approval

/rewards                   Creator: rewards wallet and available offers
/profile                   Edit own profile
/profile/verification      Creator: submit sample videos for verification

/admin                     Admin dashboard (internal Make Agency use)
/admin/creators            Review and approve/reject creator verifications
/admin/rewards             Manage reward partner offers
```

---

## Core features for MVP (Phase 1)

Build these in order of priority:

**1. Auth and onboarding**
- Sign up with email or Google OAuth
- Role selection: Creator or Brand
- Creator onboarding: profile, social linking, niche selection (multi-select), day rate
- Brand onboarding: company name, industry, billing

**2. Creator verification**
- Creator uploads 2-3 sample UGC video files
- Admin reviews and approves or rejects with feedback
- Verified badge applied to profile on approval
- Email notification on outcome

**3. Brief creation and management (brand side)**
- Brand creates a brief with title, description, deliverables, budget, deadline, target niches
- Brief goes live and appears in creator swipe feed
- Brand can pause or close a brief

**4. Swipe feed (creator side)**
- Creator sees live briefs as swipeable cards
- Card shows: brand name, brief title, budget, niche tags, deadline
- Swipe right (Slide) to express interest, swipe left (Pass) to skip
- On Slide: creator lands on brief detail page and can submit a full application

**5. Creator search and swipe (brand side)**
- Brand can search creators by niche, location, follower range
- Grid and swipe view available
- Brand can invite a creator directly to a brief

**6. Applications**
- Creator submits pitch and proposed rate
- Brand reviews applications per brief
- Brand accepts or rejects
- On acceptance: deal is created, escrow flow begins

**7. Escrow and payments**
- Stripe Connect for creator payouts
- Brand funds escrow on deal acceptance
- Creator submits content files via Supabase Storage
- Brand approves content
- Escrow releases to creator minus 5% platform fee
- Automated receipt emails via Resend

**8. Rewards wallet**
- Creator sees available discount offers in their wallet
- Offers filtered by their current tier
- Creator reveals discount code on click (tracked as redemption)
- Admin can add/edit/remove offers

**9. Basic notifications**
- Email notifications for: new application, application accepted/rejected, deal funded, content approved, payment released, verification outcome

---

## Phase 2 features (do not build in MVP)

- Direct creator outreach from brand dashboard
- Content revision requests and approval workflow
- Campaign performance tracking and analytics
- Expanded rewards marketplace with partner self-serve listing
- Creator tier progression logic (auto-upgrade based on completed deals)
- In-app messaging between brands and creators

## Phase 3 features (do not build in MVP)

- Multi-tenancy: per-agency white-label instances
- Social stats API ingestion (pull live follower counts from Instagram/TikTok APIs)
- Creator scoring algorithm
- White-label branding configuration per agency

---

## Code standards

- TypeScript throughout, strict mode enabled
- All database queries via Supabase client with proper RLS policies
- Every table must have Row Level Security enabled
- Use server components by default, client components only where interactivity requires it
- API routes in `/app/api/` for webhooks (Stripe, etc.)
- Environment variables for all secrets, never hardcoded
- All money values stored in pence/cents as integers, converted for display only
- All dates stored as UTC, converted to local time on display
- Zod for all form validation and API input validation
- Error boundaries on all major page sections
- Loading states on all async operations

---

## Naming conventions

- The platform is called **Slide** throughout the codebase, UI, and copy
- The swipe right action is called **Slide** (not "like" or "match")
- The swipe left action is called **Pass**
- A matched brief is called a **Deal**
- Creator discount offers are called **Rewards**
- The discount access area is called the **Rewards Wallet**
- Platform fee is 5% taken from the creator payout on deal completion

---

## Copy and tone

- British English throughout (colour not color, organised not organized, etc.)
- Direct and specific, no corporate jargon
- Creator-facing copy should feel native and social-platform-familiar
- Brand-facing copy should feel professional but not corporate
- No em-dashes anywhere, use commas or restructure
- Numbers first, commentary second

---

## Environment variables required

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## First task

When starting a new session, begin here:

1. Scaffold the Next.js 14 project with TypeScript, Tailwind, and shadcn/ui
2. Connect Supabase and run the core schema migrations
3. Implement auth (email and Google OAuth) with role selection on first sign-in
4. Build the creator onboarding flow
5. Build the brand onboarding flow

Do not jump ahead to swipe or payments until auth and onboarding are solid and tested.
