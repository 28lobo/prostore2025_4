// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = [
  /^\/shipping-address/,
  /^\/cart/,
  /^\/payment-method/,
  /^\/place-order/,
  /^\/profile/,
  /^\/user\//,
  /^\/order\//,
  /^\/admin/,
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ——————————————————————————————————————————
  // 1. sessionCartId cookie logic (runs on every matching route)
  // ——————————————————————————————————————————
  const cartId = request.cookies.get("sessionCartId")?.value;
  let response = NextResponse.next();
  if (!cartId) {
    const newId = crypto.randomUUID();
    response = NextResponse.next();
    response.cookies.set("sessionCartId", newId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // ——————————————————————————————————————————
  // 2. protected-route logic
  // ——————————————————————————————————————————
  if (protectedPaths.some((rx) => rx.test(pathname))) {
    // look for a valid NextAuth JWT
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      // encryption: true  // only if you’re using encryption in your JWT config
    });

    if (!token) {
      // not signed in → redirect to your sign-in page
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = {
  // apply to all pages (but skip /api, /_next, static files)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
