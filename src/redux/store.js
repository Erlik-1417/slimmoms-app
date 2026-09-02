import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './auth/authSlice';
import { diaryReducer } from './diary/diarySlice';
import { loaderReducer } from './loader/loaderSlice';

const persistConfig = {
  key: 'auth',
  storage: storage.default || storage,
  whitelist: ['token', 'refreshToken', 'sessionId', 'user']
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authReducer),
    diary: diaryReducer,
    loader: loaderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
