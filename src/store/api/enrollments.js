import { apiSlice } from "../initalState";

export const enrollmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE ENROLLMENT =================
    createEnrollment: builder.mutation({
      query: (enrollmentData) => ({
        url: "/api/enrollments",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: enrollmentData,
      }),
      invalidatesTags: ["Enrollment"],
    }),

    // ================= GET ALL ENROLLMENTS =================
    getAllEnrollments: builder.query({
      query: () => ({
        url: "/api/enrollments",
        method: "GET",
      }),
      providesTags: ["Enrollment"],
    }),

    // ================= GET ENROLLMENTS BY CLIENT =================
    getEnrollmentsByClient: builder.query({
      query: (clientId) => ({
        url: `/api/enrollments/client/${clientId}`,
        method: "GET",
      }),
      providesTags: (result, error, clientId) => [
        { type: "Enrollment", id: clientId },
      ],
    }),

    // ================= GET ENROLLMENT BY ID =================
    getEnrollmentById: builder.query({
      query: (id) => ({
        url: `/api/enrollments/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Enrollment", id }],
    }),
    checkEnrollment: builder.query({
      query: ({ courseId, userId }) => ({
        url: `/api/enrollments/check-enrollment`,
        params: { courseId, userId },
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Enrollment", id }],
    }),
    // ================= UPDATE ENROLLMENT =================
    updateEnrollment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/enrollments/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Enrollment", id },
        "Enrollment",
      ],
    }),

    // ================= DELETE ENROLLMENT =================
    deleteEnrollment: builder.mutation({
      query: (id) => ({
        url: `/api/enrollments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enrollment"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateEnrollmentMutation,
  useGetAllEnrollmentsQuery,
  useGetEnrollmentsByClientQuery,
  useGetEnrollmentByIdQuery,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useCheckEnrollmentQuery,
} = enrollmentApiSlice;
