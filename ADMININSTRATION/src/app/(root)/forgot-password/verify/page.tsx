"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { forgotPassword } from "@/requests";
import { useRouter } from "next/navigation";

export default function ForgotPasswordVerify() {
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email: form.email, otp: form.otp, newPassword: form.newPassword });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center space-y-2 bg-zinc-100">
      <div className="container px-6 py-16 mx-auto">
        <div className="items-center flex flex-col">
          <div className="w-full">
            <section className="max-w-2xl p-6 mx-auto rounded-md shadow-xl bg-white dark:bg-gray-800">
              <div className="flex flex-col items-center text-center space-y-2">
                <h2 className="text-md font-bold text-gray-700 capitalize dark:text-white">ENTER CODE</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6 mt-4">
                  <div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      id="otp"
                      type="text"
                      placeholder="OTP"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={form.otp}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="New Password"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={form.newPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm New Password"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <Button size="lg" variant="default" className="w-full" type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
                {error && (
                  <div className="mt-2 text-red-600 text-center font-semibold">{error}</div>
                )}
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
