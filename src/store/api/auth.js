import { apiSlice } from "../initalState";

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["send-otp", "check-role", "clients", "banner", "gallery"],
});

export const authApiSlice = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    // ================= AUTH =================
    login: builder.mutation({
      query: (credentials) => {
        return {
          url: "/api/login",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: credentials,
        };
      },
    }),
    loginStep1: builder.mutation({
      query: (credentials) => ({
        url: "/api/login/v1/step1",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),
    loginStep2: builder.mutation({
      query: (credentials) => ({
        url: "/api/login/v1/step2",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),
    googleAuth: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/google",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),
    appleAuth: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/apple",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),
    getDetail: builder.query({
      query: (credentials) => {
        console.log(credentials);
        return {
          url: "/api/me",
params: { token: credentials },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),

    register: builder.mutation({
      query: (credentials) => {
        console.log(credentials);
        return {
          url: "/api/clients",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: credentials,
        };
      },
    }),

    logout: builder.mutation({
      query: (credentials) => {
        return {
          url: "/api/logout",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: credentials,
        };
      },
    }),

    // ================= FILE UPLOAD =================
    upload_File: builder.mutation({
      query: (credentials) => {
        console.log(credentials);
        return {
          url: "https://qiktrack.com/api/aws/upload-file",
          method: "POST",
          body: credentials,
        };
      },
    }),

    // ================= OTP & ROLE =================
    check_role: builder.mutation({
      query: (credentials) => {
        console.log(credentials);
        return {
          url: "/api/check-role",
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["check-role"],
    }),

    send_otp: builder.mutation({
      query: (credentials) => {
        console.log(credentials);
        return {
          url: "/api/send-otp",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: credentials,
        };
      },
    }),

    send_otp_registration: builder.mutation({
      query: (credentials) => ({
        url: "/api/send-pre-registration-otp",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),

    forgot_password: builder.mutation({
      query: (credentials) => ({
        url: "/api/forgot-password",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),

    reset_password: builder.mutation({
      query: (credentials) => {
        console.log(credentials);
        return {
          url: "/api/reset-password",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: credentials,
        };
      },
    }),

    // ================= BANNER =================
    getbanner: builder.query({
      query: ({ companyId, name }) => ({
        url: "/api/get-banner",
        method: "GET",
        params: { companyId, name },
      }),
      keepUnusedDataFor: 0,
      providesTags: ["banner"],
    }),

    // ================= GALLERY =================
    getgallery: builder.query({
      query: ({ companyId, name, pageSize, page }) => ({
        url: "/api/get-gallery",
        method: "GET",
        params: {
          companyId,
          name,
          limit: pageSize,
          page,
        },
      }),
      keepUnusedDataFor: 0,
      providesTags: ["gallery"],
    }),

    getgalleryID: builder.query({
      query: (id) => ({
        url: `/api/gallery/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["gallery"],
    }),

    create_gallery: builder.mutation({
      query: (credentials) => ({
        url: "/api/create-gallery",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
      invalidatesTags: ["gallery"],
    }),

    edit_gallery: builder.mutation({
      query: (credentials) => {
        console.log(credentials);
        return {
          url: `/api/update-gallery/${credentials.id}`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: credentials,
        };
      },
      invalidatesTags: ["gallery"],
    }),

    delete_gallery: builder.mutation({
      query: (id) => ({
        url: `/api/Delete-gallery/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["gallery"],
    }),

    // ================= ORDER =================
    order: builder.mutation({
      query: (credentials) => ({
        url: "/api/order",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),
  }),
  overrideExisting: true,
});

// ================= HOOK EXPORTS =================
export const {
  useLoginMutation,
  useLoginStep1Mutation,
  useLoginStep2Mutation,
  useGoogleAuthMutation,
  useAppleAuthMutation,
  useSend_otpMutation,
  useReset_passwordMutation,
  useUpload_FileMutation,
  useCheck_roleMutation,
  useLogoutMutation,
  useSend_otp_registrationMutation,
  useRegisterMutation,
  useForgot_passwordMutation,
  useGetbannerQuery,
  useGetgalleryQuery,
  useCreate_galleryMutation,
  useEdit_galleryMutation,
  useDelete_galleryMutation,
  useGetgalleryIDQuery,
  useOrderMutation,
  useGetDetailQuery,
} = authApiSlice;
