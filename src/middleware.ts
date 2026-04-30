import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Set the current URL in headers for server components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-url', nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
});

export const config = {
  // Matchers for routes to run middleware on
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
