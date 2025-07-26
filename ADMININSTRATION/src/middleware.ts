import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/admin",
  "/superadmin",
  "/admin/(.*)",
  "/superadmin/(.*)"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Only run on protected routes
  if (protectedRoutes.some(route => new RegExp(`^${route}$`).test(pathname))) {
    const token = request.cookies.get("access_token")?.value;
    const role = request.cookies.get("user_role")?.value;
    if (!token || !role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Optionally, check role for route
    if (pathname.startsWith("/admin") && !["admin", "manager"].includes(role)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/superadmin") && role !== "superadmin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*"]
};
