"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  allowedRoles: string[];
  redirectTo?: string;
  children: ReactNode;
}

export default function AuthGuard({ allowedRoles, redirectTo = "/", children }: AuthGuardProps) {
  const router = useRouter();
  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/credentials", { credentials: "include" });
      const data = await res.json();
      if (!data.token || !allowedRoles.includes(data.role)) {
        router.replace(redirectTo);
      }
    }
    checkAuth();
  }, [router, allowedRoles, redirectTo]);
  return <>{children}</>;
} 