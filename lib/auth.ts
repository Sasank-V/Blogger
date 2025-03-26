// import { IUser, User } from "@/models/User";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import { connect_DB } from "@/utils/DB";
// import { google } from "googleapis";
// import { OAuth2Client } from "google-auth-library";
// import { defaultCategories } from "./constants";
// import { defaultCategories } from "@/lib/constants";

// export const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.REDIRECT_URI // e.g., "http://localhost:3000/oauth2callback"
// );

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string; // Assign `sub` as `id`
      }
      return session;
    },
    async signIn({ account, user }) {
      if (!account) return false;
      await fetch("http://localhost:8080/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          google_id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        }),
      });
      return true;
    },
  },
};
