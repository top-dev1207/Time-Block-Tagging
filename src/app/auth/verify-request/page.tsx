"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const VerifyRequestContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop"
          alt="Executive Time Management"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
      </div>

      {/* Dynamic Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="dynamic-grid" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-2">Check Your Email</CardTitle>
              <CardDescription className="text-gray-600">
                {email 
                  ? `We've sent a magic link to ${email}`
                  : "We've sent you a magic link to sign in"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 mb-1">
                        Magic Link Sent!
                      </h3>
                      <p className="text-sm text-blue-700">
                        Click the link in your email to sign in instantly. No password needed!
                        Check your spam folder if you don't see it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">What happens next:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check your email inbox</li>
                    <li>• Click the "Sign in to TimeROI" button</li>
                    <li>• You'll be automatically signed in</li>
                    <li>• Access your executive dashboard instantly</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="w-full h-11"
                  >
                    Resend Magic Link
                  </Button>
                  
                  <Link href="/login">
                    <Button 
                      variant="ghost"
                      className="w-full h-11"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                The magic link will expire in 24 hours for security.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const VerifyRequestPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Clock className="h-6 w-6 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <VerifyRequestContent />
    </Suspense>
  );
};

export default VerifyRequestPage;