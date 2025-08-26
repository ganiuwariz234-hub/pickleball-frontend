import React from 'react';
import { Trophy, Users } from 'lucide-react';

interface Match {
  id: string;
  opponent: string;
  date: string;
  result: string;
  score: string;
  tournament: string;
  points: string;
}

interface MatchesProps {
  matchHistory: Match[];
}

const Matches: React.FC<MatchesProps> = ({ matchHistory }) => {
  // Calculate match statistics
  const totalMatches = matchHistory.length;
  const wins = matchHistory.filter(match => match.result === 'Won').length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
  const totalPoints = matchHistory.reduce((sum, match) => {
    const points = parseInt(match.points.replace(/[+-]/g, ''));
    return match.points.startsWith('+') ? sum + points : sum - points;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Match Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-on-scroll">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Matches</h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalMatches}</div>
          <p className="text-xs text-gray-600">matches played</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Win Rate</h3>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{winRate}%</div>
          <p className="text-xs text-gray-600">{wins} wins</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Net Points</h3>
            <span className="text-sm font-medium">📊</span>
          </div>
          <div className={`text-2xl font-bold ${totalPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPoints >= 0 ? `+${totalPoints}` : totalPoints}
          </div>
          <p className="text-xs text-gray-600">total points</p>
        </div>
      </div>

      {/* Match History */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <span>Match History</span>
          </h3>
        </div>
        <div className="p-6">
          {matchHistory.length > 0 ? (
            <div className="space-y-4">
              {matchHistory.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      match.result === 'Won' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {match.result === 'Won' ? <Trophy className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">vs. {match.opponent}</h4>
                      <p className="text-sm text-gray-600">{match.tournament}</p>
                      <p className="text-xs text-gray-500">{match.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{match.score}</p>
                    <p className={`text-sm ${match.result === 'Won' ? 'text-green-600' : 'text-red-600'}`}>
                      {match.points}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Yet</h3>
              <p className="text-gray-500 mb-4">Start playing matches to see your history here</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">• Join tournaments to play competitive matches</p>
                <p className="text-sm text-gray-400">• Find players for practice matches</p>
                <p className="text-sm text-gray-400">• Track your performance and progress</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Performance Trend</h3>
        </div>
        <div className="p-6">
          {matchHistory.length > 0 ? (
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Performance chart will be displayed here</p>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No performance data yet</p>
                <p className="text-sm text-gray-400">Play matches to see your performance trends</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches; 