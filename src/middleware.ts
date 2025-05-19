import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authenticatedRoutes = ["/my-projects"];

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;

  if (user && request.nextUrl.pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const requiresAuth = authenticatedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && requiresAuth) {
    return NextResponse.redirect(new URL("/register", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
