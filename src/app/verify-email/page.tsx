"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const VerifyEmailForm = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setIsError(true);
      return;
    }

    const verifyEmail = async () => {
      setIsVerifying(true);
      
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setIsVerified(true);
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified.",
          });
        } else {
          setIsError(true);
          toast({
            title: "Verification Failed",
            description: data.error || "Invalid or expired verification link.",
            variant: "destructive",
          });
        }
      } catch (error) {
        setIsError(true);
        toast({
          title: "Error",
          description: "Failed to verify email",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token]); // Remove toast from dependencies

  const getIcon = () => {
    if (isVerifying) return <Clock className="h-8 w-8 text-white animate-spin" />;
    if (isVerified) return <CheckCircle className="h-8 w-8 text-white" />;
    return <AlertCircle className="h-8 w-8 text-white" />;
  };

  const getTitle = () => {
    if (isVerifying) return "Verifying Email...";
    if (isVerified) return "Email Verified!";
    return "Verification Failed";
  };

  const getDescription = () => {
    if (isVerifying) return "Please wait while we verify your email address.";
    if (isVerified) return "Your email has been successfully verified. You can now sign in to your account.";
    return "This verification link is invalid or has expired.";
  };

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
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isVerified ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-gradient-to-r from-primary to-primary/80'
              }`}>
                {getIcon()}
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                {getTitle()}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {getDescription()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {isVerified && (
                  <Link href="/login">
                    <Button className="w-full h-11 btn-elegant text-white font-medium">
                      Sign In Now
                    </Button>
                  </Link>
                )}
                
                {isError && (
                  <>
                    <Link href="/resend-verification">
                      <Button className="w-full h-11 btn-elegant text-white font-medium mb-3">
                        Request New Link
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="outline" className="w-full h-11">
                        Back to Sign Up
                      </Button>
                    </Link>
                  </>
                )}

                <div className="mt-6">
                  <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const VerifyEmailPage = () => {
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
      <VerifyEmailForm />
    </Suspense>
  );
};

export default VerifyEmailPage;