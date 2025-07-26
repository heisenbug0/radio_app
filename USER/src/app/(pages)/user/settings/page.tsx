import Signout from "@/components/ui/signout";

export default function settings() {
  return (
    <>
      <span className="font-bold text-2xl">Personal Information</span>

      <div className="bg-white w-full rounded-lg shadow-xl mt-3">
        <ul className="p-4 lg:p-8 dark:bg-gray-800 dark:text-gray-100">
          <li>
            <div>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex flex-row p-4 overflow-hidden md:flex md:flex-row rounded-xl lg:p-6 xl:flex xl:flex-row justify-between hover:dark:bg-gray-900"
              >
                <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                  Full Name:
                </h3>
             
                <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-300">
                  John Doe
                </p>
              </a>
            </div>
          </li>
          <li>
            <div>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex flex-row p-4 overflow-hidden md:flex md:flex-row rounded-xl lg:p-6 xl:flex xl:flex-row justify-between hover:dark:bg-gray-900"
              >
                <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                  Email:
                </h3>
             
                <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-300">
                  Johndoe@gmail.com
                </p>
              </a>
            </div>
          </li>
          <li>
            <div>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex flex-row p-4 overflow-hidden md:flex md:flex-row rounded-xl lg:p-6 xl:flex xl:flex-row justify-between hover:dark:bg-gray-900"
              >
                <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                  Phone Number:
                </h3>
             
                <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-300">
                  08105347598
                </p>
              </a>
            </div>
          </li>
          <li>
            <div>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex flex-row p-4 overflow-hidden md:flex md:flex-row rounded-xl lg:p-6 xl:flex xl:flex-row justify-between hover:dark:bg-gray-900"
              >
                <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                  Identity verification:
                </h3>
             
                <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-300">
                  VERIFIED
                </p>
              </a>
            </div>
          </li>
        </ul>

        <div className="grid place-items-center">
          <Signout />
        </div>
      </div>
    </>
  );
}
