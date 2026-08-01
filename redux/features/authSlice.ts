import { User } from "@/src/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthChecked = true;
      Cookies.set("token", action.payload.token, { expires: 7 });
    },
    setAuthChecked: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthChecked = true;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      // Called after a profile update so Navbar/sidebar reflect changes immediately
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthChecked = true;
      Cookies.remove("token");
    },
  },
});

export const { setCredentials, setAuthChecked, updateUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
