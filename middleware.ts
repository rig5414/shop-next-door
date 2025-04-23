import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Get the token using next-auth's getToken helper
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // If no token, handle unauthorized access
  if (!token) {
    // For API requests, return 401 Unauthorized
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // For page requests, redirect to login with return URL
    const returnUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/auth/login?returnUrl=${returnUrl}`, req.url));
  }

  // Get user role from the token
  const userRole = token.role as string || "customer";

  // Only redirect if the user is trying to access `/dashboard` directly
  if (req.nextUrl.pathname === "/dashboard") {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    } else if (userRole === "vendor") {
      return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard/customer", req.url));
    }
  }

  return NextResponse.next();
}

// Define paths to protect
export const config = {
  matcher: ["/dashboard/:path*"],
};
