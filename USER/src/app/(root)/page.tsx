"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";

//Images
import img from "../../../public/homepage/finance.png";
import ellipse from "../../../public/homepage/ellipse28.png";
import secure from "../../../public/homepage/secure.png";
import income from "../../../public/homepage/growth.png";
import dollars from "../../../public/homepage/dollars.png";
import frame from "../../../public/homepage/frame01.png";
import trading from "../../../public/homepage/trading.png";
import makedeposit from "../../../public/homepage/deposit.png";
import chooseplan from "../../../public/homepage/plan.png";
import withdrawfunds from "../../../public/homepage/withdraw.png";
import refer from "../../../public/homepage/refer.png";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-2 bg-white">
      <div className="container flex flex-col-reverse justify-center p-6 mx-auto md:py-12 lg:py-16 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded lg:max-w-md xl:max-w-lg lg:text-left">
          <div>
            <h1 className="text-2xl md: font-bold leadi md:text-4xl flex flex-col justify-center">
              Join the world of{" "}
              <span className="text-primaryColor">successful Investors</span>
            </h1>
            <p className="mt-6 mb-8 text-md md:text-lg md:mb-12">
              {/* Investing does not have to be complicated. With Freemann Firms,
              you can invest, sit back and let our professional fund managers
              grow your Investments. */}
              "Invest with ease, powered by CRYPTO.
              <span className="inline-block">
                Let Freemann Firms’ expert fund managers grow your wealth while
                you stay in control.
              </span>
              Withdraw when you want—whether with crypto or cash, we’ve got you
              covered."
            </p>
          </div>
          <Button size="lg" variant="default">
            <Link rel="noopener noreferrer" href="#">
              INVEST NOW
            </Link>
          </Button>
        </div>
        <div className="hidden lg:flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 md:h-80 lg:h-96 xl:h-112 2xl:h-128">
          <Image
            src={img}
            alt=""
            className="object-contain h-72 md:h-80 lg:h-96 xl:h-112 2xl:h-128"
          />
        </div>
      </div>

      <div>
        <div className="container flex flex-col justify-center p-6  mx-auto md:py-12 lg:space-x-6 lg:py-16 lg:flex-row lg:items-center lg:justify-center">
          <motion.div
            whileHover={{ scale: [null, 1.1, 1.1] }}
            transition={{ type: "spring", duration: 0.5 }}
            className="card bg-base-100 w-80 shadow-xl border-2 h-44 mb-6 lg:mb-0"
          >
            <div className="card-body flex items-center">
              <Image src={ellipse} alt="" className="object-contain" />
              <p className="text-center font-semibold text-sm">
                Reduced fees on your Investments
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: [null, 1.1, 1.1] }}
            transition={{ type: "spring", duration: 0.5 }}
            className="card bg-base-100 w-80 shadow-xl border-2 b h-44 mb-6 lg:mb-0"
          >
            <div className="card-body flex items-center">
              <Image src={secure} alt="" className="object-contain" />
              <p className="text-center font-semibold text-sm">
                Seamless and secure fund management
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: [null, 1.1, 1.1] }}
            transition={{ type: "spring", duration: 0.5 }}
            className="card bg-base-100 w-80 shadow-xl border-2 b h-44 mb-6 lg:mb-0"
          >
            <div className="card-body flex items-center">
              <Image src={income} alt="" className="object-contain" />
              <p className="text-center font-semibold text-sm">
                Enjoy passive income from the comfort of your home
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: [null, 1.1, 1.1] }}
            transition={{ type: "spring", duration: 0.5 }}
            className="card bg-base-100 w-80 shadow-xl border-2 h-44"
          >
            <div className="card-body flex items-center">
              <Image src={dollars} alt="" className="object-contain" />
              <p className="text-center font-semibold text-sm">
                Quick and reliable transactions
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div>
        <div className="container px-6 mx-auto md:mt-0 flex flex-col justify-center p-6 md:py-12 lg:py-16 lg:flex-col lg:justify-between">
          <h1 className="text-2xl border-solid mb-10 font-semibold border-b-4 border-primaryColor py-3 md:px-3 lg:px-0">
            How it works
          </h1>
          <p>
            Your success is our priority. Fund managers only win when you do,
            with performance-based fees. Plus, our AUM fee is simple, so your
            assets stay your own. With just a few clicks you can start earning
            active or passive income without having to actively manage your
            Investments. Here is how it works.
          </p>

          <div className="flex flex-col items-center">
            <div className="mx-auto flex flex-col lg:flex-row">
              <div className="mr-0 lg:mr-5 w-full lg:w-1/2">
                <Image
                  src={makedeposit}
                  alt=""
                  className="w-full max-h-80 object-contain"
                />
              </div>
              <div className="p-6 lg:p-12 ml-0 lg:ml-5 w-full lg:w-1/2">
                <h3 className="text-xl font-bold">Make a deposit!</h3>
                <ul className="py-2 lg:py-6 list-decimal">
                  <li>Sign in or register a new account</li>
                  <li>Verify account</li>
                  <li>Make a deposit</li>
                </ul>
              </div>
            </div>

            <div className="mx-auto flex flex-col lg:flex-row-reverse">
              <div className="mr-0 lg:mr-5 w-full lg:w-1/2">
                <Image
                  src={chooseplan}
                  alt=""
                  className="w-full max-h-80 object-contain"
                />
              </div>
              <div className="p-6 lg:p-12 ml-0 lg:ml-5 w-full lg:w-1/2">
                <h3 className="text-xl font-bold">Choose a plan and Earn!</h3>
                <ul className="py-2 lg:py-6 list-decimal">
                  <li>Choose an Investment plan</li>
                  <li>Select your preferred fund manager</li>
                  <li>Then kick back and relax as they do the rest</li>
                </ul>
              </div>
            </div>

            <div className="mx-auto flex flex-col lg:flex-row">
              <div className="mr-0 lg:mr-5 w-full lg:w-1/2">
                <Image
                  src={withdrawfunds}
                  alt=""
                  className="w-full max-h-80 object-contain"
                />
              </div>
              <div className="p-6 lg:p-12 ml-0 lg:ml-5 w-full lg:w-1/2">
                <h3 className="text-xl font-bold">Withdraw funds anytime!</h3>
                <ul className="py-2 lg:py-6 list-decimal">
                  <li>Save withdrawal accounts or address</li>
                  <li>Withdraw funds anytime</li>
                  <li>
                    Enjoy smooth and seamless withdrawals with no hidden fees
                  </li>
                </ul>
              </div>
            </div>

            <div className="mx-auto flex flex-col lg:flex-row-reverse">
              <div className="mr-0 lg:mr-5 w-full lg:w-1/2">
                <Image
                  src={refer}
                  alt=""
                  className="w-full max-h-80 object-contain"
                />
              </div>
              <div className="p-6 lg:p-12 ml-0 lg:ml-5 w-full lg:w-1/2">
                <h3 className="text-xl font-bold">Refer and Earn!</h3>
                <ul className="py-2 lg:py-6 list-decimal">
                  <li>Copy referral link from dashboad</li>
                  <li>Earn 10% of your referrals Investment earnings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container flex flex-col justify-center p-6 mx-auto md:py-12 lg:py-16 lg:flex-row lg:justify-between">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <Image
              src={frame}
              alt=""
              className="object-contain h-72 md:h-80 lg:h-96 xl:h-112 2xl:h-128 mb-4 lg:mb-0"
            />
            <div className="">
              <h1 className="text-2xl font-semibold border-solid border-primaryColor border-b-4 py-3">
                We are trading for you!
              </h1>
              <p className="py-6 text-sm">
                Freemann Firms is the ideal choice for investors seeking
                consistent profits, whether short or long term. Our expert
                traders and fund managers ensure top returns based on
                performance, with no fixed ROE. A unique approach to investing!
              </p>
              <div className="container flex flex-col justify-center p-6 lg:space-x-4 mx-auto md:py-12 lg:py-16 lg:flex-row lg:items-center">
                <Image
                  src={trading}
                  alt=""
                  className="object-contain mb-6 lg:mb-0 h-64 md:h-80 lg:h-56 xl:h-112 2xl:h-128 rounded-md shadow-2xl"
                />
                <Button size="lg" variant="default">
                  <Link href="#">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container flex flex-col justify-center p-6 mx-auto md:py-12 lg:py-16 lg:flex-col lg:justify-between">
          <h1 className="text-2xl font-semibold border-solid border-primaryColor border-b-4 py-3">
            Investment strategies!
          </h1>
          <div className="flex flex-col justify-center p-6 lg:space-x-4 mx-auto md:py-12 lg:py-16 lg:flex-row lg:items-center ">
            <div className="card bg-base-100 w-auto h-96 shadow-xl border-2 flex flex-col items-center mb-6 lg:mb-0">
              <div className="flex flex-col items-center justify-center">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Tier 1</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <th>Duration</th>
                      <td>30 days</td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <th>AUM fees(%)</th>
                      <td>3%</td>
                    </tr>
                    {/* row 3 */}
                    <tr>
                      <th>Maximum investors</th>
                      <td>1000</td>
                    </tr>
                    {/* row 4 */}
                    <tr>
                      <th>Starts</th>
                      <td>01-01-2025</td>
                    </tr>
                    {/* row 5 */}
                    <tr>
                      <th>Ends</th>
                      <td>31-01-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Button size="lg" variant="default">
                <Link href="#">Invest now</Link>
              </Button>
            </div>
            <div className="card bg-base-100 w-auto h-96 shadow-xl border-2 flex flex-col items-center mb-6 lg:mb-0">
              <div className="flex flex-col items-center justify-center">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Tier 1</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <th>Duration</th>
                      <td>30 days</td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <th>AUM fees(%)</th>
                      <td>3%</td>
                    </tr>
                    {/* row 3 */}
                    <tr>
                      <th>Maximum investors</th>
                      <td>1000</td>
                    </tr>
                    {/* row 4 */}
                    <tr>
                      <th>Starts</th>
                      <td>01-01-2025</td>
                    </tr>
                    {/* row 5 */}
                    <tr>
                      <th>Ends</th>
                      <td>31-01-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Button size="lg" variant="default">
                <Link href="#">Invest now</Link>
              </Button>
            </div>
            <div className="card bg-base-100 w-auto h-96 shadow-xl border-2 flex flex-col items-center">
              <div className="flex flex-col items-center justify-center">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Tier 1</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <th>Duration</th>
                      <td>30 days</td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <th>AUM fees(%)</th>
                      <td>3%</td>
                    </tr>
                    {/* row 3 */}
                    <tr>
                      <th>Maximum investors</th>
                      <td>1000</td>
                    </tr>
                    {/* row 4 */}
                    <tr>
                      <th>Starts</th>
                      <td>01-01-2025</td>
                    </tr>
                    {/* row 5 */}
                    <tr>
                      <th>Ends</th>
                      <td>31-01-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Button size="lg" variant="default">
                <Link href="#">Invest now</Link>
              </Button>
            </div>
          </div>
          <h4 className="text-sm font-medium">
            <span className="font-bold text-lg">Note:</span> All investment
            strategies are performance-based, giving you an open ROE (%) as your
            profits depend on your fund manager’s performance, with a loss
            threshold in place to manage risks and minimize losses.
          </h4>
        </div>
      </div>
    </main>
  );
}
