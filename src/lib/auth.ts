import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Add debugging utility
function logError(context: string, error: any) {
  console.error(`[AUTH_ERROR] ${context}:`, {
    message: error?.message,
    code: error?.code,
    stack: error?.stack?.slice(0, 200)
  });
}

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

    const newToken = {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };

    // Update the database with the new token
    try {
      if (token.email) {
        const dbUser = await prisma.users.findUnique({
          where: { email: token.email }
        });
        
        if (dbUser) {
          await prisma.accounts.updateMany({
            where: {
              userId: dbUser.id,
              provider: "google"
            },
            data: {
              access_token: refreshedTokens.access_token,
              expires_at: Math.floor((Date.now() + refreshedTokens.expires_in * 1000) / 1000),
              refresh_token: refreshedTokens.refresh_token ?? token.refreshToken,
            }
          });
          console.log("Updated refreshed token in database for:", token.email);
        }
      }
    } catch (dbError) {
      console.error("Failed to update refreshed token in database:", dbError);
    }

    return newToken;
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
          // Generate new verification code for unverified user attempting to login
          const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
          const newVerificationCodeExpiry = new Date(Date.now() + 5 * 60 * 1000);

          await prisma.users.update({
            where: { email: credentials.email },
            data: {
              verificationCode: newVerificationCode,
              verificationCodeExpiry: newVerificationCodeExpiry,
            }
          });

          // Send verification code email
          try {
            const { sendEmail, generateVerificationCodeEmailHtml, generateVerificationCodeEmailText } = await import("@/lib/email");
            
            const emailResult = await sendEmail({
              to: credentials.email,
              subject: "TimeROI - Email Verification Required",
              html: generateVerificationCodeEmailHtml(user.name || "User", newVerificationCode),
              text: generateVerificationCodeEmailText(user.name || "User", newVerificationCode)
            });
            
            if (emailResult.success) {
              console.log(`Verification code sent to unverified user attempting login: ${credentials.email}`);
            }
          } catch (emailError: unknown) {
            const error = emailError instanceof Error ? emailError : new Error(String(emailError));
            console.error("Failed to send verification email on login attempt:", error.message);
          }
          
          throw new Error("EMAIL_NOT_VERIFIED|Your email is not verified. We've sent a new verification code to your email. Please verify your email before signing in.|" + credentials.email);
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
    async signIn({ user, account, profile: _profile }) {
      console.log("NextAuth signIn callback triggered:", { 
        provider: account?.provider, 
        userEmail: user.email,
        userName: user.name 
      });

      // Handle Google OAuth user creation/update
      if (account?.provider === "google") {
        console.log("Processing Google OAuth signin for:", user.email);
        
        try {
          // Check if user already exists
          let existingUser = await prisma.users.findUnique({
            where: { email: user.email! }
          });

          if (existingUser) {
            console.log("Existing Google user found:", existingUser.email);
            // Update user info if needed
            if (!existingUser.emailVerified) {
              await prisma.users.update({
                where: { email: user.email! },
                data: { 
                  emailVerified: new Date(),
                  name: user.name || existingUser.name,
                  image: user.image || existingUser.image
                }
              });
              console.log("Updated email verification for existing user");
            }
            
            // Check if Google account is linked
            const existingAccount = await prisma.accounts.findFirst({
              where: {
                userId: existingUser.id,
                provider: "google"
              }
            });

            if (!existingAccount) {
              // Link Google account
              await prisma.accounts.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                }
              });
              console.log("Linked Google account to existing user");
            }
          } else {
            console.log("Creating new Google user:", user.email);
            // Create new user
            existingUser = await prisma.users.create({
              data: {
                email: user.email!,
                name: user.name || "",
                image: user.image || null,
                emailVerified: new Date(), // Google emails are pre-verified
                company: "",
              }
            });
            console.log("New Google user created:", existingUser.id);

            // Create the account record
            await prisma.accounts.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              }
            });
            console.log("Created Google account record for new user");
          }
          
          return true;
        } catch (error) {
          logError("Google OAuth user creation/update", error);
          // Don't block the login completely, but log the error
          console.error("Database operation failed, but allowing login to proceed");
          return true;
        }
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
        userId: user?.id,
        tokenEmail: token?.email 
      });

      // Initial sign in
      if (account && user) {
        console.log("JWT: Initial sign in for provider:", account.provider);
        
        // Handle Google OAuth - get user from database
        if (account.provider === "google") {
          console.log("Handling Google OAuth in JWT callback for:", user.email);
          
          try {
            // Get the user from database to ensure we have the correct ID and info
            const dbUser = await prisma.users.findUnique({
              where: { email: user.email! }
            });

            if (dbUser) {
              console.log("Found database user for Google OAuth:", dbUser.id);
              return {
                ...token,
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                image: dbUser.image,
                company: dbUser.company || "",
                provider: "google",
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
              };
            } else {
              console.error("Database user not found for Google OAuth:", user.email);
              // Fallback to user object data
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
          } catch (error) {
            logError("JWT callback database lookup", error);
            // Fallback to user object data
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

      // If we don't have an access token in the token, try to get it from database
      if (!token.accessToken && token.email) {
        console.log("No accessToken in JWT, fetching from database for:", token.email);
        try {
          const dbUser = await prisma.users.findUnique({
            where: { email: token.email }
          });
          
          if (dbUser) {
            const googleAccount = await prisma.accounts.findFirst({
              where: {
                userId: dbUser.id,
                provider: "google"
              }
            });
            
            if (googleAccount && googleAccount.access_token) {
              console.log("Found Google access token in database for:", token.email);
              token.accessToken = googleAccount.access_token;
              token.refreshToken = googleAccount.refresh_token || undefined;
              token.accessTokenExpires = googleAccount.expires_at ? googleAccount.expires_at * 1000 : 0;
            }
          }
        } catch (error) {
          console.error("Error fetching access token from database:", error);
        }
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      if (token.refreshToken) {
        return await refreshAccessToken(token);
      }
      
      return token;
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
        session.user.email = (token.email as string) || undefined;
        session.user.name = (token.name as string) || undefined;
        session.user.image = (token.image as string) || undefined;
        (session.user as any).company = token.company as string;
        (session.user as any).provider = token.provider as string;
        session.accessToken = token.accessToken as string;
        console.log("Session created for user:", session.user.id, "with email:", session.user.email);
        console.log("Session accessToken set:", !!session.accessToken);
      }
      return session;
    },
  },
};