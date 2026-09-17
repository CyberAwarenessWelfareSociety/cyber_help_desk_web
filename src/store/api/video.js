// src/redux/api/videosApiSlice.js
import { apiSlice } from "../initalState";

export const videosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // ✅ CREATE VIDEO
    // body: { class_id, title, video_url, duration, thumbnail, description, order_no, is_preview, is_published, is_skippable, min_watch_percent }
    // =========================
    createVideo: builder.mutation({
      query: (body) => ({
        url: "/api/videos",
        method: "POST",
        body, // ✅ direct body
      }),
      invalidatesTags: (result) =>
        result?.data?.class_id
          ? [
              "videos",
              { type: "videos", id: `class-${result.data.class_id}` },
              "videoProgress",
            ]
          : ["videos", "videoProgress"],
    }),

    // =========================
    // ✅ GET ALL VIDEOS (with optional query params)
    // queryParams: { class_id, q, is_published, is_preview, page, limit }
    // =========================
    getAllVideos: builder.query({
      query: (queryParams = {}) => ({
        url: "/api/videos",
        method: "GET",
        params: queryParams,
      }),
      providesTags: ["videos"],
    }),

    // =========================
    // ✅ GET VIDEOS BY CLASS (order wise)
    // classId: string | number
    // optional query: { is_published, is_preview }
    // =========================
    getVideosByClass: builder.query({
      query: ({ classId, params = {} }) => ({
        url: `/api/videos/class/${classId}`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, arg) => [
        "videos",
        { type: "videos", id: `class-${arg?.classId}` },
      ],
    }),

    // =========================
    // ✅ GET VIDEO BY ID
    // id: string | number
    // =========================
    getVideoById: builder.query({
      query: (id) => ({
        url: `/api/videos/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "videos", id: `video-${id}` }],
    }),

    // =========================
    // ✅ UPDATE VIDEO
    // arg: { id, ...rest } OR any object containing id
    // ✅ sends FULL arg directly in body
    // =========================
    updateVideo: builder.mutation({
      query: (body) => {
        if (!body?.id) throw new Error("updateVideo: 'id' is required in body");
        return {
          url: `/api/videos/${body.id}`,
          method: "PUT",
          body, // ✅ direct body (includes id too if you want)
        };
      },
      invalidatesTags: (result, error, body) => [
        "videos",
        "videoProgress",
        { type: "videos", id: `video-${body?.id}` },
        body?.class_id ? { type: "videos", id: `class-${body.class_id}` } : null,
      ].filter(Boolean),
    }),

    // =========================
    // ✅ DELETE VIDEO
    // body: { id, class_id? }
    // =========================
    deleteVideo: builder.mutation({
      query: (body) => {
        if (!body?.id) throw new Error("deleteVideo: 'id' is required in body");
        return {
          url: `/api/videos/${body.id}`,
          method: "DELETE",
          body, // ✅ direct body (optional; backend usually ignores body for delete, but you asked direct)
        };
      },
      invalidatesTags: (result, error, body) => [
        "videos",
        "videoProgress",
        { type: "videos", id: `video-${body?.id}` },
        body?.class_id ? { type: "videos", id: `class-${body.class_id}` } : null,
      ].filter(Boolean),
    }),

    // =========================
    // ✅ REORDER BULK
    // body: { class_id, order: [{ id, order_no }] }
    // =========================
    reorderVideosBulk: builder.mutation({
      query: (body) => ({
        url: "/api/videos/reorder/bulk",
        method: "PUT",
        body, // ✅ direct body
      }),
      invalidatesTags: (result, error, body) => [
        "videos",
        body?.class_id ? { type: "videos", id: `class-${body.class_id}` } : null,
      ].filter(Boolean),
    }),

    // ==========================================================
    // ✅ VIDEO PROGRESS / TRACKING APIs
    // ==========================================================

    // -------------------------
    // ✅ UPSERT PROGRESS
    // body: { client_id, video_id, enrollment_id?, last_position, watched_seconds, watch_percent }
    // -------------------------
    upsertVideoProgress: builder.mutation({
      query: (body) => ({
        url: "/api/videos/progress/update",
        method: "POST",
        body, // ✅ direct body
      }),
      invalidatesTags: (result, error, body) => [
        "videoProgress",
        body?.video_id ? { type: "videoProgress", id: `video-${body.video_id}` } : null,
      ].filter(Boolean),
    }),

    // -------------------------
    // ✅ COMPLETE VIDEO
    // body: { client_id, video_id, enrollment_id? }
    // -------------------------
    completeVideo: builder.mutation({
      query: (body) => ({
        url: "/api/videos/progress/complete",
        method: "POST",
        body, // ✅ direct body
      }),
      invalidatesTags: (result, error, body) => [
        "videoProgress",
        body?.video_id ? { type: "videoProgress", id: `video-${body.video_id}` } : null,
        "videos",
      ].filter(Boolean),
    }),

    // -------------------------
    // ✅ SKIP VIDEO
    // body: { client_id, video_id, enrollment_id? }
    // -------------------------
    skipVideo: builder.mutation({
      query: (body) => ({
        url: "/api/videos/progress/skip",
        method: "POST",
        body, // ✅ direct body
      }),
      invalidatesTags: (result, error, body) => [
        "videoProgress",
        body?.video_id ? { type: "videoProgress", id: `video-${body.video_id}` } : null,
        "videos",
      ].filter(Boolean),
    }),

    // -------------------------
    // ✅ GET MY PROGRESS FOR VIDEO
    // arg: { videoId, client_id, enrollment_id? }
    // GET /progress/me/:video_id?client_id=...&enrollment_id=...
    // -------------------------
    getMyProgressForVideo: builder.query({
      query: ({ videoId, client_id, enrollment_id }) => ({
        url: `/api/videos/progress/me/${videoId}`,
        method: "GET",
        params: { client_id, enrollment_id },
      }),
      providesTags: (result, error, arg) => [
        "videoProgress",
        { type: "videoProgress", id: `video-${arg?.videoId}` },
      ],
    }),

    // -------------------------
    // ✅ GET MY PROGRESS FOR CLASS
    // arg: { classId, client_id, enrollment_id? }
    // GET /progress/class/:class_id?client_id=...&enrollment_id=...
    // -------------------------
    getMyProgressForClass: builder.query({
      query: ({ classId, client_id, enrollment_id }) => ({
        url: `/api/videos/progress/class/${classId}`,
        method: "GET",
        params: { client_id, enrollment_id },
      }),
      providesTags: (result, error, arg) => [
        "videoProgress",
        { type: "videoProgress", id: `class-${arg?.classId}` },
      ],
    }),
  }),

  overrideExisting: true,
});

export const {
  // videos
  useCreateVideoMutation,
  useGetAllVideosQuery,
  useGetVideosByClassQuery,
  useGetVideoByIdQuery,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useReorderVideosBulkMutation,

  // progress
  useUpsertVideoProgressMutation,
  useCompleteVideoMutation,
  useSkipVideoMutation,
  useGetMyProgressForVideoQuery,
  useGetMyProgressForClassQuery,
} = videosApiSlice;
