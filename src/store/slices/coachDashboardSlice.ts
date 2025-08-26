import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

// Types for coach dashboard data
interface CoachStats {
  totalStudents: number;
  activeStudents: number;
  trainingSessions: number;
  sessionsThisMonth: number;
  averageRating: number;
  totalReviews: number;
  certifications: number;
  nextSession: string;
  nextSessionDate: string;
  upcomingSessions: number;
  recentAchievements: string[];
}

interface Session {
  id: number;
  title: string;
  date: string;
  time: string;
  students: number;
  type: string;
  status: string;
  revenue: number;
}

interface StudentProgress {
  id: number;
  name: string;
  level: string;
  lastSession: string;
  progress: number;
  nextGoal: string;
  achievements: string[];
  nextSession: string;
  photo: string | null;
}

interface TrainingPlan {
  id: number;
  name: string;
  duration: string;
  students: number;
  status: string;
  progress: number;
  nextSession: string;
  description: string;
}

interface Credential {
  id: number;
  name: string;
  issuingOrg: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  verificationUrl: string;
}

interface RevenueData {
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  lastYear: number;
  monthlyBreakdown: Array<{ month: string; revenue: number }>;
  sessionTypes: Record<string, number>;
}

interface CoachDashboardState {
  coachStats: CoachStats | null;
  allSessions: Session[];
  studentProgress: StudentProgress[];
  trainingPlans: TrainingPlan[];
  credentials: Credential[];
  revenueData: RevenueData | null;
  loading: boolean;
  error: string | null;
}

const initialState: CoachDashboardState = {
  coachStats: null,
  allSessions: [],
  studentProgress: [],
  trainingPlans: [],
  credentials: [],
  revenueData: null,
  loading: false,
  error: null,
};

// Async thunks for fetching coach dashboard data
export const fetchCoachStats = createAsyncThunk(
  'coachDashboard/fetchCoachStats',
  async (coachId: string, { rejectWithValue }) => {
    try {
      // Fetch coach statistics from multiple endpoints
      const [studentsResponse, sessionsResponse, reviewsResponse, credentialsResponse] = await Promise.all([
        api.get(`/coaches/${coachId}/students`),
        api.get(`/coaches/${coachId}/sessions`),
        api.get(`/coaches/${coachId}/reviews`),
        api.get(`/coaches/${coachId}/credentials`)
      ]);

      // Transform the data into the expected format
      const students = (studentsResponse as any)?.data?.students || [];
      const sessions = (sessionsResponse as any)?.data?.sessions || [];
      const reviews = (reviewsResponse as any)?.data?.reviews || [];
      const credentials = (credentialsResponse as any)?.data?.credentials || [];

      // Calculate coach statistics
      const totalStudents = students.length;
      const activeStudents = students.filter((s: any) => s.status === 'active').length;
      const trainingSessions = sessions.length;
      const sessionsThisMonth = sessions.filter((s: any) => {
        const sessionDate = new Date(s.date);
        const now = new Date();
        return sessionDate.getMonth() === now.getMonth() && 
               sessionDate.getFullYear() === now.getFullYear();
      }).length;

      // Calculate average rating
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length 
        : 0;

      const totalReviews = reviews.length;
      const certifications = credentials.filter((c: any) => c.status === 'active').length;

      // Get next session
      const upcomingSessions = sessions.filter((s: any) => 
        new Date(s.date) > new Date() && s.status === 'scheduled'
      );
      const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0].title : 'No upcoming sessions';
      const nextSessionDate = upcomingSessions.length > 0 ? upcomingSessions[0].date : '';
      const upcomingSessionsCount = upcomingSessions.length;

      // Generate recent achievements based on data
      const recentAchievements = [];
      if (totalStudents >= 20) recentAchievements.push(`${totalStudents}+ Students Milestone`);
      if (trainingSessions >= 100) recentAchievements.push(`${trainingSessions}+ Training Sessions Milestone`);
      if (averageRating >= 4.5) recentAchievements.push('High Rating Achievement');
      if (certifications >= 3) recentAchievements.push('Multiple Certifications');
      if (activeStudents >= 15) recentAchievements.push('Active Student Base');

      return {
        totalStudents,
        activeStudents,
        trainingSessions,
        sessionsThisMonth,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        certifications,
        nextSession,
        nextSessionDate,
        upcomingSessions: upcomingSessionsCount,
        recentAchievements
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch coach stats');
    }
  }
);

export const fetchCoachSessions = createAsyncThunk(
  'coachDashboard/fetchCoachSessions',
  async (coachId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/coaches/${coachId}/sessions`);
      const sessions = (response as any)?.data?.sessions || [];
      
      // Transform sessions into the expected format
      return sessions.map((session: any) => ({
        id: parseInt(session.id) || Math.random(),
        title: session.title,
        date: session.date,
        time: session.time,
        students: session.student_count || 0,
        type: session.session_type || 'Group Session',
        status: session.status,
        revenue: session.revenue || 0
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch coach sessions');
    }
  }
);

export const fetchStudentProgress = createAsyncThunk(
  'coachDashboard/fetchStudentProgress',
  async (coachId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/coaches/${coachId}/students`);
      const students = (response as any)?.data?.students || [];
      
      // Transform students into the expected format
      return students.map((student: any) => ({
        id: parseInt(student.id) || Math.random(),
        name: student.full_name || student.username,
        level: student.skill_level || 'Beginner',
        lastSession: student.last_session_date || 'Never',
        progress: student.progress_percentage || 0,
        nextGoal: student.next_goal || 'Improve Skills',
        achievements: student.achievements || [],
        nextSession: student.next_session_date || 'Not scheduled',
        photo: student.profile_photo
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch student progress');
    }
  }
);

export const fetchTrainingPlans = createAsyncThunk(
  'coachDashboard/fetchTrainingPlans',
  async (coachId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/coaches/${coachId}/training-plans`);
      const plans = (response as any)?.data?.training_plans || [];
      
      // Transform training plans into the expected format
      return plans.map((plan: any) => ({
        id: parseInt(plan.id) || Math.random(),
        name: plan.name,
        duration: plan.duration,
        students: plan.student_count || 0,
        status: plan.status,
        progress: plan.progress_percentage || 0,
        nextSession: plan.next_session || 'Not scheduled',
        description: plan.description
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch training plans');
    }
  }
);

export const fetchCredentials = createAsyncThunk(
  'coachDashboard/fetchCredentials',
  async (coachId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/coaches/${coachId}/credentials`);
      const credentials = (response as any)?.data?.credentials || [];
      
      // Transform credentials into the expected format
      return credentials.map((credential: any) => ({
        id: parseInt(credential.id) || Math.random(),
        name: credential.name,
        issuingOrg: credential.issuing_organization,
        issueDate: credential.issue_date,
        expiryDate: credential.expiry_date,
        status: credential.status,
        verificationUrl: credential.verification_url
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch credentials');
    }
  }
);

export const fetchRevenueData = createAsyncThunk(
  'coachDashboard/fetchRevenueData',
  async (coachId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/coaches/${coachId}/revenue`);
      const revenue = (response as any)?.data || {};
      
      // Transform revenue data into the expected format
      return {
        thisMonth: revenue.this_month || 0,
        lastMonth: revenue.last_month || 0,
        thisYear: revenue.this_year || 0,
        lastYear: revenue.last_year || 0,
        monthlyBreakdown: revenue.monthly_breakdown || [],
        sessionTypes: revenue.session_types || {}
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch revenue data');
    }
  }
);

const coachDashboardSlice = createSlice({
  name: 'coachDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboardData: (state) => {
      state.coachStats = null;
      state.allSessions = [];
      state.studentProgress = [];
      state.trainingPlans = [];
      state.credentials = [];
      state.revenueData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Coach Stats
      .addCase(fetchCoachStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoachStats.fulfilled, (state, action) => {
        state.loading = false;
        state.coachStats = action.payload;
      })
      .addCase(fetchCoachStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch coach stats';
      })
      // Fetch Coach Sessions
      .addCase(fetchCoachSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoachSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.allSessions = action.payload;
      })
      .addCase(fetchCoachSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch coach sessions';
      })
      // Fetch Student Progress
      .addCase(fetchStudentProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.studentProgress = action.payload;
      })
      .addCase(fetchStudentProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch student progress';
      })
      // Fetch Training Plans
      .addCase(fetchTrainingPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainingPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.trainingPlans = action.payload;
      })
      .addCase(fetchTrainingPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch training plans';
      })
      // Fetch Credentials
      .addCase(fetchCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.credentials = action.payload;
      })
      .addCase(fetchCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch credentials';
      })
      // Fetch Revenue Data
      .addCase(fetchRevenueData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueData = action.payload;
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch revenue data';
      });
  },
});

export const { clearError, clearDashboardData } = coachDashboardSlice.actions;
export default coachDashboardSlice.reducer; 