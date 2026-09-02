
import axios from './axiosConfig';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCredentials, logOut } from './authSlice';

const setAuthHeader = token => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

export const register = createAsyncThunk('auth/register', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post('/users/register', credentials);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logIn = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post('/users/login', credentials);
    setAuthHeader(res.data.accessToken);
    thunkAPI.dispatch(setCredentials({ 
      user: res.data.user, 
      token: res.data.accessToken, 
      refreshToken: res.data.refreshToken, 
      sessionId: res.data.sessionId 
    }));
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logoutOperation = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.post('/users/logout', {}, {
      headers: { Authorization: axios.defaults.headers.common.Authorization }
    });
    clearAuthHeader();
    thunkAPI.dispatch(logOut());
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateUserDataOperation = createAsyncThunk(
  'auth/updateUserData',
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post('/calculator/private', userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.token;

  if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Unable to fetch user');
  }

  try {
      setAuthHeader(persistedToken);
      const res = await axios.get('/users/current');
      return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
