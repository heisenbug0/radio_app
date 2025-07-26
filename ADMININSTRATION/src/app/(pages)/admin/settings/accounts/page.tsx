import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WalletAddress from "@/components/admin/wallet-address"

const Accounts = () => {
  return (
    <>
      <span className="font-bold text-2xl">Accounts</span>

      <div className="bg-white w-full rounded-lg shadow-xl mt-3">
        <ul className="p-4 lg:p-8 dark:bg-gray-800 dark:text-gray-100">
          <li>
            <div className="">
              <div className="flex flex-col overflow-hidden md:flex md:flex-row rounded-xl xl:flex xl:flex-row justify-between hover:dark:bg-gray-900">
                <div className="flex flex-col">
                  <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                    Your Wallet address
                  </h3>
                  <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0">
                    Kindly add your withdrawal address for each of the following
                    assets
                  </p>
                </div>

                <Button size="sm" variant="default">
                  <Link href="/admin/settings/accounts/addcrypto">
                    Add Wallet address
                  </Link>
                </Button>
              </div>
              <WalletAddress />
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Accounts;
