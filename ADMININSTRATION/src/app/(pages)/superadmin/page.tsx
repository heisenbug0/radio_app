"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { PiHandWithdraw } from "react-icons/pi";
import { FaCoins } from "react-icons/fa";

import React from "react";
import AccountInfoSuperadmin from "@/components/super-admin/account-info";
import PendingPayout from "@/components/super-admin/pending-payout";
import { SuperAdminDashboard } from "@/screens";

const SuperAdmin = () => {
  return <SuperAdminDashboard />;
};

export default SuperAdmin;
