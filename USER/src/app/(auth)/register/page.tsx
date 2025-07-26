"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function register() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-2">
      <div className="container px-6 py-16 mx-auto">
        <div className="items-center flex flex-col">
          <div className="w-full">
            <section className="max-w-2xl p-6 mx-auto rounded-md shadow-md dark:bg-gray-800">
              <div className="flex flex-col items-center text-center space-y-2">
                {/* <Image src={logo} alt="" className="w-20" /> */}
                <h2 className="text-md font-bold text-gray-700 capitalize dark:text-white">
                  WELCOME TO{" "}
                  <span className="text-primaryColor font-semibold text-xl">
                    FREEMANN FIRMS
                  </span>
                </h2>
              </div>

              <form>
                <div className="flex flex-col gap-6 mt-4">
                  <div>
                    <input
                      id="firstname"
                      type="text"
                      placeholder="First Name"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    />
                  </div>

                  <div>
                    <input
                      id="lastname"
                      type="text"
                      placeholder="Last Name"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    />
                  </div>

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

                  <div>
                    <input
                      id="confirmpassword"
                      type="password"
                      placeholder="Confirm Password"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    />
                  </div>
                </div>

                <div className="flex flex-row mt-6 justify-center items-center mb-4">
                <Button size='lg' variant='default' className="w-full">
                    Sign Up
                  </Button>
                </div>

                <div className="flex space-x-2 justify-center">
                  <h2 className="">Already a registered User?</h2>
                  <Link
                    className="text-primaryColor font-semibold"
                    href="/login"
                  >
                    Log In
                  </Link>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
