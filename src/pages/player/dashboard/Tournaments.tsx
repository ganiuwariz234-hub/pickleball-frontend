import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Award } from 'lucide-react';

interface PlayerStats {
  tournamentsPlayed: number;
  tournamentsWon: number;
  nextTournament: string;
  nextTournamentDate: string;
  upcomingMatches: number;
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

interface TournamentsProps {
  playerStats: PlayerStats;
  tournamentResults: TournamentResult[];
  upcomingTournaments: any[];
}

const Tournaments: React.FC<TournamentsProps> = ({ 
  playerStats, 
  tournamentResults, 
  upcomingTournaments 
}) => {
  const navigate = useNavigate();

  // Get next tournament from upcoming tournaments
  const nextTournament = upcomingTournaments.length > 0 ? upcomingTournaments[0] : null;

  return (
    <div className="space-y-6">
      {/* Next Tournament */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span>Next Tournament</span>
          </h3>
        </div>
        <div className="p-6">
          {nextTournament ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {nextTournament.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {new Date(nextTournament.start_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="flex justify-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {playerStats?.upcomingMatches || 0}
                  </div>
                  <div className="text-sm text-gray-600">Upcoming Matches</div>
                </div>
              </div>
              <button 
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 hover:shadow-lg"
                onClick={() => navigate(`/tournaments/${nextTournament.id}`)}
              >
                View Tournament Details
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Upcoming Tournaments
              </h3>
              <p className="text-gray-600 mb-4">
                Check back later for new tournament opportunities
              </p>
              <button 
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 hover:shadow-lg"
                onClick={() => navigate('/tournaments')}
              >
                Find Tournaments
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tournament Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-on-scroll">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Tournaments Played</h3>
            <Trophy className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {playerStats?.tournamentsPlayed || 0}
          </div>
          <p className="text-xs text-gray-600">total tournaments</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Tournaments Won</h3>
            <Award className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {playerStats?.tournamentsWon || 0}
          </div>
          <p className="text-xs text-gray-600">championships</p>
        </div>
      </div>

      {/* Tournament History */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Tournament Results</h3>
        </div>
        <div className="p-6">
          {tournamentResults.length > 0 ? (
            <div className="space-y-3">
              {tournamentResults.slice(0, 5).map((tournament) => (
                <div 
                  key={tournament.id} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    tournament.result === 'winner' ? 'bg-green-50' : 
                    tournament.result === 'finalist' ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <h5 className="font-medium text-gray-900">{tournament.name}</h5>
                    <p className="text-sm text-gray-600">
                      {new Date(tournament.date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tournament.result === 'winner' ? 'bg-green-100 text-green-800' :
                      tournament.result === 'finalist' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}>
                      {tournament.result === 'winner' ? 'Winner' :
                       tournament.result === 'finalist' ? 'Finalist' :
                       tournament.result === 'semifinalist' ? 'Semi-Final' :
                       tournament.result === 'quarterfinalist' ? 'Quarter-Final' :
                       tournament.result}
                    </span>
                    <p className={`text-sm mt-1 ${
                      tournament.result === 'winner' ? 'text-green-600' :
                      tournament.result === 'finalist' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>
                      +{tournament.points} points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No tournament results yet</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                onClick={() => navigate('/tournaments')}
              >
                Find Your First Tournament
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              className="h-12 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:shadow-lg flex items-center justify-center"
              onClick={() => navigate('/tournaments')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Find Tournaments
            </button>
            <button 
              className="h-12 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:shadow-lg flex items-center justify-center"
              onClick={() => navigate('/rankings')}
            >
              <Trophy className="h-4 w-4 mr-2" />
              View Rankings
            </button>
          </div>
        </div>
      </div>

      {/* Tournament Calendar Placeholder */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Tournament Calendar</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Tournament calendar will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tournaments; 