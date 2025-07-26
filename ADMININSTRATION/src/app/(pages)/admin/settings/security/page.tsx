import React from "react";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

const Security = () => {
  return (
    <>
      <span className="font-bold text-2xl">Security settings</span>

      <div className="h-72 bg-white w-full rounded-lg shadow-xl mt-3">
        <ul className="p-4 lg:p-8 dark:bg-gray-800 dark:text-gray-100 hover:bg-purple-100">
          <Link href="/admin/settings/security/password">
            <div className="flex flex-col overflow-hidden md:flex md:flex-row rounded-xl xl:flex xl:flex-row justify-between hover:dark:bg-gray-900">
              <div className="flex flex-col">
                <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                  Change password
                </h3>
                <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0">
                  Secure your account and update your already existing password
                </p>
              </div>

              <span className="hidden md:block">
                <LuChevronRight fontSize={20} />
              </span>
            </div>
          </Link>
        </ul>
        <ul className="p-4 lg:p-8 dark:bg-gray-800 dark:text-gray-100 hover:bg-purple-100">
          <Link href="/admin/settings/security/pin">
            <div className="flex flex-col overflow-hidden md:flex md:flex-row rounded-xl xl:flex xl:flex-row justify-between hover:dark:bg-gray-900">
              <div className="flex flex-col">
                <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                  Set account pin
                </h3>
                <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0">
                  Secure your account while setting a unique pin for
                  authorization while logged in
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

export default Security;
