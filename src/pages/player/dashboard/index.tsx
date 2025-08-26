import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { AppDispatch } from '../../../store';
import { 
  fetchPlayerStats, 
  fetchMatchHistory, 
  fetchRecentActivity, 
  fetchTournamentResults, 
  fetchUpcomingTournaments 
} from '../../../store/slices/playerDashboardSlice';
import Overview from './Overview';
import DigitalIDCard from '../../../components/DigitalIDCard';
import Matches from './Matches';
import Tournaments from './Tournaments';
import Activity from './Activity';
import Settings from './Settings';

const PlayerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    playerStats, 
    matchHistory, 
    recentActivity, 
    tournamentResults, 
    upcomingTournaments,
    loading,
    error 
  } = useSelector((state: RootState) => state.playerDashboard);
  
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all dashboard data on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchPlayerStats(user.id));
      dispatch(fetchMatchHistory(user.id));
      dispatch(fetchRecentActivity(user.id));
      dispatch(fetchTournamentResults(user.id));
      dispatch(fetchUpcomingTournaments());
    }
  }, [dispatch, user?.id]);

  // Profile completion status calculation
  const profileCompletion = {
    photo: !!user?.profile_photo,
    idDocument: !!user?.verification_documents,
    bio: !!user?.bio,
    contactInfo: !!(user?.phone || user?.whatsapp),
    location: !!(user?.state && user?.city),
    total: 5,
    completed: 0
  };

  // Calculate completion percentage
  profileCompletion.completed = [
    profileCompletion.photo,
    profileCompletion.idDocument,
    profileCompletion.bio,
    profileCompletion.contactInfo,
    profileCompletion.location
  ].filter(Boolean).length;

  // Affiliation data
  const affiliationData = {
    location: {
      state: user?.state,
      city: user?.city
    },
    club: user?.club,
    membershipStatus: user?.membership_status
  };

  // Privacy settings data
  const privacySettings = {
    canBeFound: user?.can_be_found ?? true
  };

  // Loading state
  if (loading && !playerStats) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !playerStats) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-on-scroll">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'Player'}!
          </h1>
          <p className="text-gray-600">Here's your pickleball journey overview and recent activity.</p>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-8">
          <div className="w-full">
            {/* Tab Navigation */}
            <div className="grid w-full grid-cols-6 bg-white rounded-lg shadow-sm border border-gray-200 p-1 animate-on-scroll">
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
                onClick={() => setActiveTab('credentials')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'credentials'
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Digital ID
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'matches'
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Matches
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
                onClick={() => setActiveTab('activity')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'activity'
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="animate-on-scroll">
                  <Overview 
                    playerStats={playerStats}
                    profileCompletion={profileCompletion}
                    affiliationData={affiliationData}
                  />
                </div>
              )}

              {/* Digital ID Tab */}
              {activeTab === 'credentials' && (
                <div className="animate-on-scroll">
                  <DigitalIDCard />
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === 'matches' && (
                <div className="animate-on-scroll">
                  <Matches matchHistory={matchHistory || []} />
                </div>
              )}

              {/* Tournaments Tab */}
              {activeTab === 'tournaments' && (
                <div className="animate-on-scroll">
                  <Tournaments 
                    playerStats={playerStats}
                    tournamentResults={tournamentResults || []}
                    upcomingTournaments={upcomingTournaments || []}
                  />
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="animate-on-scroll">
                  <Activity recentActivity={recentActivity || []} />
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="animate-on-scroll">
                  <Settings 
                    privacySettings={privacySettings}
                    profileCompletion={profileCompletion}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard; 