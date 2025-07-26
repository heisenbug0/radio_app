import { Button } from "@/components/ui/button";
import { LoginDto } from "@/dto";
import { login, otpLogin } from "@/requests";
import { useState } from "react";
import { setupAutoLogout } from "@/lib/autoLogout";
import { LoginForm } from "./forms/LoginForm";
import { OtpForm } from "./forms/OtpForm";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

export function LoginScreen() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | string[]>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(dto: LoginDto) {
    setError("");
    setLoading(true);
    try {
      const data = await login(dto);
      setEmail(dto.email);
      setStep(1);
    } catch (error: any) {
      if (error.messages && Array.isArray(error.messages)) {
        setError(error.messages);
      } else {
        setError(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(otp: string) {
    setError("");
    try {
      const data = await otpLogin(email, otp);
      const { role } = data.data.user;

      if (role === UserRole.ADMIN) {
        router.push("/superadmin");
      } else if (role === UserRole.MANAGER) {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "OTP verification failed. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center space-y-2 bg-zinc-100">
      <div className="container px-6 py-16 mx-auto">
        <div className="items-center flex flex-col">
          <div className="w-full">
            {step === 0 && <LoginForm submit={handleLogin} loading={loading} />}
            {step === 1 && <OtpForm submit={handleOtp} />}
            {error && (
              <div className="mt-4 text-red-600 text-center font-semibold">
                {Array.isArray(error)
                  ? error.map((msg, i) => <div key={i}>{msg}</div>)
                  : error}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
