"use server";
import { generateJWTToken } from "@/lib/jwt";
import NextAuth from "next-auth";
import supabase from "@/lib/supabase";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: any;
      account: any;
      user: any;
    }) {
      if (account && user) {
        const jwtToken = generateJWTToken(user);
        token.accessToken = jwtToken;
      }
      console.log("JWT token: ", token);
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      console.log("Session accessToken: ", session.accessToken);
      return session;
    },

    async signIn({ user }: { user: any }) {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email)
        .single();

      if (!existingUser) {
        await supabase.from("profiles").insert({
          full_name: user.name,
          email: user.email,
          avatar_url: user.image,
        });
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
