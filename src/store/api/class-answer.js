import { apiSlice } from "../initalState";

export const answerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ================= SUBMIT ANSWER =================
    submitAnswer: builder.mutation({
      query: (answerData) => ({
        url: "/api/answers",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: answerData,
      }),
      invalidatesTags: ["Answer"],
    }),

    // ================= GET CLASS RESULT =================
    getClassResult: builder.query({
      query: ({ clientId, classId }) => ({
        url: `/api/answers/result/${clientId}/${classId}`,
        method: "GET",
      }),
      providesTags: (result, error, { clientId, classId }) => [
        { type: "Answer", id: `${clientId}-${classId}` },
      ],
    }),

    // ================= TEACHER / ADMIN CLASS RESULTS =================
    getClassQuizStats: builder.query({
      query: (classId) => ({
        url: `/api/answers/classes/${classId}/quiz-stats`,
        method: "GET",
      }),
      providesTags: (result, error, classId) => [
        { type: "Answer", id: `stats-${classId}` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useSubmitAnswerMutation,
  useGetClassResultQuery,
  useGetClassQuizStatsQuery,
} = answerApiSlice;
