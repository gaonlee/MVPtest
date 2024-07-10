import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || '',
  isAdmin: localStorage.getItem('isAdmin') === 'true',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, isAdmin } = action.payload;
      state.token = token;
      state.isAdmin = isAdmin;
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', isAdmin);
    },
    logout: (state) => {
      state.token = '';
      state.isAdmin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
