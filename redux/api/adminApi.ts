/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AccountStatus,
  AdminProperty,
  AdminRentalRequest,
  AdminStats,
  AdminUser,
  Meta,
  UserQueryParams,
} from "@/src/types/admin";
import { baseApi } from "./baseApi";

const buildUserParams = (params: UserQueryParams) => {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.role && params.role !== "ALL") query.append("role", params.role);
  query.append("page", String(params.page ?? 1));
  query.append("limit", String(params.limit ?? 10));
  return query.toString();
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<{ success: boolean; data: AdminStats }, void>({
      query: () => "/admin/stats",
      providesTags: ["User", "Property", "Rental"],
    }),

    getAdminUsers: builder.query<
      { success: boolean; data: AdminUser[]; meta: Meta },
      UserQueryParams | void
    >({
      query: (params) => `/admin/users?${buildUserParams(params ?? {})}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User" as const, id: "ADMIN_LIST" },
            ]
          : [{ type: "User", id: "ADMIN_LIST" }],
    }),

    updateUserStatus: builder.mutation<
      { success: boolean; data: AdminUser },
      { id: string; status: AccountStatus }
    >({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "ADMIN_LIST" },
      ],
    }),

    getAdminProperties: builder.query<
      { success: boolean; data: AdminProperty[]; meta: Meta },
      { page?: number; limit?: number; search?: string } | void
    >({
      query: (params) =>
        `/admin/properties?page=${params?.page ?? 1}&limit=${params?.limit ?? 10}${
          params?.search ? `&search=${encodeURIComponent(params.search)}` : ""
        }`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Property" as const,
                id,
              })),
              { type: "Property" as const, id: "ADMIN_LIST" },
            ]
          : [{ type: "Property", id: "ADMIN_LIST" }],
    }),

    deleteAdminProperty: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Property", id: "ADMIN_LIST" }],
    }),

    getAdminRequests: builder.query<
      { success: boolean; data: AdminRentalRequest[]; meta: Meta },
      { page?: number; limit?: number } | void
    >({
      query: (params) =>
        `/admin/rentals?page=${params?.page ?? 1}&limit=${params?.limit ?? 10}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Rental" as const, id })),
              { type: "Rental" as const, id: "ADMIN_LIST" },
            ]
          : [{ type: "Rental", id: "ADMIN_LIST" }],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useGetAdminPropertiesQuery,
  useDeleteAdminPropertyMutation,
  useGetAdminRequestsQuery,
} = adminApi;
