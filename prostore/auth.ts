// auth.ts
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import type { JWT } from "@auth/core/jwt";
import type { AdapterUser } from "@auth/core/adapters";



const prismaClientSingleton = () => { 
  return new PrismaClient();
};

const prisma =
  (globalThis as { prisma?: PrismaClient }).prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;

interface CustomUser extends AdapterUser {
  id: string;
  role: string;
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in", // <-- CORRECTED PATH HERE
    error: "/sign-in", // <-- CORRECTED PATH HERE (usually same as signIn)
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials): Promise<AdapterUser | null> {
  if (!credentials?.email || !credentials?.password) return null;

  const user = await prisma.user.findFirst({
    where: { email: credentials.email },
  });

  if (!user?.password) return null;

 const isMatch = await bcrypt.compare(credentials.password as string, user.password);

  if (!isMatch) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email!,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role,
  } as CustomUser;
}
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (token.sub && session.user) session.user.id = token.sub;
      if (token.role && session.user) session.user.role = token.role as string;
      if (token.name && session.user) session.user.name = token.name;
      if (token.email && session.user) session.user.email = token.email;
      return session;
    },
    async jwt({ token, user, trigger }: { token: JWT; user?: CustomUser | AdapterUser; trigger?: "signIn" | "signUp" | "update"; }): Promise<JWT> {
      if (user) {
        token.sub = user.id;
        token.role = (user as CustomUser).role;
        token.name = user.name;
        token.email = user.email;
        if (user.name === "NO_NAME" && user.email) {
          try {
            const name = user.email.split('@')[0];
            token.name = name;
            await prisma.user.update({ where: { id: user.id }, data: { name: name } });
          } catch (error) { console.error("Failed to update user name:", error); }
        }
        if (trigger === "signIn" || trigger === "signUp") {
          try {
            const cookiesObject = cookies();
            const sessionCartId = cookiesObject.get("sessionCartId")?.value;
            if (sessionCartId) {
              const sessionCart = await prisma.cart.findFirst({ where: { sessionCartId } });
              if (sessionCart) {
                await prisma.cart.deleteMany({ where: { userId: user.id } });
                await prisma.cart.update({
                  where: { id: sessionCart.id },
                  data: { userId: user.id, sessionCartId: null },
                });
                console.log(`Session cart ${sessionCartId} assigned to user ${user.id}.`);
              }
            }
          } catch (error) { console.error("Error merging cart in JWT:", error); }
        }
      }
      // handle session updates
      // if(session?.user.name && trigger === 'update'){
      //   token.name = session.user.name
  
      // }

      return token;
    },
    authorized({ request, auth }: { request: NextRequest; auth: Session | null }) {
      const { pathname } = request.nextUrl;
      const protectedPaths = [
        /^\/shipping-address/, /^\/cart/, /^\/payment-method/,
        /^\/place-order/, /^\/profile/, /^\/user\/(.+)/,
        /^\/order\/(.+)/, /^\/admin/,
      ];
      const isProtectedRoute = protectedPaths.some((pattern) => pattern.test(pathname));

      // 1. Redirect unauthenticated users trying to access protected routes
      if (isProtectedRoute && !auth?.user) {
        const redirectUrl = new URL("/sign-in", request.url); // <-- CORRECTED PATH HERE
        redirectUrl.searchParams.set("callbackUrl", pathname);
        console.log(`Unauthorized access to ${pathname}, redirecting to signIn.`);
        return NextResponse.redirect(redirectUrl);
      }

      // 2. Handle session cart cookie generation if not redirected
      const sessionCartIdCookie = request.cookies.get("sessionCartId");
      let response: NextResponse | boolean = true;
      if (!sessionCartIdCookie?.value) {
        const sessionCartId = crypto.randomUUID();
        console.log(`Generating new sessionCartId: ${sessionCartId} for path: ${pathname}`);
        response = NextResponse.next({ request });
        response.cookies.set({
          name: "sessionCartId", value: sessionCartId, httpOnly: true,
          path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 30,
        });
        console.log(`Set sessionCartId cookie for path: ${pathname}`);
      }
      // 3. Return true (allow) or the response object (allow + set cookie)
      return response;
    },
  },
};

// --- Module Augmentation ---
declare module 'next-auth' {
  interface Session { user: { id: string; role: string; } & Omit<AdapterUser, 'id'>; }
  interface User extends AdapterUser{ role: string; }
}
declare module '@auth/core/jwt' { interface JWT { role?: string; } }
// --- End Module Augmentation ---

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);