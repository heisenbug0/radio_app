"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AllAdminsLists from "@/components/super-admin/all-admins-list";

const Admins = () => {
  return (
    <>
      <div className="flex flex-row justify-between mt-3">
        <span className="font-bold text-2xl">Manage Admins</span>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            href="/super-admin/management"
            className="bg-primaryColor text-xs lg:text-sm text-white rounded-full p-2 m-1 font-bold hover:bg-secondaryColor"
          >
            Go back
          </Link>
        </motion.div>
      </div>

      <div className="flex flex-row justify-between gap-0 lg:gap-20">
        <div className="border h-12 rounded w-2/3">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Search by UId" />
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
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex justify-center items-center h-12"
        >
          <Link
            href="/super-admin/management/admins/create-admin"
            className="bg-primaryColor text-xs lg:text-sm text-white rounded-full p-2 m-1 font-bold hover:bg-secondaryColor"
          >
            Create Admin
          </Link>
        </motion.div>
      </div>

      <div className="border w-full rounded-lg">
        <AllAdminsLists />
      </div>
    </>
  );
};

export default Admins;
