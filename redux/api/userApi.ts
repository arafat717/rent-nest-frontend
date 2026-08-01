import { ChangePasswordPayload, UpdateProfilePayload, UpdateProfileResponse } from "@/src/types/user.type";
import { baseApi } from "./baseApi";


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfilePayload
    >({
      query: (payload) => ({
        url: "/users/me",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation<
      { success: boolean; message: string },
      ChangePasswordPayload
    >({
      query: (payload) => ({
        url: "/users/change-password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation, useChangePasswordMutation } = userApi;
