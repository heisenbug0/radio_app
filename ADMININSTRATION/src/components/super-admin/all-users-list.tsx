import React from "react";

const AllUsersLists = () => {
  return (
    <div className="overflow-x-auto rounded border shadow-xl">
      <table className="table bg-white">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>UID</th>
            <th>Full name</th>
            <th>Email</th>
            <th>Phone number</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr className="hover">
            <th>1</th>
            <th>7890654</th>
            <td>John Doe</td>
            <td>johndoe@email.com</td>
            <td>+234-9014578903</td>
          </tr>
          {/* row 2 */}
          <tr className="hover">
            <th>2</th>
            <th>7890654</th>
            <td>John Doe</td>
            <td>johndoe@email.com</td>
            <td>+234-9014578903</td>
          </tr>
          {/* row 3 */}
          <tr className="hover">
            <th>3</th>
            <th>7890654</th>
            <td>John Doe</td>
            <td>johndoe@email.com</td>
            <td>+234-9014578903</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AllUsersLists;
