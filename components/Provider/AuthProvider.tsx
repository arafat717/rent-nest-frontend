"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthChecked } from "@/redux/features/authSlice";
import { useLazyGetMeQuery } from "@/redux/api/authApi";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      dispatch(setAuthChecked(null));
      return;
    }

    triggerGetMe()
      .unwrap()
      .then((res) => dispatch(setAuthChecked(res.data)))
      .catch(() => {
        // token invalid/expired
        Cookies.remove("token");
        dispatch(setAuthChecked(null));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
