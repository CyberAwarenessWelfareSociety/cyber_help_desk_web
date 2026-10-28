import { createSlice } from "@reduxjs/toolkit";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "SUPERADMIN"];

export const getClientRole = (client) =>
  String(
    client?.role ||
      client?.client_type ||
      client?.clientType ||
      client?.type ||
      "USER",
  )
    .trim()
    .toUpperCase();

export const isAdminUser = (client) => ADMIN_ROLES.includes(getClientRole(client));

export const isTeacherUser = (client) =>
  isAdminUser(client) ||
  client?.isteacher === true ||
  client?.isteacher === 1 ||
  String(client?.isteacher || "").trim().toLowerCase() === "true";

const normalizeUser = (client) => {
  if (!client) return null;
  const role = getClientRole(client);

  return {
    ...client,
    role,
    client_type: role,
    isteacher: isTeacherUser({ ...client, role }),
  };
};

// ================= INITIAL STATE =================
const initialState = {
  token: null,
  user: null,
  apiKeys: null,
  isLoading: false,
  error: null,
};

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.apiKeys = action.payload.apiKeys;
      state.isLoading = false;
      state.error = null;
    },

    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.apiKeys = null;
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

// ================= ASYNC ACTIONS =================
export const saveAuthToStorage =
  (loginResponse) =>
  (dispatch) => {
    try {
      dispatch(setLoading(true));
      const client = loginResponse?.client || loginResponse?.user;
      if (!loginResponse?.token || !client) {
        throw new Error("Invalid login response");
      }

      const role = getClientRole(client);

      const authData = {
        token: loginResponse.token,
        user: {
          id: client.id,
          phone: client.phone || null,
          name: (client.name || "User").trim(),
          email: client.email || null,
          role,
          client_type: role,
          isteacher: isTeacherUser(client),
          aadhar_access: Boolean(client.aadhar_access),
          billing_method: client.billing_method || null,
          avatar: client.avatar || null,
        },
        apiKeys: loginResponse.apiKeys || null,
      };

      // ✅ Save to localStorage
      localStorage.setItem("auth", JSON.stringify(authData));

      dispatch(setAuth(authData));
    } catch (error) {
      dispatch(setError(error?.message || "Failed to save auth data"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const loadAuthFromStorage = () => (dispatch) => {
  try {
    dispatch(setLoading(true));

    const authDataString = localStorage.getItem("auth");
    if (!authDataString) return;

    const authData = JSON.parse(authDataString);

    if (authData?.token && authData?.user?.id) {
      const normalizedAuthData = {
        ...authData,
        user: normalizeUser(authData.user),
      };
      localStorage.setItem("auth", JSON.stringify(normalizedAuthData));
      dispatch(setAuth(normalizedAuthData));
    } else {
      localStorage.removeItem("auth");
    }
  } catch (error) {
    dispatch(setError(error?.message || "Failed to load auth data"));
    localStorage.removeItem("auth");
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => (dispatch) => {
  try {
    localStorage.removeItem("auth");
    dispatch(clearAuth());
  } catch (error) {
    dispatch(setError(error?.message || "Failed to logout"));
  }
};

// ================= EXPORTS =================
export const {
  setAuth,
  clearAuth,
  setLoading,
  setError,
} = authSlice.actions;

// ================= SELECTORS =================
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectApiKeys = (state) => state.auth.apiKeys;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
