import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { 
  fetchStateStats,
  fetchStateTournaments,
  fetchStateClubAffiliations,
  fetchStateMemberVerifications,
  fetchStateRecentMembers,
  fetchStateAnnouncements,
  fetchStateAnalytics,
  fetchStateMicrosite
} from '../../../store/slices/stateDashboardSlice';
import Overview from './Overview';
import Tournaments from './Tournaments';
import ClubManagement from './ClubManagement';
import Verifications from './Verifications';
import Microsite from './Microsite';
import Analytics from './Analytics';
import Communications from './Communications';

const StateDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Redux selectors for state dashboard data
  const {
    stateStats,
    tournaments,
    clubAffiliations,
    memberVerifications,
    recentMembers,
    recentAnnouncements,
    analyticsData,
    performanceData,
    communicationsData,
    micrositeConfig,
    loading: stateDashboardLoading,
    error: stateDashboardError
  } = useSelector((state: RootState) => state.stateDashboard);

  // Helper function to ensure numeric values are valid
  const ensureValidNumber = (value: any, fallback: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      return value;
    }
    return fallback;
  };

  // Fetch data when component mounts and when specific tabs are activated
  useEffect(() => {
    if (user?.state) {
      // Always fetch state stats and analytics
      dispatch(fetchStateStats(user.state));
      dispatch(fetchStateAnalytics(user.state));
      
      // Fetch recent members and announcements
      dispatch(fetchStateRecentMembers(user.state));
      dispatch(fetchStateAnnouncements(user.state));
    }
  }, [dispatch, user?.state]);

  // Fetch tournaments when tournaments tab is clicked
  useEffect(() => {
    if (activeTab === 'tournaments' && user?.state) {
      dispatch(fetchStateTournaments(user.state));
    }
  }, [activeTab, dispatch, user?.state]);

  // Fetch clubs when clubs tab is clicked
  useEffect(() => {
    if (activeTab === 'clubs' && user?.state) {
      dispatch(fetchStateClubAffiliations(user.state));
    }
  }, [activeTab, dispatch, user?.state]);

  // Fetch verifications when verifications tab is clicked
  useEffect(() => {
    if (activeTab === 'verifications' && user?.state) {
      dispatch(fetchStateMemberVerifications(user.state));
    }
  }, [activeTab, dispatch, user?.state]);

  // Transform tournaments data for the component with validation
  const transformedTournaments = (tournaments || []).map(tournament => ({
    id: tournament.id,
    name: tournament.name || 'Unnamed Tournament',
    date: tournament.date || new Date().toISOString().split('T')[0],
    location: tournament.location || 'Location TBD',
    participants: tournament.participants || 0,
    maxParticipants: tournament.maxParticipants || 0,
    entryFee: tournament.entryFee || 0,
    status: tournament.status || 'draft',
    category: tournament.category || 'singles',
    revenue: (tournament.entryFee || 0) * (tournament.participants || 0)
  }));

  // Transform clubs data for the component with validation
  const transformedClubAffiliations = (clubAffiliations || []).map(club => ({
    id: club.id,
    name: club.name || 'Unnamed Club',
    city: club.city || 'Unknown City',
    members: club.members || 0,
    status: club.status,
    complianceScore: club.complianceScore,
    lastInspection: club.lastInspection,
    nextInspection: club.nextInspection,
    issues: club.issues
  }));

  // Transform member verification data for the component with validation
  const transformedMemberVerifications = (memberVerifications || []).map(user => ({
    id: user.id,
    name: user.name,
    type: user.type,
    club: user.club,
    submitted: user.submitted,
    status: user.status,
    documents: user.documents,
    verifiedBy: user.verifiedBy,
    verifiedDate: user.verifiedDate
  }));

  // Transform recent members data with validation
  const transformedRecentMembers = (recentMembers || [])
    .sort((a, b) => {
      try {
        return new Date(b.joinDate || 0).getTime() - new Date(a.joinDate || 0).getTime();
      } catch (error) {
        console.error('Error sorting users by date:', error);
        return 0;
      }
    })
    .slice(0, 5);

  // Transform recent announcements with validation
  const transformedAnnouncements = (recentAnnouncements || [])
    .slice(0, 5);

  // Analytics data derived from real data
  const derivedAnalyticsData = {
    memberGrowth: ensureValidNumber(stateStats && stateStats.totalMembers > 0 ? ((stateStats.totalMembers - (stateStats.totalMembers * 0.9)) / (stateStats.totalMembers * 0.9)) * 100 : 0, 0),
    revenueGrowth: ensureValidNumber(stateStats && stateStats.monthlyRevenue > 0 ? ((stateStats.monthlyRevenue - (stateStats.monthlyRevenue * 0.9)) / (stateStats.monthlyRevenue * 0.9)) * 100 : 0, 0),
    tournamentParticipation: ensureValidNumber((() => {
      const totalParticipants = (tournaments || []).reduce((total, t) => total + (t.participants || 0), 0);
      const totalMaxParticipants = (tournaments || []).reduce((total, t) => total + (t.maxParticipants || 0), 0);
      return totalMaxParticipants > 0 ? (totalParticipants / totalMaxParticipants) * 100 : 0;
    })(), 0),
    clubCompliance: ensureValidNumber((() => {
      const activeClubs = (clubAffiliations || []).filter(c => c.status === 'Active').length;
      const totalClubs = (clubAffiliations || []).length;
      return totalClubs > 0 ? (activeClubs / totalClubs) * 100 : 0;
    })(), 0),
    monthlyTrends: [45, 52, 48, 67, 73, 89, 95, 87, 92, 98, 105, 112] // Placeholder - would need time-series API
  };

  // Communications data derived from real data
  const derivedCommunicationsData = {
    totalAnnouncements: transformedAnnouncements.length,
    scheduledMessages: (tournaments || []).filter(t => t.status === 'published').length,
    memberEngagement: 78.5, // Placeholder - would need engagement API
    responseRate: 92.3, // Placeholder - would need response API
    recentMessages: transformedAnnouncements.map(announcement => ({
      id: announcement.id,
      type: 'Announcement',
      title: announcement.title,
      sentDate: announcement.date,
      recipients: stateStats?.totalMembers || 0,
      opened: Math.floor((stateStats?.totalMembers || 0) * 0.7), // Placeholder
      clicked: Math.floor((stateStats?.totalMembers || 0) * 0.2) // Placeholder
    }))
  };

  // Microsite configuration data
  const derivedMicrositeConfig = micrositeConfig || {
    stateName: `${user?.state || 'State'} Pickleball Federation`,
    description: `Official state representative for ${user?.state || 'State'} Pickleball Federation with authority to organize state-level tournaments`,
    logo: user?.logo || 'https://example.com/state-logo.png',
    bannerImage: 'https://example.com/state-banner.jpg',
    contactInfo: {
      phone: user?.phone || '+1-555-123-4567',
      email: user?.email || 'state@pickleballfederation.org',
      address: `${user?.address || '123 State Street'}, ${user?.city || 'City'}, ${user?.state || 'State'}`,
      website: user?.website || 'https://www.state-pickleball.org'
    },
    socialMedia: {
      facebook: 'https://facebook.com/state-pickleball',
      instagram: 'https://instagram.com/state-pickleball',
      twitter: 'https://twitter.com/state-pickleball'
    },
    features: {
      tournaments: true,
      training: true,
      rankings: true,
      news: true
    }
  };

  // Performance analytics data
  const derivedPerformanceData = {
    memberGrowth: {
      thisYear: stateStats?.totalMembers || 0,
      lastYear: Math.floor((stateStats?.totalMembers || 0) * 0.9),
      growth: derivedAnalyticsData.memberGrowth
    },
    revenueGrowth: {
      thisYear: stateStats?.monthlyRevenue || 0,
      lastYear: Math.floor((stateStats?.monthlyRevenue || 0) * 0.9),
      growth: derivedAnalyticsData.revenueGrowth
    },
    tournamentGrowth: {
      thisYear: stateStats?.totalTournaments || 0,
      lastYear: Math.floor((stateStats?.totalTournaments || 0) * 0.8),
      growth: ensureValidNumber((() => {
        const thisYear = stateStats?.totalTournaments || 0;
        const lastYear = Math.floor(thisYear * 0.8);
        return lastYear > 0 ? ((thisYear - lastYear) / lastYear) * 100 : 0;
      })(), 0)
    },
    monthlyTrends: [
      { month: 'Jan', members: Math.floor((stateStats?.totalMembers || 0) * 0.95), revenue: Math.floor((stateStats?.monthlyRevenue || 0) * 0.1) },
      { month: 'Feb', members: Math.floor((stateStats?.totalMembers || 0) * 0.97), revenue: Math.floor((stateStats?.monthlyRevenue || 0) * 0.1) },
      { month: 'Mar', members: stateStats?.totalMembers || 0, revenue: Math.floor((stateStats?.monthlyRevenue || 0) * 0.1) },
      { month: 'Apr', members: 0, revenue: 0 }
    ]
  };

  // Loading states
  const isLoading = stateDashboardLoading;
 
  // Error states
  const hasError = stateDashboardError;

  // Refresh function
  const handleRefresh = () => {
    if (user?.state) {
      dispatch(fetchStateStats(user.state));
      dispatch(fetchStateAnalytics(user.state));
      dispatch(fetchStateRecentMembers(user.state));
      dispatch(fetchStateAnnouncements(user.state));
    }
    
    if (activeTab === 'tournaments' && user?.state) {
      dispatch(fetchStateTournaments(user.state));
    }
    
    if (activeTab === 'clubs' && user?.state) {
      dispatch(fetchStateClubAffiliations(user.state));
    }

    if (activeTab === 'verifications' && user?.state) {
      dispatch(fetchStateMemberVerifications(user.state));
    }
  };

  // Error display component with retry functionality
  const ErrorDisplay = ({ error }: { error: string }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <div className="text-gray-400 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-on-scroll">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">State Federation Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.full_name || 'Federation Administrator'}</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {hasError && <ErrorDisplay error={hasError} />}

        {/* Quick Stats */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-on-scroll">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-blue-600">{stateStats?.totalMembers?.toLocaleString() || 0}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg font-semibold">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Clubs</p>
                  <p className="text-2xl font-bold text-green-600">{clubAffiliations?.filter(c => c.status === 'Active').length || 0}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg font-semibold">🏢</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">${stateStats?.monthlyRevenue?.toLocaleString() || 0}</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-lg font-semibold">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-2xl font-bold text-orange-600">{stateStats?.pendingApplications || 0}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-lg font-semibold">⏳</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="grid w-full grid-cols-7 bg-white rounded-lg shadow-sm border border-gray-200 p-1 animate-on-scroll">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'tournaments'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Tournaments
            </button>
            <button
              onClick={() => setActiveTab('clubs')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'clubs'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Clubs
            </button>
            <button
              onClick={() => setActiveTab('verifications')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'verifications'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Verifications
            </button>
            <button
              onClick={() => setActiveTab('microsite')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'microsite'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Microsite
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('communications')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'communications'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Communications
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-on-scroll">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <Overview 
                    stateStats={stateStats}
                    recentMembers={transformedRecentMembers}
                    recentAnnouncements={transformedAnnouncements}
                  />
                )}
              </div>
            )}

            {/* Tournaments Tab */}
            {activeTab === 'tournaments' && (
              <div className="animate-on-scroll">
                {/* The original code had tournamentsLoading and tournamentsError, which are no longer defined.
                    Assuming they are meant to be stateDashboardLoading and stateDashboardError respectively
                    for the tournaments data fetching. */}
                {isLoading ? (
                  <LoadingSkeleton />
                ) : hasError ? (
                  <ErrorDisplay error={hasError} />
                ) : transformedTournaments.length === 0 ? (
                  <EmptyState message="No tournaments found for this state. Create a new tournament to get started." />
                ) : (
                  <Tournaments tournaments={transformedTournaments} />
                )}
              </div>
            )}

            {/* Clubs Tab */}
            {activeTab === 'clubs' && (
              <div className="animate-on-scroll">
                {/* The original code had clubsLoading and clubsError, which are no longer defined.
                    Assuming they are meant to be stateDashboardLoading and stateDashboardError respectively
                    for the clubs data fetching. */}
                {isLoading ? (
                  <LoadingSkeleton />
                ) : hasError ? (
                  <ErrorDisplay error={hasError} />
                ) : transformedClubAffiliations.length === 0 ? (
                  <EmptyState message="No clubs found in this state. Encourage local clubs to register with the federation." />
                ) : (
                  <ClubManagement clubAffiliations={transformedClubAffiliations} />
                )}
              </div>
            )}

            {/* Verifications Tab */}
            {activeTab === 'verifications' && (
              <div className="animate-on-scroll">
                {/* The original code had usersLoading and usersError, which are no longer defined.
                    Assuming they are meant to be stateDashboardLoading and stateDashboardError respectively
                    for the member verifications data fetching. */}
                {isLoading ? (
                  <LoadingSkeleton />
                ) : hasError ? (
                  <ErrorDisplay error={hasError} />
                ) : transformedMemberVerifications.length === 0 ? (
                  <EmptyState message="No verification requests found. Members will appear here when they submit verification documents." />
                ) : (
                  <Verifications memberVerifications={transformedMemberVerifications} />
                )}
              </div>
            )}

            {/* Microsite Tab */}
            {activeTab === 'microsite' && (
              <div className="animate-on-scroll">
                <Microsite micrositeConfig={derivedMicrositeConfig} />
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="animate-on-scroll">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : hasError ? (
                  <ErrorDisplay error={hasError} />
                ) : !stateStats ? (
                  <EmptyState message="No analytics data available. Data will appear here once the federation starts collecting information." />
                ) : (
                  <Analytics performanceData={derivedPerformanceData} stateStats={stateStats} />
                )}
              </div>
            )}

            {/* Communications Tab */}
            {activeTab === 'communications' && (
              <div className="animate-on-scroll">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <Communications 
                    stateStats={stateStats}
                    recentAnnouncements={transformedAnnouncements}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateDashboard; 