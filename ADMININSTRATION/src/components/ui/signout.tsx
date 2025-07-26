// "use client";

import React from "react";
import { Button } from "./button";

const Signout = () => {
  const handleSignout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    } catch (e) {
      console.error(e);
    }
    // Remove auth cookies
    document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Strict; Secure";
    document.cookie = "user_role=; Path=/; Max-Age=0; SameSite=Strict; Secure";
    window.location.href = "/login";
  };

  return (
    <Button size="lg" variant="default" onClick={handleSignout}>
      Signout
    </Button>
  );
};

export default Signout;
