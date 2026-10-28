import { apiSlice } from "../initalState";

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE COURSE =================
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "/api/courses",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: courseData,
      }),
      invalidatesTags: ["Course"],
    }),

    // ================= GET ALL COURSES =================
    getAllCourses: builder.query({
      query: () => ({
        url: "/api/courses",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    showCourseOnlyInstructor: builder.query({
      query: ({ userId, id }) => ({
        url: `/api/courses/instructor/${userId}`,
        method: "GET",
        params: id ? { course_id: id } : undefined,
      }),
      providesTags: ["Course"],
    }),
    // ================= GET COURSE BY ID =================
    getCourseById: builder.query({
      query: (id) => ({
        url: `/api/courses/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    // ================= UPDATE COURSE =================
updateCourse: builder.mutation({
  query: ({ id, data }) => ({
    url: `/api/courses/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: data,
  }),
  invalidatesTags: (result, error, { id }) => [{ type: "Course", id }, "Course"],
}),


    // ================= DELETE COURSE =================
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/api/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useShowCourseOnlyInstructorQuery,
} = courseApiSlice;
