import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // If trying to access login page with a token, redirect to dashboard
  if (token && pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // If trying to access a protected admin route without a token, redirect to login
  if (
    !token &&
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
};
