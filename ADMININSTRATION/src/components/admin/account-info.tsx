// "use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

const AccountInfoAdmin = () => {
  return (
    <div className="navbar bg-base-100 shadow-xl rounded mb-3 border">
      {/* sticky top-16 z-10 */}
      <div className="navbar-start">
        <div className="flex flex-col p-2 m-1">
          <p className="font-bold text-md sm:text-sm">John Doe</p>
          <span className="font-light text-sm sm:text-xs">UID: 123098</span>
        </div>
      </div>
      <div className="navbar-end">
        <div className="flex justify-between">
          {/* <Button size="sm" variant="default">
            <Link href="/admin/deposit">Deposit</Link>
          </Button> */}
          <Button size="sm" variant="default">
            <Link href="/admin/withdraw">Withdraw</Link>
          </Button>
        </div>
        <Link href="/admin/notifications" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AccountInfoAdmin;
