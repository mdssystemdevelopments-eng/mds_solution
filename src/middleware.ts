import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminSurfacePath, isAllowedAdminHost, isLocalAdminHost, normalizeHost } from "@/lib/admin-host";

function deny(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse("Not Found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export function middleware(req: NextRequest) {
  const host = normalizeHost(req.headers.get("host"));
  const { pathname } = req.nextUrl;

  if (isLocalAdminHost(host)) {
    return NextResponse.next();
  }

  const onAdminHost = isAllowedAdminHost(host);

  if (!onAdminHost && isAdminSurfacePath(pathname)) {
    return deny(req);
  }

  if (onAdminHost && (pathname === "/" || !isAdminSurfacePath(pathname))) {
    const url = req.nextUrl.clone();
    url.pathname = "/loginsolution";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|webm|woff2)$).*)",
  ],
};
