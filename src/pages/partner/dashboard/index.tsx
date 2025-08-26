import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { AppDispatch } from '../../../store';
import { 
  fetchPartnerStats, 
  fetchPartnerCourts, 
  fetchPartnerBookings, 
  fetchPartnerCustomers, 
  fetchPartnerMaintenance, 
  fetchPartnerFinancialData, 
  fetchPartnerMicrosite 
} from '../../../store/slices/partnerDashboardSlice';
import Overview from './Overview';
import CourtManagement from './CourtManagement';
import Bookings from './Bookings';
import Customers from './Customers';
import Maintenance from './Maintenance';
import Microsite from './Microsite';
import Analytics from './Analytics';

const PartnerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    partnerStats, 
    allCourts, 
    allBookings, 
    allCustomers, 
    maintenanceItems, 
    financialData, 
    micrositeConfig,
    loading,
    error 
  } = useSelector((state: RootState) => state.partnerDashboard);
  
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all dashboard data on component mount
  useEffect(() => {
    if (user?.partner_id) {
      dispatch(fetchPartnerStats(user.partner_id));
      dispatch(fetchPartnerCourts(user.partner_id));
      dispatch(fetchPartnerBookings(user.partner_id));
      dispatch(fetchPartnerCustomers(user.partner_id));
      dispatch(fetchPartnerMaintenance(user.partner_id));
      dispatch(fetchPartnerFinancialData(user.partner_id));
      dispatch(fetchPartnerMicrosite(user.partner_id));
    }
  }, [dispatch, user?.partner_id]);

  // Loading state
  if (loading && !partnerStats) {
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
  if (error && !partnerStats) {
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
            Welcome back, {user?.username || 'Partner'}!
          </h1>
          <p className="text-gray-600">
            Here's your business overview and management dashboard.
          </p>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-8 animate-on-scroll">
          {/* Custom Tabs Implementation */}
          <div className="w-full">
            {/* Tab Navigation */}
            <div className="grid w-full grid-cols-7 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('courts')}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'courts'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Courts
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'bookings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'customers'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Customers
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'maintenance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Maintenance
              </button>
              <button
                onClick={() => setActiveTab('microsite')}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'microsite'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Microsite
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="animate-on-scroll">
                  <Overview 
                    partnerStats={partnerStats}
                    allCourts={allCourts || []}
                    allBookings={allBookings || []}
                    financialData={financialData}
                  />
                </div>
              )}

              {/* Courts Tab */}
              {activeTab === 'courts' && (
                <div className="animate-on-scroll">
                  <CourtManagement allCourts={allCourts || []} />
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="animate-on-scroll">
                  <Bookings allBookings={allBookings || []} />
                </div>
              )}

              {/* Customers Tab */}
              {activeTab === 'customers' && (
                <div className="animate-on-scroll">
                  <Customers customers={allCustomers || []} />
                </div>
              )}

              {/* Maintenance Tab */}
              {activeTab === 'maintenance' && (
                <div className="animate-on-scroll">
                  <Maintenance maintenanceSchedule={maintenanceItems || []} />
                </div>
              )}

              {/* Microsite Tab */}
              {activeTab === 'microsite' && (
                <div className="animate-on-scroll">
                  <Microsite micrositeConfig={micrositeConfig} />
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="animate-on-scroll">
                  <Analytics financialData={financialData} partnerStats={partnerStats} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard; 