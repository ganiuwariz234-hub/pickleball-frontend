import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchClubs } from '../../store/slices/clubsSlice';
import { Club } from '../../types/api';

// Import states slice actions directly
import { fetchStates } from '../../store/slices/statesSlice';

const ClubsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clubs, loading, error, pagination } = useSelector((state: RootState) => state.clubs);
  const { states, loading: statesLoading, error: statesError } = useSelector((state: RootState) => state.states);
  
  // Fallback states in case API fails
  const fallbackStates = [
    { id: '1', state: 'Jalisco', city: 'Guadalajara' },
    { id: '2', state: 'Nuevo León', city: 'Monterrey' },
    { id: '3', state: 'Baja California', city: 'Tijuana' },
    { id: '4', state: 'Sonora', city: 'Hermosillo' },
    { id: '5', state: 'Chihuahua', city: 'Chihuahua' },
    { id: '6', state: 'Coahuila', city: 'Saltillo' },
    { id: '7', state: 'Tamaulipas', city: 'Reynosa' },
    { id: '8', state: 'Sinaloa', city: 'Culiacán' },
    { id: '9', state: 'Durango', city: 'Durango' },
    { id: '10', state: 'Zacatecas', city: 'Zacatecas' }
  ];
  
  // Use fallback states if API fails or returns empty
  const availableStates = states.length > 0 ? states : fallbackStates;

  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    state: string;
    city: string;
    club_type: 'all' | 'recreational' | 'competitive' | 'training' | 'mixed';
    has_courts: string;
    subscription_plan: 'all' | 'basic' | 'premium';
    search: string;
  }>({
    page: 1,
    limit: 12,
    state: 'all',
    city: 'all',
    club_type: 'all',
    has_courts: 'all',
    subscription_plan: 'all',
    search: ''
  });

  useEffect(() => {
    // Fetch states for the filter dropdown
    dispatch(fetchStates({}));
  }, [dispatch]);

  useEffect(() => {
    const apiFilters = {
      ...filters,
      state: filters.state === 'all' ? undefined : filters.state,
      city: filters.city === 'all' ? undefined : filters.city,
      club_type: filters.club_type === 'all' ? undefined : filters.club_type,
      has_courts: filters.has_courts === 'all' ? undefined : (filters.has_courts === 'true'),
      subscription_plan: filters.subscription_plan === 'all' ? undefined : filters.subscription_plan
    } as any;
    
    // Remove undefined values
    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key] === undefined) {
        delete apiFilters[key];
      }
    });
    
    dispatch(fetchClubs(apiFilters));
  }, [dispatch, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getClubTypeColor = (type: string) => {
    switch (type) {
      case 'competitive': return 'bg-red-100 text-red-800';
      case 'recreational': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'mixed': return 'bg-purple-100 text-purple-800';
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

  if (loading && clubs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading clubs...</p>
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
          backgroundImage: `linear-gradient(to right, rgba(150, 200, 200, 0.4), rgba(147, 200, 234, 0.9)), url('/img/clubs-facility.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg animate-on-scroll">
              Find Your Perfect Pickleball Club
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md animate-on-scroll">
              Discover clubs near you, join communities, and take your game to the next level
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
                placeholder="Search clubs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent animate-on-scroll"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select 
                value={filters.state} 
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent animate-on-scroll"
                disabled={statesLoading}
              >
                <option value="all">All States</option>
                {statesLoading ? (
                  <option value="" disabled>Loading states...</option>
                ) : statesError ? (
                  <option value="" disabled>Error loading states</option>
                ) : availableStates.length > 0 ? (
                  availableStates.map((state) => (
                    <option key={state.id} value={state.state}>
                      {state.state}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No states available</option>
                )}
              </select>
              {statesLoading && (
                <div className="mt-1 text-xs text-gray-500">Loading states...</div>
              )}
              {statesError && states.length === 0 && (
                <div className="mt-1 text-xs text-amber-500">Using fallback state list</div>
              )}
              {statesError && (
                <div className="mt-1 text-xs text-red-500">
                  Failed to load states (using fallback list)
                  <button 
                    onClick={() => dispatch(fetchStates({}))}
                    className="ml-2 text-blue-500 hover:text-blue-700 underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
            <div>
              <select 
                value={filters.club_type} 
                onChange={(e) => handleFilterChange('club_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent animate-on-scroll"
              >
                <option value="all">All Types</option>
                <option value="recreational">Recreational</option>
                <option value="competitive">Competitive</option>
                <option value="training">Training</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <select 
                value={filters.has_courts} 
                onChange={(e) => handleFilterChange('has_courts', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent animate-on-scroll"
              >
                <option value="all">All Clubs</option>
                <option value="true">With Courts</option>
                <option value="false">Without Courts</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 text-lg animate-on-scroll">{error}</p>
            </div>
          )}

          {clubs.length === 0 && !loading ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-on-scroll" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-on-scroll">No clubs found</h3>
                <p className="text-gray-600 mb-6 animate-on-scroll">
                  Try adjusting your search criteria or check back later for new clubs in your area.
                </p>
                <button 
                  onClick={() => setFilters({ page: 1, limit: 12, state: 'all', city: 'all', club_type: 'all', has_courts: 'all', subscription_plan: 'all', search: '' })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors animate-on-scroll"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map((club: Club, index: number) => (
                  <div key={club.id}>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full hover:shadow-lg transition-shadow duration-300 animate-on-scroll">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 animate-on-scroll">
                            {club.name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getClubTypeColor(club.club_type)} animate-on-scroll`}>
                            {club.club_type}
                          </span>
                        </div>
                        <p className="flex items-center text-gray-600 animate-on-scroll">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {club.city}, {club.state}
                        </p>
                      </div>
                      
                      <div className="px-6 pb-6 space-y-4">
                        {club.description && (
                          <p className="text-gray-700 line-clamp-3 animate-on-scroll">
                            {club.description}
                          </p>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600 animate-on-scroll">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            {club.member_count} members
                          </div>
                          {club.has_courts && (
                            <div className="flex items-center text-gray-600 animate-on-scroll">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              {club.court_count} courts
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {club.offers_training && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 animate-on-scroll">Training</span>
                          )}
                          {club.offers_tournaments && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 animate-on-scroll">Tournaments</span>
                          )}
                          {club.offers_equipment && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 animate-on-scroll">Equipment</span>
                          )}
                        </div>

                        {club.founded_date && (
                          <div className="flex items-center text-sm text-gray-500 animate-on-scroll">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Founded {formatDate(club.founded_date)}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-4 text-sm">
                            {club.contact_phone && (
                              <a href={`tel:${club.contact_phone}`} className="flex items-center text-blue-600 hover:text-blue-800 hover:scale-105 transition-transform duration-300 animate-on-scroll">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Contact
                              </a>
                            )}
                            {club.contact_email && (
                              <a href={`mailto:${club.contact_email}`} className="flex items-center text-blue-600 hover:text-blue-800 hover:scale-105 transition-transform duration-300 animate-on-scroll">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                              </a>
                            )}
                            {club.website && (
                              <a href={club.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 hover:scale-105 transition-transform duration-300 animate-on-scroll">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                Website
                              </a>
                            )}
                          </div>
                          <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:scale-105 transition-transform duration-300 animate-on-scroll">
                            View Details
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
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-300 animate-on-scroll"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md hover:scale-105 transition-transform duration-300 animate-on-scroll ${
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
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-300 animate-on-scroll"
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

export default ClubsPage; 