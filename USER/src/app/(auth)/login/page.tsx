"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function login() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-2">
      <div className="container px-6 py-16 mx-auto">
        <div className="items-center flex flex-col">
          <div className="w-full">
            <section className="max-w-2xl p-6 mx-auto rounded-md shadow-md dark:bg-gray-800">
              <div className="flex flex-col items-center text-center space-y-2">
                <h2 className="text-md font-bold text-gray-700 capitalize dark:text-white">
                  LOGIN{" "}
                </h2>
              </div>

              <form>
                <div className="flex flex-col gap-6 mt-4">
                  <div>
                    <input
                      id="emailAddress"
                      type="email"
                      placeholder="Email Address"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    />
                  </div>
                  <div>
                    <input
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    />
                  </div>
                </div>

                <div className="flex flex-row mt-6 justify-center items-center mb-4">
                  <div className="flex justify-center w-full space-x-4">
                    <Button size="lg" variant="default" className="w-full">
                      Log in
                    </Button>
                  </div>
                </div>

                <div className="flex flex-row mt-6 justify-between items-center mb-4">
                  <Link
                    className="font-semibold text-primaryColor"
                    href="/register"
                  >
                    Sign up
                  </Link>
                  <div className="flex justify-end">
                    <Link
                      className="font-semibold text-primaryColor"
                      href="/forgot-password"
                    >
                      Forgotten password?
                    </Link>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
