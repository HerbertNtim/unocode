import { apiSlice } from "../api/apiSlice";
import { userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
}

type RegistrationData = {
  username: string;
  password: string;
  email: string;
}

 export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // endpoints here 
    register: build.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: '/unocode/auth/register',
        method: 'POST',
        body: data,
        credentials: 'include'  
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }: { dispatch: any, queryFulfilled: any }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log("Error in the registration",error);
        }
      }
    }),

    activation: build.mutation({
      query: ({ activation_token, activation_code}) => ({
        url: 'unocode/auth/activate-user',
        method: "POST",
        body: {
          activation_code,
          activation_token
        }
      }),
    }),

  }) 
})

export const {useRegisterMutation} = authApi;


