import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  GuideProfile, 
  Destination, 
  Booking, 
  Itinerary, 
  ItineraryItem, 
  Recommendation, 
  Review, 
  Message, 
  Conversation, 
  VerificationRequest, 
  UserRole,
  BookingStatus 
} from '../types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_GUIDES,
  INITIAL_BOOKINGS,
  INITIAL_ITINERARIES,
  INITIAL_RECOMMENDATIONS,
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_VERIFICATION_REQUESTS
} from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AppContextType {
  currentUser: UserProfile;
  isDemoMode: boolean;
  destinations: Destination[];
  guides: GuideProfile[];
  bookings: Booking[];
  itineraries: Record<string, Itinerary>;
  recommendations: Recommendation[];
  reviews: Review[];
  conversations: Conversation[];
  messages: Message[];
  verificationRequests: VerificationRequest[];
  
  // Role & Auth Switcher
  switchRole: (role: UserRole, targetId?: string) => void;
  loginUser: (email: string, role: UserRole, fullName: string) => void;
  logoutUser: () => void;
  
  // Destination Actions
  addDestination: (dest: Omit<Destination, 'id'>) => void;

  // Booking Actions
  createBooking: (bookingData: {
    guideId: string;
    guideName: string;
    destinationName: string;
    startDate: string;
    endDate: string;
    travelerCount: number;
    selectedServices: string[];
    specialRequirements?: string;
    dailyRateSnapshot: number;
  }) => { success: boolean; message: string; booking?: Booking };

  updateBookingStatus: (bookingId: string, status: BookingStatus) => { success: boolean; message: string };

  // Itinerary Actions
  getItineraryByBookingId: (bookingId: string) => Itinerary | undefined;
  saveItinerary: (bookingId: string, itinerary: {
    title: string;
    notes?: string;
    emergencyInfo?: string;
    items: ItineraryItem[];
  }) => void;

  // Messaging Actions
  sendMessage: (bookingId: string, receiverId: string, receiverName: string, text: string) => { success: boolean; message?: string };
  getMessagesByBookingId: (bookingId: string) => Message[];
  getConversationByBookingId: (bookingId: string) => Conversation | undefined;

  // Review Actions
  canUserReviewBooking: (bookingId: string) => { eligible: boolean; reason?: string };
  submitReview: (reviewData: {
    bookingId: string;
    guideId: string;
    rating: number;
    writtenFeedback: string;
    guideBehaviorRating: number;
    pricingSatisfactionRating: number;
    tripExperienceRating: number;
  }) => { success: boolean; message: string };

  // Guide & Verification Actions
  getGuideById: (id: string) => GuideProfile | undefined;
  submitVerificationRequest: (req: {
    governmentIdType: string;
    idDocumentUrl: string;
    licenseNumber?: string;
    notes?: string;
  }) => void;
  approveVerification: (requestId: string, adminNotes?: string) => void;
  rejectVerification: (requestId: string, adminNotes?: string) => void;

  // Recommendations
  addRecommendation: (rec: Omit<Recommendation, 'id'>) => void;

  // Demo Reset
  resetDemoData: () => void;
}

const STORAGE_KEY_PREFIX = 'tourist_guide_v1_';

const DEMO_USERS: Record<UserRole, UserProfile> = {
  tourist: {
    id: 'user-ananya',
    role: 'tourist',
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Avid cultural traveler, heritage lover, traveling with family across historic Indian shrines.',
    createdAt: '2026-08-10T10:00:00Z',
  },
  guide: {
    id: 'guide-ramesh',
    role: 'guide',
    fullName: 'Ramesh Sharma',
    email: 'ramesh.sharma@example.com',
    phone: '+91 98480 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Certified Heritage & Temple Guide in Tirupati (8+ Years Experience).',
    createdAt: '2026-01-15T10:00:00Z',
  },
  admin: {
    id: 'user-admin',
    role: 'admin',
    fullName: 'Platform Admin',
    email: 'admin@touristguide.in',
    phone: '+91 90000 00001',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    bio: 'Tourist Guide Operations & Verification Administrator.',
    createdAt: '2025-01-01T00:00:00Z',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isConfigured = isSupabaseConfigured();
  // By default, if supabase is not connected or in demo environment, we run in Demo Mode
  const [isDemoMode] = useState<boolean>(!isConfigured);

  // Load persisted state or initial seed
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'currentUser');
    return saved ? JSON.parse(saved) : DEMO_USERS.tourist;
  });

  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'destinations');
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  const [guides, setGuides] = useState<GuideProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'guides');
    return saved ? JSON.parse(saved) : INITIAL_GUIDES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [itineraries, setItineraries] = useState<Record<string, Itinerary>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'itineraries');
    return saved ? JSON.parse(saved) : INITIAL_ITINERARIES;
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'recommendations');
    return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'verificationRequests');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATION_REQUESTS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'destinations', JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'guides', JSON.stringify(guides));
  }, [guides]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'itineraries', JSON.stringify(itineraries));
  }, [itineraries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'verificationRequests', JSON.stringify(verificationRequests));
  }, [verificationRequests]);

  // Auth & Role Switching
  const switchRole = (role: UserRole, targetId?: string) => {
    if (role === 'guide') {
      const guideObj = targetId ? guides.find(g => g.id === targetId) : guides[0];
      if (guideObj) {
        setCurrentUser({
          id: guideObj.id,
          role: 'guide',
          fullName: guideObj.fullName,
          email: guideObj.email,
          phone: guideObj.phone,
          avatarUrl: guideObj.avatarUrl,
          bio: guideObj.bio,
          createdAt: '2026-01-01T00:00:00Z',
        });
        return;
      }
    }
    setCurrentUser(DEMO_USERS[role]);
  };

  const loginUser = (email: string, role: UserRole, fullName: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      role,
      fullName: fullName || email.split('@')[0],
      email,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || email)}`,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);

    // If guide, create guide profile entry if none exists
    if (role === 'guide') {
      const existing = guides.find(g => g.email === email);
      if (!existing) {
        const newGuide: GuideProfile = {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          avatarUrl: newUser.avatarUrl || '',
          headline: 'Certified Local Guide',
          bio: 'Passionate local guide ready to share stories and historic gems with travelers.',
          experienceYears: 1,
          pricePerDay: 1500,
          languages: ['English', 'Hindi'],
          specializations: ['Heritage Walks', 'Local Culture'],
          supportedDestinations: ['Tirupati'],
          servicesOffered: ['Walking tours', 'Local guidance'],
          includedServices: ['Guidance'],
          excludedServices: ['Tickets', 'Transportation'],
          isVerified: false,
          verificationStatus: 'pending',
          rating: 5.0,
          reviewCount: 0,
          isDemo: true,
        };
        setGuides(prev => [newGuide, ...prev]);
      }
    }
  };

  const logoutUser = () => {
    // Return to default demo tourist
    setCurrentUser(DEMO_USERS.tourist);
  };

  const addDestination = (dest: Omit<Destination, 'id'>) => {
    const newDest: Destination = {
      ...dest,
      id: `dest-${dest.name.toLowerCase().replace(/\s+/g, '-')}`,
    };
    setDestinations(prev => [...prev, newDest]);
  };

  // Create Booking with concurrency/overlap check
  const createBooking = (bookingData: {
    guideId: string;
    guideName: string;
    destinationName: string;
    startDate: string;
    endDate: string;
    travelerCount: number;
    selectedServices: string[];
    specialRequirements?: string;
    dailyRateSnapshot: number;
  }) => {
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);

    if (end < start) {
      return { success: false, message: 'End date cannot be earlier than start date.' };
    }

    if (bookingData.travelerCount < 1) {
      return { success: false, message: 'Traveler count must be at least 1.' };
    }

    // Calculate total days (inclusive)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const estimatedTotal = totalDays * bookingData.dailyRateSnapshot;

    // Check concurrency / overlapping confirmed bookings for the same guide
    const hasOverlap = bookings.some(b => {
      if (b.guideId !== bookingData.guideId) return false;
      if (b.status !== 'accepted' && b.status !== 'in_progress') return false;

      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);

      return (start <= bEnd && end >= bStart);
    });

    if (hasOverlap) {
      return {
        success: false,
        message: 'The selected guide already has a confirmed booking for these dates. Please select alternative dates or another verified guide.'
      };
    }

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      touristId: currentUser.id,
      touristName: currentUser.fullName,
      touristEmail: currentUser.email,
      guideId: bookingData.guideId,
      guideName: bookingData.guideName,
      destinationName: bookingData.destinationName,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      travelerCount: bookingData.travelerCount,
      selectedServices: bookingData.selectedServices,
      specialRequirements: bookingData.specialRequirements,
      dailyRateSnapshot: bookingData.dailyRateSnapshot,
      totalDays,
      estimatedTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);

    // Create or find conversation
    const existingConv = conversations.find(
      c => c.bookingId === newBooking.id || (c.touristId === currentUser.id && c.guideId === bookingData.guideId)
    );

    if (!existingConv) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        bookingId: newBooking.id,
        touristId: currentUser.id,
        touristName: currentUser.fullName,
        guideId: bookingData.guideId,
        guideName: bookingData.guideName,
        destinationName: bookingData.destinationName,
        lastMessage: `Booking requested for ${bookingData.destinationName} (${bookingData.startDate} to ${bookingData.endDate})`,
        lastMessageAt: new Date().toISOString(),
      };
      setConversations(prev => [newConv, ...prev]);

      // Add system message
      const sysMsg: Message = {
        id: `msg-${Date.now()}`,
        conversationId: newConv.id,
        senderId: currentUser.id,
        senderName: currentUser.fullName,
        senderRole: 'tourist',
        message: `Hello ${bookingData.guideName}! I have requested a ${totalDays}-day trip for ${bookingData.travelerCount} traveler(s). Looking forward to exploring with you!`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, sysMsg]);
    }

    return {
      success: true,
      message: `Booking request successfully submitted to ${bookingData.guideName}!`,
      booking: newBooking
    };
  };

  // Update Booking Status with permission check
  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };

    // Permission checks
    if (currentUser.role === 'guide' && currentUser.id !== booking.guideId) {
      return { success: false, message: 'Unauthorized: Only the assigned guide can update this booking status.' };
    }

    // Guides can accept/reject or mark in progress / completed
    // Tourists can only cancel pending/accepted
    if (currentUser.role === 'tourist' && status !== 'cancelled') {
      return { success: false, message: 'Tourists can only cancel bookings.' };
    }

    // Check overlap if changing to 'accepted'
    if (status === 'accepted') {
      const bStart = new Date(booking.startDate);
      const bEnd = new Date(booking.endDate);
      const hasConflict = bookings.some(b => {
        if (b.id === booking.id || b.guideId !== booking.guideId) return false;
        if (b.status !== 'accepted' && b.status !== 'in_progress') return false;
        const oStart = new Date(b.startDate);
        const oEnd = new Date(b.endDate);
        return (bStart <= oEnd && bEnd >= oStart);
      });

      if (hasConflict) {
        return { success: false, message: 'Conflict: You already have an accepted trip on these overlapping dates.' };
      }
    }

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b))
    );

    // Auto-create initial draft itinerary when guide accepts, if none exists
    if (status === 'accepted' && !itineraries[bookingId]) {
      const defaultItinerary: Itinerary = {
        id: `itin-${Date.now()}`,
        bookingId: booking.id,
        title: `${booking.totalDays}-Day Personalized Tour in ${booking.destinationName}`,
        notes: `Prepared with care for ${booking.touristName} (${booking.travelerCount} travelers).`,
        emergencyInfo: 'Emergency Police: 100 | Tourist Helpline: 1363 | Local Medical Help: 108',
        updatedAt: new Date().toISOString(),
        items: Array.from({ length: booking.totalDays }, (_, i) => ({
          id: `item-${Date.now()}-${i + 1}`,
          dayNumber: i + 1,
          date: booking.startDate,
          attractionName: `Day ${i + 1}: Iconic ${booking.destinationName} Highlights`,
          description: `Guided exploration of heritage monuments, cultural storytelling, and scenic local vistas.`,
          visitingTime: '09:00 AM - 05:00 PM',
          travelTime: '30 mins',
          foodRecommendation: 'Famous local restaurant for traditional regional fare',
          accommodationSuggestion: 'Recommended city center hotel',
          transportation: 'Dedicated AC cab / auto shuttle',
          estimatedExpense: 800,
        })),
      };

      setItineraries(prev => ({ ...prev, [booking.id]: defaultItinerary }));
    }

    return { success: true, message: `Booking marked as ${status.replace('_', ' ')}.` };
  };

  // Itinerary
  const getItineraryByBookingId = (bookingId: string) => {
    return itineraries[bookingId];
  };

  const saveItinerary = (bookingId: string, data: {
    title: string;
    notes?: string;
    emergencyInfo?: string;
    items: ItineraryItem[];
  }) => {
    const existing = itineraries[bookingId];
    const newItinerary: Itinerary = {
      id: existing ? existing.id : `itin-${Date.now()}`,
      bookingId,
      title: data.title,
      notes: data.notes,
      emergencyInfo: data.emergencyInfo,
      items: data.items,
      updatedAt: new Date().toISOString(),
    };

    setItineraries(prev => ({
      ...prev,
      [bookingId]: newItinerary,
    }));
  };

  // Messaging
  const sendMessage = (bookingId: string, receiverId: string, receiverName: string, text: string) => {
    if (!text.trim()) {
      return { success: false, message: 'Message cannot be empty.' };
    }

    let conv = conversations.find(c => c.bookingId === bookingId || (c.touristId === currentUser.id && c.guideId === receiverId) || (c.guideId === currentUser.id && c.touristId === receiverId));

    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        bookingId,
        touristId: currentUser.role === 'tourist' ? currentUser.id : receiverId,
        touristName: currentUser.role === 'tourist' ? currentUser.fullName : receiverName,
        guideId: currentUser.role === 'guide' ? currentUser.id : receiverId,
        guideName: currentUser.role === 'guide' ? currentUser.fullName : receiverName,
        destinationName: 'Tour Discussion',
        lastMessage: text,
        lastMessageAt: new Date().toISOString(),
      };
      setConversations(prev => [conv!, ...prev]);
    } else {
      setConversations(prev =>
        prev.map(c => (c.id === conv!.id ? { ...c, lastMessage: text, lastMessageAt: new Date().toISOString() } : c))
      );
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      message: text.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);
    return { success: true };
  };

  const getMessagesByBookingId = (bookingId: string) => {
    const conv = conversations.find(c => c.bookingId === bookingId);
    if (!conv) return [];
    return messages.filter(m => m.conversationId === conv.id);
  };

  const getConversationByBookingId = (bookingId: string) => {
    return conversations.find(c => c.bookingId === bookingId);
  };

  // Reviews
  const canUserReviewBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { eligible: false, reason: 'Booking not found.' };

    if (booking.touristId !== currentUser.id && currentUser.role !== 'admin') {
      return { eligible: false, reason: 'Only the tourist who booked this trip can submit a review.' };
    }

    if (booking.status !== 'completed') {
      return { eligible: false, reason: 'Reviews can only be submitted after the trip is marked Completed.' };
    }

    const alreadyReviewed = reviews.some(r => r.bookingId === bookingId);
    if (alreadyReviewed) {
      return { eligible: false, reason: 'A review has already been submitted for this booking.' };
    }

    return { eligible: true };
  };

  const submitReview = (reviewData: {
    bookingId: string;
    guideId: string;
    rating: number;
    writtenFeedback: string;
    guideBehaviorRating: number;
    pricingSatisfactionRating: number;
    tripExperienceRating: number;
  }) => {
    const eligibility = canUserReviewBooking(reviewData.bookingId);
    if (!eligibility.eligible) {
      return { success: false, message: eligibility.reason || 'Not eligible to review.' };
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookingId: reviewData.bookingId,
      touristId: currentUser.id,
      touristName: currentUser.fullName,
      touristAvatar: currentUser.avatarUrl,
      guideId: reviewData.guideId,
      rating: reviewData.rating,
      writtenFeedback: reviewData.writtenFeedback,
      guideBehaviorRating: reviewData.guideBehaviorRating,
      pricingSatisfactionRating: reviewData.pricingSatisfactionRating,
      tripExperienceRating: reviewData.tripExperienceRating,
      isDemo: true,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate guide rating & review count
    const guideReviews = updatedReviews.filter(r => r.guideId === reviewData.guideId && !r.isModerated);
    const avgRating = guideReviews.length
      ? Number((guideReviews.reduce((sum, r) => sum + r.rating, 0) / guideReviews.length).toFixed(2))
      : reviewData.rating;

    setGuides(prev =>
      prev.map(g =>
        g.id === reviewData.guideId
          ? { ...g, rating: avgRating, reviewCount: guideReviews.length }
          : g
      )
    );

    return { success: true, message: 'Review successfully submitted! Thank you for your feedback.' };
  };

  // Guide lookup
  const getGuideById = (id: string) => {
    return guides.find(g => g.id === id);
  };

  // Verification
  const submitVerificationRequest = (req: {
    governmentIdType: string;
    idDocumentUrl: string;
    licenseNumber?: string;
    notes?: string;
  }) => {
    const newReq: VerificationRequest = {
      id: `verif-${Date.now()}`,
      guideId: currentUser.id,
      guideName: currentUser.fullName,
      guideEmail: currentUser.email,
      governmentIdType: req.governmentIdType,
      idDocumentUrl: req.idDocumentUrl,
      licenseNumber: req.licenseNumber,
      notes: req.notes,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setVerificationRequests(prev => [newReq, ...prev]);
  };

  const approveVerification = (requestId: string, adminNotes?: string) => {
    const req = verificationRequests.find(r => r.id === requestId);
    if (!req) return;

    setVerificationRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'approved', adminNotes, reviewedAt: new Date().toISOString() } : r))
    );

    setGuides(prev =>
      prev.map(g =>
        g.id === req.guideId
          ? { ...g, isVerified: true, verificationStatus: 'verified' }
          : g
      )
    );
  };

  const rejectVerification = (requestId: string, adminNotes?: string) => {
    const req = verificationRequests.find(r => r.id === requestId);
    if (!req) return;

    setVerificationRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'rejected', adminNotes, reviewedAt: new Date().toISOString() } : r))
    );

    setGuides(prev =>
      prev.map(g =>
        g.id === req.guideId
          ? { ...g, isVerified: false, verificationStatus: 'rejected' }
          : g
      )
    );
  };

  const addRecommendation = (rec: Omit<Recommendation, 'id'>) => {
    const newRec: Recommendation = {
      ...rec,
      id: `rec-${Date.now()}`,
      isDemo: true,
    };
    setRecommendations(prev => [newRec, ...prev]);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'currentUser');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'destinations');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'guides');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'bookings');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'itineraries');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'recommendations');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'reviews');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'conversations');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'messages');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'verificationRequests');

    setCurrentUser(DEMO_USERS.tourist);
    setDestinations(INITIAL_DESTINATIONS);
    setGuides(INITIAL_GUIDES);
    setBookings(INITIAL_BOOKINGS);
    setItineraries(INITIAL_ITINERARIES);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setReviews(INITIAL_REVIEWS);
    setConversations(INITIAL_CONVERSATIONS);
    setMessages(INITIAL_MESSAGES);
    setVerificationRequests(INITIAL_VERIFICATION_REQUESTS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isDemoMode,
        destinations,
        guides,
        bookings,
        itineraries,
        recommendations,
        reviews,
        conversations,
        messages,
        verificationRequests,
        switchRole,
        loginUser,
        logoutUser,
        addDestination,
        createBooking,
        updateBookingStatus,
        getItineraryByBookingId,
        saveItinerary,
        sendMessage,
        getMessagesByBookingId,
        getConversationByBookingId,
        canUserReviewBooking,
        submitReview,
        getGuideById,
        submitVerificationRequest,
        approveVerification,
        rejectVerification,
        addRecommendation,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
