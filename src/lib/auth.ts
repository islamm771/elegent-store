import { compare, hashSync } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { encode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "./db";

const DAY = 24 * 60 * 60;
const REMEMBER_MAX_AGE = 30 * DAY; // "Remember for 30 days"

let dummyHash: string | undefined;
const getDummyHash = () => (dummyHash ??= hashSync("elegent-dummy-password", 12));

export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

/** Social buttons shown on the auth pages — only providers that are actually configured. */
export function getSocialProviders(): Array<"google"> {
  return googleEnabled ? ["google"] : [];
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: REMEMBER_MAX_AGE },
  jwt: {
    maxAge: REMEMBER_MAX_AGE,
    // Unchecked "Remember" → the token (and cookie) lives 24h instead of 30 days.
    async encode({ token, secret, maxAge }) {
      return encode({ token, secret, maxAge: token?.remember === false ? DAY : maxAge });
    },
  },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        // compare against a dummy hash when the user doesn't exist so timing doesn't leak which emails are registered
        const ok = await compare(password, user?.passwordHash ?? getDummyHash());
        if (!user || !ok) return null;

        return { id: user.id, name: user.name, email: user.email, remember: credentials?.remember !== "false" };
      },
    }),
    ...(googleEnabled
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.remember = user.remember ?? true;
      }
      if (trigger === "update" && typeof session?.name === "string") token.name = session.name; // profile rename
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id;
        if (token.name) session.user.name = token.name;
      }
      return session;
    },
  },
};
