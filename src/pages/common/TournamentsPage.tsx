import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchTournaments, registerForTournament } from '../../store/slices/tournamentsSlice';
import { Tournament } from '../../types/api';
import { toast } from 'sonner';

const TournamentsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tournaments, loading, error, pagination } = useSelector((state: RootState) => state.tournaments);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    tournament_type: 'all' | 'local' | 'state' | 'national' | 'international' | 'exhibition' | 'league';
    category: 'all' | 'singles' | 'doubles' | 'mixed_doubles' | 'team';
    status: 'all' | 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'in_progress' | 'completed' | 'cancelled';
    state: string;
    city: string;
    search: string;
  }>({
    page: 1,
    limit: 12,
    tournament_type: 'all',
    category: 'all',
    status: 'all',
    state: '',
    city: '',
    search: ''
  });

  useEffect(() => {
    const apiFilters = {
      ...filters,
      tournament_type: filters.tournament_type === 'all' ? undefined : filters.tournament_type,
      category: filters.category === 'all' ? undefined : filters.category,
      status: filters.status === 'all' ? undefined : filters.status,
      state: filters.state || undefined,
      city: filters.city || undefined,
      search: filters.search || undefined
    };

    // Remove undefined values
    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key as keyof typeof apiFilters] === undefined) {
        delete apiFilters[key as keyof typeof apiFilters];
      }
    });

    dispatch(fetchTournaments(apiFilters));
  }, [dispatch, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleRegister = async (tournamentId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to register for tournaments');
      return;
    }

    try {
      await dispatch(registerForTournament({
        tournamentId,
        registrationData: {
          category: 'singles', // Default, should come from user preference
          division: '3.5', // Default, should come from user profile
          partner_name: '', // For doubles/mixed doubles
          special_requests: '',
          dietary_restrictions: ''
        }
      })).unwrap();

      toast.success('Successfully registered for tournament!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register for tournament');
    }
  };

  const getTournamentTypeColor = (type: string) => {
    switch (type) {
      case 'national': return 'bg-purple-100 text-purple-800';
      case 'state': return 'bg-blue-100 text-blue-800';
      case 'local': return 'bg-green-100 text-green-800';
      case 'league': return 'bg-yellow-100 text-yellow-800';
      case 'exhibition': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration_open': return 'bg-green-100 text-green-800';
      case 'registration_closed': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading && tournaments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tournaments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section 
        className="relative text-white py-16 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(150, 200, 200, 0.4), rgba(147, 200, 234, 0.9)), url('/img/tournament-system.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Pickleball Tournaments
          </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
              Compete, improve, and connect with players from all skill levels
          </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <input
              placeholder="Search tournaments..."
              value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
            <select 
              value={filters.tournament_type} 
              onChange={(e) => handleFilterChange('tournament_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="local">Local</option>
              <option value="state">State</option>
              <option value="national">National</option>
              <option value="international">International</option>
              <option value="exhibition">Exhibition</option>
              <option value="league">League</option>
            </select>
            </div>
            <div>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="singles">Singles</option>
              <option value="doubles">Doubles</option>
              <option value="mixed_doubles">Mixed Doubles</option>
              <option value="team">Team</option>
            </select>
            </div>
            <div>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="registration_open">Registration Open</option>
              <option value="registration_closed">Registration Closed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          )}

          {tournaments.length === 0 && !loading ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournaments found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or check back later for new tournaments.
                </p>
                  <button 
                  onClick={() => setFilters({ page: 1, limit: 12, tournament_type: 'all', category: 'all', status: 'all', state: '', city: '', search: '' })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Clear Filters
                  </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament: Tournament) => (
                  <div key={tournament.id}>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full hover:shadow-lg transition-shadow duration-300">
                      {/* Tournament Image */}
                      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                        {tournament.banner_image ? (
                          <img 
                            src={tournament.banner_image} 
                            alt={tournament.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Handle broken image URLs by replacing with fallback
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              // Show fallback content instead
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                            {tournament.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTournamentTypeColor(tournament.tournament_type)}`}>
                            {tournament.tournament_type}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
                            {tournament.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {tournament.venue_name && `${tournament.venue_name} • `}
                            {tournament.city}, {tournament.state}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                          </p>
                  </div>

                        {tournament.description && (
                          <p className="text-gray-700 line-clamp-3 mb-4">
                            {tournament.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                            {tournament.current_participants || 0}/{tournament.max_participants || '∞'} participants
                      </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                            {tournament.entry_fee ? formatCurrency(tournament.entry_fee) : 'Free'}
                          </div>
                    </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {tournament.skill_levels && tournament.skill_levels.map((level, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                              {level}
                            </span>
                          ))}
                    </div>
                    
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-500">
                            Registration deadline: {tournament.registration_deadline ? formatDate(tournament.registration_deadline) : 'TBD'}
                    </div>
                        <button 
                          onClick={() => handleRegister(tournament.id)}
                            disabled={tournament.status !== 'registration_open'}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {tournament.status === 'registration_open' ? 'Register' : 'Registration Closed'}
                      </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default TournamentsPage; 