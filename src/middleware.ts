import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminHost, isLocalAdminHost, normalizeHost } from "@/lib/admin-host";
import { publicSiteUrl } from "@/lib/site-url";

export function middleware(req: NextRequest) {
  const host = normalizeHost(req.headers.get("x-forwarded-host") || req.headers.get("host"));
  const { pathname } = req.nextUrl;

  if (isLocalAdminHost(host) || host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  if (host === getAdminHost() && (pathname === "/business" || pathname.startsWith("/business/"))) {
    if (req.cookies.get("mds_admin")?.value) {
      return NextResponse.next();
    }
    const url = new URL(`${publicSiteUrl()}${pathname}`);
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url);
  }

  if (host === getAdminHost() && pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/loginsolution";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|uploads/|api/media/|.*\\..*).*)"],
};
