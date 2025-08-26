import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

// Types for player dashboard data
interface PlayerStats {
  tournamentsPlayed: number;
  tournamentsWon: number;
  currentRanking: number;
  rankingChange: string;
  totalPoints: number;
  matchesPlayed: number;
  winRate: number;
  nextTournament: string;
  nextTournamentDate: string;
  upcomingMatches: number;
  recentAchievements: string[];
}

interface Match {
  id: string;
  opponent: string;
  date: string;
  result: string;
  score: string;
  tournament: string;
  points: string;
}

interface Activity {
  type: 'tournament' | 'match' | 'ranking';
  title: string;
  date: string;
  result: string;
  points: string;
}

interface TournamentResult {
  id: string;
  name: string;
  date: string;
  result: string;
  points: number;
  category: string;
  division: string;
}

interface PlayerDashboardState {
  playerStats: PlayerStats | null;
  matchHistory: Match[];
  recentActivity: Activity[];
  tournamentResults: TournamentResult[];
  upcomingTournaments: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PlayerDashboardState = {
  playerStats: null,
  matchHistory: [],
  recentActivity: [],
  tournamentResults: [],
  upcomingTournaments: [],
  loading: false,
  error: null,
};

// Async thunks for fetching player dashboard data
export const fetchPlayerStats = createAsyncThunk(
  'playerDashboard/fetchPlayerStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Fetch player statistics from multiple endpoints
      const [rankingsResponse, tournamentsResponse, matchesResponse] = await Promise.all([
        api.get(`/rankings/user/${userId}`),
        api.get(`/tournaments/user/${userId}/results`),
        api.get(`/matches/user/${userId}`)
      ]);

      // Transform the data into the expected format
      const rankings = (rankingsResponse as any)?.data?.rankings || [];
      const tournaments = (tournamentsResponse as any)?.data?.tournaments || [];
      const matches = (matchesResponse as any)?.data?.matches || [];

      // Calculate player statistics
      const tournamentsPlayed = tournaments.length;
      const tournamentsWon = tournaments.filter((t: any) => t.result === 'winner').length;
      const currentRanking = rankings.length > 0 ? rankings[0].position : 0;
      const rankingChange = rankings.length > 0 ? rankings[0].change || '+0' : '+0';
      const totalPoints = rankings.reduce((sum: number, r: any) => sum + (r.points || 0), 0);
      const matchesPlayed = matches.length;
      const wins = matches.filter((m: any) => m.result === 'won').length;
      const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;

      // Get next tournament
      const upcomingTournaments = tournaments.filter((t: any) => 
        new Date(t.start_date) > new Date() && t.status === 'registration_open'
      );
      const nextTournament = upcomingTournaments.length > 0 ? upcomingTournaments[0].name : 'No upcoming tournaments';
      const nextTournamentDate = upcomingTournaments.length > 0 ? upcomingTournaments[0].start_date : '';
      const upcomingMatches = upcomingTournaments.length;

      // Generate recent achievements based on data
      const recentAchievements = [];
      if (tournamentsWon > 0) recentAchievements.push(`Tournament Winner - ${tournamentsWon} championships`);
      if (currentRanking <= 50) recentAchievements.push('Ranking Improvement - Top 50');
      if (winRate >= 80) recentAchievements.push('High Performance - 80%+ Win Rate');

      return {
        tournamentsPlayed,
        tournamentsWon,
        currentRanking,
        rankingChange,
        totalPoints,
        matchesPlayed,
        winRate,
        nextTournament,
        nextTournamentDate,
        upcomingMatches,
        recentAchievements
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch player stats');
    }
  }
);

export const fetchMatchHistory = createAsyncThunk(
  'playerDashboard/fetchMatchHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/matches/user/${userId}`);
      const matches = (response as any)?.data?.matches || [];
      
      // Transform matches into the expected format
      return matches.map((match: any) => ({
        id: match.id,
        opponent: match.opponent_name || 'Unknown Opponent',
        date: match.match_date,
        result: match.result === 'won' ? 'Won' : 'Lost',
        score: match.score || 'N/A',
        tournament: match.tournament_name || 'Practice Match',
        points: match.points > 0 ? `+${match.points}` : `${match.points}`
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch match history');
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'playerDashboard/fetchRecentActivity',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Fetch recent activity from multiple sources
      const [matchesResponse, tournamentsResponse, rankingsResponse] = await Promise.all([
        api.get(`/matches/user/${userId}?limit=5`),
        api.get(`/tournaments/user/${userId}/results?limit=5`),
        api.get(`/rankings/user/${userId}?limit=5`)
      ]);

      const matches = (matchesResponse as any)?.data?.matches || [];
      const tournaments = (tournamentsResponse as any)?.data?.tournaments || [];
      const rankings = (rankingsResponse as any)?.data?.rankings || [];

      // Combine and sort all activities by date
      const activities: Activity[] = [];

      // Add match activities
      matches.forEach((match: any) => {
        activities.push({
          type: 'match',
          title: `Match vs. ${match.opponent_name}`,
          date: match.match_date,
          result: match.result === 'won' ? 'Won' : 'Lost',
          points: match.points > 0 ? `+${match.points}` : `${match.points}`
        });
      });

      // Add tournament activities
      tournaments.forEach((tournament: any) => {
        activities.push({
          type: 'tournament',
          title: tournament.name,
          date: tournament.end_date,
          result: tournament.result,
          points: `+${tournament.points || 0}`
        });
      });

      // Add ranking activities
      rankings.forEach((ranking: any) => {
        if (ranking.change && ranking.change !== '+0') {
          activities.push({
            type: 'ranking',
            title: 'Ranking Update',
            date: ranking.updated_at,
            result: `Moved to #${ranking.position}`,
            points: ranking.change
          });
        }
      });

      // Sort by date (most recent first) and return top 10
      return activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch recent activity');
    }
  }
);

export const fetchTournamentResults = createAsyncThunk(
  'playerDashboard/fetchTournamentResults',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tournaments/user/${userId}/results`);
      const tournaments = (response as any)?.data?.tournaments || [];
      
      // Transform tournament results into the expected format
      return tournaments.map((tournament: any) => ({
        id: tournament.id,
        name: tournament.name,
        date: tournament.end_date,
        result: tournament.result,
        points: tournament.points || 0,
        category: tournament.category,
        division: tournament.division
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch tournament results');
    }
  }
);

export const fetchUpcomingTournaments = createAsyncThunk(
  'playerDashboard/fetchUpcomingTournaments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tournaments/upcoming?limit=5');
      return (response as any)?.data?.tournaments || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch upcoming tournaments');
    }
  }
);

const playerDashboardSlice = createSlice({
  name: 'playerDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboardData: (state) => {
      state.playerStats = null;
      state.matchHistory = [];
      state.recentActivity = [];
      state.tournamentResults = [];
      state.upcomingTournaments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Player Stats
      .addCase(fetchPlayerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.playerStats = action.payload;
      })
      .addCase(fetchPlayerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch player stats';
      })
      // Fetch Match History
      .addCase(fetchMatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.matchHistory = action.payload;
      })
      .addCase(fetchMatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch match history';
      })
      // Fetch Recent Activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch recent activity';
      })
      // Fetch Tournament Results
      .addCase(fetchTournamentResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTournamentResults.fulfilled, (state, action) => {
        state.loading = false;
        state.tournamentResults = action.payload;
      })
      .addCase(fetchTournamentResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch tournament results';
      })
      // Fetch Upcoming Tournaments
      .addCase(fetchUpcomingTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingTournaments = action.payload;
      })
      .addCase(fetchUpcomingTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch upcoming tournaments';
      });
  },
});

export const { clearError, clearDashboardData } = playerDashboardSlice.actions;
export default playerDashboardSlice.reducer; 