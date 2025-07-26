"use client";

import React from "react";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

const Tasks = () => {
  return (
    <>
      <span className="font-bold text-2xl">Tasks</span>
      <div className="bg-white w-full rounded-lg shadow-xl mt-3">
        <ul className="p-4 lg:p-6 dark:bg-gray-800 dark:text-gray-100">
          <a href="#">
            <div className="flex flex-col overflow-hidden md:flex md:flex-row rounded-xl xl:flex xl:flex-row justify-between hover:dark:bg-gray-900">
              <div className="flex flex-col">
                <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                  Follow on twitter
                </h3>
                <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0">
                  Get the latest updates from our official twitter page
                </p>
              </div>

              <span className="hidden md:block">
                <LuChevronRight fontSize={20} />
              </span>
            </div>
          </a>
        </ul>
        <ul className="p-4 lg:p-6 dark:bg-gray-800 dark:text-gray-100">
          <a href="#">
            <div className="flex flex-col overflow-hidden md:flex md:flex-row rounded-xl xl:flex xl:flex-row justify-between hover:dark:bg-gray-900">
              <div className="flex flex-col">
                <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                  Follow on Instagram
                </h3>
                <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0">
                  Get the latest updates from our official IG page
                </p>
              </div>

              <span className="hidden md:block">
                <LuChevronRight fontSize={20} />
              </span>
            </div>
          </a>
        </ul>
        <ul className="p-4 lg:p-6 dark:bg-gray-800 dark:text-gray-100">
          <a href="#">
            <div className="flex flex-col overflow-hidden md:flex md:flex-row rounded-xl xl:flex xl:flex-row justify-between hover:dark:bg-gray-900">
              <div className="flex flex-col">
                <h3 className="mb-1 ml-2 font-bold md:col-start-2 md:ml-0">
                  Follow on LinkedIn
                </h3>
                <p className="mb-1 ml-2 font-md md:col-start-2 md:ml-0">
                  Get the latest updates from our official LinkedIn page
                </p>
              </div>

              <span className="hidden md:block">
                <LuChevronRight fontSize={20} />
              </span>
            </div>
          </a>
        </ul>
      </div>
    </>
  );
};

export default Tasks;
