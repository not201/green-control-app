import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwToken")?.value;

  const publicPaths = ["/iniciar-sesion", "/registrarse", "/"];
  const isPublicPath = publicPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(path + "/"),
  );

  if (!token && !isPublicPath) {
    const url = new URL("/iniciar-sesion", request.url);
    return NextResponse.redirect(url);
  }

  if (
    token &&
    (request.nextUrl.pathname === "/iniciar-sesion" ||
      request.nextUrl.pathname === "/registrarse")
  ) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
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
