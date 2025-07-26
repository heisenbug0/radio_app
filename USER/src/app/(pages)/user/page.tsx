import Image from "next/image";
import Link from "next/link";

import AccountInfo from "@/components/user/account-info";
import wallet from "../../../../public/homepage/wallet.png";
import Tiers from "@/components/user/tiers";
import TransactionsList from "@/components/user/transactions-list";

export default function user() {
  return (
    <>
      <AccountInfo />
      <span className="font-bold text-2xl">Dashboard</span>
      <div className="flex flex-col gap-4">
        <div className="w-full rounded flex flex-col lg:grid lg:grid-cols-3 lg:gap-6 justify-between mt-3 mb-6">
          <div className="card w-auto lg:max-w-96 rounded shadow-xl bg-primaryColor flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
            <div className="card-body w-1/2 flex justify-normal ">
              <Image src={wallet} alt="" className="w-7 h-7 lg:h-9" />
            </div>
            <div className="card-body text-white w-1/2">
              <h2 className="card-title font-bold">Account Balance</h2>
              <p className="text-sm font-md">$10,000</p>
            </div>
          </div>
          <div className="card w-auto lg:max-w-96 rounded shadow-xl bg-secondaryColor flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
            <div className="card-body w-1/2 flex justify-normal">
              <Image src={wallet} alt="" className="w-7 h-7 lg:h-9" />
            </div>
            <div className="card-body text-white w-1/2">
              <h2 className="card-title font-bold">Total Earnings</h2>
              <p className="text-sm font-md">$700</p>
            </div>
          </div>
          <div className="card border w-auto lg:max-w-96 rounded shadow-xl bg-white text-black mb-6 lg:mb-0">
            <div className="card-body flex flex-col">
              <h2 className="card-title font-bold">Refer and Earn</h2>
              <div className="flex flex-col space-y-3">
                <p className="text-xs font-medium">
                  Earn 7% commissions from each of your referral's active Investments. Maximum referrals is 15 persons.
                </p>
                <div className="flex flex-row justify-between">
                  <span className="text-sm font-extralight">REFERRAL LINK</span>
                  <Link
                    href="/user/referrals"
                    className="text-xs font-semibold hover:text-primaryColor"
                  >
                    Sell all referrals
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 mb-6">
          <div className="flex flex-row justify-between">
            <span className="text-1xl font-semibold">Investments</span>
            <Link
              href="/user/tiers"
              className="text-xs font-semibold hover:text-primaryColor hover:text-md"
            >
              SEE ALL
            </Link>
          </div>
          <div className="w-full rounded flex flex-col md:grid lg:grid-cols-3 gap-6 md:gap-6 justify-between mt-3 mb-6">
            <Tiers />
            <Tiers />
            <Tiers />
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between">
            <span className="text-1xl font-semibold">Transactions</span>
            <Link
              href="/user/transactions"
              className="text-xs font-semibold hover:text-primaryColor hover:text-md"
            >
              SEE ALL
            </Link>
          </div>

          <div className="mt-3 mb-6 rounded">
            <TransactionsList />
          </div>
        </div>
      </div>
    </>
  );
}
