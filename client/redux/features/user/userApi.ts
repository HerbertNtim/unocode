import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    updateAvatar: builder.mutation({
      query: (data) => ({
        url: "/unocode/auth/update-user-avatar",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
  }),
})

export const { useUpdateAvatarMutation } = userApi;
