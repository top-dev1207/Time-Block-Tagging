"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    if (previousPath !== pathname && pathname.startsWith('/dashboard')) {
      setIsLoading(true);
      setPreviousPath(pathname);
      
      // Show loading for a minimum duration for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Clock className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Loading</h3>
              <p className="text-sm text-gray-600">Preparing your dashboard...</p>
            </div>
            
            {/* Loading animation */}
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};