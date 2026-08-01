/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { logout } from "../features/authSlice";
import { RootState } from "../store";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  throw new Error("Environment variable NEXT_PUBLIC_BASE_URL is not set");
}

// Endpoints where a 401/403 is an EXPECTED possible outcome, not a reason
// to nuke the session — e.g. checking "am I logged in?" on app load.
const SKIP_AUTO_LOGOUT_ENDPOINTS = ["getMe"];

const baseQueryWithAuth: ReturnType<typeof fetchBaseQuery> = async (
  args,
  api,
  extraOptions,
) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const stateToken = (getState() as RootState).auth?.token;
      const token = stateToken || Cookies.get("token");
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  });

  const result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    const shouldSkip = SKIP_AUTO_LOGOUT_ENDPOINTS.includes(api.endpoint);

    if (!shouldSkip) {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User", "Events", "Property", "Rental", "Payment", "Review"],
  endpoints: (builder) => ({}),
});
