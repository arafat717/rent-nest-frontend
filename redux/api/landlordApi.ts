/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meta } from "@/src/types/property";
import { baseApi } from "./baseApi";

import {
  CreatePropertyPayload,
  LandlordProperty,
  LandlordStats,
  UpdatePropertyPayload,
} from "@/src/types/landlordProperty";
import { RentalRequest, RentalStatus } from "@/src/types/rental";

export const landlordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLandlordStats: builder.query<
      { success: boolean; data: LandlordStats },
      void
    >({
      query: () => "/stats",
      providesTags: ["Property", "Rental"],
    }),

    getLandlordProperties: builder.query<
      { success: boolean; data: LandlordProperty[]; meta: Meta },
      { page?: number; limit?: number } | void
    >({
      query: (params) =>
        `/properties?page=${params?.page ?? 1}&limit=${params?.limit ?? 10}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Property" as const,
                id,
              })),
              { type: "Property" as const, id: "LANDLORD_LIST" },
            ]
          : [{ type: "Property", id: "LANDLORD_LIST" }],
    }),

    getLandlordPropertyById: builder.query<
      { success: boolean; data: LandlordProperty },
      string
    >({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    createProperty: builder.mutation<
      { success: boolean; data: LandlordProperty },
      CreatePropertyPayload
    >({
      query: (payload) => ({
        url: "/properties",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Property", id: "LANDLORD_LIST" }],
    }),

    updateProperty: builder.mutation<
      { success: boolean; data: LandlordProperty },
      { id: string; payload: UpdatePropertyPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/properties/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Property", id },
        { type: "Property", id: "LANDLORD_LIST" },
      ],
    }),

    deleteProperty: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Property", id: "LANDLORD_LIST" }],
    }),

    getLandlordRequests: builder.query<
      { success: boolean; data: RentalRequest[] },
      { status?: RentalStatus } | void
    >({
      query: (params) =>
        `/rentals/requests${params?.status ? `?status=${params.status}` : ""}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Rental" as const, id })),
              { type: "Rental" as const, id: "LANDLORD_LIST" },
            ]
          : [{ type: "Rental", id: "LANDLORD_LIST" }],
    }),

    updateRequestStatus: builder.mutation<
      { success: boolean; data: RentalRequest },
      { id: string; status: "APPROVED" | "REJECTED" }
    >({
      query: ({ id, status }) => ({
        url: `/rentals/requests/${id}`,
        method: "PATCH",
        body: { status },
      }),
      // Optimistic update: flip the status in the cache immediately so the
      // table reflects the change without waiting for the network round-trip.
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          landlordApi.util.updateQueryData(
            "getLandlordRequests",
            undefined,
            (draft) => {
              const request = draft.data.find((r: any) => r.id === id);
              if (request) request.status = status;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Rental", id },
        { type: "Rental", id: "LANDLORD_LIST" },
      ],
    }),
  }),
});

export const {
  useGetLandlordStatsQuery,
  useGetLandlordPropertiesQuery,
  useGetLandlordPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetLandlordRequestsQuery,
  useUpdateRequestStatusMutation,
} = landlordApi;
