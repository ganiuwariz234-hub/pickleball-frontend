import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchCourts } from '../../store/slices/courtsSlice';
import { createCourtReservation, getCourtAvailability, getCourtBookings } from '../../store/slices/courtReservationsSlice';
import { Court, BookCourtRequest } from '../../types/api';
import { toast } from 'sonner';

// CourtCard Component
interface CourtCardProps {
  court: any;
  onSelect: () => void;
  onFavorite: (courtId: string) => void;
  onShare: (court: any) => void;
  onViewDetails: (court: any) => void;
  isFavorite: boolean;
  isSelected: boolean;
  viewMode: 'grid' | 'list';
}

const CourtCard: React.FC<CourtCardProps> = ({
  court,
  onSelect,
  onFavorite,
  onShare,
  onViewDetails,
  isFavorite,
  isSelected,
  viewMode
}) => {
  if (viewMode === 'list') {
    return (
      <div 
        className={`cursor-pointer transition-all duration-300 hover:shadow-md border rounded-lg animate-on-scroll ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center gap-4 p-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img 
              src={court.image || '/img/placeholder.svg'} 
              alt={court.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/img/placeholder.svg';
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 animate-on-scroll">{court.name}</h3>
                <p className="text-sm text-gray-600 mb-2 animate-on-scroll">{court.club_name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1 animate-on-scroll">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {court.location}
                  </span>
                  <span className="flex items-center gap-1 animate-on-scroll">
                    <svg className="w-4 h-4 text-yellow-500 fill-current" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674c1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {court.rating || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1 animate-on-scroll">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5c1.747 0 3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                    </svg>
                    {court.total_bookings || 0} bookings
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 animate-on-scroll">${court.hourly_rate || 0}</div>
                <div className="text-sm text-gray-500 animate-on-scroll">per hour</div>
                <div className="text-sm text-green-600 font-medium animate-on-scroll">
                  Member: ${court.member_rate || 0}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium animate-on-scroll ${
              court.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {court.is_available ? 'Available' : 'Unavailable'}
            </span>
            
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite(court.id);
                }}
                className={`p-2 rounded-md hover:bg-gray-100 transition-colors animate-on-scroll ${
                  isFavorite ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                <svg className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(court);
                }}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 animate-on-scroll"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(court);
                }}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 animate-on-scroll"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg border rounded-lg overflow-hidden animate-on-scroll ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={court.image || '/img/placeholder.svg'} 
          alt={court.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/img/placeholder.svg';
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 animate-on-scroll">{court.name}</h3>
            <p className="text-sm text-gray-600 mb-2 animate-on-scroll">{court.club_name}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium animate-on-scroll ${
            court.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {court.is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 animate-on-scroll">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {court.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 animate-on-scroll">
            <svg className="w-4 h-4 text-yellow-500 fill-current" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674c1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {court.rating || 'N/A'} • {court.total_bookings || 0} bookings
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600 animate-on-scroll">${court.hourly_rate || 0}</div>
            <div className="text-sm text-gray-500 animate-on-scroll">per hour</div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(court.id);
              }}
              className={`p-2 rounded-md hover:bg-gray-100 transition-colors animate-on-scroll ${
                isFavorite ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              <svg className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(court);
              }}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 animate-on-scroll"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(court);
              }}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 animate-on-scroll"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourtReservationsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courts, loading, error, pagination } = useSelector((state: RootState) => state.courts);
  const { courtAvailability, courtBookings, loading: reservationsLoading, error: reservationsError } = useSelector((state: RootState) => state.courtReservations);
  const { user } = useSelector((state: RootState) => state.auth);

  // Component state
  const [activeTab, setActiveTab] = useState<'courts' | 'availability' | 'bookings' | 'favorites'>('courts');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [bookingData, setBookingData] = useState<BookCourtRequest>({
    start_time: '',
    end_time: '',
    purpose: '',
    match_type: 'singles',
    guest_count: 0,
    notes: '',
    equipment_needed: {},
    special_requests: '',
  });

  // Enhanced search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [courtTypeFilter, setCourtTypeFilter] = useState('all');
  const [surfaceFilter, setSurfaceFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    dispatch(fetchCourts({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      dispatch(getCourtAvailability({
        courtId: selectedCourt.id,
        params: { date: dateString, duration: 2 }
      }));
      dispatch(getCourtBookings({
        courtId: selectedCourt.id,
        params: { date: dateString }
      }));
    }
  }, [dispatch, selectedCourt, selectedDate]);

  // Enhanced handler functions
  const handleBookCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourt || !selectedDate) return;

    try {
      const reservationData = {
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        purpose: bookingData.purpose || '',
        match_type: bookingData.match_type,
        guest_count: bookingData.guest_count || 0,
        notes: bookingData.notes || '',
        equipment_needed: bookingData.equipment_needed,
        special_requests: bookingData.notes || '',
      };

      await dispatch(createCourtReservation({
        courtId: selectedCourt.id,
        bookingData: reservationData
      })).unwrap();
      
      toast.success('Court booked successfully!');
      setShowBookingForm(false);
      setBookingData({
        start_time: '',
        end_time: '',
        purpose: '',
        match_type: 'singles',
        guest_count: 0,
        notes: '',
        equipment_needed: {},
        special_requests: '',
      });

      // Refresh court availability and bookings
      if (selectedCourt && selectedDate) {
        const dateString = selectedDate.toISOString().split('T')[0];
        dispatch(getCourtAvailability({
          courtId: selectedCourt.id,
          params: { date: dateString, duration: 2 }
        }));
        dispatch(getCourtBookings({
          courtId: selectedCourt.id,
          params: { date: dateString }
        }));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to book court');
    }
  };

  const handleFavoriteCourt = (courtId: string) => {
    setFavorites(prev => 
      prev.includes(courtId) 
        ? prev.filter(id => id !== courtId)
        : [...prev, courtId]
    );
    
    const court = courts.find(c => c.id === courtId);
    if (court) {
      toast.success(
        favorites.includes(courtId) 
          ? `Removed ${court.name} from favorites`
          : `Added ${court.name} to favorites`
      );
    }
  };

  const handleShareCourt = (court: any) => {
    const shareText = `Check out this pickleball court: ${court.name} at ${court.club_name}`;
    const shareUrl = `${window.location.origin}/courts/${court.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: court.name,
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        toast.success('Court information copied to clipboard!');
      });
    }
  };

  const handleViewCourtDetails = (court: any) => {
    toast.info(`Viewing ${court.name} details`, {
      description: `${court.court_type} • ${court.surface} • $${court.hourly_rate}/hour`,
      duration: 3000
    });
    // In a real app, this would navigate to court details page
  };

  const handleQuickBook = (court: any, startTime: string, endTime: string) => {
    setSelectedCourt(court);
    setBookingData({
      ...bookingData,
      start_time: startTime,
      end_time: endTime,
    });
    setShowBookingForm(true);
    toast.info('Quick booking initiated!', {
      description: 'Please complete your reservation details.',
      duration: 3000
    });
  };

  const handleFilterCourts = () => {
    // Apply filters to real court data
    let filtered = [...courts];
    
    if (searchTerm) {
      filtered = filtered.filter(court => 
        court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.club_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (courtTypeFilter !== 'all') {
      filtered = filtered.filter(court => court.court_type === courtTypeFilter);
    }
    
    if (surfaceFilter !== 'all') {
      filtered = filtered.filter(court => court.surface === surfaceFilter);
    }
    
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(court => 
        availabilityFilter === 'available' ? court.is_available : !court.is_available
      );
    }
    
    filtered = filtered.filter(court => 
      (court.hourly_rate || 0) >= priceRange[0] && (court.hourly_rate || 0) <= priceRange[1]
    );
    
    return filtered;
  };

  const filteredCourts = handleFilterCourts();

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isTimeSlotAvailable = (startTime: string, endTime: string) => {
    return courtAvailability.some(slot => 
      slot.start_time === startTime && 
      slot.end_time === endTime && 
      slot.available
    );
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 2).toString().padStart(2, '0')}:00`;
      slots.push({ startTime, endTime });
    }
    return slots;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading courts...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-600 text-lg">Error: {error}</p>
      <button 
        onClick={() => dispatch(fetchCourts({ page: 1, limit: 50 }))}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Court Reservations
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Courts</p>
                <p className="text-2xl font-bold text-blue-900">{courts.length}</p>
              </div>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Available Now</p>
                <p className="text-2xl font-bold text-green-900">{courts.filter(c => c.is_available).length}</p>
              </div>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Bookings</p>
                <p className="text-2xl font-bold text-purple-900">{courts.reduce((sum, c) => sum + c.total_bookings, 0)}</p>
              </div>
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5c1.747 0 3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Rating</p>
                <p className="text-2xl font-bold text-orange-900">
                  {courts.length > 0 ? '4.5' : 'N/A'}
                </p>
              </div>
              <svg className="w-4 h-4 text-orange-600 fill-current" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674c1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="space-y-6">
        <div className="grid w-full grid-cols-4 bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('courts')}
            className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'courts' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Courts
          </button>
          <button 
            onClick={() => setActiveTab('availability')}
            className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'availability' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Availability
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'bookings' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5c1.747 0 3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
            </svg>
            My Bookings
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'favorites' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Favorites
          </button>
        </div>

        {/* Courts Tab */}
        {activeTab === 'courts' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="border border-gray-200 rounded-lg">
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Find Courts
                </h3>
                <p className="text-sm text-gray-600 mb-4">Search and filter courts based on your preferences</p>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search courts by name, club, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L6.293 13H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Filters
                  </button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Court Type</label>
                        <select
                          value={courtTypeFilter}
                          onChange={(e) => setCourtTypeFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Types</option>
                          <option value="indoor">Indoor</option>
                          <option value="outdoor">Outdoor</option>
                          <option value="covered">Covered</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Surface</label>
                        <select
                          value={surfaceFilter}
                          onChange={(e) => setSurfaceFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Surfaces</option>
                          <option value="concrete">Concrete</option>
                          <option value="asphalt">Asphalt</option>
                          <option value="synthetic">Synthetic</option>
                          <option value="grass">Grass</option>
                          <option value="clay">Clay</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                        <select
                          value={availabilityFilter}
                          onChange={(e) => setAvailabilityFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Courts</option>
                          <option value="available">Available Only</option>
                          <option value="unavailable">Unavailable Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          <span className="text-gray-500 self-center">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
                            className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {filteredCourts.length} court{filteredCourts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Courts Grid/List */}
            {filteredCourts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredCourts.map((court) => (
                  <CourtCard
                    key={court.id}
                    court={court}
                    onSelect={() => setSelectedCourt(court)}
                    onFavorite={handleFavoriteCourt}
                    onShare={handleShareCourt}
                    onViewDetails={handleViewCourtDetails}
                    isFavorite={favorites.includes(court.id)}
                    isSelected={selectedCourt?.id === court.id}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courts found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => dispatch(fetchCourts({ page: pagination.page - 1, limit: pagination.limit }))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => dispatch(fetchCourts({ page: pagination.page + 1, limit: pagination.limit }))}
                  disabled={pagination.page >= pagination.pages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

              {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="space-y-6">
            {selectedCourt ? (
        <>
          {/* Date Selection */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Date</h3>
                    <p className="text-sm text-gray-600 mb-4">Choose a date to view court availability</p>
                    <div className="border rounded-md p-4">
                      <input
                        type="date"
                        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
          </div>

              {/* Availability Grid */}
              <div className="border border-gray-200 rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Court Availability</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedDate?.toLocaleDateString()} • {selectedCourt.name}
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {generateTimeSlots().map((slot) => {
                      const isAvailable = isTimeSlotAvailable(slot.startTime, slot.endTime);
                      return (
                        <div
                          key={slot.startTime}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors text-center ${
                            isAvailable 
                              ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                              : 'bg-red-50 border-red-200'
                          }`}
                          onClick={() => {
                            if (isAvailable) {
                              handleQuickBook(selectedCourt, slot.startTime, slot.endTime);
                            }
                          }}
                        >
                          <div className="font-medium text-sm">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </div>
                          <div className={`text-xs font-medium mt-1 ${
                              isAvailable ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isAvailable ? 'Available' : 'Booked'}
                          </div>
                          {isAvailable && (
                            <div className="text-xs text-gray-500 mt-1">
                              ${selectedCourt.hourly_rate}/hour
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                      </div>
                    </div>
            </>
          ) : (
            <div className="border border-gray-200 rounded-lg">
              <div className="p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Court First</h3>
                <p className="text-gray-600">Please select a court from the Courts tab to view availability.</p>
                      </div>
                    </div>
          )}
                    </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg">
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5c1.747 0 3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                  </svg>
                  My Bookings
                </h3>
                <p className="text-sm text-gray-600 mb-4">View and manage your court reservations</p>
                {courtBookings.length > 0 ? (
                  <div className="space-y-4">
                    {courtBookings.map((reservation) => (
                      <div key={reservation.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {reservation.user_id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {reservation.reservation_date}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Time:</span>
                                <span className="ml-2 font-medium">
                                  {reservation.start_time} - {reservation.end_time}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Type:</span>
                                <span className="ml-2 font-medium capitalize">
                                  {reservation.match_type}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Status:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {reservation.status}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Total:</span>
                                <span className="ml-2 font-medium">
                                  ${reservation.final_amount}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                              View Details
                            </button>
                            {reservation.status === 'confirmed' && (
                              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No bookings found</p>
                    <p className="text-gray-400">Start by booking your first court reservation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg">
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favorite Courts
                </h3>
                <p className="text-sm text-gray-600 mb-4">Quick access to your favorite courts</p>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courts
                      .filter(c => favorites.includes(c.id))
                      .map((court) => (
                        <CourtCard
                          key={court.id}
                          court={court}
                          onSelect={() => setSelectedCourt(court)}
                          onFavorite={handleFavoriteCourt}
                          onShare={handleShareCourt}
                          onViewDetails={handleViewCourtDetails}
                          isFavorite={true}
                          isSelected={selectedCourt?.id === court.id}
                          viewMode="grid"
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No favorite courts yet</p>
                    <p className="text-gray-400">Click the heart icon on any court to add it to favorites</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Court Selection Modal */}
      {selectedCourt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCourt.name}</h2>
                <button
                  onClick={() => setSelectedCourt(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Court Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <img 
                    src={selectedCourt.photos?.[0] || '/img/placeholder.svg'} 
                    alt={selectedCourt.name}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/img/placeholder.svg';
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Court Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Type:</span> {selectedCourt.court_type}</p>
                      <p><span className="font-medium">Surface:</span> {selectedCourt.surface}</p>
                      <p><span className="font-medium">Location:</span> {selectedCourt.club_name}</p>
                      <p><span className="font-medium">Rate:</span> ${selectedCourt.hourly_rate}/hour</p>
                      {selectedCourt.member_rate && (
                        <p><span className="font-medium">Member Rate:</span> ${selectedCourt.member_rate}/hour</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {generateTimeSlots().map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickBook(selectedCourt, slot.startTime, slot.endTime)}
                          disabled={!isTimeSlotAvailable(slot.startTime, slot.endTime)}
                          className={`p-2 text-xs rounded-md transition-colors ${
                            isTimeSlotAvailable(slot.startTime, slot.endTime)
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {formatTime(slot.startTime)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              {showBookingForm && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Court</h3>
                  <form onSubmit={handleBookCourt} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={bookingData.start_time}
                          onChange={(e) => setBookingData({...bookingData, start_time: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          value={bookingData.end_time}
                          onChange={(e) => setBookingData({...bookingData, end_time: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Match Type</label>
                        <select
                          value={bookingData.match_type}
                          onChange={(e) => setBookingData({...bookingData, match_type: e.target.value as 'singles' | 'doubles' | 'mixed_doubles' | 'practice' | 'lesson' | 'other'})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="singles">Singles</option>
                          <option value="doubles">Doubles</option>
                          <option value="mixed_doubles">Mixed Doubles</option>
                          <option value="practice">Practice</option>
                          <option value="lesson">Lesson</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count</label>
                        <input
                          type="number"
                          min="0"
                          value={bookingData.guest_count}
                          onChange={(e) => setBookingData({...bookingData, guest_count: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                      <input
                        type="text"
                        value={bookingData.purpose}
                        onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                        placeholder="e.g., Tournament practice, Casual play"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                        placeholder="Any special requests or additional information"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={(e) => setBookingData({...bookingData, equipment_needed: e.target.checked ? {} : {}})}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Equipment needed</span>
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Book Court
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtReservationsPage; 