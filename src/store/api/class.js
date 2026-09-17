import { apiSlice } from "../initalState";

export const classApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE CLASS =================
    createClass: builder.mutation({
      query: (classData) => ({
        url: "/api/classes",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: classData,
      }),
      invalidatesTags: ["Class"],
    }),

    // ================= GET ALL CLASSES =================
    getAllClasses: builder.query({
      query: () => ({
        url: "/api/classes",
        method: "GET",
      }),
      providesTags: ["Class"],
    }),
    getClientRoleForClass: builder.query({
      query: ({clientId, classId}) => ({
        url: `/api/classes/role/${clientId}/${classId}`,
        method: "GET",
      }),
      providesTags: ["Class"],
    }),

    // ================= GET CLASSES BY COURSE =================
    getClassesByCourse: builder.query({
      query: (courseId) => ({
        url: `/api/classes/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [
        { type: "Class", id: courseId },
      ],
    }),

    // ================= UPDATE CLASS =================
    updateClass: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/classes/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),

    // ================= DELETE CLASS =================
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/api/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateClassMutation,
  useGetAllClassesQuery,
  useGetClassesByCourseQuery,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useGetClientRoleForClassQuery
} = classApiSlice;
