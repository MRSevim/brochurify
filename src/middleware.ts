import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { appConfig } from "./utils/config";

const authenticatedRoutes = ["/my-projects", "/my-account"];

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
  const url = request.nextUrl;

  const path = url.pathname;

  // This allows local subdomain testing
  const hostname = request.headers
    .get("host")
    ?.replace(".localhost:3000", appConfig.DOMAIN_EXTENSION);

  //if no localhost subdomain, return early
  if (hostname === "localhost:3000") return NextResponse.next();

  // 🧠 --- Skip platform root non-tenant paths
  const isPlatformRoot =
    hostname === appConfig.BASE_DOMAIN ||
    hostname === "www." + appConfig.BASE_DOMAIN;
  const isRootPage = path === "/" || path === "";
  if (isPlatformRoot || !isRootPage) return NextResponse.next();

  // 🧭 ---  Rewrite for everything else
  if (!isPlatformRoot) {
    const domain = hostname;
    url.pathname = `/${domain}`;
    return NextResponse.rewrite(url);
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
