"use client";

import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { ADMIN_SIDENAV_ITEMS } from "@/styles/admin/constants";
import { SideNavItem } from "@/styles/types";
import { Icon } from "@iconify/react";

//Images
import logo from "../../../public/logo.png";

const Sidebar = () => {
  return (
    <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
        >
          <Image className="w-auto h-10 sm:h-7" src={logo} alt="" />
          <span className="text-sm font-bold text-primaryColor">
            FREEMANN FIRMS
          </span>
        </Link>

        <div className="flex flex-col space-y-2  md:px-6 ">
          {ADMIN_SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`border shadow flex flex-row items-center p-2 rounded-full w-full justify-between hover:bg-secondaryColor hover:text-white ${
              pathname.includes(item.path) ? "bg-purple-100" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-md flex">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4 text-sm">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? "font-bold text-primaryColor" : ""
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`border shadow flex flex-row space-x-4 items-center p-2 rounded-full hover:bg-secondaryColor hover:text-white ${
            item.path === pathname ? "bg-purple-100" : ""
          }`}
        >
          {item.icon}
          <span className="font-semibold text-md flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
