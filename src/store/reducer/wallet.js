import { createSlice } from "@reduxjs/toolkit";

// ================= INITIAL STATE =================
const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

// ================= SLICE =================
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.data = action.payload;
    },

    clearWallet: (state) => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

// ================= EXPORTS =================
export const {
  setWallet,
  clearWallet,
  setLoading,
  setError,
} = walletSlice.actions;

// ================= SELECTORS =================
export const selectWalletData = (state) => state.wallet.data;
export const selectWalletLoading = (state) => state.wallet.isLoading;
export const selectWalletError = (state) => state.wallet.error;

export default walletSlice.reducer;
