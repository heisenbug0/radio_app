"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const help = () => {
  return (
    <>
      <span className="font-bold text-2xl">Help</span>

      <div className="bg-white w-full rounded-lg shadow-xl mt-3 dark:bg-gray-800 dark:text-gray-100">
        <div className="container flex flex-col justify-center p-4 mx-auto md:p-8">
          <h2 className="mb-12 text-1xl font-semibold leadi text-center sm:text-md">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 divide-gray-700">
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                What is Freemann Firms?
              </summary>
              <div className="px-4 pb-4">
                <p>
                  Freemann Firms is an online platform that provides a wide
                  range of services but specifically created this ecosystem to
                  allow it's users ease of Investing, providing expert guidance
                  from our fund managers as well as an innovative approach to
                  investing at very little cost.
                </p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                How does Freemann Firms Investments work?
              </summary>
              <div className="px-4 pb-4">
                <p>
                  Our platform offers an intuitive interface and employs a
                  tactical but yet robust approach to how user Investments are
                  designed. We prioritize risk management in our approach and
                  that is why our Investments are performance based and our
                  Investment options are limited to a particular number of
                  Investors per Tier.
                </p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                How do I start Investing?
              </summary>
              <div className="px-4 pb-4 space-y-2">
                <p>
                  To start investing,{" "}
                  <span>
                    <Link
                      href="/user/deposit"
                      className="text-primaryColor font-semibold"
                    >
                      deposit
                    </Link>
                  </span>{" "}
                  funds into your account, choose any Tier that suits your risk
                  appetite, select preferred fund manager and proceed to Invest
                  as we help you secure your Investments.
                </p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                What are the fees and charges?
              </summary>
              <div className="px-4 pb-4 space-y-2">
                <p>
                  We charge two fees since our service is Performance based.
                </p>
                <p>
                  <span className="font-semibold text-md pr-1">
                    Asset Under Management (AUM) fee:
                  </span>
                  we charge a 2% fee on all Investments and this fee is used for
                  running and maintaining the platform.
                </p>
                <p>
                  <span className="font-semibold text-md pr-1">
                    Performance fee:
                  </span>
                  To reward our fund managers and ensure that there is some
                  equilibrum as the Investor bears most of the risks should
                  there be a loss, we charge a 20-30% performance fees on all
                  ROE made by the fund managers during the Investment and the
                  Investor gets the remaining 70% returns
                </p>
                <p>
                  Additional fees may apply for certain transactions or
                  services.
                </p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                How do I withdraw funds from my account?
              </summary>
              <div className="px-4 pb-4 space-y-2">
                <p>
                  To withdraw funds, navigate to the{" "}
                  <span>
                    <Link
                      href="/user/withdraw"
                      className="text-primaryColor font-semibold"
                    >
                      withdraw
                    </Link>
                  </span>{" "}
                  section in your dashboard, enter the amount you wish to
                  withdraw, and follow the instructions. Withdrawals are
                  typically processed within a few minutes.
                </p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                How is my money protected?
              </summary>
              <div className="px-4 pb-4">
                <p>
                  Your investments are held in secure accounts with top-tier
                  financial institutions. We use advanced security measures,
                  including encryption and two-factor authentication, to protect
                  your personal and financial information. Our fund managers
                  also only have third-party access as all they can do is manage
                  funds.
                </p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                What should I do if I suspect fraudulent activity?
              </summary>
              <div className="px-4 pb-4">
                <p>
                  If you notice any suspicious activity, please take measures to
                  secure your account and also contact our customer support team
                  immediately. We will investigate and take appropriate action
                  to secure your account.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="bg-white w-full rounded-lg shadow-xl mt-6 py-6 dark:bg-gray-800 dark:text-gray-50">
        <div className="grid max-w-6xl grid-cols-1 px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x">
          <div className="py-6 md:py-0 md:px-6">
            <h1 className="text-4xl font-bold">Get in touch</h1>
            <p className="pt-2 pb-4">
              Fill in the form to start a conversation
            </p>
            <div className="space-y-4">
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Nigeria</span>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span>+234-8105347598</span>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>freemannfirmsInfo@gmail.com</span>
              </p>
            </div>
          </div>
          <form className="flex flex-col py-6 px-3 space-y-6 md:py-4 md:px-6 bg-purple-200 rounded-lg">
            <label className="block">
              <span className="mb-1">Full name:</span>
              <input
                type="text"
                placeholder="John doe"
                className="block w-full rounded-md shadow-sm p-2 focus:ring focus:ri focus:ri dark:bg-gray-800"
              />
            </label>
            <label className="block">
              <span className="mb-1">Email address:</span>
              <input
                type="email"
                placeholder="Johndoe@gmail.com"
                className="block w-full rounded-md shadow-sm p-2 focus:ring focus:ri focus:ri dark:bg-gray-800"
              />
            </label>
            <label className="block">
              <span className="mb-1">Message</span>
              <textarea
                rows="3"
                className="block w-full rounded-md focus:ring focus:ri focus:ri dark:bg-gray-800"
              ></textarea>
            </label>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="p-2 lg:py-3 lg:px-4 mt-2 mb-6 text-center md:text-md font-semibold bg-primaryColor text-white hover:bg-secondaryColor rounded-full shadow-xl cursor-pointer dark:border-gray-100 self-center px-8 py-3 text-md dark:bg-violet-400 dark:text-gray-900"
            >
              Submit
            </motion.button>
          </form>
        </div>
      </div>
    </>
  );
};

export default help;
