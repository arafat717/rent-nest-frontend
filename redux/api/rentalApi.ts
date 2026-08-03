/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConfirmPaymentPayload,
  ConfirmPaymentResponse,
  CreatePaymentPayload,
  CreatePaymentResponse,
  CreateRentalRequestPayload,
  CreateReviewPayload,
  Payment,
  RentalRequest,
} from "@/src/types/rental";
import { baseApi } from "./baseApi";

export const rentalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyRentalRequests: builder.query<
      { success: boolean; data: RentalRequest[] },
      void
    >({
      query: () => "/rentals",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Rental" as const, id })),
              { type: "Rental" as const, id: "LIST" },
            ]
          : [{ type: "Rental" as const, id: "LIST" }],
    }),

    getRentalRequestById: builder.query<
      { success: boolean; data: RentalRequest },
      string
    >({
      query: (id) => `/rentals/${id}`,
      providesTags: (result, error, id) => [{ type: "Rental", id }],
    }),

    createRentalRequest: builder.mutation<
      { success: boolean; data: RentalRequest },
      CreateRentalRequestPayload
    >({
      query: (payload) => ({
        url: "/rentals",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Rental", id: "LIST" }],
    }),

    getMyPayments: builder.query<{ success: boolean; data: Payment[] }, void>({
      query: () => "/payments",
      providesTags: [{ type: "Payment", id: "LIST" }],
    }),

    createPayment: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/payments/create",
        method: "POST",
        body: payload,
      }),
    }),

    createReview: builder.mutation<{ success: boolean }, CreateReviewPayload>({
      query: (payload) => ({
        url: "/reviews",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Rental", id: "LIST" }],
    }),
    confirmPayment: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/payments/confirm",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Rental", id: "LIST" },
        { type: "Payment", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMyRentalRequestsQuery,
  useGetRentalRequestByIdQuery,
  useCreateRentalRequestMutation,
  useGetMyPaymentsQuery,
  useCreatePaymentMutation,
  useCreateReviewMutation,
  useConfirmPaymentMutation,
} = rentalApi;
