"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Tier from "@/components/user/tiers";

const Tiers = () => {
  return (
    <>
      <div className="flex flex-row justify-between mt-3">
        <span className="font-bold text-2xl">All Tiers</span>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            href="/user/myplans"
            className="bg-primaryColor text-sm sm:text-xs text-white rounded-full p-2 m-1 font-bold hover:bg-secondaryColor"
          >
            Go back
          </Link>
        </motion.div>
      </div>
      <div className="w-full rounded flex flex-col md:grid lg:grid-cols-3 gap-6 md:gap-6 justify-between mt-3">
        <Tier />
        <Tier />
        <Tier />
        <Tier />
        <Tier />
        <Tier />
      </div>
    </>
  );
};

export default Tiers;
