import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

// Interfaces for partner dashboard data
export interface PartnerStats {
  totalCourts: number;
  activeCourts: number;
  totalBookings: number;
  monthlyRevenue: number;
  totalCustomers: number;
  averageRating: number;
  upcomingBookings: number;
  maintenanceRequired: number;
}

export interface Court {
  name: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  lastMaintenance: string;
  nextMaintenance: string;
  hourlyRate: number;
  type: 'Indoor' | 'Outdoor';
}

export interface Booking {
  id: number;
  customerName: string;
  courtName: string;
  date: string;
  time: string;
  duration: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  customerEmail: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  rating: number;
  feedback: string;
}

export interface MaintenanceItem {
  id: number;
  courtName: string;
  type: 'Emergency' | 'Scheduled' | 'Preventive';
  description: string;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Scheduled' | 'Completed' | 'Cancelled';
  technician: string;
  cost: number;
}

export interface FinancialData {
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  lastYear: number;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  revenueSources: Record<string, number>;
}

export interface MicrositeConfig {
  businessName: string;
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
    courts: boolean;
    equipment: boolean;
    training: boolean;
    tournaments: boolean;
  };
  amenities: string[];
}

// Initial state
interface PartnerDashboardState {
  partnerStats: PartnerStats | null;
  allCourts: Court[];
  allBookings: Booking[];
  allCustomers: Customer[];
  maintenanceItems: MaintenanceItem[];
  financialData: FinancialData | null;
  micrositeConfig: MicrositeConfig | null;
  loading: boolean;
  error: string | null;
}

const initialState: PartnerDashboardState = {
  partnerStats: null,
  allCourts: [],
  allBookings: [],
  allCustomers: [],
  maintenanceItems: [],
  financialData: null,
  micrositeConfig: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPartnerStats = createAsyncThunk(
  'partnerDashboard/fetchPartnerStats',
  async (partnerId: number) => {
    const response = await api.get(`/partners/${partnerId}/stats`);
    return (response as any).data.data;
  }
);

export const fetchPartnerCourts = createAsyncThunk(
  'partnerDashboard/fetchPartnerCourts',
  async (partnerId: number) => {
    const response = await api.get(`/partners/${partnerId}/courts`);
    return (response as any).data.data.courts;
  }
);

export const fetchPartnerBookings = createAsyncThunk(
  'partnerDashboard/fetchPartnerBookings',
  async (partnerId: number) => {
    const response = await api.get(`/partners/${partnerId}/bookings`);
    return (response as any).data.data.bookings;
  }
);

export const fetchPartnerCustomers = createAsyncThunk(
  'partnerDashboard/fetchPartnerCustomers',
  async (partnerId: number) => {
    const response = await api.get(`/partners/${partnerId}/customers`);
    return (response as any).data.data.customers;
  }
);

export const fetchPartnerMaintenance = createAsyncThunk(
  'partnerDashboard/fetchPartnerMaintenance',
  async (partnerId: number) => {
    const response = await api.get(`/partners/${partnerId}/maintenance`);
    return (response as any).data.data.maintenance;
  }
);

export const fetchPartnerFinancialData = createAsyncThunk(
  'partnerDashboard/fetchPartnerFinancialData',
  async (partnerId: number) => {
    const response = await api.get(`/partners/${partnerId}/financial`);
    return (response as any).data.data;
  }
);

export const fetchPartnerMicrosite = createAsyncThunk(
  'partnerDashboard/fetchPartnerMicrosite',
  async (partnerId: number) => {
    const response = await api.get(`/partners/${partnerId}/microsite`);
    return (response as any).data.data;
  }
);

// Slice
const partnerDashboardSlice = createSlice({
  name: 'partnerDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Partner Stats
      .addCase(fetchPartnerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.partnerStats = action.payload;
      })
      .addCase(fetchPartnerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch partner stats';
      })
      
      // Fetch Partner Courts
      .addCase(fetchPartnerCourts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerCourts.fulfilled, (state, action) => {
        state.loading = false;
        state.allCourts = action.payload;
      })
      .addCase(fetchPartnerCourts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch partner courts';
      })
      
      // Fetch Partner Bookings
      .addCase(fetchPartnerBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload;
      })
      .addCase(fetchPartnerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch partner bookings';
      })
      
      // Fetch Partner Customers
      .addCase(fetchPartnerCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.allCustomers = action.payload;
      })
      .addCase(fetchPartnerCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch partner customers';
      })
      
      // Fetch Partner Maintenance
      .addCase(fetchPartnerMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenanceItems = action.payload;
      })
      .addCase(fetchPartnerMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch partner maintenance';
      })
      
      // Fetch Partner Financial Data
      .addCase(fetchPartnerFinancialData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerFinancialData.fulfilled, (state, action) => {
        state.loading = false;
        state.financialData = action.payload;
      })
      .addCase(fetchPartnerFinancialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch partner financial data';
      })
      
      // Fetch Partner Microsite
      .addCase(fetchPartnerMicrosite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerMicrosite.fulfilled, (state, action) => {
        state.loading = false;
        state.micrositeConfig = action.payload;
      })
      .addCase(fetchPartnerMicrosite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch partner microsite';
      });
  },
});

export const { clearError } = partnerDashboardSlice.actions;
export default partnerDashboardSlice.reducer; 