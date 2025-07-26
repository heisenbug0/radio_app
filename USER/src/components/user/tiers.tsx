"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Tiers = () => {
  return (
    <>
      <div className="card border w-auto lg:max-w-96 rounded bg-white text-black shadow-xl mb-6 lg:mb-0 p-2">
        <div className="card p-2 items-center text-center flex flex-col justify-between">
          <div className="w-full">
            <span className="text-md font-semibold">Tier 1</span>

            <table className="table h-80">
              {/* head */}
              <thead>
                <tr>{/* <th>Tier 1</th> */}</tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>Duration</th>
                  <td>30 days</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>AUM fees(%)</th>
                  <td>3%</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>Maximum investors</th>
                  <td>100</td>
                </tr>
                {/* row 4 */}
                <tr>
                  <th>Starts</th>
                  <td>01-01-2025</td>
                </tr>
                {/* row 5 */}
                <tr>
                  <th>Ends</th>
                  <td>31-01-2025</td>
                </tr>
              </tbody>
            </table>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
              className="w-full px-8 py-2 mt-6 lg:mt-10 lg:py-2 lg:my-8 text-lg font-semibold bg-primaryColor text-white hover:bg-secondaryColor border rounded-full shadow-xl cursor-pointer dark:border-gray-100"
          >
            <Link
              href="/user/tiers"
            >
              Invest now
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Tiers;
