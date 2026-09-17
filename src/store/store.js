// store.js (or your store file)
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import authReducer from "@/store/reducer/auth";
import walletReducer from "@/store/reducer/wallet";
import { apiSlice } from "./initalState";

export const trackingLogo = "...";

export const Client_ID = import.meta.env.VITE_CLIENT_ID
  ? Number(import.meta.env.VITE_CLIENT_ID)
  : undefined;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "wallet"], // persist only these
};

const persistedAuth = persistReducer(persistConfig, authReducer);
const persistedWallet = persistReducer(persistConfig, walletReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: persistedAuth,
    wallet: persistedWallet,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);