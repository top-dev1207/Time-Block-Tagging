"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const UnauthorizedPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]); // Remove router from dependencies

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white animate-pulse" />
              </div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Screen Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop"
          alt="Executive Time Management and Business Analytics"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-800/80 to-red-700/70" />
      </div>

      {/* Dynamic Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="dynamic-grid" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-2">Access Denied</CardTitle>
              <CardDescription className="text-gray-600">
                You don't have permission to access this page. Contact your administrator if you believe this is an error.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 mb-1">
                      Insufficient Permissions
                    </h3>
                    <p className="text-sm text-red-700">
                      Your current role doesn't have access to this resource. Please contact your system administrator to request appropriate permissions.
                    </p>
                  </div>
                </div>
              </div>

              {session?.user && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">
                    <p><strong>Signed in as:</strong> {session.user.name}</p>
                    <p><strong>Email:</strong> {session.user.email}</p>
                    {(session.user as any)?.role && (
                      <p><strong>Role:</strong> {(session.user as any).role}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full h-11"
                >
                  Go Back
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                Need help? <Link href="/contact" className="text-primary hover:text-primary/80 font-medium">Contact Support</Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;