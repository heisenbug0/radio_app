import React from "react";

const TransactionsList = () => {
  return (
    <div className="overflow-x-auto rounded border shadow-xl">
      <table className="table bg-white">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Type</th>
            <th>Details</th>
            <th>Amount</th>
            <th>Transaction ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr className="hover">
            <th>1</th>
            <td>Deposit</td>
            <td>Deposit successful</td>
            <td>$1000</td>
            <td>trx343494ssjbshb</td>
            <td>Successful</td>
          </tr>
          {/* row 2 */}
          <tr className="hover">
            <th>2</th>
            <td>Deposit</td>
            <td>Deposit successful</td>
            <td>$1000</td>
            <td>trx343494ssjbshb</td>
            <td>Successful</td>
          </tr>
          {/* row 3 */}
          <tr className="hover">
            <th>3</th>
            <td>Deposit</td>
            <td>Deposit successful</td>
            <td>$1000</td>
            <td>trx343494ssjbshb</td>
            <td>Successful</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
