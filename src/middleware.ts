iimport { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
  "/api/mpesa/callback",
]);

// Define the allowed domain
const allowedDomains = [
  "https://sandbox.safaricom.co.ke",
  "http://127.0.0.1:3000",
  "http://localhost:3000", // Allow localhost
];

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const origin = request.headers.get("origin");

  // Handle public routes
  if (isPublicRoute(request)) {
    if (!origin || allowedDomains.includes(origin)) {
    // if (origin && allowedDomains.includes(origin)) {
      const response = NextResponse.next();

      // Set CORS headers
      // response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Origin", origin || "*"); 
      response.headers.set(
        "Access-Control-Allow-Methods",
        " POST, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      return response;
    }

    // Reject requests from disallowed domains
    return NextResponse.json(
      { error: "Not allowed by CORS policy" },
      { status: 403 }
    );
  }

  // Protect other routes with Clerk
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/api/:path*",
    "/(api|trpc)(.*)",
  ],
};
