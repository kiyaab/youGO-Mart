export type UserRole = 'visitor' | 'buyer' | 'seller' | 'verified_seller' | 'moderator' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_verified: boolean;
  display_name: string;
  has_seller_profile: boolean;
  is_seller_verified: boolean;
  created_at: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  display_name: string;
  bio: string;
  country: string;
  region: string;
  city: string;
  preferred_language: 'en' | 'am' | 'om';
  email_notifications: boolean;
  message_notifications: boolean;
  created_at: string;
}

export interface SellerProfile {
  id: number;
  user_id: number;
  user_email: string;
  public_name: string;
  business_name?: string;
  bio?: string;
  contact_phone: string;
  allow_calls: boolean;
  allow_whatsapp: boolean;
  allow_messages: boolean;
  allow_email: boolean;
  location_city: string;
  location_neighborhood: string;
  seller_status: 'active' | 'suspended';
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  is_verified: boolean;
  total_views: number;
  total_contact_clicks: number;
  response_time_str: string;
  active_listings_count?: number;
  member_since?: string;
  created_at: string;
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_identifier?: string;
  listing_count: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_identifier: string;
  sort_order: number;
  is_active: boolean;
  listing_count: number;
  subcategories: Subcategory[];
}

export type ListingCondition = 'brand_new' | 'like_new' | 'used_good' | 'used_fair' | 'refurbished';
export type ListingStatus = 'draft' | 'pending' | 'active' | 'reserved' | 'sold' | 'paused' | 'expired' | 'rejected' | 'removed';

export interface ListingCard {
  id: number;
  title: string;
  slug: string;
  price: string | number;
  currency: string;
  is_negotiable: boolean;
  condition: ListingCondition;
  condition_display: string;
  category_name: string;
  category_slug: string;
  city: string;
  neighborhood: string;
  landmark?: string;
  status: ListingStatus;
  is_promoted: boolean;
  promotion_type: string;
  reference_id: string;
  views_count: number;
  primary_image?: string | null;
  seller_id: number;
  seller_name: string;
  is_seller_verified: boolean;
  created_at: string;
  time_ago: string;
}

export interface ListingImage {
  id: number;
  image?: string;
  image_url?: string;
  url: string;
  display_order: number;
  is_primary: boolean;
}

export interface ListingDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string | number;
  currency: string;
  is_negotiable: boolean;
  condition: ListingCondition;
  condition_display: string;
  brand?: string;
  model?: string;
  category: number;
  category_name: string;
  category_slug: string;
  subcategory?: number;
  country: string;
  region: string;
  city: string;
  neighborhood: string;
  landmark?: string;
  status: ListingStatus;
  is_promoted: boolean;
  promotion_type: string;
  reference_id: string;
  views_count: number;
  contact_clicks_count: number;
  images: ListingImage[];
  seller: SellerProfile;
  is_favorited: boolean;
  created_at: string;
  updated_at: string;
  time_ago: string;
}

export interface Conversation {
  id: number;
  listing?: number;
  listing_title?: string;
  listing_price?: string;
  listing_currency?: string;
  listing_image?: string;
  other_party?: {
    id: number;
    name: string;
    email: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    is_read: boolean;
    sender_id: number;
  };
  unread_count: number;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation: number;
  sender: number;
  sender_name: string;
  content: string;
  is_read: boolean;
  is_me: boolean;
  created_at: string;
}

export interface Notification {
  id: number;
  notification_type: 'message' | 'listing_approved' | 'listing_rejected' | 'verification' | 'system';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface LocationGroup {
  region: string;
  city: string;
  neighborhoods: string[];
}
