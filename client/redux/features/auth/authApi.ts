import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {
  name: string;
  password: string;
  email: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "/unocode/auth/register",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }: { dispatch: any; queryFulfilled: any }
      ) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.payload.activationToken,
            })
          );
        } catch (error: any) {
          console.log("Error in the registration", error);
        }
      },
    }),

    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "unocode/auth/activate-user",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "unocode/auth/login",
        method: "POST",
        body: {
          email,
          password,
        },
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

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "unocode/auth/logout",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }: { dispatch: any; queryFulfilled: any }
      ) {
        try {
          dispatch(userLoggedOut());
        } catch (error: any) {
          console.log("Error in the Logout", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
