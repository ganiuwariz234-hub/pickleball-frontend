import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

// Interfaces for state dashboard data
export interface StateStats {
  totalMembers: number;
  activeMembers: number;
  totalClubs: number;
  totalCourts: number;
  totalTournaments: number;
  monthlyRevenue: number;
  pendingApplications: number;
  upcomingEvents: number;
}

export interface StateTournament {
  id: number;
  name: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  entryFee: number;
  status: string;
  category: string;
  revenue: number;
}

export interface StateClubAffiliation {
  id: number;
  name: string;
  city: string;
  members: number;
  status: string;
  complianceScore: number;
  lastInspection: string;
  nextInspection: string;
  issues: number;
}

export interface StateMemberVerification {
  id: number;
  name: string;
  type: string;
  club: string;
  submitted: string;
  status: string;
  documents: string[];
  verifiedBy: string | null;
  verifiedDate: string | null;
}

export interface StateRecentMember {
  id: number;
  name: string;
  type: string;
  club: string;
  joinDate: string;
  status: string;
  photo: string | null;
}

export interface StateAnnouncement {
  id: number;
  title: string;
  date: string;
  priority: string;
  category: string;
}

export interface StateAnalyticsData {
  memberGrowth: number;
  revenueGrowth: number;
  tournamentParticipation: number;
  clubCompliance: number;
  monthlyTrends: number[];
}

export interface StatePerformanceData {
  memberGrowth: {
    thisYear: number;
    lastYear: number;
    growth: number;
  };
  revenueGrowth: {
    thisYear: number;
    lastYear: number;
    growth: number;
  };
  tournamentGrowth: {
    thisYear: number;
    lastYear: number;
    growth: number;
  };
  monthlyTrends: Array<{
    month: string;
    members: number;
    revenue: number;
  }>;
}

export interface StateCommunicationsData {
  totalAnnouncements: number;
  scheduledMessages: number;
  memberEngagement: number;
  responseRate: number;
  recentMessages: Array<{
    id: number;
    type: string;
    title: string;
    sentDate: string;
    recipients: number;
    opened: number;
    clicked: number;
  }>;
}

export interface StateMicrositeConfig {
  stateName: string;
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
    tournaments: boolean;
    training: boolean;
    rankings: boolean;
    news: boolean;
  };
}

// Initial state
interface StateDashboardState {
  stateStats: StateStats | null;
  tournaments: StateTournament[];
  clubAffiliations: StateClubAffiliation[];
  memberVerifications: StateMemberVerification[];
  recentMembers: StateRecentMember[];
  recentAnnouncements: StateAnnouncement[];
  analyticsData: StateAnalyticsData | null;
  performanceData: StatePerformanceData | null;
  communicationsData: StateCommunicationsData | null;
  micrositeConfig: StateMicrositeConfig | null;
  loading: boolean;
  error: string | null;
}

const initialState: StateDashboardState = {
  stateStats: null,
  tournaments: [],
  clubAffiliations: [],
  memberVerifications: [],
  recentMembers: [],
  recentAnnouncements: [],
  analyticsData: null,
  performanceData: null,
  communicationsData: null,
  micrositeConfig: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchStateStats = createAsyncThunk(
  'stateDashboard/fetchStateStats',
  async (stateId: string) => {
    const response = await api.get(`/states/${stateId}/stats`);
    return (response as any).data.data;
  }
);

export const fetchStateTournaments = createAsyncThunk(
  'stateDashboard/fetchStateTournaments',
  async (stateId: string) => {
    const response = await api.get(`/states/${stateId}/tournaments`);
    return (response as any).data.data.tournaments;
  }
);

export const fetchStateClubAffiliations = createAsyncThunk(
  'stateDashboard/fetchStateClubAffiliations',
  async (stateId: string) => {
    const response = await api.get(`/states/${stateId}/clubs`);
    return (response as any).data.data.clubs;
  }
);

export const fetchStateMemberVerifications = createAsyncThunk(
  'stateDashboard/fetchStateMemberVerifications',
  async (stateId: string) => {
    const response = await api.get(`/states/${stateId}/verifications`);
    return (response as any).data.data.verifications;
  }
);

export const fetchStateRecentMembers = createAsyncThunk(
  'stateDashboard/fetchStateRecentMembers',
  async (stateId: string) => {
    const response = await api.get(`/states/${stateId}/members/recent`);
    return (response as any).data.data.members;
  }
);

export const fetchStateAnnouncements = createAsyncThunk(
  'stateDashboard/fetchStateAnnouncements',
  async (stateId: string) => {
    const response = await api.get(`/states/${stateId}/announcements`);
    return (response as any).data.data.announcements;
  }
);

export const fetchStateAnalytics = createAsyncThunk(
  'stateDashboard/fetchStateAnalytics',
  async (stateId: string) => {
    const response = await api.get(`/states/${stateId}/analytics`);
    return (response as any).data.data;
  }
);

export const fetchStateMicrosite = createAsyncThunk(
  'stateDashboard/fetchStateMicrosite',
  async (stateId: string) => {
    const response = await api.get(`/states/${stateId}/microsite`);
    return (response as any).data.data;
  }
);

// Slice
const stateDashboardSlice = createSlice({
  name: 'stateDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStateStats: (state, action) => {
      state.stateStats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch State Stats
      .addCase(fetchStateStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stateStats = action.payload;
      })
      .addCase(fetchStateStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch state stats';
      })
      
      // Fetch State Tournaments
      .addCase(fetchStateTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload;
      })
      .addCase(fetchStateTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch state tournaments';
      })
      
      // Fetch State Club Affiliations
      .addCase(fetchStateClubAffiliations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateClubAffiliations.fulfilled, (state, action) => {
        state.loading = false;
        state.clubAffiliations = action.payload;
      })
      .addCase(fetchStateClubAffiliations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch state club affiliations';
      })
      
      // Fetch State Member Verifications
      .addCase(fetchStateMemberVerifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateMemberVerifications.fulfilled, (state, action) => {
        state.loading = false;
        state.memberVerifications = action.payload;
      })
      .addCase(fetchStateMemberVerifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch state member verifications';
      })
      
      // Fetch State Recent Members
      .addCase(fetchStateRecentMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateRecentMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.recentMembers = action.payload;
      })
      .addCase(fetchStateRecentMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch state recent members';
      })
      
      // Fetch State Announcements
      .addCase(fetchStateAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.recentAnnouncements = action.payload;
      })
      .addCase(fetchStateAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch state announcements';
      })
      
      // Fetch State Analytics
      .addCase(fetchStateAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload.analytics;
        state.performanceData = action.payload.performance;
        state.communicationsData = action.payload.communications;
      })
      .addCase(fetchStateAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch state analytics';
      })
      
      // Fetch State Microsite
      .addCase(fetchStateMicrosite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateMicrosite.fulfilled, (state, action) => {
        state.loading = false;
        state.micrositeConfig = action.payload;
      })
      .addCase(fetchStateMicrosite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch state microsite';
      });
  },
});

export const { clearError, updateStateStats } = stateDashboardSlice.actions;
export default stateDashboardSlice.reducer; 