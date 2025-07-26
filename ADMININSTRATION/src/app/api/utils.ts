const authCookieName = process.env.AUTH_COOKIE_NAME as string;

export function getAuth(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const cookies = cookieHeader?.split(";").map((c) => c.trim());

  if (!cookies) {
    return null;
  }

  const authCookie = cookies.find((c) => c.includes(`${authCookieName}=`));
  const token = authCookie?.split("=")[1];

  if (!token) {
    return null;
  }

  return token;
}

export function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
}
