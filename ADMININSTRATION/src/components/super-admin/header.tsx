"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";

import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

//Images
import logo from "../../../public/logo.png";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          "border-b border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
          "border-b border-gray-200 bg-white": selectedLayout,
        }
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row items-center justify-center md:hidden"
          >
            <Image className="w-auto h-10 sm:h-7" src={logo} alt="" />
          </Link>
        </div>

        {/* <div className="hidden md:block">
        <div className="h-8 w-auto p-2 bg-zinc-100 rounded flex items-center justify-center text-center">
          <span className="font-semibold text-sm text-black">INVESTMENTS</span>
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default Header;
