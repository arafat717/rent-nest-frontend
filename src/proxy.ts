import { NextRequest, NextResponse } from "next/server";

const ROLE_PROTECTED_ROUTES: { prefix: string; roles: string[] }[] = [
  { prefix: "/dashboard/tenant", roles: ["TENANT"] },
  { prefix: "/dashboard/landlord", roles: ["LANDLORD"] },
  { prefix: "/dashboard/admin", roles: ["ADMIN"] },
];

const AUTH_PAGES = ["/login", "/register"];

// Decode role out of the JWT payload without verifying signature —
// verification happens server-side on every API call anyway.
function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Logged-in users shouldn't see login/register again
  if (token && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const matchedRoute = ROLE_PROTECTED_ROUTES.find((route) =>
    pathname.startsWith(route.prefix),
  );

  if (matchedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = getRoleFromToken(token);
    if (!role || !matchedRoute.roles.includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
