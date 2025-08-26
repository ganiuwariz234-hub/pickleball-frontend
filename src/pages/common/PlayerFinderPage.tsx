import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { 
  searchPlayers, 
  fetchNearbyPlayers, 
  fetchPlayerFinderPreferences, 
  updatePlayerFinderPreferences,
  togglePlayerFinderStatus,
  sendMatchRequest,
  clearSearchResults
} from '../../store/slices/playerFinderSlice';
import { toast } from 'sonner';

interface SearchFilters {
  skill_level?: '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5';
  gender?: 'male' | 'female' | 'any';
  age_min?: number;
  age_max?: number;
  match_type?: 'singles' | 'doubles' | 'mixed_doubles' | 'any';
  radius?: number;
  page?: number;
  limit?: number;
}

const PlayerFinderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    searchResults, 
    nearbyPlayers, 
    preferences, 
    stats, 
    loading, 
    error, 
    pagination 
  } = useSelector((state: RootState) => state.playerFinder);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    skill_level: undefined,
    gender: undefined,
    age_min: undefined,
    age_max: undefined,
    match_type: undefined,
    radius: 50,
    page: 1,
    limit: 20
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    is_active: true,
    skill_level_min: undefined as '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5' | undefined,
    skill_level_max: undefined as '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0' | '5.5' | undefined,
    preferred_gender: 'any' as 'male' | 'female' | 'any',
    age_range_min: undefined as number | undefined,
    age_range_max: undefined as number | undefined,
    search_radius_km: 50,
    match_type: 'any' as 'singles' | 'doubles' | 'mixed_doubles' | 'any',
    contact_method: 'any' as 'email' | 'phone' | 'whatsapp' | 'any',
    auto_notify: true
  });

  useEffect(() => {
    // Fetch user's player finder preferences
    if (user) {
      dispatch(fetchPlayerFinderPreferences());
    }
    
    // Fetch nearby players on component mount
    dispatch(fetchNearbyPlayers(10));
  }, [dispatch, user]);

  useEffect(() => {
    // Update privacy settings when preferences are loaded
    if (preferences) {
      setPrivacySettings({
        is_active: preferences.is_active || false,
        skill_level_min: preferences.skill_level_min,
        skill_level_max: preferences.skill_level_max,
        preferred_gender: preferences.preferred_gender || 'any',
        age_range_min: preferences.age_range_min,
        age_range_max: preferences.age_range_max,
        search_radius_km: preferences.search_radius_km || 50,
        match_type: preferences.match_type || 'any',
        contact_method: preferences.contact_method || 'any',
        auto_notify: preferences.auto_notify || true
      });
    }
  }, [preferences]);

  const handleSearch = () => {
    if (!user?.latitude || !user?.longitude) {
      toast.error('Location information required. Please update your profile with location details.');
      return;
    }

    const searchParams = {
      ...filters,
      latitude: user.latitude,
      longitude: user.longitude,
      page: 1
    };

    // Remove undefined values
    Object.keys(searchParams).forEach(key => {
      const value = searchParams[key as keyof SearchFilters];
      if (value === undefined || value === null) {
        delete searchParams[key as keyof SearchFilters];
      }
    });

    dispatch(searchPlayers(searchParams));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    handleSearch();
  };

  const handleContactPlayer = (player: any) => {
    setSelectedPlayer(player);
    setShowContactModal(true);
  };

  const sendContactMessage = async () => {
    if (!contactMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!selectedPlayer) return;

    try {
      const matchType = filters.match_type && filters.match_type !== 'any' ? filters.match_type : 'singles';
      await dispatch(sendMatchRequest({
        targetUserId: selectedPlayer.id,
        requestData: {
          message: contactMessage,
          match_type: matchType,
          preferred_date: new Date().toISOString()
        }
      })).unwrap();

      toast.success(`Message sent to ${selectedPlayer.full_name || selectedPlayer.username}! They will be notified.`);
      setShowContactModal(false);
      setContactMessage('');
      setSelectedPlayer(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const updatePrivacySettings = async () => {
    try {
      await dispatch(updatePlayerFinderPreferences({
        skill_level_min: privacySettings.skill_level_min,
        skill_level_max: privacySettings.skill_level_max,
        preferred_gender: privacySettings.preferred_gender,
        age_range_min: privacySettings.age_range_min,
        age_range_max: privacySettings.age_range_max,
        search_radius_km: privacySettings.search_radius_km,
        match_type: privacySettings.match_type,
        contact_method: privacySettings.contact_method,
        auto_notify: privacySettings.auto_notify
      })).unwrap();

      setShowPrivacySettings(false);
      toast.success('Privacy settings updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update privacy settings');
    }
  };

  const toggleVisibility = async () => {
    try {
      await dispatch(togglePlayerFinderStatus()).unwrap();
      toast.success(preferences?.is_active ? 'You are now hidden from player finder' : 'You are now visible in player finder');
    } catch (error: any) {
      toast.error('Failed to update visibility');
    }
  };

  const getSkillLevelColor = (level: string) => {
    const numLevel = parseFloat(level);
    if (numLevel >= 4.5) return 'bg-purple-100 text-purple-800';
    if (numLevel >= 4.0) return 'bg-blue-100 text-blue-800';
    if (numLevel >= 3.5) return 'bg-green-100 text-green-800';
    if (numLevel >= 3.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatLocation = (player: any) => {
    if (player.city && player.state) {
      return `${player.city}, ${player.state}`;
    }
    return player.state || 'Location not specified';
  };

  const displayPlayers = searchResults.length > 0 ? searchResults : nearbyPlayers;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Players</h1>
              <p className="text-gray-600">Connect with pickleball players in your area</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={toggleVisibility}
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                  preferences?.is_active 
                    ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {preferences?.is_active ? 'Visible' : 'Hidden'}
              </button>
              <button
                onClick={() => setShowPrivacySettings(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                Privacy Settings
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Players</label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, location, or bio..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-end space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
              </button>
              <button
                onClick={handleSearch}
                disabled={loading || !user?.latitude || !user?.longitude}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                  <select
                    value={filters.skill_level || ''}
                    onChange={(e) => handleFilterChange('skill_level', e.target.value || undefined)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="2.5">2.5 - Beginner</option>
                    <option value="3.0">3.0 - Beginner+</option>
                    <option value="3.5">3.5 - Intermediate</option>
                    <option value="4.0">4.0 - Intermediate+</option>
                    <option value="4.5">4.5 - Advanced</option>
                    <option value="5.0">5.0+ - Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={filters.gender || ''}
                    onChange={(e) => handleFilterChange('gender', e.target.value || undefined)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="any">Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance (km)</label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={filters.radius || 50}
                    onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
                    className="block w-full"
                  />
                  <span className="text-sm text-gray-600">{filters.radius} km</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.age_min || ''}
                      onChange={(e) => handleFilterChange('age_min', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.age_max || ''}
                      onChange={(e) => handleFilterChange('age_max', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Match Type</label>
                  <select
                    value={filters.match_type || ''}
                    onChange={(e) => handleFilterChange('match_type', e.target.value || undefined)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Type</option>
                    <option value="singles">Singles</option>
                    <option value="doubles">Doubles</option>
                    <option value="mixed_doubles">Mixed Doubles</option>
                    <option value="any">Any</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count and Stats */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {searchResults.length > 0 
              ? `Found ${searchResults.length} player${searchResults.length !== 1 ? 's' : ''} matching your criteria`
              : `Showing ${nearbyPlayers.length} nearby players`
            }
          </p>
          {stats && (
            <div className="text-sm text-gray-600">
              <span className="mr-4">Matches found: {stats.total_matches_found}</span>
              <span className="mr-4">Contacted: {stats.matches_contacted}</span>
              <span>Successful: {stats.successful_matches}</span>
            </div>
          )}
        </div>

        {/* Players Grid */}
        {loading && displayPlayers.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for players...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPlayers.map((player) => (
              <div key={player.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0 h-16 w-16">
                      {player.profile_photo ? (
                        <img className="h-16 w-16 rounded-full object-cover" src={player.profile_photo} alt={player.full_name || player.username} />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium">
                          {(player.full_name || player.username).split(' ').map((n: string) => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {player.full_name || player.username}
                      </h3>
                      {player.skill_level && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(player.skill_level)}`}>
                          {player.skill_level}
                        </span>
                      )}
                      {player.date_of_birth && (
                        <div className="text-sm text-gray-600 mt-1">
                          Age: {calculateAge(player.date_of_birth)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Location</p>
                      <p className="text-sm font-medium text-gray-900">{formatLocation(player)}</p>
                    </div>

                    {player.gender && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Gender</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{player.gender}</p>
                      </div>
                    )}

                    {player.membership_status && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Membership</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          player.membership_status === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {player.membership_status}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        Member since: {new Date(player.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleContactPlayer(player)}
                        disabled={!preferences?.is_active}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {displayPlayers.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No players found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {!user?.latitude || !user?.longitude 
                ? 'Please update your profile with location information to find nearby players.'
                : 'Try adjusting your search criteria or filters.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pagination.page === page 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedPlayer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact {selectedPlayer.full_name || selectedPlayer.username}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Message *</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Introduce yourself and explain why you'd like to connect..."
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Your message will be sent as a notification to {selectedPlayer.full_name || selectedPlayer.username}. They can choose to respond or block further contact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={sendContactMessage}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacySettings && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        These settings control how other players can find and contact you.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.is_active}
                      onChange={(e) => setPrivacySettings({...privacySettings, is_active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Can Be Found in Search</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level Range</label>
                    <div className="flex space-x-2">
                      <select
                        value={privacySettings.skill_level_min || ''}
                        onChange={(e) => setPrivacySettings({...privacySettings, skill_level_min: e.target.value as any || undefined})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Min Level</option>
                        <option value="2.5">2.5</option>
                        <option value="3.0">3.0</option>
                        <option value="3.5">3.5</option>
                        <option value="4.0">4.0</option>
                        <option value="4.5">4.5</option>
                        <option value="5.0">5.0</option>
                      </select>
                      <select
                        value={privacySettings.skill_level_max || ''}
                        onChange={(e) => setPrivacySettings({...privacySettings, skill_level_max: e.target.value as any || undefined})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Max Level</option>
                        <option value="2.5">2.5</option>
                        <option value="3.0">3.0</option>
                        <option value="3.5">3.5</option>
                        <option value="4.0">4.0</option>
                        <option value="4.5">4.5</option>
                        <option value="5.0">5.0</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Gender</label>
                    <select
                      value={privacySettings.preferred_gender}
                      onChange={(e) => setPrivacySettings({...privacySettings, preferred_gender: e.target.value as 'male' | 'female' | 'any'})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="any">Any Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Radius (km)</label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={privacySettings.search_radius_km}
                      onChange={(e) => setPrivacySettings({...privacySettings, search_radius_km: parseInt(e.target.value)})}
                      className="block w-full"
                    />
                    <span className="text-sm text-gray-600">{privacySettings.search_radius_km} km</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Match Type</label>
                    <select
                      value={privacySettings.match_type}
                      onChange={(e) => setPrivacySettings({...privacySettings, match_type: e.target.value as 'singles' | 'doubles' | 'mixed_doubles' | 'any'})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="any">Any Type</option>
                      <option value="singles">Singles</option>
                      <option value="doubles">Doubles</option>
                      <option value="mixed_doubles">Mixed Doubles</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
                    <select
                      value={privacySettings.contact_method}
                      onChange={(e) => setPrivacySettings({...privacySettings, contact_method: e.target.value as 'email' | 'phone' | 'whatsapp' | 'any'})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="any">Any Method</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.auto_notify}
                      onChange={(e) => setPrivacySettings({...privacySettings, auto_notify: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Auto-notify for new matches</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowPrivacySettings(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={updatePrivacySettings}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerFinderPage; 