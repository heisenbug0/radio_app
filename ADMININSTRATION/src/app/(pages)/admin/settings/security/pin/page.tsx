// "use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Pin = () => {
  return (
    <>
      <div className="flex flex-row justify-between mt-3">
        <span className="font-bold text-2xl">Set pin</span>
        <Button size="sm" variant="default">
          <Link href="/admin/settings/security">Go back</Link>
        </Button>
      </div>

      <div className="flex flex-col items-center border w-full p-6 rounded-md sm:p-10 bg-white shadow-xl dark:bg-gray-900 dark:text-gray-100">
        <form action="" className="space-y-12 w-full md:w-1/2">
          <div className="">
            <div>
              <div className="flex mb-2">
                <label className="text-sm">Enter Pin:</label>
              </div>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="******"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <Button
                size="lg"
                variant="default"
                type="button"
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Pin;
