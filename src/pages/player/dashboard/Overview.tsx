import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Target,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

interface ProfileCompletion {
  photo: boolean;
  idDocument: boolean;
  bio: boolean;
  contactInfo: boolean;
  location: boolean;
  total: number;
  completed: number;
}

interface AffiliationData {
  location: {
    state?: string;
    city?: string;
  };
  club?: any;
  membershipStatus?: string;
}

interface OverviewProps {
  playerStats: PlayerStats | null;
  profileCompletion: ProfileCompletion;
  affiliationData: AffiliationData;
}

const Overview: React.FC<OverviewProps> = ({ 
  playerStats, 
  profileCompletion, 
  affiliationData 
}) => {
  const navigate = useNavigate();

  // Default values when playerStats is null
  const stats = playerStats || {
    tournamentsPlayed: 0,
    tournamentsWon: 0,
    currentRanking: 0,
    rankingChange: '+0',
    totalPoints: 0,
    matchesPlayed: 0,
    winRate: 0,
    nextTournament: 'No upcoming tournaments',
    nextTournamentDate: '',
    upcomingMatches: 0,
    recentAchievements: []
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-on-scroll">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Tournaments Won</h3>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.tournamentsWon}</div>
          <p className="text-xs text-gray-600">out of {stats.tournamentsPlayed} played</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Current Ranking</h3>
            <Award className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.currentRanking > 0 ? `#${stats.currentRanking}` : 'Unranked'}
          </div>
          <p className="text-xs text-green-600">{stats.rankingChange} this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Win Rate</h3>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.winRate}%</div>
          <p className="text-xs text-gray-600">{stats.matchesPlayed} matches</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Points</h3>
            <Target className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalPoints}</div>
          <p className="text-xs text-gray-600">lifetime points</p>
        </div>
      </div>

      {/* Affiliation Information */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-indigo-500" />
            <span>Affiliation & Location</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <div className="space-y-2">
                  {affiliationData.location.state && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        <strong>State:</strong> {affiliationData.location.state}
                      </span>
                    </div>
                  )}
                  {affiliationData.location.city && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        <strong>City:</strong> {affiliationData.location.city}
                      </span>
                    </div>
                  )}
                  {!affiliationData.location.state && !affiliationData.location.city && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-500">Location not specified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Club Affiliation</h4>
                <div className="space-y-2">
                  {affiliationData.club ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          <strong>Club Member:</strong> Yes
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          <strong>Club:</strong> {affiliationData.club.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          <strong>Location:</strong> {affiliationData.club.city}, {affiliationData.club.state}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        <strong>Club Member:</strong> No
                      </span>
                    </div>
                  )}
                  {affiliationData.membershipStatus && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        <strong>Membership:</strong> 
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 capitalize">
                          {affiliationData.membershipStatus}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Status */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Profile Completion</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-gray-900">
                {profileCompletion.completed}/{profileCompletion.total} ({Math.round((profileCompletion.completed / profileCompletion.total) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(profileCompletion.completed / profileCompletion.total) * 100}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                {profileCompletion.photo ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className={profileCompletion.photo ? 'text-gray-700' : 'text-yellow-600'}>
                  Profile Photo
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {profileCompletion.idDocument ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className={profileCompletion.idDocument ? 'text-gray-700' : 'text-yellow-600'}>
                  ID Document
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {profileCompletion.bio ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className={profileCompletion.bio ? 'text-gray-700' : 'text-yellow-600'}>
                  Bio
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {profileCompletion.contactInfo ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className={profileCompletion.contactInfo ? 'text-gray-700' : 'text-yellow-600'}>
                  Contact Info
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {profileCompletion.location ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className={profileCompletion.location ? 'text-gray-700' : 'text-yellow-600'}>
                  Location
                </span>
              </div>
            </div>
            {profileCompletion.completed < profileCompletion.total && (
              <button 
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:shadow-lg"
                onClick={() => navigate('/player/profile')}
              >
                Complete Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      {stats.recentAchievements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Recent Achievements</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats.recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{achievement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              className="h-20 flex-col space-y-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:shadow-lg"
              onClick={() => navigate('/tournaments')}
            >
              <Trophy className="h-6 w-6 mx-auto" />
              <span>Find Tournaments</span>
            </button>
            <button 
              className="h-20 flex-col space-y-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:shadow-lg"
              onClick={() => navigate('/player-finder')}
            >
              <Award className="h-6 w-6 mx-auto" />
              <span>Find Players</span>
            </button>
            <button 
              className="h-20 flex-col space-y-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:shadow-lg"
              onClick={() => navigate('/court-reservations')}
            >
              <MapPin className="h-6 w-6 mx-auto" />
              <span>Book Court</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 