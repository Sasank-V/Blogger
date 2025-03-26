import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    // Sign in callback: send user details to /api/signin to get the user_id
    async signIn({ account, user }) {
      if (account && user) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/signin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                google_id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
              }),
            }
          );
          const data = await res.json();
          // Update the user object with the user_id returned by /api/signin
          user.id = data.user_id;
          return true;
        } catch (err) {
          console.error("Error in signIn callback:", err);
          return false;
        }
      }
      return true;
    },

    // JWT callback: store the user_id from the signIn callback in the token
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id; // Save the user_id returned from /api/signin
      }
      return token;
    },

    // Session callback: attach the user_id from the token to session.user
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
};
