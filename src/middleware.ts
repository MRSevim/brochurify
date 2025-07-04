import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { appConfig } from "./utils/config";

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
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  const isLocalhost =
    hostname.includes("localhost") || hostname.startsWith("127.0.0.1");
  const path = url.pathname;

  // 🧠 ---  Bypass on localhost
  if (isLocalhost) return;

  // 🧠 --- Skip platform root non-tenant paths
  const isPlatformRoot =
    hostname === appConfig.BASE_DOMAIN ||
    hostname === "www." + appConfig.BASE_DOMAIN;
  const isRootPage = path === "/" || path === "";
  if (isPlatformRoot || !isRootPage) return;

  // 🧭 ---  Rewrite for tenant subdomains (*.brochurify.app)

  if (hostname.endsWith(appConfig.DOMAIN_EXTENSION)) {
    const subdomain = hostname.replace(appConfig.DOMAIN_EXTENSION, "");
    url.pathname = `/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  // 🧭 ---  Rewrite for custom domains (everything else)
  if (!isPlatformRoot && !isLocalhost) {
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
