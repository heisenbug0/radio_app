"use client";
import AccountInfoSuperadmin from "@/components/super-admin/account-info";
import PendingPayout from "@/components/super-admin/pending-payout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { FaCoins } from "react-icons/fa";
import { PiHandWithdraw } from "react-icons/pi";
import useSWR, { mutate } from "swr";
import { apiFetch } from "@/api";
import { useEffect, useState } from "react";

export function SuperAdminDashboard() {
  const [url, setUrl] = useState("/v1/agent");
  const { data, error } = useSWR(url, apiFetch, { refreshInterval: 2000 });
  useEffect(() => {
    if (data) {
      console.log(data);
    }

    if (error) {
      console.error(error);
    }
  }, [data, error]);
  return (
    <>
      <AccountInfoSuperadmin />
      <span className="font-bold text-2xl">Dashboard</span>

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-semibold text-1xl mt-3 mb-2">Users</h1>
          <div className="w-full rounded flex flex-col lg:grid lg:grid-cols-4 lg:gap-6 justify-between mb-6">
            <div className="card w-auto lg:max-w-96 rounded shadow-xl bg-white flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
              <div className="card-body w-1/3 flex justify-normal ">
                <Icon
                  icon="lucide:users"
                  width="28"
                  height="28"
                  color="purple"
                />
              </div>
              <div className="card-body text-primaryColor w-2/3">
                <h2 className="card-title font-bold">Total Users</h2>
                <p className="text-sm font-semibold text-black">10,000</p>
              </div>
            </div>
            <div className="card w-auto lg:max-w-96 rounded shadow-xl bg-white flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
              <div className="card-body w-1/3 flex justify-normal">
                <Icon
                  icon="lucide:badge-dollar-sign"
                  width="28"
                  height="28"
                  color="purple"
                />
              </div>
              <div className="card-body text-primaryColor w-2/3">
                <h2 className="card-title font-bold">Total Deposits</h2>
                <p className="text-sm font-semibold text-black">$1,300,900</p>
              </div>
            </div>
            <div className="card w-auto lg:max-w-96 rounded shadow-xl bg-white flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
              <div className="card-body w-1/3 flex justify-normal">
                <PiHandWithdraw fontSize={28} color="purple" />
              </div>
              <div className="card-body text-primaryColor w-2/3">
                <h2 className="card-title font-bold">Total Withdrawals</h2>
                <p className="text-sm font-semibold text-black">$190,900</p>
              </div>
            </div>
            <div className="card w-auto lg:max-w-96 rounded shadow-xl bg-white flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
              <div className="card-body w-1/3 flex justify-normal">
                <FaCoins fontSize={28} color="purple" />
              </div>
              <div className="card-body text-primaryColor w-2/3">
                <h2 className="card-title font-bold">Profit and Loss</h2>
                <p className="text-sm font-semibold text-black">+$300,900</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="font-semibold text-1xl mt-3 mb-2">Admins</h1>
          <div className="w-full rounded flex flex-col lg:grid lg:grid-cols-4 lg:gap-6 justify-between mb-6">
            <div className="card w-auto lg:max-w-96 rounded shadow-xl bg-white flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
              <div className="card-body w-1/3 flex justify-normal ">
                <Icon
                  icon="lucide:users"
                  width="28"
                  height="28"
                  color="purple"
                />
              </div>
              <div className="card-body text-primaryColor w-2/3">
                <h2 className="card-title font-bold">Total Fund managers</h2>
                <p className="text-sm font-semibold text-black">77</p>
              </div>
            </div>
            <div className="card w-auto lg:max-w-96 rounded shadow-xl bg-white flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
              <div className="card-body w-1/3 flex justify-normal">
                <PiHandWithdraw fontSize={28} color="purple" />
              </div>
              <div className="card-body text-primaryColor w-2/3">
                <h2 className="card-title font-bold">Total Withdrawals</h2>
                <p className="text-sm font-semibold text-black">$80,800</p>
              </div>
            </div>
            <div className="card w-auto lg:max-w-96 rounded shadow-xl bg-white flex flex-col lg:flex-row-reverse mb-6 lg:mb-0 justify-between lg:items-center">
              <div className="card-body w-1/3 flex justify-normal">
                <FaCoins fontSize={28} color="purple" />
              </div>
              <div className="card-body text-primaryColor w-2/3">
                <h2 className="card-title font-bold">Profit and Loss</h2>
                <p className="text-sm font-semibold text-black">+$300,900</p>
              </div>
            </div>
            <Link
              href="/super-admin/management/admins/create-admin"
              className="card w-auto lg:max-w-96 rounded-full lg:rounded shadow-xl bg-primaryColor text-white font-medium lg:font-semibold mb-6 py-4 lg:py-0 hover:bg-secondaryColor lg:mb-0 items-center justify-center "
            >
              Create admin
            </Link>
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between">
            <span className="text-1xl font-semibold">Pending payouts</span>
            <Link
              href="/super-admin/transactions"
              className="text-xs font-semibold hover:text-primaryColor hover:text-md"
            >
              SEE ALL
            </Link>
          </div>

          <div className="mt-3 mb-6 rounded">
            <PendingPayout />
          </div>
        </div>
      </div>
    </>
  );
}
