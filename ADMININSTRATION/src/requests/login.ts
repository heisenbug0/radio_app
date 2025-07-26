import { LoginDto, EmailDto, ForgotPasswordDto } from "@/dto";
import { CompleteCallback } from "./utils";
import { LoginResponse, OtpLoginResponse } from "@/responses/auth";
import { API } from "@/api/api.config";

export async function login(
  credentials: LoginDto,
  complete?: CompleteCallback
) {
  const req = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const status = req.status;
  const response = await req.json();

  if (!req.ok) {
    const message = response.message || "Something went wrong";
    throw new Error(message);
  }

  console.log(response);

  return response;
}

export async function otpLogin(
  email: string,
  otp: string,
  complete?: CompleteCallback
) {
  const req = await fetch("/api/auth/login/otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const status = req.status;
  const response = await req.json();

  if (!req.ok) {
    const message = response.message || "Something went wrong";
    throw new Error(message);
  }

  console.log(response);

  return response;
}

export async function forgotPasswordOtp(data: EmailDto) {
  try {
    const response = await API.post("/api/auth/forgot-password/otp", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    let message = "Failed to send OTP";
    if (error.response && error.response.data) {
      message =
        error.response.data.message || error.response.data.error || message;
    }
    throw new Error(message);
  }
}

export async function forgotPassword(data: ForgotPasswordDto) {
  try {
    const response = await API.post("/api/auth/forgot-password", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    let message = "Failed to reset password";
    if (error.response && error.response.data) {
      message =
        error.response.data.message || error.response.data.error || message;
    }
    throw new Error(message);
  }
}
