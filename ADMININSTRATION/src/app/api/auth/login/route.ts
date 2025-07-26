import { authEndpoints } from "@/endpoints";

const baseUrl = process.env.API_URL as string;
const maxAge = process.env.COOKIE_MAX_AGE as string;
const authCookie = process.env.AUTH_COOKIE_NAME as string;

export async function POST(req: Request) {
  const url = `${baseUrl}${authEndpoints.login}`;
  const body = await req.json();

  const { email, password } = body;

  if (!email || !password) {
    return Response.json(
      { message: "Invalid credentials", data: null },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.status,
    });
  } catch (err: any) {
    const message = err.message || "An error occurred";
    return Response.json({ message, data: null }, { status: 500 });
  }
}
