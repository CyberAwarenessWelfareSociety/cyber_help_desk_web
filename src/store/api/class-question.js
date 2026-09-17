import { apiSlice } from "../initalState";

export const questionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE QUESTION =================
    createQuestion: builder.mutation({
      query: (questionData) => ({
        url: "/api/questions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: questionData,
      }),
      invalidatesTags: ["Question"],
    }),

    // ================= GET QUESTIONS BY CLASS =================
    getQuestionsByClass: builder.query({
      query: (classId) => ({
        url: `/api/questions/${classId}`,
        method: "GET",
      }),
      providesTags: (result, error, classId) => [
        { type: "Question", id: classId },
      ],
    }),

    // ================= GET ALL QUESTIONS =================
    getAllQuestions: builder.query({
      query: () => ({
        url: "/api/questions",
        method: "GET",
      }),
      providesTags: ["Question"],
    }),

    // ================= UPDATE QUESTION =================
    updateQuestion: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/questions/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Question", id },
        "Question",
      ],
    }),

    // ================= DELETE QUESTION =================
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/api/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Question"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateQuestionMutation,
  useGetQuestionsByClassQuery,
  useGetAllQuestionsQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApiSlice;
