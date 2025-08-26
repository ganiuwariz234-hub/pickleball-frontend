import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import usersReducer from './slices/usersSlice'
import clubsReducer from './slices/clubsSlice'
import tournamentsReducer from './slices/tournamentsSlice'
import courtsReducer from './slices/courtsSlice'
import paymentsReducer from './slices/paymentsSlice'
import rankingsReducer from './slices/rankingsSlice'
import adminRankingsReducer from './slices/rankingsSlice'
import notificationsReducer from './slices/notificationsSlice'
import adminReducer from './slices/adminSlice'
import adminMessagesReducer from './slices/adminMessagesSlice'
import affiliationsReducer from './slices/affiliationsSlice'
import statsReducer from './slices/statsSlice'
import bannersReducer from './slices/bannersSlice'
import playerFinderReducer from './slices/playerFinderSlice'
import courtReservationsReducer from './slices/courtReservationsSlice'
import pendingReducer from './slices/pendingSlice'
import digitalCredentialsReducer from './slices/digitalCredentialsSlice'
import playerDashboardReducer from './slices/playerDashboardSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    clubs: clubsReducer,
    tournaments: tournamentsReducer,
    courts: courtsReducer,
    payments: paymentsReducer,
    rankings: rankingsReducer,
    adminRankings: adminRankingsReducer,
    notifications: notificationsReducer,
    admin: adminReducer,
    adminMessages: adminMessagesReducer,
    affiliations: affiliationsReducer,
    stats: statsReducer,
    banners: bannersReducer,
    playerFinder: playerFinderReducer,
    courtReservations: courtReservationsReducer,
    pending: pendingReducer,
    digitalCredentials: digitalCredentialsReducer,
    playerDashboard: playerDashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 