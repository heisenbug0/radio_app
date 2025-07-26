"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRootRedirect() {
  const router = useRouter();
  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/credentials", { credentials: "include" });
      const data = await res.json();
      if (!data.token) {
        router.replace("/"); // login page
      } else if (data.role === "admin") {
        router.replace("/superadmin");
      } else if (data.role === "manager") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
    checkAuth();
  }, [router]);
  return null;
} 