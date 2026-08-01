import { User } from "./auth";


export interface UpdateProfilePayload {
  name: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: User;
}
