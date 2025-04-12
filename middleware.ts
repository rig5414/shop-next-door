import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Check for authentication
  const token = req.cookies.get("next-auth.session-token")?.value || 
                req.cookies.get("__Secure-next-auth.session-token")?.value;
  
  // If no authentication token, redirect to login
  if (!token) {
    // For API requests, return 401 Unauthorized
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // For page requests, redirect to login with return URL
    const returnUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/auth/login?returnUrl=${returnUrl}`, req.url));
  }

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
