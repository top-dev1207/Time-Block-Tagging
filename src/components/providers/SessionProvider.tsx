"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import { ReactNode, useEffect } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

function AuthStoreSync() {
  const { data: session, status } = useSession();
  const { setSession, setLoading } = useAuthStore();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
      setSession(session);
    }
  }, [session, status, setSession, setLoading]);

  return null;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      <AuthStoreSync />
      {children}
    </NextAuthSessionProvider>
  );
}