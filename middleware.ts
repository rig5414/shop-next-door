import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // TEMPORARY BYPASS: Remove authentication check
  // const token = req.cookies.get("appSession")?.value;
  // if (!token) {
  //   return NextResponse.redirect(new URL("/api/auth/login", req.url));
  // }

  // Extract user role from cookie (assuming role is stored in JWT or session)
  const userRole = req.cookies.get("userRole")?.value || "customer"; // Default to customer

  // Only redirect if the user is trying to access `/dashboard` directly (not subpages)
  if (req.nextUrl.pathname === "/dashboard") {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    } else if (userRole === "vendor") {
      return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard/customer", req.url));
    }
  }

  return NextResponse.next(); // Allow normal page access
}

// Define paths to protect
export const config = {
  matcher: ["/dashboard/:path*"],
};
