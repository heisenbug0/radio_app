"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AccountInfoSuperadmin from "@/components/super-admin/account-info";

const CreatePlan = () => {
  return (
    <>
      <AccountInfoSuperadmin />

      <div className="flex flex-row justify-between mt-3">
        <span className="font-bold text-2xl">Create Plan</span>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            href="/super-admin/investments"
            className="bg-primaryColor text-sm sm:text-xs text-white rounded p-2 m-1 font-bold hover:bg-secondaryColor"
          >
            Go back
          </Link>
        </motion.div>
      </div>

      <div className="flex flex-col items-center border w-full p-6 rounded-md sm:p-10 bg-white shadow-xl dark:bg-gray-900 dark:text-gray-100">
        <form action="" className="space-y-12 w-full md:w-1/2">
          <div className="">
            <div>
              <div className="flex mb-2">
                <label className="text-sm">Tier:</label>
              </div>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="1"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="mt-6">
              <div className="flex mb-2">
                <label className="text-sm">Duration (days):</label>
              </div>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="180"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="mt-6">
              <div className="flex mb-2">
                <label className="text-sm">AUM fee (%):</label>
              </div>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="10"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="mt-6">
              <div className="flex mb-2">
                <label className="text-sm">Loss thnreshold (%):</label>
              </div>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="10"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="mt-6">
              <div className="flex mb-2">
                <label className="text-sm">Maximum Investors:</label>
              </div>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="100"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="mt-6">
              <div className="flex mb-2">
                <label className="text-sm">Start Date:</label>
              </div>
              <input
                type="date"
                name="text"
                id="text"
                placeholder="DD/MM/YY"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="mt-6">
              <div className="flex mb-2">
                <label className="text-sm">End Date:</label>
              </div>
              <input
                type="date"
                name="text"
                id="text"
                placeholder="DD/MM/YY"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <button
                type="button"
                className="w-full px-8 py-3 font-semibold rounded-md bg-primaryColor text-white dark:bg-violet-400 dark:text-gray-900"
              >
                Create Plan
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePlan;
