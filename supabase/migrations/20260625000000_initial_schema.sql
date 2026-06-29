-- ============================================================
-- Slide — Initial Schema Migration
-- ============================================================

-- Profiles (extends Supabase Auth users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('creator', 'brand', 'admin')),
  display_name text,
  avatar_url text,
  bio text,
  location text,
  created_at timestamptz default now() not null
);

-- Creator profiles
create table if not exists creator_profiles (
  id uuid references profiles on delete cascade primary key,
  niches text[],
  follower_count_instagram int,
  follower_count_tiktok int,
  follower_count_youtube int,
  follower_count_linkedin int,
  avg_engagement_rate numeric,
  verification_status text check (verification_status in ('pending', 'approved', 'rejected')) default 'pending',
  tier text check (tier in ('rising', 'verified', 'elite', 'ambassador')) default 'rising',
  sample_video_urls text[],
  portfolio_urls text[],
  day_rate numeric,
  created_at timestamptz default now() not null
);

-- Brand profiles
create table if not exists brand_profiles (
  id uuid references profiles on delete cascade primary key,
  company_name text,
  website text,
  industry text,
  subscription_tier text check (subscription_tier in ('free', 'pro', 'enterprise')) default 'free',
  created_at timestamptz default now() not null
);

-- Briefs
create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references profiles on delete cascade not null,
  title text,
  description text,
  deliverables text[],
  budget numeric,
  currency text default 'GBP' not null,
  deadline date,
  niches text[],
  status text check (status in ('draft', 'live', 'closed', 'completed')) default 'draft' not null,
  created_at timestamptz default now() not null
);

-- Swipes (creator swiping briefs, brand swiping creators)
create table if not exists swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid references profiles on delete cascade not null,
  target_id uuid not null,
  target_type text check (target_type in ('brief', 'creator')) not null,
  direction text check (direction in ('pass', 'slide')) not null,
  created_at timestamptz default now() not null,
  unique (swiper_id, target_id, target_type)
);

-- Applications
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references briefs on delete cascade not null,
  creator_id uuid references profiles on delete cascade not null,
  pitch text,
  proposed_rate numeric,
  status text check (status in ('pending', 'accepted', 'rejected', 'withdrawn')) default 'pending' not null,
  created_at timestamptz default now() not null,
  unique (brief_id, creator_id)
);

-- Deals
create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references briefs on delete restrict not null,
  creator_id uuid references profiles on delete restrict not null,
  brand_id uuid references profiles on delete restrict not null,
  agreed_fee numeric,
  stripe_payment_intent_id text,
  escrow_funded_at timestamptz,
  content_submitted_at timestamptz,
  approved_at timestamptz,
  status text check (status in ('pending', 'funded', 'delivered', 'approved', 'disputed', 'cancelled')) default 'pending' not null,
  created_at timestamptz default now() not null
);

-- Rewards
create table if not exists rewards (
  id uuid primary key default gen_random_uuid(),
  partner_name text,
  offer_description text,
  discount_code text,
  discount_value text,
  minimum_tier text check (minimum_tier in ('rising', 'verified', 'elite', 'ambassador')) default 'rising',
  expires_at date,
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

-- Creator reward redemptions
create table if not exists reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles on delete cascade not null,
  reward_id uuid references rewards on delete cascade not null,
  redeemed_at timestamptz default now() not null,
  unique (creator_id, reward_id)
);

-- ============================================================
-- Indexes
-- ============================================================

create index if not exists idx_briefs_brand_id on briefs(brand_id);
create index if not exists idx_briefs_status on briefs(status);
create index if not exists idx_swipes_swiper_id on swipes(swiper_id);
create index if not exists idx_swipes_target on swipes(target_id, target_type);
create index if not exists idx_applications_brief_id on applications(brief_id);
create index if not exists idx_applications_creator_id on applications(creator_id);
create index if not exists idx_deals_creator_id on deals(creator_id);
create index if not exists idx_deals_brand_id on deals(brand_id);
create index if not exists idx_reward_redemptions_creator_id on reward_redemptions(creator_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles enable row level security;
alter table creator_profiles enable row level security;
alter table brand_profiles enable row level security;
alter table briefs enable row level security;
alter table swipes enable row level security;
alter table applications enable row level security;
alter table deals enable row level security;
alter table rewards enable row level security;
alter table reward_redemptions enable row level security;

-- ============================================================
-- RLS Policies: profiles
-- ============================================================

create policy "Public profiles are viewable by all authenticated users"
  on profiles for select
  to authenticated
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- RLS Policies: creator_profiles
-- ============================================================

create policy "Creator profiles are viewable by authenticated users"
  on creator_profiles for select
  to authenticated
  using (true);

create policy "Creators can insert their own creator profile"
  on creator_profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Creators can update their own creator profile"
  on creator_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can update any creator profile"
  on creator_profiles for update
  to authenticated
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- RLS Policies: brand_profiles
-- ============================================================

create policy "Brand profiles are viewable by authenticated users"
  on brand_profiles for select
  to authenticated
  using (true);

create policy "Brands can insert their own brand profile"
  on brand_profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Brands can update their own brand profile"
  on brand_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- RLS Policies: briefs
-- ============================================================

create policy "Live briefs are viewable by all authenticated users"
  on briefs for select
  to authenticated
  using (status = 'live' or brand_id = auth.uid());

create policy "Brands can insert briefs"
  on briefs for insert
  to authenticated
  with check (
    auth.uid() = brand_id and
    exists (select 1 from profiles where id = auth.uid() and role = 'brand')
  );

create policy "Brands can update their own briefs"
  on briefs for update
  to authenticated
  using (auth.uid() = brand_id)
  with check (auth.uid() = brand_id);

create policy "Admins can manage all briefs"
  on briefs for all
  to authenticated
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- RLS Policies: swipes
-- ============================================================

create policy "Users can view their own swipes"
  on swipes for select
  to authenticated
  using (auth.uid() = swiper_id);

create policy "Users can insert their own swipes"
  on swipes for insert
  to authenticated
  with check (auth.uid() = swiper_id);

-- ============================================================
-- RLS Policies: applications
-- ============================================================

create policy "Creators can view their own applications"
  on applications for select
  to authenticated
  using (
    auth.uid() = creator_id or
    exists (
      select 1 from briefs where id = brief_id and brand_id = auth.uid()
    )
  );

create policy "Creators can insert applications"
  on applications for insert
  to authenticated
  with check (
    auth.uid() = creator_id and
    exists (select 1 from profiles where id = auth.uid() and role = 'creator')
  );

create policy "Creators can update their own applications"
  on applications for update
  to authenticated
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

create policy "Brands can update applications for their briefs"
  on applications for update
  to authenticated
  using (
    exists (
      select 1 from briefs where id = brief_id and brand_id = auth.uid()
    )
  );

-- ============================================================
-- RLS Policies: deals
-- ============================================================

create policy "Deals are viewable by the creator and brand involved"
  on deals for select
  to authenticated
  using (auth.uid() = creator_id or auth.uid() = brand_id);

create policy "Deals can be inserted by the brand"
  on deals for insert
  to authenticated
  with check (auth.uid() = brand_id);

create policy "Deals can be updated by the creator or brand involved"
  on deals for update
  to authenticated
  using (auth.uid() = creator_id or auth.uid() = brand_id);

create policy "Admins can manage all deals"
  on deals for all
  to authenticated
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- RLS Policies: rewards
-- ============================================================

create policy "Active rewards are viewable by all authenticated users"
  on rewards for select
  to authenticated
  using (is_active = true);

create policy "Admins can manage all rewards"
  on rewards for all
  to authenticated
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- RLS Policies: reward_redemptions
-- ============================================================

create policy "Creators can view their own redemptions"
  on reward_redemptions for select
  to authenticated
  using (auth.uid() = creator_id);

create policy "Creators can insert their own redemptions"
  on reward_redemptions for insert
  to authenticated
  with check (auth.uid() = creator_id);

-- ============================================================
-- Auto-create profile on sign-up trigger
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
