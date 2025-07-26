import { getAuth, decodeJwt } from "../../utils";

export async function GET(req: Request) {
  const token = getAuth(req) || "";
  let role = null;
  if (token) {
    const decoded = decodeJwt(token);
    role = decoded?.role || null;
  }
  return Response.json({ message: "Token retrieved", token, role });
}
