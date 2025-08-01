import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from 'next-auth';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isLoading: true,
      isAuthenticated: false,
      
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
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ session: state.session }),
    }
  )
);