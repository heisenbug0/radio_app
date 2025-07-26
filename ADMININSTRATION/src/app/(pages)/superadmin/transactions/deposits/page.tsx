"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AccountInfoSuperadmin from "@/components/super-admin/account-info";
import AllDepositsList from "@/components/super-admin/all-deposits-list";

const Deposits = () => {
  return (
    <>
      <AccountInfoSuperadmin />

      <div className="flex flex-row justify-between mt-3">
        <span className="font-bold text-2xl">Deposits</span>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            href="/super-admin/transactions"
            className="bg-primaryColor text-sm sm:text-xs text-white rounded p-2 m-1 font-bold hover:bg-secondaryColor"
          >
            Go back
          </Link>
        </motion.div>
      </div>

      <div className="border h-12 rounded w-full">
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search by transaction Id" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div className="border w-full rounded-lg">
        <AllDepositsList />
      </div>
    </>
  );
};

export default Deposits;
