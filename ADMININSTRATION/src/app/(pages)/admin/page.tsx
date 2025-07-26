import Image from "next/image";
import Link from "next/link";

import React from "react";
import AccountInfoAdmin from "@/components/admin/account-info";
import wallet from "../../../../public/img/wallet.png";
import InvestmentLists from "@/components/admin/investment-lists";
import TransactionsListAdmin from "@/components/admin/transactions-list";

const admin = () => {
  return (
    <>
      <AccountInfoAdmin />
      <span className="font-bold text-2xl">Dashboard</span>

      <div className="flex flex-col gap-4">
        <div className="w-full rounded flex flex-col lg:grid lg:grid-cols-2 lg:gap-6 justify-between mt-3 mb-6">
          <div className="card w-auto lg:w-auto rounded shadow-xl bg-primaryColor flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
            <div className="card-body w-1/3 flex justify-normal ">
              <Image src={wallet} alt="" className="w-7 h-7 lg:h-9" />
            </div>
            <div className="card-body text-white w-2/3">
              <h2 className="card-title font-bold">Account Balance</h2>
              <p className="text-sm font-md">$10,000</p>
            </div>
          </div>
          <div className="card w-auto lg:w-auto rounded shadow-xl bg-secondaryColor flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
            <div className="card-body w-1/3 flex justify-normal">
              <Image src={wallet} alt="" className="w-7 h-7 lg:h-9" />
            </div>
            <div className="card-body text-white w-2/3">
              <h2 className="card-title font-bold">Total Earnings</h2>
              <p className="text-sm font-md">$700</p>
            </div>
          </div>
          <div className="card w-auto lg:w-auto rounded shadow-xl bg-primaryColor flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
            <div className="card-body w-1/3 flex justify-normal">
              <Image src={wallet} alt="" className="w-7 h-7 lg:h-9" />
            </div>
            <div className="card-body text-white w-2/3">
              <h2 className="card-title font-bold">Tier Balance</h2>
              <p className="text-sm font-md">$700</p>
            </div>
          </div>
          <div className="card w-auto lg:w-auto rounded shadow-xl bg-secondaryColor flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
            <div className="card-body w-1/3 flex justify-normal">
              <Image src={wallet} alt="" className="w-7 h-7 lg:h-9" />
            </div>
            <div className="card-body text-white w-2/3">
              <h2 className="card-title font-bold">Percentage Earnings</h2>
              <p className="text-sm font-md">$700</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-row justify-between">
            <span className="text-1xl font-semibold">All Investments</span>
            <Link
              href="/admin/investments"
              className="text-xs font-semibold hover:text-primaryColor hover:text-md"
            >
              SEE ALL
            </Link>
          </div>

          <div className="mt-3 mb-6 rounded">
            <InvestmentLists />
          </div>
        </div>

        <div>
          <div className="flex flex-row justify-between">
            <span className="text-1xl font-semibold">All Transactions</span>
            <Link
              href="/admin/transactions"
              className="text-xs font-semibold hover:text-primaryColor hover:text-md"
            >
              SEE ALL
            </Link>
          </div>

           <div className="mt-3 mb-6 rounded">
            <TransactionsListAdmin />
          </div>
        </div>
      </div>
    </>
  );
};

export default admin;
