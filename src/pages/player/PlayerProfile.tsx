import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { updateUser } from '../../store/slices/usersSlice';
import { AppDispatch, RootState } from '../../store';
import { updateUser as updateAuthUser, getProfile } from '../../store/slices/authSlice';
import { imageBaseURL } from '../../lib/const';
import { 
  MapPin, 
  Trophy,
  Target,
  Edit3,
  Save,
  X,
  Calendar,
  Eye,
  EyeOff,
  Shield,
  Camera,
  User,
  AlertTriangle
} from 'lucide-react';
import { api } from '../../lib/api';

const PlayerProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Debug: Monitor isEditing state changes
  useEffect(() => {
    console.log('isEditing state changed to:', isEditing);
  }, [isEditing]);

  // Debug: Monitor user authentication state
  useEffect(() => {
    console.log('Authentication state:', { isAuthenticated, userId: user?.id });
  }, [isAuthenticated, user?.id]);
  
  // Debug: Log authentication state
  console.log('🔐 PlayerProfile - Auth state:', {
    isAuthenticated,
    hasUser: !!user,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
    userId: user?.id
  });
  
  // Debug: Log user data including profile photo
  console.log('🖼️ PlayerProfile - User data:', {
    id: user?.id,
    username: user?.username,
    full_name: user?.full_name,
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    profile_photo: user?.profile_photo,
    hasProfilePhoto: !!user?.profile_photo,
    user_type: user?.user_type
  });
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    address: user?.address || '',
    dateOfBirth: user?.date_of_birth || '',
    gender: user?.gender || '',
    skillLevel: user?.skill_level || 'beginner',
    bio: user?.bio || 'Tell us about your pickleball journey...',
    profilePhoto: user?.profile_photo || '',
    timezone: user?.timezone || '',
    curp: user?.curp || '',
    canBeFound: user?.can_be_found ?? true,
    preferences: user?.preferences || {
      playing_style: 'all-around',
      show_contact_info: false,
      show_skill_level: true,
      preferred_match_types: ['singles', 'doubles'],
      preferred_playing_times: ['morning', 'afternoon', 'evening'],
      preferred_court_surfaces: ['indoor', 'outdoor'],
      preferred_playing_partners: 'any',
      notification_preferences: {
        email: true,
        sms: false,
        push: true
      }
    }
  });

  // Privacy settings state - use real user data as defaults
  const [privacySettings, setPrivacySettings] = useState({
    isVisibleInSearch: user?.can_be_found ?? true,
    showContactInfo: user?.preferences?.show_contact_info ?? false,
    showSkillLevel: user?.preferences?.show_skill_level ?? true
  });

  // Update profile data when user data changes
  React.useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.full_name || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        address: user.address || '',
        dateOfBirth: user.date_of_birth || '',
        gender: user.gender || '',
        skillLevel: user.skill_level || 'beginner',
        bio: user.bio || 'Tell us about your pickleball journey...',
        profilePhoto: user.profile_photo || '',
        timezone: user.timezone || '',
        curp: user.curp || '',
        canBeFound: user.can_be_found ?? true,
        preferences: user.preferences || {
          playing_style: 'all-around',
          show_contact_info: false,
          show_skill_level: true,
          preferred_match_types: ['singles', 'doubles'],
          preferred_playing_times: ['morning', 'afternoon', 'evening'],
          preferred_court_surfaces: ['indoor', 'outdoor'],
          preferred_playing_partners: 'any',
          notification_preferences: {
            email: true,
            sms: false,
            push: true
          }
        }
      });

      setPrivacySettings({
        isVisibleInSearch: user.can_be_found ?? true,
        showContactInfo: user.preferences?.show_contact_info ?? false,
        showSkillLevel: user.preferences?.show_skill_level ?? true
      });
    }
  }, [user]);

  // Mock player statistics
  const playerStats = {
    tournamentsPlayed: 12,
    tournamentsWon: 3,
    currentRanking: 45,
    totalMatches: 89,
    winRate: 67,
    averageScore: 21.5,
    bestScore: 25,
    skillLevel: 'Intermediate',
    playingStyle: 'All-Around',
    experience: '3 years',
    favoriteCourt: 'Central Park Courts',
    achievements: [
      'Tournament Champion - Spring 2024',
      'Most Improved Player - 2023',
      'Sportsmanship Award - 2022'
    ]
  };

  const handleSave = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to update your profile');
      return;
    }

    setIsSaving(true);
    try {
      // Update profile data using the correct backend endpoint
      const response = await api.put(`/auth/profile`, {
        full_name: profileData.fullName,
        phone: profileData.phone,
        city: profileData.city,
        state: profileData.state,
        address: profileData.address,
        date_of_birth: profileData.dateOfBirth,
        gender: profileData.gender,
        skill_level: profileData.skillLevel,
        bio: profileData.bio,
        timezone: profileData.timezone,
        curp: profileData.curp,
        can_be_found: profileData.canBeFound,
        preferences: {
          playing_style: profileData.preferences.playing_style,
          show_contact_info: privacySettings.showContactInfo,
          show_skill_level: privacySettings.showSkillLevel,
          preferred_match_types: profileData.preferences.preferred_match_types,
          preferred_playing_times: profileData.preferences.preferred_playing_times,
          preferred_court_surfaces: profileData.preferences.preferred_court_surfaces,
          preferred_playing_partners: profileData.preferences.preferred_playing_partners,
          notification_preferences: profileData.preferences.notification_preferences
        }
      });

      // Check if the response was successful
      if (response && typeof response === 'object' && 'status' in response && response.status === 200) {
        toast.success('Profile updated successfully!');
        
        // Update global auth state immediately
        const updatedUserData = {
          full_name: profileData.fullName,
          phone: profileData.phone,
          city: profileData.city,
          state: profileData.state,
          address: profileData.address,
          date_of_birth: profileData.dateOfBirth,
          gender: profileData.gender,
          skill_level: profileData.skillLevel,
          bio: profileData.bio,
          timezone: profileData.timezone,
          curp: profileData.curp,
          can_be_found: profileData.canBeFound,
          preferences: {
            playing_style: profileData.preferences.playing_style,
            show_contact_info: privacySettings.showContactInfo,
            show_skill_level: privacySettings.showSkillLevel,
            preferred_match_types: profileData.preferences.preferred_match_types,
            preferred_playing_times: profileData.preferences.preferred_playing_times,
            preferred_court_surfaces: profileData.preferences.preferred_court_surfaces,
            preferred_playing_partners: profileData.preferences.preferred_playing_partners,
            notification_preferences: profileData.preferences.notification_preferences
          }
        };
        
        dispatch(updateAuthUser(updatedUserData));
        
        // Force exit edit mode - this should make the Cancel button disappear
        setIsEditing(false);
        console.log('Edit mode set to false after successful save');
        
        // Also reset the saving state to ensure clean state
        setIsSaving(false);
        
        // No background refresh - just update the local state
        // The global auth state is already updated above
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.full_name || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        address: user.address || '',
        dateOfBirth: user.date_of_birth || '',
        gender: user.gender || '',
        skillLevel: user.skill_level || 'beginner',
        bio: user.bio || 'Tell us about your pickleball journey...',
        profilePhoto: user.profile_photo || '',
        timezone: user.timezone || '',
        curp: user.curp || '',
        canBeFound: user.can_be_found ?? true,
        preferences: user.preferences || {
          playing_style: 'all-around',
          show_contact_info: false,
          show_skill_level: true,
          preferred_match_types: ['singles', 'doubles'],
          preferred_playing_times: ['morning', 'afternoon', 'evening'],
          preferred_court_surfaces: ['indoor', 'outdoor'],
          preferred_playing_partners: 'any',
          notification_preferences: {
            email: true,
            sms: false,
            push: true
          }
        }
      });

      setPrivacySettings({
        isVisibleInSearch: user.can_be_found ?? true,
        showContactInfo: user.preferences?.show_contact_info ?? false,
        showSkillLevel: user.preferences?.show_skill_level ?? true
      });
    }
    
    // Exit edit mode immediately
    setIsEditing(false);
    
    // Reset saving state if it was active
    setIsSaving(false);
  };

  const updateField = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePrivacySetting = (setting: string, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to upload a photo');
      return;
    }

    if (!user?.id) {
      toast.error('User not found. Please log in again.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please log in again.');
      return;
    }

    console.log('Starting photo upload for user:', user.id);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });

    const formData = new FormData();
    formData.append('profile_photo', file);

    setIsUploadingPhoto(true);
    try {
      console.log('Making request to:', 'http://localhost:5000/api/v1/auth/profile/photo');
      
      // Don't set Content-Type header - let the browser set it for FormData
      const response = await fetch('http://localhost:5000/api/v1/auth/profile/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Remove Content-Type - browser will set it automatically for FormData
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response body:', result);

      if (result.success) {
        toast.success('Profile photo updated successfully!');
        // Update the user state to show the new photo immediately
        if (result.data?.profile_photo) {
          // Update Redux state
          dispatch(updateUser({ 
            id: user.id, 
            userData: { profile_photo: result.data.profile_photo } 
          }));
          
          // Update global auth state so dashboard reflects changes immediately
          dispatch(updateAuthUser({ profile_photo: result.data.profile_photo }));
          
          // Also update local state
          setProfileData(prev => ({
            ...prev,
            profilePhoto: result.data.profile_photo
          }));
          
          // Refresh user data from backend to ensure consistency
          refreshUserData();
        }
      } else {
        toast.error(result.message || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔍 handlePhotoChange called');
    console.log('Event:', event);
    console.log('Files:', event.target.files);
    
    const file = event.target.files?.[0];
    if (file) {
      console.log('✅ File selected:', file);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.log('❌ Invalid file type:', file.type);
        toast.error('Please select an image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log('❌ File too large:', file.size);
        toast.error('File size must be less than 5MB');
        return;
      }

      console.log('✅ File validation passed, starting upload');
      // Show preview and confirm upload
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          console.log('✅ FileReader loaded, calling handlePhotoUpload');
          handlePhotoUpload(file);
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.log('❌ No file selected');
    }
    
    // Reset the input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const triggerPhotoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const refreshUserData = async () => {
    try {
      await dispatch(getProfile());
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Authentication Warning */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Authentication Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Please log in to edit your profile and access all features.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode Status */}
        {isEditing && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Edit3 className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Edit Mode Active
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>You are currently editing your profile. Click "Save Changes" to save or "Cancel" to discard changes.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex justify-between items-center animate-on-scroll">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Player Profile</h1>
            <p className="text-gray-600">Manage your profile and preferences</p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                disabled={!isAuthenticated}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isAuthenticated ? 'Edit Profile' : 'Login to Edit'}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={!isAuthenticated || isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                {isEditing && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Hidden file input for photo upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <span>Basic Information</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={profileData.username}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={profileData.timezone}
                      onChange={(e) => updateField('timezone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="UTC-0">UTC-0 (GMT)</option>
                      <option value="UTC+1">UTC+1 (CET)</option>
                      <option value="UTC+2">UTC+2 (EET)</option>
                      <option value="UTC+3">UTC+3 (EEST)</option>
                      <option value="UTC+4">UTC+4 (MSK)</option>
                      <option value="UTC+5">UTC+5 (IST)</option>
                      <option value="UTC+6">UTC+6 (BST)</option>
                      <option value="UTC+7">UTC+7 (CST)</option>
                      <option value="UTC+8">UTC+8 (CST)</option>
                      <option value="UTC+9">UTC+9 (JST)</option>
                      <option value="UTC+10">UTC+10 (EST)</option>
                      <option value="UTC+11">UTC+11 (EST)</option>
                      <option value="UTC+12">UTC+12 (EST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CURP</label>
                    <input
                      type="text"
                      value={profileData.curp}
                      onChange={(e) => updateField('curp', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Playing Preferences */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span>Playing Preferences</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                    <select
                      value={profileData.skillLevel}
                      onChange={(e) => updateField('skillLevel', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Playing Style</label>
                    <select
                      value={profileData.preferences.playing_style}
                      onChange={(e) => updateField('preferences', { ...profileData.preferences, playing_style: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="all-around">All-Around</option>
                      <option value="aggressive">Aggressive</option>
                      <option value="defensive">Defensive</option>
                      <option value="strategic">Strategic</option>
                      <option value="power">Power Player</option>
                      <option value="finesse">Finesse Player</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Match Types</label>
                    <div className="space-y-2">
                      {['singles', 'doubles', 'mixed_doubles'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profileData.preferences.preferred_match_types.includes(type)}
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...profileData.preferences.preferred_match_types, type]
                                : profileData.preferences.preferred_match_types.filter(t => t !== type);
                              updateField('preferences', { ...profileData.preferences, preferred_match_types: newTypes });
                            }}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Playing Times</label>
                    <div className="space-y-2">
                      {['morning', 'afternoon', 'evening'].map((time) => (
                        <label key={time} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profileData.preferences.preferred_playing_times.includes(time)}
                            onChange={(e) => {
                              const newTimes = e.target.checked
                                ? [...profileData.preferences.preferred_playing_times, time]
                                : profileData.preferences.preferred_playing_times.filter(t => t !== time);
                              updateField('preferences', { ...profileData.preferences, preferred_playing_times: newTimes });
                            }}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span className="text-sm capitalize">{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Court Surfaces</label>
                    <div className="space-y-2">
                      {['indoor', 'outdoor'].map((surface) => (
                        <label key={surface} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profileData.preferences.preferred_court_surfaces.includes(surface)}
                            onChange={(e) => {
                              const newSurfaces = e.target.checked
                                ? [...profileData.preferences.preferred_court_surfaces, surface]
                                : profileData.preferences.preferred_court_surfaces.filter(s => s !== surface);
                              updateField('preferences', { ...profileData.preferences, preferred_court_surfaces: newSurfaces });
                            }}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span className="text-sm capitalize">{surface}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Playing Partners</label>
                    <select
                      value={profileData.preferences.preferred_playing_partners}
                      onChange={(e) => updateField('preferences', { ...profileData.preferences, preferred_playing_partners: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="any">Any Skill Level</option>
                      <option value="similar">Similar Skill Level</option>
                      <option value="higher">Higher Skill Level</option>
                      <option value="lower">Lower Skill Level</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Tell us about your pickleball journey..."
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <span>Privacy Settings</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Visible in Search</h4>
                      <p className="text-sm text-gray-600">Allow other players to find you</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.isVisibleInSearch}
                        onChange={(e) => updatePrivacySetting('isVisibleInSearch', e.target.checked)}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Show Contact Info</h4>
                      <p className="text-sm text-gray-600">Display phone and email to other players</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showContactInfo}
                        onChange={(e) => updatePrivacySetting('showContactInfo', e.target.checked)}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Show Skill Level</h4>
                      <p className="text-sm text-gray-600">Display your skill level to other players</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showSkillLevel}
                        onChange={(e) => updatePrivacySetting('showSkillLevel', e.target.checked)}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Preferences */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <span>Advanced Preferences</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
                    <div className="space-y-2">
                      {[
                        { key: 'email', label: 'Email Notifications' },
                        { key: 'sms', label: 'SMS Notifications' },
                        { key: 'push', label: 'Push Notifications' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profileData.preferences.notification_preferences[key]}
                            onChange={(e) => {
                              const newPrefs = {
                                ...profileData.preferences.notification_preferences,
                                [key]: e.target.checked
                              };
                              updateField('preferences', { 
                                ...profileData.preferences, 
                                notification_preferences: newPrefs 
                              });
                            }}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span className="text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Settings</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profileData.canBeFound}
                          onChange={(e) => updateField('canBeFound', e.target.checked)}
                          disabled={!isEditing}
                          className="mr-2"
                        />
                        <span className="text-sm">Visible in Player Search</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings.showContactInfo}
                          onChange={(e) => updatePrivacySetting('showContactInfo', e.target.checked)}
                          disabled={!isEditing}
                          className="mr-2"
                        />
                        <span className="text-sm">Show Contact Information</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings.showSkillLevel}
                          onChange={(e) => updatePrivacySetting('showSkillLevel', e.target.checked)}
                          disabled={!isEditing}
                          className="mr-2"
                        />
                        <span className="text-sm">Show Skill Level</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Photo & Stats */}
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-pink-500" />
                  <span>Profile Photo</span>
                </h3>
              </div>
              <div className="p-6 text-center">
                {profileData.profilePhoto ? (
                  <img
                    src={profileData.profilePhoto.startsWith('http') ? profileData.profilePhoto : `${imageBaseURL}${profileData.profilePhoto}`}
                    alt="Profile Photo"
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold text-4xl mx-auto mb-4">
                    {profileData.fullName ? getInitials(profileData.fullName) : ''}
                  </div>
                )}
                {isEditing && (
                  <button 
                    onClick={() => {
                      console.log('🔍 Change Photo button clicked');
                      triggerPhotoUpload();
                    }}
                    disabled={isUploadingPhoto}
                    className="w-full px-4 py-2 text-blue-600 hover:text-blue-800 text-sm border border-blue-300 rounded-md hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
                  </button>
                )}
              </div>
            </div>

            {/* Player Statistics */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Player Statistics</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tournaments Played</span>
                    <span className="font-semibold text-blue-600">{playerStats.tournamentsPlayed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tournaments Won</span>
                    <span className="font-semibold text-green-600">{playerStats.tournamentsWon}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Ranking</span>
                    <span className="font-semibold text-purple-600">#{playerStats.currentRanking}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Matches</span>
                    <span className="font-semibold text-gray-900">{playerStats.totalMatches}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Win Rate</span>
                    <span className="font-semibold text-green-600">{playerStats.winRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="font-semibold text-blue-600">{playerStats.averageScore}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Current Status</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Skill Level</span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(playerStats.skillLevel)}`}>
                      {playerStats.skillLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Playing Style</span>
                    <span className="font-medium text-gray-900">{playerStats.playingStyle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="font-medium text-gray-900">{playerStats.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Favorite Court</span>
                    <span className="font-medium text-gray-900">{playerStats.favoriteCourt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-on-scroll">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Recent Achievements</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {playerStats.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile; 