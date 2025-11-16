"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    try {
      const keys = [
        "user",
        "userToken",
        "accessToken",
        "refreshToken",
        "userRole",
        "userInfo",
        "token",
      ];
      keys.forEach((k) => localStorage.removeItem(k));

      const evt = new CustomEvent("userUpdate", { detail: null });
      window.dispatchEvent(evt);
    } catch {}

    router.replace("/");
  }, [router]);

  return null;
}
