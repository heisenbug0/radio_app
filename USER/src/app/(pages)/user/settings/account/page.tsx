import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { LuLandmark } from "react-icons/lu";
import { LuMenuSquare } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { LuBitcoin } from "react-icons/lu";

export default function account() {
  return (
    <>
      <span className="font-bold text-2xl">Account Settings</span>

      <div className="bg-white w-full rounded-lg shadow-xl mt-3">
        <ul className="p-4 lg:p-8 dark:bg-gray-800 dark:text-gray-100">
          <li>
            <div className="">
              <div className="flex flex-col overflow-hidden md:flex md:flex-row rounded-xl xl:flex xl:flex-row justify-between hover:dark:bg-gray-900">
                <div className="flex flex-col">
                  <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                    Your Bank Accounts
                  </h3>
                  <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0">
                    Kindly add your bank accounts for easy deposits and
                    withdrawals
                  </p>
                </div>

                <Link
                  href="/user/settings/account/addbank"
                  className="bg-primaryColor text-center lg:flex items-center text-xs sm:text-sm text-white rounded p-2 m-1 font-semibold hover:bg-secondaryColor"
                >
                  <span>
                    <LuPlus fontSize={20} />
                  </span>
                  Add
                </Link>
              </div>  
              <div className="bg-purple-200 w-full rounded flex flex-col md:flex md:flex-row gap-6 md:gap-6 justify-between mt-6 mb-6 p-2">
                <div className="flex flex-row">
                  <span>
                    <LuLandmark fontSize={20} />
                  </span>
                  <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-1">
                    United bank of Africa
                  </h3>
                </div>
                <div className="flex flex-row items-center">
                  <span>
                    <LuMenuSquare fontSize={20} />
                  </span>
                  <div className="flex flex-col ml-3">
                    <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0 font-semibold">
                      Account Number
                    </p>
                    <p>3046997766</p>
                  </div>
                </div>
                <div className="">
                  <span>
                    <LuTrash2 fontSize={20} className="fill-red-600"/>
                  </span>
                </div>
              </div>
              <div className="bg-purple-200 w-full rounded flex flex-col md:flex md:flex-row gap-6 md:gap-6 justify-between mt-6 mb-6 p-2">
                <div className="flex flex-row">
                  <span>
                    <LuLandmark fontSize={20} />
                  </span>
                  <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-1">
                    United bank of Africa
                  </h3>
                </div>
                <div className="flex flex-row items-center">
                  <span>
                    <LuMenuSquare fontSize={20} />
                  </span>
                  <div className="flex flex-col ml-3">
                    <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0 font-semibold">
                      Account Number
                    </p>
                    <p>3046997766</p>
                  </div>
                </div>
                <div className="">
                  <span>
                    <LuTrash2 fontSize={20} className="fill-red-600" />
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

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

                <Link
                  href="/user/settings/account/addcrypto"
                  className="bg-primaryColor text-center lg:flex items-center text-xs sm:text-sm text-white rounded p-2 m-1 font-semibold hover:bg-secondaryColor"
                >
                  <span>
                    <LuPlus fontSize={20} />
                  </span>
                  Add
                </Link>
              </div>
              <div className="bg-purple-200 w-full rounded flex flex-col md:flex md:flex-row gap-6 md:gap-6 justify-between mt-6 mb-6 p-2">
                <div className="flex flex-row">
                  <span>
                    <LuBitcoin fontSize={20} />
                  </span>
                  <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                    Bitcoin
                  </h3>
                </div>
                <div className="flex flex-row items-center">
                  <span>
                    <LuMenuSquare fontSize={20} />
                  </span>
                  <div className="flex flex-col ml-3">
                    <p className="mb-1 ml-2 font-semibold md:col-start-2 md:ml-0">
                      Address
                    </p>
                    <p>1EzTfBWcqsMyvas44Zosfte5ZPiXrBErix</p>
                  </div>
                </div>
                <div className="">
                  <span>
                    <LuTrash2 fontSize={20} className="fill-red-600" />
                  </span>
                </div>
              </div>
              <div className="bg-purple-200 w-full rounded flex flex-col md:flex md:flex-row gap-6 md:gap-6 justify-between mt-6 mb-6 p-2">
                <div className="flex flex-row">
                  <span>
                    <LuBitcoin fontSize={20} />
                  </span>
                  <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                    Bitcoin
                  </h3>
                </div>
                <div className="flex flex-row items-center">
                  <span>
                    <LuMenuSquare fontSize={20} />
                  </span>
                  <div className="flex flex-col ml-3">
                    <p className="mb-1 ml-2 font-semibold md:col-start-2 md:ml-0">
                      Address
                    </p>
                    <p>1EzTfBWcqsMyvas44Zosfte5ZPiXrBErix</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="">
                    <LuTrash2 fontSize={20} className="fill-red-600" />
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
