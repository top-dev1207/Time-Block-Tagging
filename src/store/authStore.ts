import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from 'next-auth';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  clearSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      isLoading: true,
      isAuthenticated: false,
      hasHydrated: false,
      
      setSession: (session) => set({ 
        session, 
        isAuthenticated: !!session,
        isLoading: false 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      clearSession: () => set({ 
        session: null, 
        isAuthenticated: false,
        isLoading: false 
      }),
      
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);