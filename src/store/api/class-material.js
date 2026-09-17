import { apiSlice } from "../initalState";

export const materialApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE MATERIAL =================
    createMaterial: builder.mutation({
      query: (materialData) => ({
        url: "/api/materials",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: materialData,
      }),
      invalidatesTags: ["Material"],
    }),

    // ================= GET ALL MATERIALS =================
    getAllMaterials: builder.query({
      query: () => ({
        url: "/api/materials",
        method: "GET",
      }),
      providesTags: ["Material"],
    }),

    // ================= GET MATERIALS BY CLASS =================
    getMaterialsByClass: builder.query({
      query: (classId) => ({
        url: `/api/materials/class/${classId}`,
        method: "GET",
      }),
      providesTags: (result, error, classId) => [
        { type: "Material", id: classId },
      ],
    }),

    // ================= GET MATERIAL BY ID =================
    getMaterialById: builder.query({
      query: (id) => ({
        url: `/api/materials/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Material", id }],
    }),

    // ================= UPDATE MATERIAL =================
    updateMaterial: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/materials/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Material", id },
        "Material",
      ],
    }),

    // ================= DELETE MATERIAL =================
    deleteMaterial: builder.mutation({
      query: (id) => ({
        url: `/api/materials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Material"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateMaterialMutation,
  useGetAllMaterialsQuery,
  useGetMaterialsByClassQuery,
  useGetMaterialByIdQuery,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialApiSlice;
