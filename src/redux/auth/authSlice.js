import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: { name: null, email: null },
    userData: {
      weight: '',
      height: '',
      age: '',
      bloodType: '1',
      desiredWeight: '',
      dailyRate: 0,
      notAllowedFoods: [],
    },
    token: null,
    isLoggedIn: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      if (action.payload.user) state.user = action.payload.user;
      if (action.payload.token) state.token = action.payload.token;
      if (action.payload.refreshToken) state.refreshToken = action.payload.refreshToken;
      if (action.payload.sessionId) state.sessionId = action.payload.sessionId;
      state.isLoggedIn = true;
    },
    logOut: (state) => {
      state.user = { name: null, email: null };
      state.userData = {};
      state.token = null;
      state.refreshToken = null;
      state.sessionId = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('auth/login/fulfilled', (state, action) => {
        const { user, accessToken, refreshToken, sessionId } = action.payload;
        state.user = { name: user.name, email: user.email };
        const rawUserData = user.userData || {};
        state.userData = {
          ...rawUserData,
          notAllowedFoods: rawUserData.notAllowedProducts ?? rawUserData.notAllowedFoods ?? [],
        };
        state.token = accessToken;
        state.refreshToken = refreshToken;
        state.sessionId = sessionId;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase('auth/getCurrentUser/fulfilled', (state, action) => {
        state.user = { name: action.payload.name, email: action.payload.email };
        const rawUserData = action.payload.userData || {};
        state.userData = {
          ...rawUserData,
          notAllowedFoods: rawUserData.notAllowedProducts ?? rawUserData.notAllowedFoods ?? [],
        };
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase('auth/getCurrentUser/rejected', (state) => {
        state.isLoggedIn = false;
        state.token = null;
      })
      .addCase('auth/updateUserData/fulfilled', (state, action) => {
        
        const { dailyRate, notAllowedProducts, userData } = action.payload;
        state.userData = {
          ...(userData || state.userData),
          dailyRate: dailyRate ?? state.userData.dailyRate,
          notAllowedFoods: notAllowedProducts ?? state.userData.notAllowedFoods ?? [],
        };
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && !action.type.includes('getCurrentUser') && !action.type.includes('getDayInfo'),
        (state, action) => {
          state.error = action.payload || 'Bir hata oluştu';
        }
      );
  }
});

export const { setCredentials, logOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
