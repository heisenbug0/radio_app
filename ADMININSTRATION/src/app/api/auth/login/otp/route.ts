import { authEndpoints } from "@/endpoints";
import { OtpLoginResponse } from "@/responses";
const baseUrl = process.env.API_URL as string;
const maxAge = process.env.COOKIE_MAX_AGE as string;
const authCookie = process.env.AUTH_COOKIE_NAME as string;

export async function POST(req: Request) {
  const body = await req.json();

  const { email, otp } = body;

  if (!otp || !email) {
    return Response.json(
      { message: "Invalid OTP", data: null },
      { status: 401 }
    );
  }

  let numeric: Number;

  try {
    numeric = parseInt(otp);
  } catch (e) {
    return Response.json(
      { message: "Invalid OTP", data: null },
      { status: 401 }
    );
  }

  try {
    const url = `${baseUrl}${authEndpoints.otpLogin}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response) {
      return Response.json(
        { message: "Service unavailable", data: null },
        { status: 501 }
      );
    }

    const result = await response.json();
    const headers = new Headers();

    if (response.ok) {
      const details: OtpLoginResponse = result;

      const token = details.data.token;
      headers.append(
        "Set-Cookie",
        `${authCookie}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; Secure`
      );
    }

    return new Response(JSON.stringify(result), {
      status: response.status,
      headers,
    });
  } catch (e) {
    return Response.json(
      { message: "Service unavailable", data: null },
      { status: 500 }
    );
  }
}
