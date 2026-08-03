export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export interface RentalRequest {
  id: string;
  property: {
    id: string;
    title: string;
    images: string[];
    price: number;
    location: string;
    city: string;
  };
  tenant: { id: string; name: string; email: string };
  landlord: { id: string; name: string; email: string };
  moveInDate: string;
  message?: string;
  status: RentalStatus;
  hasReview?: boolean;
  createdAt: string;
}


export interface Payment {
  id: string;
  rentalRequestId: string;
  property: { id: string; title: string };
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  transactionId?: string;
  createdAt: string;
}

export interface CreatePaymentPayload {
  rentalRequestId: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  data: {
    checkoutUrl: string;
    sessionId: string;
  };
}

export interface CreateReviewPayload {
  rentalRequestId: string;
  propertyId: string;
  rating: number;
  comment: string;
}

export interface ConfirmPaymentPayload {
  sessionId: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  data: {
    payment: Payment;
    rentalRequest: RentalRequest;
  };
}

export interface CreateRentalRequestPayload {
  propertyId: string;
  moveInDate: string;
  moveOutDate: string;
  message?: string;
}
