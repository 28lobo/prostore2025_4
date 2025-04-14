// auth.ts
import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const prisma = (globalThis as { prisma?: PrismaClient }).prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') (globalThis as any).prisma = prisma;

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      console.log(token);

      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
    authorized({ request, auth }: any) {
      // check for session cart cookie
      const sessionCartIdCookie = request.cookies.get('sessionCartId');
      if (!sessionCartIdCookie) {
        const sessionCartId = crypto.randomUUID();
        console.log(sessionCartId);
        // clone request headers
        const newRequestHeaders = new Headers(request.headers);

        // create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders
          }
        });
        // set newly generated sessionCartId in the response cookie
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      } else {
        return true;
      }
    }
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
// Removed: export { auth as middleware } from "@/auth";  