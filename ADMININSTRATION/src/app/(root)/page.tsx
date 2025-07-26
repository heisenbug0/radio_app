"use client";
import { LoginScreen } from "@/screens";
import AuthRootRedirect from "@/components/AuthRootRedirect";

export default function RootPage() {
  return (
    <>
      <AuthRootRedirect />
      <LoginScreen />
    </>
  );
}
