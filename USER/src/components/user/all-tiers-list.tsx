"use client";

import React from "react";
import Link from "next/link";

const AllTiersList = () => {
  return (
    <div className="flex flex-col text-center items-center">
      <div className="overflow-x-auto rounded border shadow-xl w-full">
        <table className="table bg-white">
          {/* head */}
          <thead>
            <tr>
              <th>Pool Id</th>
              <th>Tier</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="hover">
              <th>er67ji1G</th>
              <td>2</td>
              <td>$100</td>
              <td>Active</td>
            </tr>
            {/* row 2 */}
            <tr className="hover">
              <th>88yKiwk</th>
              <td>5</td>
              <td>$200</td>
              <td>Active</td>
            </tr>
            {/* row 3 */}
            <tr className="hover">
              <th>Juy354UY</th>
              <td>3</td>
              <td>$50</td>
              <td>Inactive</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTiersList;
