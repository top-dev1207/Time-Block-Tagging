import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function refreshAccessToken(token: any) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  // Temporarily disable adapter to fix OAuth issues
  // adapter: PrismaAdapter(prisma),
  debug: true, // Enable debug mode to see detailed logs
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events"
        }
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid email profile https://graph.microsoft.com/calendars.read https://graph.microsoft.com/calendars.readwrite"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password || ""
        );

        if (!isPasswordValid) {
          return null;
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          company: user.company,
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("NextAuth signIn callback triggered:", { 
        provider: account?.provider, 
        userEmail: user.email,
        userName: user.name 
      });

      // Allow Google OAuth signin for now (will handle user creation in JWT callback)
      if (account?.provider === "google") {
        console.log("Allowing Google OAuth for:", user.email);
        return true;
      }
      
      // Allow Azure AD OAuth signin for now
      if (account?.provider === "azure-ad") {
        console.log("Allowing Azure AD OAuth for:", user.email);
        return true;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      console.log("NextAuth JWT callback:", { 
        hasAccount: !!account, 
        hasUser: !!user, 
        provider: account?.provider,
        userId: user?.id 
      });

      // Initial sign in
      if (account && user) {
        console.log("JWT: Initial sign in for provider:", account.provider);
        
        // Handle Google OAuth user creation/retrieval
        if (account.provider === "google") {
          console.log("Handling Google OAuth in JWT callback");
          // For now, just create a token with user info (skip DB operations)
          return {
            ...token,
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            company: "",
            provider: "google",
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
          };
        }

        // Default token creation for other providers
        return {
          ...token,
          id: user.id,
          company: (user as any)?.company || "",
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      console.log("NextAuth session callback:", { 
        hasToken: !!token, 
        tokenId: token?.id,
        tokenEmail: token?.email,
        sessionUserEmail: session?.user?.email 
      });

      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        (session.user as any).company = token.company as string;
        (session.user as any).provider = token.provider as string;
        session.accessToken = token.accessToken as string;
        console.log("Session created for user:", session.user.id, "with email:", session.user.email);
      }
      return session;
    },
  },
};