"use client";

import { motion } from "framer-motion";

export default function newPassword() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-2">
      <div className="container px-6 py-16 mx-auto">
        <div className="items-center flex flex-col">
          <div className="w-full">
            <section className="max-w-2xl p-6 mx-auto rounded-md shadow-md dark:bg-gray-800">
              <div className="flex flex-col items-center text-center space-y-2">
                <h2 className="text-md font-bold text-gray-700 capitalize dark:text-white">
                  CREATE A NEW PASSWORD{" "}
                </h2>
              </div>

              <form>
                <div className="flex flex-col gap-6 mt-4">
                  <div>
                    <input
                      type="password"
                      placeholder="new password"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="confirm password"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                    />
                  </div>
                </div>

                <div className="flex flex-row mt-6 justify-center items-center mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex justify-center w-full space-x-4"
                  >
                    <button
                      className="px-8 py-2.5 leading-5 w-full text-white font-bold transition-colors duration-300 transform bg-primaryColor rounded-full hover:bg-secondaryColor focus:outline-none focus:bg-gray-600"
                      type="submit"
                    >
                      RESET PASSWORD
                    </button>
                  </motion.div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
