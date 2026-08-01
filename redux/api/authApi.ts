import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/src/types/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (payload) => ({
        url: "/users/register",
        method: "POST",
        body: payload,
      }),
    }),

    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (payload) => ({
        url: "/users/login",
        method: "POST",
        body: payload,
      }),
    }),

    getMe: builder.query<{ success: boolean; data: User }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
