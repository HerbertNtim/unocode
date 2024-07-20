import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "unocode/auth/refresh",
        method: "GET",
        credentials: "include",
      }),
    }),

    loadUser: builder.query({
      query: () => ({
        url: "unocode/auth/me",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }: { dispatch: any; queryFulfilled: any }
      ) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log("Error in the registration", error);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
