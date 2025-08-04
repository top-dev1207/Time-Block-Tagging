"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page - users need to authenticate first
    router.push('/login');
  }, []); // Empty dependency array since we only want this to run once

  // Show loading screen while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse border border-white/20">
          <Clock className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">TimeROI</h1>
        <p className="text-white/70">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default HomePage;