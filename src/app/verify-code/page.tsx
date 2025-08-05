"use client";

import { Suspense } from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, ArrowLeft, CheckCircle, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const VerifyCodeForm = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const email = searchParams.get("email");

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every(digit => digit !== "") && newCode.join("").length === 6) {
      handleVerifyCode(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);
    
    if (digits.length === 6) {
      const newCode = digits.split("");
      setCode(newCode);
      handleVerifyCode(digits);
    }
  };

  const handleVerifyCode = async (codeString: string) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please return to signup.",
        variant: "destructive",
      });
      return;
    }

    if (timeLeft <= 0) {
      toast({
        title: "Code expired",
        description: "Please request a new verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email,
          code: codeString 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsVerified(true);
        toast({
          title: "Email verified! ✅",
          description: "Your account has been successfully verified.",
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast({
          title: "Verification failed",
          description: data.error || "Invalid verification code. Please try again.",
          variant: "destructive",
        });
        // Clear the code for retry
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please return to signup.",
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
          title: "New code sent",
          description: "Check your email for the new verification code.",
        });
        // Reset timer
        setTimeLeft(300);
        // Clear current code
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to resend verification code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
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
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center mx-auto mb-4">
                {isVerified ? (
                  <CheckCircle className="h-7 w-7 text-white" />
                ) : (
                  <Mail className="h-7 w-7 text-white" />
                )}
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                {isVerified ? "Email Verified!" : "Enter Verification Code"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isVerified 
                  ? "Your account has been successfully verified."
                  : email 
                    ? `We've sent a 6-digit code to ${email}`
                    : "Enter the 6-digit code from your email"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isVerified ? (
                <div className="text-center space-y-4">
                  <p className="text-green-600 font-medium">
                    🎉 Welcome to TimeROI! Redirecting to login...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Code Input */}
                  <div className="flex justify-center gap-3">
                    {code.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-primary"
                        disabled={isVerifying || timeLeft <= 0}
                      />
                    ))}
                  </div>

                  {/* Timer */}
                  <div className="text-center">
                    {timeLeft > 0 ? (
                      <p className="text-sm text-gray-600">
                        Code expires in: <span className="font-bold text-primary">{formatTime(timeLeft)}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 font-bold">
                        ⏰ Code expired
                      </p>
                    )}
                  </div>

                  {/* Manual Verify Button */}
                  <Button 
                    onClick={() => handleVerifyCode(code.join(""))}
                    disabled={code.some(digit => !digit) || isVerifying || timeLeft <= 0}
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium"
                  >
                    {isVerifying ? "Verifying..." : "Verify Code"}
                  </Button>

                  {/* Resend Code */}
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?
                    </p>
                    <Button 
                      onClick={handleResendCode}
                      disabled={isResending || timeLeft > 240} // Can resend after 1 minute
                      variant="outline"
                      className="w-full h-11"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resend Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

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

const VerifyCodePage = () => {
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
      <VerifyCodeForm />
    </Suspense>
  );
};

export default VerifyCodePage;