"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import TiersList from "@/components/user/all-referrals-list";

const Refer = () => {
  return (
    <>
      <div className="flex flex-row justify-between mt-3">
        <span className="font-bold text-2xl">Referrals</span>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            href="/user"
            className="bg-primaryColor text-sm sm:text-xs text-white rounded-full p-2 m-1 font-bold hover:bg-secondaryColor"
          >
            Go back
          </Link>
        </motion.div>
      </div>
      <div className="mt-3 mb-6 mx-3 lg:mx-full rounded">
        <TiersList />
      </div>
    </>
  );
};

export default Refer;
