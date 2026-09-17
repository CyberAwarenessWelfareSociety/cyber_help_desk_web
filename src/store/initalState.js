import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout } from "./reducer/auth";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

if (!SERVER_URL) {
  console.error("SERVER_URL is not defined in environment variables");
}

// ================= HELPERS =================
export const getToken = () => {
  try {
    const authDataString = localStorage.getItem("auth");
    if (!authDataString) return null;

    const authData = JSON.parse(authDataString);
    return authData?.token ?? null;
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    return null;
  }
};

export const getApiKeys = () => {
  try {
    const authDataString = localStorage.getItem("auth");
    if (!authDataString) return null;

    const authData = JSON.parse(authDataString);
    return Array.isArray(authData?.apiKeys) ? authData.apiKeys : null;
  } catch (error) {
    console.error("Error getting apiKeys from localStorage:", error);
    return null;
  }
};

// ================= BASE QUERY =================
const rawBaseQuery = fetchBaseQuery({
  baseUrl: SERVER_URL,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const apiKeys = getApiKeys();
    if (apiKeys?.length) {
      headers.set("x-api-key", apiKeys[0]);
    }

    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// ================= RE-AUTH HANDLER =================
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.warn("Unauthorized – logging out");

    localStorage.removeItem("auth");
    api.dispatch(logout());

    // Optional retry (usually not needed after logout)
    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
};

// ================= API SLICE =================
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    userDetail: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useUserDetailQuery } = apiSlice;
