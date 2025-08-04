import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from 'next-auth';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  company: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  clearSession: () => void;
  clearUser: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      user: null,
      isLoading: true,
      isAuthenticated: false,
      hasHydrated: false,
      
      setSession: (session) => set({ 
        session, 
        isAuthenticated: !!session,
        isLoading: false 
      }),
      
      setUser: (user) => set({ 
        user,
        isAuthenticated: true
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      clearSession: () => set({ 
        session: null, 
        user: null,
        isAuthenticated: false,
        isLoading: false 
      }),
      
      clearUser: () => set({ 
        user: null,
        isAuthenticated: false 
      }),
      
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ session: state.session, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);