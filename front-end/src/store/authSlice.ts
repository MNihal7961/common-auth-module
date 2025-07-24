import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  expiresAt: number | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  expiresAt: null,
};

export const refreshTokenThunk = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    if (!state.auth.userId || !state.auth.refreshToken) return rejectWithValue('No refresh token');
    try {
      const res = await axios.post('/auth/refresh', {
        userId: state.auth.userId,
        refreshToken: state.auth.refreshToken,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Refresh failed');
    }
  }
);

let refreshTimeout: any| null = null;

const scheduleRefresh = (dispatch: any, expiresAt: number) => {
  if (refreshTimeout) clearTimeout(refreshTimeout);
  const now = Date.now();
  const delay = expiresAt - now - 5000; // refresh 5s before expiry
  if (delay > 0) {
    refreshTimeout = setTimeout(() => {
      dispatch(refreshTokenThunk());
    }, delay);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      // decode userId and expiry from JWT
      try {
        const payload = JSON.parse(atob(action.payload.accessToken.split('.')[1]));
        state.userId = payload.sub;
        state.expiresAt = payload.exp ? payload.exp * 1000 : null;
      } catch {
        state.userId = null;
        state.expiresAt = null;
      }
      localStorage.setItem('auth', JSON.stringify(state));
    },
    clearAuth(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.expiresAt = null;
      localStorage.removeItem('auth');
      if (refreshTimeout) clearTimeout(refreshTimeout);
    },
    loadAuth(state) {
      const data = localStorage.getItem('auth');
      if (data) {
        const parsed = JSON.parse(data);
        state.accessToken = parsed.accessToken;
        state.refreshToken = parsed.refreshToken;
        state.userId = parsed.userId;
        state.expiresAt = parsed.expiresAt;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(refreshTokenThunk.fulfilled, (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      try {
        const payload = JSON.parse(atob(action.payload.accessToken.split('.')[1]));
        state.userId = payload.sub;
        state.expiresAt = payload.exp ? payload.exp * 1000 : null;
      } catch {
        state.userId = null;
        state.expiresAt = null;
      }
      localStorage.setItem('auth', JSON.stringify(state));
    });
    builder.addCase(refreshTokenThunk.rejected, (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.expiresAt = null;
      localStorage.removeItem('auth');
      if (refreshTimeout) clearTimeout(refreshTimeout);
    });
  },
});

export const { setAuth, clearAuth, loadAuth } = authSlice.actions;

export const setupAuthRefresh = (dispatch: any, expiresAt: number | null) => {
  if (expiresAt) scheduleRefresh(dispatch, expiresAt);
};

export default authSlice.reducer; 