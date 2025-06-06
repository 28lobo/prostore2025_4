import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    } & DefaultSession["user"];
  }
}
