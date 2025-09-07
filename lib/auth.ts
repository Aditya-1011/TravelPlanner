// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" }, // keep if you prefer JWT
  callbacks: {
    // when user first signs in, put the id in token
    async jwt({ token, user }) {
      if (user) {
        // user is present only at first sign in
        (token as any).id = (user as any).id;
      }
      return token;
    },

    // whenever a session is checked, copy token.id -> session.user.id
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id as string | undefined;
      }
      return session;
    },
  },
};
