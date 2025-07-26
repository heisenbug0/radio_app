"use client";

import React from "react";
import { motion } from "framer-motion";

const Signout = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-1/4 p-1 lg:py-2 lg:px-1 mt-2 mb-6 text-center text-md md:text-lg font-semibold bg-primaryColor text-white hover:bg-secondaryColor border rounded-full shadow-xl cursor-pointer dark:border-gray-100"
    >
      Signout
    </motion.div>
  );
};

export default Signout;
