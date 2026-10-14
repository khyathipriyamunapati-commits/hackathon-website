export type UserRole = 'tourist' | 'guide' | 'admin';

export type BookingStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'in_progress'
  | 'completed';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface GuideProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  headline: string;
  bio: string;
  experienceYears: number;
  pricePerDay: number;
  languages: string[];
  specializations: string[];
  supportedDestinations: string[];
  servicesOffered: string[];
  includedServices: string[];
  excludedServices: string[];
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  rating: number;
  reviewCount: number;
  isDemo?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  description: string;
  heroImage: string;
  category: string;
  popularAttractions: string[];
  suggestedDuration: string;
  indicativeBudgetMin: number;
  indicativeBudgetMax: number;
  bestTimeToVisit: string;
  guideCount: number;
}

export interface Booking {
  id: string;
  touristId: string;
  touristName: string;
  touristEmail?: string;
  guideId: string;
  guideName: string;
  destinationName: string;
  destinationId?: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  selectedServices: string[];
  specialRequirements?: string;
  dailyRateSnapshot: number;
  totalDays: number;
  estimatedTotal: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryItem {
  id: string;
  dayNumber: number;
  date?: string;
  attractionName: string;
  description: string;
  visitingTime: string;
  travelTime?: string;
  foodRecommendation?: string;
  accommodationSuggestion?: string;
  transportation?: string;
  estimatedExpense?: number;
}

export interface Itinerary {
  id: string;
  bookingId: string;
  title: string;
  notes?: string;
  emergencyInfo?: string;
  items: ItineraryItem[];
  updatedAt: string;
}

export type RecommendationCategory = 
  | 'hotel_budget'
  | 'hotel_midrange'
  | 'restaurant'
  | 'local_food'
  | 'transport';

export interface Recommendation {
  id: string;
  guideId?: string;
  guideName?: string;
  destinationName: string;
  destinationId?: string;
  name: string;
  category: RecommendationCategory;
  description: string;
  location: string;
  estimatedPrice: string;
  dietaryType?: 'veg' | 'non_veg' | 'both';
  recommendationNotes?: string;
  isDemo?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  touristId: string;
  touristName: string;
  touristAvatar?: string;
  guideId: string;
  rating: number;
  writtenFeedback: string;
  guideBehaviorRating: number;
  pricingSatisfactionRating: number;
  tripExperienceRating: number;
  isModerated?: boolean;
  isDemo?: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  bookingId?: string;
  touristId: string;
  touristName: string;
  guideId: string;
  guideName: string;
  destinationName: string;
  lastMessage?: string;
  lastMessageAt: string;
}

export interface VerificationRequest {
  id: string;
  guideId: string;
  guideName: string;
  guideEmail: string;
  governmentIdType: string;
  idDocumentUrl: string;
  licenseNumber?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}
