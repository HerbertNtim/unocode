import { apiSlice } from "../api/apiSlice";
import { userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
}

type RegistrationData = {
  name: string;
  password: string;
  email: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here 
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: '/unocode/auth/register',
        method: 'POST',
        body: data,
        credentials: 'include' as const
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }: { dispatch: any, queryFulfilled: any }) {
        try {
          const result = await queryFulfilled;
          dispatch(userRegistration({
            token: result.data.activationToken
          }));
        } catch (error: any) {
          console.log("Error in the registration", error);
        }
      }
    }),

    activation: builder.mutation({
      query: ({ activation_token, activation_code}) => ({
        url: 'unocode/auth/activate-user',
        method: "POST",
        body: {
          activation_token,
          activation_code,
        }
      }),
    }),

  }) ,
})

export const {useRegisterMutation, useActivationMutation} = authApi;
