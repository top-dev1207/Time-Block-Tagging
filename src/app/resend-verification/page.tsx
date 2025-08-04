"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ResendVerificationPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
        setIsSubmitted(true);
        toast({
          title: "Verification email sent",
          description: data.message,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
                {isSubmitted ? (
                  <Mail className="h-7 w-7 text-white" />
                ) : (
                  <Clock className="h-7 w-7 text-white" />
                )}
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                {isSubmitted ? "Verification Email Sent" : "Resend Verification Email"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isSubmitted 
                  ? "We've sent a new verification link to your email address."
                  : "Enter your email address and we'll send you a new verification link."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 btn-elegant text-white font-medium" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Verification Email"}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Please check your email inbox and spam folder for the verification link.
                  </p>
                  <Button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full h-11"
                  >
                    Send to Different Email
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;