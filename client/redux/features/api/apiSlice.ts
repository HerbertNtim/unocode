import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  }),
  endpoints: (builder) => ({
    refreshToken: builder.mutation({
      query: () => ({
        url: "unocode/auth/refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    loadUser: builder.query({
      query: () => ({
        url: 'unocode/auth/me',
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, {queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user
            })
          )          
        } catch (error: any) {
          console.log(error);
        }
      }
    }),
  }),
});
export const { useRefreshTokenMutation, useLoadUserQuery } = apiSlice;
