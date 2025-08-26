import React from 'react';
import { Trophy, Users, TrendingUp, Award } from 'lucide-react';

interface Activity {
  type: 'tournament' | 'match' | 'ranking';
  title: string;
  date: string;
  result: string;
  points: string;
}

interface ActivityProps {
  recentActivity: Activity[];
}

const Activity: React.FC<ActivityProps> = ({ recentActivity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="h-5 w-5" />;
      case 'match':
        return <Users className="h-5 w-5" />;
      case 'ranking':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'tournament':
        return 'bg-blue-100 text-blue-600';
      case 'match':
        return 'bg-green-100 text-green-600';
      case 'ranking':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Calculate activity statistics
  const thisMonthActivities = recentActivity.filter(activity => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    return activityDate.getMonth() === now.getMonth() && 
           activityDate.getFullYear() === now.getFullYear();
  });

  const pointsEarned = thisMonthActivities.reduce((sum, activity) => {
    const points = parseInt(activity.points.replace(/[+-]/g, ''));
    return activity.points.startsWith('+') ? sum + points : sum;
  }, 0);

  const achievements = recentActivity.filter(activity => 
    activity.result.includes('Winner') || 
    activity.result.includes('Top') || 
    activity.result.includes('Improvement')
  ).length;

  return (
    <div className="space-y-6">
      {/* Recent Activity Feed */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{activity.result}</p>
                    <p className="text-sm text-green-600">{activity.points}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400 mt-2">Start playing matches and tournaments to see your activity here</p>
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span>Recent Achievements</span>
          </h3>
        </div>
        <div className="p-6">
          {achievements > 0 ? (
            <div className="space-y-4">
              {recentActivity
                .filter(activity => 
                  activity.result.includes('Winner') || 
                  activity.result.includes('Top') || 
                  activity.result.includes('Improvement')
                )
                .slice(0, 5)
                .map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{achievement.title} - {achievement.result}</p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No achievements yet</p>
              <p className="text-sm text-gray-400 mt-2">Keep playing to unlock achievements</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-on-scroll">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">This Month</h3>
            <span className="text-sm font-medium">📅</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{thisMonthActivities.length}</div>
          <p className="text-xs text-gray-600">activities</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Points Earned</h3>
            <span className="text-sm font-medium">📊</span>
          </div>
          <div className="text-2xl font-bold text-green-600">+{pointsEarned}</div>
          <p className="text-xs text-gray-600">this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Achievements</h3>
            <Award className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{achievements}</div>
          <p className="text-xs text-gray-600">unlocked</p>
        </div>
      </div>

      {/* Activity Timeline Placeholder */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Activity Timeline</h3>
        </div>
        <div className="p-6">
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Activity timeline chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity; 