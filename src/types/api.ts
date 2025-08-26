// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Paginated Response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// User Types - CORRECTED TO MATCH ACTUAL MODEL
export interface User {
  id: string;
  user_type: 'player' | 'coach' | 'club' | 'partner' | 'state' | 'admin';
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  date_of_birth?: string;
  age?: number; // Virtual field
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  state?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  whatsapp?: string;
  skill_level?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  curp?: string; // Mexican population registry
  rfc?: string; // Mexican tax ID
  business_name?: string;
  contact_person?: string;
  job_title?: string;
  website?: string;
  social_media?: object;
  profile_photo?: string;
  logo?: string;
  membership_status: 'free' | 'basic' | 'premium' | 'expired';
  membership_expires_at?: string;
  subscription_plan: 'basic' | 'premium' | 'federation';
  email_verified: boolean;
  last_login?: string;
  preferences: object;
  is_active: boolean;
  is_verified: boolean;
  verification_documents?: object;
  notes?: string;
  can_be_found?: boolean; // Privacy setting for player finder
  club_id?: string; // Reference to club if user belongs to one
  club?: Club; // Club information if user belongs to one
  created_at: string;
  updated_at: string;
}

// Club Types - CORRECTED TO MATCH ACTUAL MODEL
export interface Club {
  id: string;
  name: string;
  club_type: 'recreational' | 'competitive' | 'training' | 'mixed';
  description?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  state: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  founded_date?: string;
  member_count: number;
  max_members?: number;
  has_courts: boolean;
  court_count: number;
  court_types?: object;
  offers_training: boolean;
  offers_tournaments: boolean;
  offers_equipment: boolean;
  membership_status: 'active' | 'expired' | 'suspended' | 'cancelled' | 'pending';
  membership_expires_at?: string;
  subscription_plan: 'basic' | 'premium';
  membership_fee?: number;
  court_rental_fee?: number;
  logo?: string;
  banner_image?: string;
  photos?: object;
  website?: string;
  social_media?: object;
  operating_hours?: object;
  availability?: object;
  club_rules?: string;
  dress_code?: string;
  total_tournaments: number;
  total_matches: number;
  created_at: string;
  updated_at: string;
}

// Tournament Types - CORRECTED TO MATCH ACTUAL MODEL
export interface Tournament {
  id: string;
  name: string;
  tournament_type: 'local' | 'state' | 'national' | 'international' | 'exhibition' | 'league';
  category: 'singles' | 'doubles' | 'mixed_doubles' | 'team';
  description?: string;
  organizer_id: string;
  organizer_type: 'club' | 'partner' | 'state' | 'federation';
  organizer_name: string;
  venue_name: string;
  venue_address: string;
  state: string;
  city: string;
  latitude?: number;
  longitude?: number;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  entry_fee?: number;
  max_participants?: number;
  current_participants: number;
  max_teams?: number;
  current_teams: number;
  skill_levels?: string[];
  age_categories?: string[];
  gender_categories?: string[];
  tournament_format?: string;
  points_to_win?: number;
  win_by?: number;
  status: 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'in_progress' | 'completed' | 'cancelled';
  rules?: string;
  schedule?: object;
  court_assignments?: object;
  banner_image?: string;
  logo?: string;
  photos?: object;
  contact_email?: string;
  contact_phone?: string;
  registration_requirements?: object;
  registration_notes?: string;
  total_matches: number;
  completed_matches: number;
  settings?: object;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Court Types - CORRECTED TO MATCH ACTUAL MODEL
export interface Court {
  id: string;
  name: string;
  court_type: 'indoor' | 'outdoor' | 'covered';
  surface: 'concrete' | 'asphalt' | 'synthetic' | 'grass' | 'clay';
  description?: string;
  dimensions?: string;
  capacity?: number;
  club_id: string;
  club_name: string;
  is_available: boolean;
  is_maintenance: boolean;
  maintenance_notes?: string;
  maintenance_start?: string;
  maintenance_end?: string;
  operating_hours?: object;
  hourly_rate?: number;
  member_rate?: number;
  equipment?: object;
  amenities?: object;
  photos?: object;
  total_bookings: number;
  total_hours: number;
  created_at: string;
  updated_at: string;
}

// Payment Types - CORRECTED TO MATCH ACTUAL MODEL
export interface Payment {
  id: string;
  user_id: string;
  club_id?: string;
  tournament_id?: string;
  amount: number;
  currency: string;
  payment_type: 'membership_fee' | 'tournament_registration' | 'court_rental' | 'equipment_purchase' | 'donation' | 'subscription_upgrade' | 'other';
  payment_method: 'stripe' | 'paypal' | 'bank_transfer' | 'cash' | 'check' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  processing_fee?: number;
  failure_reason?: string;
  refund_amount?: number;
  refund_reason?: string;
  refunded_at?: string;
  description?: string;
  metadata?: object;
  billing_address?: object;
  receipt_url?: string;
  invoice_number?: string;
  created_at: string;
  updated_at: string;
}

// Ranking Types - CORRECTED TO MATCH ACTUAL MODEL
export interface Ranking {
  id: string;
  user_id: string;
  user_name: string;
  category: 'singles' | 'doubles' | 'mixed_doubles';
  skill_level: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  state?: string;
  current_position: number;
  current_points: number;
  previous_position?: number;
  previous_points?: number;
  tournaments_played: number;
  tournaments_won: number;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  win_percentage: number;
  recent_points: number;
  best_finish?: string;
  ranking_period: string;
  is_current: boolean;
  ranking_history?: object;
  created_at: string;
  updated_at: string;
}

// Notification Types - CORRECTED TO MATCH ACTUAL MODEL
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  related_id?: string;
  related_type?: string;
  action_url?: string;
  action_text?: string;
  email_sent: boolean;
  sms_sent: boolean;
  metadata?: object;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// File Upload Types - CORRECTED TO MATCH ACTUAL MODEL
export interface FileUpload {
  id: string;
  user_id?: string;
  tournament_id?: string;
  original_name: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  file_extension: string;
  width?: number;
  height?: number;
  thumbnail_url?: string;
  is_public: boolean;
  is_approved: boolean;
  is_deleted: boolean;
  description?: string;
  tags?: string[];
  metadata?: object;
  access_token?: string;
  expires_at?: string;
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// Banner Types - NEWLY ADDED
export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  thumbnail_url?: string;
  action_url?: string;
  action_text?: string;
  position: number;
  is_active: boolean;
  is_featured: boolean;
  display_type: 'carousel' | 'sidebar' | 'popup' | 'notification';
  target_audience: 'all' | 'players' | 'coaches' | 'clubs' | 'partners' | 'admins';
  start_date?: string;
  end_date?: string;
  related_tournament_id?: string;
  related_club_id?: string;
  related_event_id?: string;
  click_count: number;
  view_count: number;
  tags?: string[];
  metadata?: object;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Player Finder Types - NEWLY ADDED
export interface PlayerFinder {
  id: string;
  searcher_id: string;
  skill_level_min?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  skill_level_max?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  preferred_gender: 'male' | 'female' | 'any';
  age_range_min?: number;
  age_range_max?: number;
  search_radius_km: number;
  preferred_locations?: object;
  match_type: 'singles' | 'doubles' | 'mixed_doubles' | 'any';
  availability_days?: number[];
  availability_time_start?: string;
  availability_time_end?: string;
  contact_method: 'email' | 'phone' | 'whatsapp' | 'any';
  auto_notify: boolean;
  is_active: boolean;
  last_search_date?: string;
  total_matches_found: number;
  matches_contacted: number;
  successful_matches: number;
  search_criteria?: object;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Court Reservation Types - NEWLY ADDED
export interface CourtReservation {
  id: string;
  court_id: string;
  user_id: string;
  club_id: string;
  start_time: string;
  end_time: string;
  reservation_date: string;
  duration_hours: number;
  purpose?: string;
  match_type?: 'singles' | 'doubles' | 'mixed_doubles' | 'practice' | 'lesson' | 'other';
  participants?: string[];
  guest_count: number;
  hourly_rate: number;
  total_amount: number;
  member_discount: number;
  final_amount: number;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_id?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
  refund_amount: number;
  special_requests?: string;
  equipment_needed?: object;
  notes?: string;
  checked_in_at?: string;
  checked_out_at?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  rating?: number;
  feedback?: string;
  booking_source: 'web' | 'mobile' | 'phone' | 'in_person';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

// Request/Response Types for Authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  user_type: 'player' | 'coach' | 'club' | 'partner' | 'state' | 'federation';
  username: string;
  email: string;
  password: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  state?: string;
  city?: string;
  phone?: string;
  skill_level?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  curp?: string;
  business_name?: string;
  contact_person?: string;
  rfc?: string;
  website?: string;
  privacy_policy_accepted?: boolean;
  profile_photo?: File;
  verification_document?: File;
}

export interface LoginResponse extends ApiResponse<{
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}> {}

export interface RegisterResponse extends ApiResponse<{
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}> {}

export interface ProfileResponse extends ApiResponse<User> {}

// Request/Response Types for Users
export interface UsersQueryParams {
  page?: number;
  limit?: number;
  user_type?: 'player' | 'coach' | 'club' | 'partner' | 'state' | 'federation';
  state?: string;
  skill_level?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  membership_status?: 'active' | 'expired' | 'suspended' | 'cancelled' | 'pending';
  search?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  profile_photo?: string;
  bio?: string;
  skill_level?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  state?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  business_name?: string;
  contact_person?: string;
  job_title?: string;
  curp?: string;
  rfc?: string;
  website?: string;
  membership_status?: 'free' | 'basic' | 'premium' | 'expired';
  membership_expires_at?: string;
  is_active?: boolean;
  is_verified?: boolean;
  club_id?: string;
}

export interface UsersResponse extends PaginatedResponse<User> {}
export interface PlayersResponse extends PaginatedResponse<User> {}
export interface UserResponse extends ApiResponse<User> {}
export interface UpdateUserResponse extends ApiResponse<User> {}

// Request/Response Types for Clubs
export interface ClubsQueryParams {
  page?: number;
  limit?: number;
  state?: string;
  city?: string;
  club_type?: 'recreational' | 'competitive' | 'training' | 'mixed';
  has_courts?: boolean;
  subscription_plan?: 'basic' | 'premium';
  search?: string;
}

export interface CreateClubRequest {
  name: string;
  club_type: 'recreational' | 'competitive' | 'training' | 'mixed';
  description?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  state: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  founded_date?: string;
  max_members?: number;
  has_courts: boolean;
  court_count: number;
  court_types?: object;
  offers_training: boolean;
  offers_tournaments: boolean;
  offers_equipment: boolean;
  membership_fee?: number;
  court_rental_fee?: number;
  website?: string;
  social_media?: object;
  operating_hours?: object;
  club_rules?: string;
  dress_code?: string;
}

export interface ClubsResponse extends PaginatedResponse<Club> {}
export interface ClubResponse extends ApiResponse<Club> {}
export interface CreateClubResponse extends ApiResponse<Club> {}
export interface ClubCourtsResponse extends ApiResponse<Court[]> {}
export interface ClubTournamentsResponse extends ApiResponse<Tournament[]> {}

// Request/Response Types for Tournaments
export interface TournamentsQueryParams {
  page?: number;
  limit?: number;
  tournament_type?: 'local' | 'state' | 'national' | 'international' | 'exhibition' | 'league';
  category?: 'singles' | 'doubles' | 'mixed_doubles' | 'team';
  status?: 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'in_progress' | 'completed' | 'cancelled';
  state?: string;
  city?: string;
  search?: string;
}

export interface CreateTournamentRequest {
  name: string;
  tournament_type: 'local' | 'state' | 'national' | 'international' | 'exhibition' | 'league';
  category: 'singles' | 'doubles' | 'mixed_doubles' | 'team';
  description?: string;
  organizer_type: 'club' | 'partner' | 'state' | 'federation';
  venue_name: string;
  venue_address: string;
  state: string;
  city: string;
  latitude?: number;
  longitude?: number;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  entry_fee?: number;
  max_participants?: number;
  max_teams?: number;
  skill_levels?: string[];
  age_categories?: string[];
  gender_categories?: string[];
  tournament_format?: string;
  points_to_win?: number;
  win_by?: number;
  rules?: string;
  contact_email?: string;
  contact_phone?: string;
  registration_requirements?: object;
  registration_notes?: string;
}

export interface TournamentRegistrationRequest {
  category?: 'singles' | 'doubles' | 'mixed_doubles';
  division?: string;
  partner_id?: string;
  partner_name?: string;
  special_requests?: string;
  dietary_restrictions?: string;
}

export interface TournamentsResponse extends PaginatedResponse<Tournament> {}
export interface UpcomingTournamentsResponse extends ApiResponse<Tournament[]> {}
export interface TournamentResponse extends ApiResponse<Tournament> {}
export interface CreateTournamentResponse extends ApiResponse<Tournament> {}
export interface TournamentRegistrationResponse extends ApiResponse<{
  registration: any;
  payment_required: boolean;
  payment_amount?: number;
}> {}

// Request/Response Types for Courts
export interface CourtsQueryParams {
  page?: number;
  limit?: number;
  club_id?: string;
  court_type?: 'indoor' | 'outdoor' | 'covered';
  surface?: 'concrete' | 'asphalt' | 'synthetic' | 'grass' | 'clay';
  is_available?: boolean;
  search?: string;
}

export interface CreateCourtRequest {
  name: string;
  court_type: 'indoor' | 'outdoor' | 'covered';
  surface: 'concrete' | 'asphalt' | 'synthetic' | 'grass' | 'clay';
  description?: string;
  dimensions?: string;
  capacity?: number;
  is_available?: boolean;
  is_maintenance?: boolean;
  maintenance_notes?: string;
  maintenance_start?: string;
  maintenance_end?: string;
  operating_hours?: object;
  hourly_rate?: number;
  member_rate?: number;
  equipment?: object;
  amenities?: object;
}

export interface BookCourtRequest {
  start_time: string;
  end_time: string;
  purpose?: string;
  match_type?: 'singles' | 'doubles' | 'mixed_doubles' | 'practice' | 'lesson' | 'other';
  participants?: string[];
  guest_count?: number;
  special_requests?: string;
  equipment_needed?: object;
  notes?: string;
}

export interface CourtsResponse extends PaginatedResponse<Court> {}
export interface CourtResponse extends ApiResponse<Court> {}
export interface CreateCourtResponse extends ApiResponse<Court> {}
export interface BookCourtResponse extends ApiResponse<{
  reservation: CourtReservation;
  payment_required: boolean;
  payment_amount: number;
}> {}

// Request/Response Types for Payments
export interface PaymentsQueryParams {
  page?: number;
  limit?: number;
  payment_type?: 'membership_fee' | 'tournament_registration' | 'court_rental' | 'equipment_purchase' | 'donation' | 'subscription_upgrade' | 'other';
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  user_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency?: string;
  payment_type: 'membership_fee' | 'tournament_registration' | 'court_rental' | 'equipment_purchase' | 'donation' | 'subscription_upgrade' | 'other';
  payment_method: 'stripe' | 'paypal' | 'bank_transfer' | 'cash' | 'check' | 'other';
  description?: string;
  club_id?: string;
  tournament_id?: string;
}

export interface ProcessPaymentRequest {
  payment_method_id: string;
  billing_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface PaymentsResponse extends PaginatedResponse<Payment> {}
export interface CreatePaymentResponse extends ApiResponse<Payment> {}
export interface ProcessPaymentResponse extends ApiResponse<{
  payment: Payment;
  client_secret?: string;
}> {}

// Request/Response Types for Rankings
export interface RankingsQueryParams {
  page?: number;
  limit?: number;
  category?: 'singles' | 'doubles' | 'mixed_doubles';
  skill_level?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  state?: string;
  search?: string;
}

export interface RankingsResponse extends PaginatedResponse<Ranking> {}
export interface TopPlayersResponse extends ApiResponse<Ranking[]> {}
export interface UserRankingsResponse extends ApiResponse<Ranking[]> {}

// Request/Response Types for Notifications
export interface NotificationsQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  unread_only?: boolean;
}

export interface NotificationsResponse extends PaginatedResponse<Notification> {}
export interface MarkReadResponse extends ApiResponse<Notification> {}
export interface MarkAllReadResponse extends ApiResponse<{
  updated_count: number;
}> {}

// Request/Response Types for Banners
export interface ActiveBannersQueryParams {
  display_type?: 'carousel' | 'sidebar' | 'popup' | 'notification';
  target_audience?: 'all' | 'players' | 'coaches' | 'clubs' | 'partners' | 'admins';
}

export interface BannersQueryParams {
  page?: number;
  limit?: number;
  display_type?: 'carousel' | 'sidebar' | 'popup' | 'notification';
  target_audience?: 'all' | 'players' | 'coaches' | 'clubs' | 'partners' | 'admins';
  is_active?: boolean;
  is_featured?: boolean;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateBannerRequest {
  title: string;
  subtitle?: string;
  image_url: string;
  thumbnail_url?: string;
  action_url?: string;
  action_text?: string;
  position?: number;
  is_active?: boolean;
  is_featured?: boolean;
  display_type?: 'carousel' | 'sidebar' | 'popup' | 'notification';
  target_audience?: 'all' | 'players' | 'coaches' | 'clubs' | 'partners' | 'admins';
  start_date?: string;
  end_date?: string;
  related_tournament_id?: string;
  related_club_id?: string;
  related_event_id?: string;
  tags?: string[];
  metadata?: object;
  notes?: string;
}

export interface UpdateBannerRequest extends Partial<CreateBannerRequest> {}

export interface UpdateBannerPositionRequest {
  position: number;
}

export interface CarouselBannersResponse extends ApiResponse<Banner[]> {}
export interface ActiveBannersResponse extends ApiResponse<Banner[]> {}
export interface BannersResponse extends PaginatedResponse<Banner> {}
export interface CreateBannerResponse extends ApiResponse<Banner> {}
export interface UpdateBannerResponse extends ApiResponse<Banner> {}
export interface DeleteBannerResponse extends ApiResponse<{}> {}
export interface ToggleBannerResponse extends ApiResponse<Banner> {}
export interface UpdateBannerPositionResponse extends ApiResponse<Banner> {}
export interface TrackBannerViewResponse extends ApiResponse<{}> {}
export interface TrackBannerClickResponse extends ApiResponse<{}> {}
export interface BannerAnalyticsResponse extends ApiResponse<{
  total_banners: number;
  total_views: number;
  total_clicks: number;
  click_through_rate: number;
  top_performing_banners: Banner[];
  banners_by_display_type: Record<string, { count: number; views: number; clicks: number }>;
  banners_by_audience: Record<string, { count: number; views: number; clicks: number }>;
}> {}

// Request/Response Types for Player Finder
export interface SearchPlayersQueryParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
  skill_level?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  gender?: 'male' | 'female' | 'any';
  age_min?: number;
  age_max?: number;
  match_type?: 'singles' | 'doubles' | 'mixed_doubles' | 'any';
  page?: number;
  limit?: number;
}

export interface UpdatePlayerFinderPreferencesRequest {
  skill_level_min?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  skill_level_max?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  preferred_gender?: 'male' | 'female' | 'any';
  age_range_min?: number;
  age_range_max?: number;
  search_radius_km?: number;
  preferred_locations?: object;
  match_type?: 'singles' | 'doubles' | 'mixed_doubles' | 'any';
  availability_days?: number[];
  availability_time_start?: string;
  availability_time_end?: string;
  contact_method?: 'email' | 'phone' | 'whatsapp' | 'any';
  auto_notify?: boolean;
  notes?: string;
}

export interface SendMatchRequestRequest {
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
  match_type?: 'singles' | 'doubles' | 'mixed_doubles';
}

export interface SearchPlayersResponse extends PaginatedResponse<User> {}
export interface NearbyPlayersResponse extends ApiResponse<Array<User & { distance_km: number }>> {}
export interface PlayerFinderPreferencesResponse extends ApiResponse<PlayerFinder | null> {}
export interface UpdatePlayerFinderPreferencesResponse extends ApiResponse<PlayerFinder> {}
export interface TogglePlayerFinderResponse extends ApiResponse<PlayerFinder> {}
export interface PlayerFinderStatsResponse extends ApiResponse<{
  total_matches_found: number;
  matches_contacted: number;
  successful_matches: number;
  is_active: boolean;
  last_search_date?: string;
}> {}
export interface SendMatchRequestResponse extends ApiResponse<{
  target_user: {
    id: string;
    username: string;
    full_name: string;
  };
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
  match_type?: string;
}> {}

// Request/Response Types for Court Reservations
export interface CourtAvailabilityQueryParams {
  date: string;
  duration?: number;
}

export interface CourtBookingsQueryParams {
  date?: string;
  status?: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
}

export interface CourtAvailabilityResponse extends ApiResponse<Array<{
  start_time: string;
  end_time: string;
  available: boolean;
}>> {}
export interface CourtBookingsResponse extends ApiResponse<CourtReservation[]> {}

// Request/Response Types for Admin
export interface DashboardStatsResponse extends ApiResponse<{
  total_users: number;
  total_clubs: number;
  total_tournaments: number;
  total_revenue: number;
  active_memberships: number;
  new_users_this_month: number;
  upcoming_tournaments: number;
  pending_payments: number;
}> {}

export interface UpdateUserRoleRequest {
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
}

export interface AdminUsersResponse extends PaginatedResponse<User> {}
export interface UpdateUserRoleResponse extends ApiResponse<User> {}

// Request/Response Types for Statistics
export interface OverviewStatsResponse extends ApiResponse<{
  total_users: number;
  total_clubs: number;
  total_tournaments: number;
  total_revenue: number;
  active_memberships: number;
}> {}

export interface UserStatsResponse extends ApiResponse<{
  total_users: number;
  new_users_this_month: number;
  active_users: number;
  users_by_type: Record<string, number>;
  users_by_state: Record<string, number>;
}> {} 

// Digital Credential Types
export interface DigitalCredential {
  id: string;
  user_id: string;
  credential_number: string;
  verification_code: string;
  federation_name: string;
  federation_logo?: string;
  player_name: string;
  nrtp_level?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  state_affiliation?: string;
  nationality: string;
  affiliation_status: 'active' | 'inactive' | 'suspended' | 'expired';
  ranking_position?: number;
  club_status: 'club_member' | 'independent';
  club_name?: string;
  qr_code_url: string;
  qr_code_data: string;
  issued_date: string;
  expiry_date?: string;
  last_verified?: string;
  verification_count: number;
  is_verified: boolean;
  verification_notes?: string;
  metadata?: object;
  created_at: string;
  updated_at: string;
}

// Digital Credential API Responses
export interface CreateDigitalCredentialResponse extends ApiResponse<DigitalCredential> {}
export interface GetDigitalCredentialResponse extends ApiResponse<DigitalCredential> {}
export interface VerifyDigitalCredentialResponse extends ApiResponse<DigitalCredential> {}
export interface UpdateDigitalCredentialResponse extends ApiResponse<DigitalCredential> {}
export interface GetAllDigitalCredentialsResponse extends PaginatedResponse<DigitalCredential> {}
export interface RegenerateQRCodeResponse extends ApiResponse<{
  qr_code_url: string;
  qr_code_data: string;
  qr_code_filename: string;
  security_features: {
    digital_signature: boolean;
    jwt_token: boolean;
    timestamp: string;
  };
}> {
  qrCodeUrl: string;
  qrCodeData: string;
}

// New response types for optimized API
export interface GetCredentialStatsResponse extends ApiResponse<{
  total: number;
  active: number;
  breakdown: Array<{
    affiliation_status: string;
    state_affiliation: string;
    is_verified: boolean;
    count: number;
  }>;
}> {}

export interface DeleteDigitalCredentialResponse extends ApiResponse<null> {} 