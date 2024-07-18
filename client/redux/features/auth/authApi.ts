import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "unocode/auth/register",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }: { queryFulfilled: any, dispatch: any }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    activation: builder.mutation({
      query: ({ activation_token, activation_code}) => ({
        url: 'unocode/auth/activate-user',
        method: "POST",
        body: {
          activation_code,
          activation_token
        }
      }),
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: 'unocode/auth/login',
        method: "POST",
        body: {
          email,
          password
        }
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {useRegisterMutation, useActivationMutation, useLoginMutation} = authApi
