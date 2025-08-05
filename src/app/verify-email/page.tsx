"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, Mail, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const VerifyEmailForm = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token) {
      handleVerification(token);
    }
  }, [token]);

  const handleVerification = async (verificationToken: string) => {
    setIsVerifying(true);
    
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsVerified(true);
        toast({
          title: "Email Verified! ✅",
          description: "Your account has been successfully verified. You can now sign in.",
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
        title: "Verification Error",
        description: "Failed to verify email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "No Email Found",
        description: "Please return to signup and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Verification Email Sent",
          description: "Check your email for the new verification link.",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to resend verification email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

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
    if (isVerified) return "Your account has been successfully verified.";
    if (token && isError) return "This verification link is invalid or has expired.";
    if (email) return `We've sent a verification link to ${email}`;
    return "Please check your email for a verification link.";
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
              {isVerified ? (
                <div className="text-center space-y-4">
                  <p className="text-green-600 font-medium">
                    🎉 Welcome to TimeROI! Your account is now active.
                  </p>
                  <Link href="/login">
                    <Button className="w-full h-11 btn-elegant text-white font-medium">
                      Sign In Now
                    </Button>
                  </Link>
                </div>
              ) : !isVerifying && !token ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800 mb-1">
                          Verification Required
                        </h3>
                        <p className="text-sm text-blue-700">
                          Click the verification link in your email to activate your account. 
                          Check your spam folder if you don't see it.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => router.push("/login")}
                      className="w-full h-11"
                    >
                      I'll verify later - Go to Login
                    </Button>
                  </div>
                </div>
              ) : isVerifying ? (
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Clock className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <p className="text-gray-600">
                    Verifying your email address...
                  </p>
                </div>
              ) : isError ? (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800 mb-1">
                          Verification Failed
                        </h3>
                        <p className="text-sm text-red-700">
                          This verification link is invalid or has expired. Please request a new one.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Request New Verification Link
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => router.push("/signup")}
                      className="w-full h-11"
                    >
                      Back to Sign Up
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 text-center">
                <Link href="/signup" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Sign Up</span>
                </Link>
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