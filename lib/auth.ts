// app/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
 // <-- adjust if your prisma is in a different path

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // @ts-expect-error add id to session.user
        session.user.id = user.id;
      }
      return session;
    },
  },
};
