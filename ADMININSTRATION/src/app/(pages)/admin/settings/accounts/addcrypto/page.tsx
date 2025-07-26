// "use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AddCrypto = () => {
  return (
    <>
      <div className="flex flex-row justify-between mt-3">
        <span className="font-bold text-2xl">Add Crypto address</span>
        <Button size="sm" variant="default">
          <Link
            href="/admin/settings/accounts"
            className="bg-primaryColor text-sm sm:text-xs text-white rounded p-2 m-1 font-bold hover:bg-secondaryColor"
          >
            Go back
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center border w-full p-6 rounded-md sm:p-10 bg-white shadow-xl dark:bg-gray-900 dark:text-gray-100">
        <form action="" className="space-y-12 w-full md:w-1/2">
          <div className="">
            <div>
              <div className="flex mb-2">
                <label className="text-sm">Select Crypto:</label>
              </div>
              <select className="select select-bordered w-full">
                <option disabled selected>
                  Select your preferred Cryptocurrency
                </option>
                <option>Bitcoin (BTC)</option>
                <option>Litecoin (LTC)</option>
                <option>USDT (TRC20)</option>
              </select>
            </div>
            <div className="mt-6">
              <div className="flex mb-2">
                <label className="text-sm">Wallet address:</label>
              </div>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="Address should match your selected Crypto network"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <Button
                size="lg"
                variant="default"
                type="button"
                className="w-full"
              >
                Add wallet address
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCrypto;
