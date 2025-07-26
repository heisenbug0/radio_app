import React from "react";

const InvestmentLists = () => {
  return (
    <div className="overflow-x-auto rounded border shadow-xl">
      <table className="table bg-white">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Tier</th>
            <th>Number of Investors</th>
            <th>Pool ID</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr className="hover">
            <th>1</th>
            <th>2</th>
            <td>217</td>
            <td>y9p2er</td>
            <td>01-01-2025</td>
            <td>31-01-2025</td>
            <td>Active</td>
          </tr>
          {/* row 2 */}
          <tr className="hover">
            <th>2</th>
            <th>3</th>
            <td>83</td>
            <td>kk34la</td>
            <td>01-11-2024</td>
            <td>31-11-2024</td>
            <td>Inactive</td>
          </tr>
          {/* row 3 */}
          <tr className="hover">
            <th>3</th>
            <th>6</th>
            <td>400</td>
            <td>rt7U8s</td>
            <td>01-12-2024</td>
            <td>31-12-2024</td>
            <td>Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentLists;
