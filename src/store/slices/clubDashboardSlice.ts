import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

// Interfaces for club dashboard data
export interface ClubStats {
  totalMembers: number;
  activeMembers: number;
  totalCourts: number;
  availableCourts: number;
  upcomingEvents: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  recentActivities: string[];
}

export interface ClubMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'Basic' | 'Premium' | 'VIP';
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
  lastVisit: string;
  totalVisits: number;
  photo: string | null;
  membershipExpiry: string;
  emergencyContact: string;
  notes: string;
}

export interface Tournament {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: number;
  maxParticipants: number;
  entryFee: number;
  totalRevenue: number;
  expenses: number;
  profit: number;
  status: string;
  description: string;
  location: string;
  tournamentType: 'singles' | 'doubles' | 'mixed';
  skillLevel: string;
  prizes: string;
  rules: string;
}

export interface CourtBooking {
  status: 'available' | 'booked' | 'maintenance' | 'reserved';
  price: number;
  player?: string;
  startTime: string;
  endTime: string;
  bookingId?: string;
}

export interface CourtBookings {
  [courtName: string]: {
    [timeSlot: string]: CourtBooking;
  };
}

export interface Invoice {
  id: string;
  member: string;
  type: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidDate: string | null;
}

export interface MicrositeConfig {
  clubName: string;
  description: string;
  logo: string;
  bannerImage: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    website: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  features: {
    courts: number;
    training: boolean;
    tournaments: boolean;
    equipment: boolean;
    proShop: boolean;
  };
}

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  participants: number;
  type: 'Tournament' | 'Training' | 'Event';
  status: string;
}

export interface CourtStatus {
  id: number;
  name: string;
  status: string;
  currentTime: string;
  nextBooking: string;
}

// Initial state
interface ClubDashboardState {
  clubStats: ClubStats | null;
  members: ClubMember[];
  tournaments: Tournament[];
  courtBookings: CourtBookings | null;
  invoices: Invoice[];
  micrositeConfig: MicrositeConfig | null;
  upcomingEvents: UpcomingEvent[];
  courtStatus: CourtStatus[];
  timeSlots: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ClubDashboardState = {
  clubStats: null,
  members: [],
  tournaments: [],
  courtBookings: null,
  invoices: [],
  micrositeConfig: null,
  upcomingEvents: [],
  courtStatus: [],
  timeSlots: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchClubStats = createAsyncThunk(
  'clubDashboard/fetchClubStats',
  async (clubId: number) => {
    const response = await api.get(`/clubs/${clubId}/stats`);
    return (response as any).data.data;
  }
);

export const fetchClubMembers = createAsyncThunk(
  'clubDashboard/fetchClubMembers',
  async (clubId: number) => {
    const response = await api.get(`/clubs/${clubId}/members`);
    return (response as any).data.data.members;
  }
);

export const fetchClubTournaments = createAsyncThunk(
  'clubDashboard/fetchClubTournaments',
  async (clubId: number) => {
    const response = await api.get(`/clubs/${clubId}/tournaments`);
    return (response as any).data.data.tournaments;
  }
);

export const fetchCourtBookings = createAsyncThunk(
  'clubDashboard/fetchCourtBookings',
  async ({ clubId, date }: { clubId: number; date: string }) => {
    const response = await api.get(`/clubs/${clubId}/courts/bookings?date=${date}`);
    return (response as any).data.data;
  }
);

export const fetchClubInvoices = createAsyncThunk(
  'clubDashboard/fetchClubInvoices',
  async (clubId: number) => {
    const response = await api.get(`/clubs/${clubId}/invoices`);
    return (response as any).data.data.invoices;
  }
);

export const fetchMicrositeConfig = createAsyncThunk(
  'clubDashboard/fetchMicrositeConfig',
  async (clubId: number) => {
    const response = await api.get(`/clubs/${clubId}/microsite`);
    return (response as any).data.data;
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  'clubDashboard/fetchUpcomingEvents',
  async (clubId: number) => {
    const response = await api.get(`/clubs/${clubId}/events/upcoming`);
    return (response as any).data.data.events;
  }
);

export const fetchCourtStatus = createAsyncThunk(
  'clubDashboard/fetchCourtStatus',
  async (clubId: number) => {
    const response = await api.get(`/clubs/${clubId}/courts/status`);
    return (response as any).data.data.courts;
  }
);

export const fetchTimeSlots = createAsyncThunk(
  'clubDashboard/fetchTimeSlots',
  async (clubId: number) => {
    const response = await api.get(`/clubs/${clubId}/courts/time-slots`);
    return (response as any).data.data.timeSlots;
  }
);

// Slice
const clubDashboardSlice = createSlice({
  name: 'clubDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedDate: (state, action) => {
      // This will be handled by the component state
    },
    setSelectedCourt: (state, action) => {
      // This will be handled by the component state
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Club Stats
      .addCase(fetchClubStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubStats.fulfilled, (state, action) => {
        state.loading = false;
        state.clubStats = action.payload;
      })
      .addCase(fetchClubStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch club stats';
      })
      
      // Fetch Club Members
      .addCase(fetchClubMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchClubMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch club members';
      })
      
      // Fetch Club Tournaments
      .addCase(fetchClubTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload;
      })
      .addCase(fetchClubTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch club tournaments';
      })
      
      // Fetch Court Bookings
      .addCase(fetchCourtBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourtBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.courtBookings = action.payload;
      })
      .addCase(fetchCourtBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch court bookings';
      })
      
      // Fetch Club Invoices
      .addCase(fetchClubInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchClubInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch club invoices';
      })
      
      // Fetch Microsite Config
      .addCase(fetchMicrositeConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMicrositeConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.micrositeConfig = action.payload;
      })
      .addCase(fetchMicrositeConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch microsite config';
      })
      
      // Fetch Upcoming Events
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch upcoming events';
      })
      
      // Fetch Court Status
      .addCase(fetchCourtStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourtStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.courtStatus = action.payload;
      })
      .addCase(fetchCourtStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch court status';
      })
      
      // Fetch Time Slots
      .addCase(fetchTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSlots = action.payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch time slots';
      });
  },
});

export const { clearError, setSelectedDate, setSelectedCourt } = clubDashboardSlice.actions;
export default clubDashboardSlice.reducer; 