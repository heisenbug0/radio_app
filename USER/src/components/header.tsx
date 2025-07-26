"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

//Images
import img from "../../public/logo.png";

export default function header() {
  return (
    <div className="navbar">
      <div className="flex-1 m-2">
        <Link href="/">
          <Image className="w-auto h-10 sm:h-7" src={img} alt="" />
        </Link>
        <h1 className="hidden md:block p-1 text-primaryColor text-xl font-bold uppercase">
          Freemann Firms
        </h1>
      </div>
      <div className="flex-none m-2">
        <ul className="menu menu-horizontal px-1">
          <Button size="sm" variant="ghost">
            <Link href="/register">Sign Up</Link>
          </Button>
          <Button size="sm" variant="default">
            <Link href="/login">Log In</Link>
          </Button>
        </ul>
      </div>
    </div>
  );
}
