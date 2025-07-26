"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ReferralsList = () => {
  return (
    <div className="flex flex-col text-center items-center">
      <div className="overflow-x-auto rounded border shadow-xl w-full">
        <table className="table bg-white">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Commissions earned</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="hover">
              <th>John cena</th>
              <td>Active</td>
              <td>$100</td>
            </tr>
            {/* row 2 */}
            <tr className="hover">
              <th>John cena</th>
              <td>Active</td>
              <td>$100</td>
            </tr>
            {/* row 3 */}
            <tr className="hover">
              <th>John cena</th>
              <td>Active</td>
              <td>$100</td>
            </tr>
          </tbody>
        </table>
      </div>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-full md:w-1/4 px-4 py-2 mt-6 lg:mt-10 lg:py-2 lg:my-8 text-md font-semibold bg-primaryColor text-white hover:bg-secondaryColor border rounded-full cursor-pointer dark:border-gray-100"
      >
        <Link href="">Claim commisions</Link>
      </motion.div>
    </div>
  );
};

export default ReferralsList;
