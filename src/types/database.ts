export type UserRole = 'creator' | 'brand' | 'admin'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'
export type CreatorTier = 'rising' | 'verified' | 'elite' | 'ambassador'
export type BriefStatus = 'draft' | 'live' | 'closed' | 'completed'
export type SwipeDirection = 'pass' | 'slide'
export type SwipeTargetType = 'brief' | 'creator'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type DealStatus = 'pending' | 'funded' | 'delivered' | 'approved' | 'disputed' | 'cancelled'
export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

export interface Profile {
  id: string
  role: UserRole
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  created_at: string
}

export interface CreatorProfile {
  id: string
  niches: string[] | null
  follower_count_instagram: number | null
  follower_count_tiktok: number | null
  follower_count_youtube: number | null
  follower_count_linkedin: number | null
  avg_engagement_rate: number | null
  verification_status: VerificationStatus | null
  tier: CreatorTier | null
  sample_video_urls: string[] | null
  portfolio_urls: string[] | null
  day_rate: number | null
  created_at: string
}

export interface BrandProfile {
  id: string
  company_name: string | null
  website: string | null
  industry: string | null
  subscription_tier: SubscriptionTier | null
  created_at: string
}

export interface Brief {
  id: string
  brand_id: string
  title: string | null
  description: string | null
  deliverables: string[] | null
  budget: number | null
  currency: string
  deadline: string | null
  niches: string[] | null
  status: BriefStatus
  created_at: string
}

export interface Swipe {
  id: string
  swiper_id: string
  target_id: string
  target_type: SwipeTargetType
  direction: SwipeDirection
  created_at: string
}

export interface Application {
  id: string
  brief_id: string
  creator_id: string
  pitch: string | null
  proposed_rate: number | null
  status: ApplicationStatus
  created_at: string
}

export interface Deal {
  id: string
  brief_id: string
  creator_id: string
  brand_id: string
  agreed_fee: number | null
  stripe_payment_intent_id: string | null
  escrow_funded_at: string | null
  content_submitted_at: string | null
  approved_at: string | null
  status: DealStatus
  created_at: string
}

export interface Reward {
  id: string
  partner_name: string | null
  offer_description: string | null
  discount_code: string | null
  discount_value: string | null
  minimum_tier: CreatorTier | null
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export interface RewardRedemption {
  id: string
  creator_id: string
  reward_id: string
  redeemed_at: string
}
