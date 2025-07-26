// "use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import Notifications from "@/components/admin/notifications";

const Refer = () => {
  return (
    <>
      <div className="flex flex-row justify-between mt-3">
        <span className="font-bold text-2xl">Notifications</span>
        <Button size="sm" variant="default">
          <Link
            href="/admin"
          >
            Go back
          </Link>
        </Button>
      </div>
      <div className="mt-3 mb-6 mx-3 lg:mx-full rounded">
        <Notifications />
      </div>
    </>
  );
};

export default Refer;
