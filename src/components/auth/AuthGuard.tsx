"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login",
  allowedRoles = []
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    setIsLoading(false);

    if (requireAuth && !session) {
      // Store the current path to redirect back after login
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
      return;
    }

    if (!requireAuth && session) {
      // If user is logged in but accessing auth pages, redirect to dashboard
      if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        router.push("/dashboard");
        return;
      }
    }

    // Update auth store with session data
    if (session?.user) {
      setUser({
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        company: (session.user as any)?.company || "",
      });
    } else {
      clearUser();
    }

    // Check role-based access if roles are specified
    if (session && allowedRoles.length > 0) {
      const userRole = (session.user as any)?.role || "user";
      if (!allowedRoles.includes(userRole)) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [session, status, requireAuth, redirectTo, pathname, router, setUser, clearUser, allowedRoles]);

  // Show loading state while checking authentication
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-gray-600">Authenticating...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-gray-600">Redirecting to login...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no authentication required and user is authenticated, redirect from auth pages
  if (!requireAuth && session && (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-gray-600">Redirecting to dashboard...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}