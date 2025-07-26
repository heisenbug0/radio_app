import React from "react";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import AccountInfoSuperadmin from "@/components/super-admin/account-info";

const Management = () => {
  return (
    <>
      <AccountInfoSuperadmin />
      <span className="font-bold text-2xl">Management</span>

      <div className="h-72 bg-white w-full rounded-lg shadow-xl mt-3">
        <ul className="p-4 lg:p-8 dark:bg-gray-800 dark:text-gray-100 hover:bg-purple-100">
          <Link href="/super-admin/management/users">
            <div className="flex flex-col overflow-hidden md:flex md:flex-row rounded-xl xl:flex xl:flex-row justify-between hover:dark:bg-gray-900">
              <div className="flex flex-col">
                <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                  Manage Users
                </h3>
                <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0">
                  Access all registered users information
                </p>
              </div>

              <span className="hidden md:block">
                <LuChevronRight fontSize={20} />
              </span>
            </div>
          </Link>
        </ul>
        <ul className="p-4 lg:p-8 dark:bg-gray-800 dark:text-gray-100 hover:bg-purple-100">
          <Link href="/super-admin/management/admins">
            <div className="flex flex-col overflow-hidden md:flex md:flex-row rounded-xl xl:flex xl:flex-row justify-between hover:dark:bg-gray-900">
              <div className="flex flex-col">
                <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                  Manage Admins
                </h3>
                <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0">
                  Access all registered admins information
                </p>
              </div>

              <span className="hidden md:block">
                <LuChevronRight fontSize={20} />
              </span>
            </div>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default Management;
