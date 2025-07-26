import { Button } from "@/components/ui/button";
import { LoginDto } from "@/dto";
import Link from "next/link";
import { FormEvent, useState } from "react";

interface LoginFormProps {
  submit: (data: LoginDto) => void;
  loading?: boolean;
}

export function LoginForm({ submit, loading }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginDto>({
    email: "",
    password: "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(credentials);
  }
  return (
    <section className="max-w-2xl p-6 mx-auto rounded-md shadow-xl bg-white dark:bg-gray-800">
      <div className="flex flex-col items-center text-center space-y-2">
        <h2 className="text-md font-bold text-gray-700 capitalize dark:text-white">
          LOGIN
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 mt-4">
          <div>
            <input
              id="emailAddress"
              type="email"
              placeholder="Email Address"
              required
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              value={credentials.email}
              onChange={(e) => {
                setCredentials((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              placeholder="Password"
              required
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              value={credentials.password}
              onChange={(e) => {
                setCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        <div className="flex flex-row mt-6 justify-center items-center mb-4">
          <div className="flex justify-center w-full space-x-4">
            <Button size="lg" variant="default" className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log in"
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-row mt-6 justify-between items-center mb-4">
          <Link className="font-semibold text-primaryColor" href="/register">
            Sign up
          </Link>
          <div className="flex justify-end">
            <Link className="font-semibold text-primaryColor" href="/forgot-password">
              Forgotten password?
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
}
