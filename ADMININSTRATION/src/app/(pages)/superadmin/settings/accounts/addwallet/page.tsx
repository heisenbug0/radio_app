"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AccountInfoSuperadmin from "@/components/super-admin/account-info";

const AddWallet = () => {
  return (
    <>
      <AccountInfoSuperadmin />
      <div className="flex flex-row justify-between mt-3">
        <span className="font-bold text-2xl">Add Crypto address</span>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            href="/super-admin/settings/accounts"
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
                <label className="text-sm">Select Crypto:</label>
              </div>
              <select className="select select-bordered w-full">
                <option disabled selected>
                  Select your preferred Cryptocurrency
                </option>
                <option>Bitcoin (BTC)</option>
                <option>Litecoin (LTC)</option>
                <option>USDT (TRC20)</option>
              </select>
            </div>
            <div className="mt-6">
              <div className="flex mb-2">
                <label className="text-sm">Wallet address:</label>
              </div>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="Address should match your selected Crypto network"
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
                Add wallet address
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddWallet;
