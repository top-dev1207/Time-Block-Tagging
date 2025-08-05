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
  adapter: PrismaAdapter(prisma),
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
      // Handle Google OAuth signup/login
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          const existingUser = await prisma.users.findUnique({
            where: { email: user.email! }
          });

          if (!existingUser) {
            // Create new user for Google signup
            const newUser = await prisma.users.create({
              data: {
                email: user.email!,
                name: user.name || "",
                image: user.image || "",
                company: "", // Will be updated later
                emailVerified: new Date(), // Google accounts are pre-verified
                provider: "google",
              }
            });
            user.id = newUser.id;
          } else {
            user.id = existingUser.id;
            (user as any).company = existingUser.company;
          }
          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      
      // Handle Azure AD OAuth signup/login
      if (account?.provider === "azure-ad") {
        try {
          const existingUser = await prisma.users.findUnique({
            where: { email: user.email! }
          });

          if (!existingUser) {
            const newUser = await prisma.users.create({
              data: {
                email: user.email!,
                name: user.name || "",
                image: user.image || "",
                company: "", // Will be updated later
                emailVerified: new Date(), // Azure accounts are pre-verified
                provider: "azure-ad",
              }
            });
            user.id = newUser.id;
          } else {
            user.id = existingUser.id;
            (user as any).company = existingUser.company;
          }
          return true;
        } catch (error) {
          console.error("Azure AD sign-in error:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          company: (user as any)?.company,
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
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).company = token.company as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};