"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, ArrowLeft, TrendingUp, Target, BarChart3, Timer, Award, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn, useSession } from "next-auth/react";
import { useCalendarSync } from "@/hooks/useCalendarSync";
import { motion } from "framer-motion";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const { syncCalendarEvents } = useCalendarSync();
  
  // Get redirect URL from query params or default to dashboard
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    setMounted(true);
    // Show dialog on page load
    setShowDialog(true);
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl);
    }
  }, [status, session, callbackUrl, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Check if it's an email verification error with structured format
        if (result.error.startsWith("EMAIL_NOT_VERIFIED|")) {
          const errorParts = result.error.split("|");
          const message = errorParts[1] || "Email verification required";
          const userEmail = errorParts[2] || email;
          
          toast({
            title: "Email verification required",
            description: message,
            variant: "destructive",
          });
          
          // Redirect to verification code page with email
          router.push(`/verify-code?email=${encodeURIComponent(userEmail)}&from=login`);
        } else if (result.error.includes("verify your email")) {
          toast({
            title: "Email verification required",
            description: "Please verify your email before signing in. Check your inbox for the verification code.",
            variant: "destructive",
          });
          // Redirect to verification page with email
          router.push(`/verify-code?email=${encodeURIComponent(email)}&from=login`);
        } else {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password.",
            variant: "destructive",
          });
        }
      } else if (result?.ok) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your TimeROI dashboard.",
        });
        
        // Trigger calendar sync after successful login
        setTimeout(() => {
          syncCalendarEvents(true);
        }, 1000);
        
        // Redirect to original destination or dashboard
        router.push(callbackUrl);
      }
    } catch {
      toast({
        title: "Error",
        description: "An error occurred during sign in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Use redirect: true for Google OAuth (more reliable)
      await signIn("google", { 
        callbackUrl: callbackUrl,
        redirect: true 
      });
    } catch {
      console.error("Google sign-in error");
      toast({
        title: "Error",
        description: "Failed to sign in with Google.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("azure-ad", { 
        callbackUrl: callbackUrl,
        redirect: false 
      });
      
      if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to sign in with Microsoft.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
      </div>

      {/* Dynamic Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="dynamic-grid" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted && (
          <>
            {/* Time Management Icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[15%] left-[10%] w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Clock className="h-8 w-8 text-white/70" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[25%] left-[15%] w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <BarChart3 className="h-7 w-7 text-white/70" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
              className="absolute bottom-[30%] left-[8%] w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Timer className="h-6 w-6 text-white/70" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 2, duration: 2.2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[35%] left-[5%] w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Target className="h-5 w-5 text-green-300" />
            </motion.div>

            {/* Value Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 3, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[20%] left-[25%] px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
            >
              <span className="text-white/80 text-sm font-medium">£10K Strategic Time</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
              className="absolute bottom-[35%] left-[20%] px-3 py-1 bg-primary/20 rounded-full backdrop-blur-sm border border-primary/30"
            >
              <span className="text-white/80 text-xs font-medium">Executive ROI</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ delay: 1.8, duration: 2.8, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[45%] left-[12%] px-3 py-1 bg-primary/20 rounded-full backdrop-blur-sm border border-primary/30"
            >
              <span className="text-white/80 text-xs font-medium">Time Analytics</span>
            </motion.div>

            {/* Orbiting Elements */}
            <div className="absolute top-[40%] left-[30%] w-32 h-32">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-full h-full"
              >
                <div className="absolute top-0 left-1/2 w-6 h-6 -ml-3 bg-yellow-500/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-200">£10K</span>
                </div>
                <div className="absolute right-0 top-1/2 w-6 h-6 -mt-3 bg-purple-500/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white/80">£1K</span>
                </div>
                <div className="absolute bottom-0 left-1/2 w-6 h-6 -ml-3 bg-green-500/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-200">£100</span>
                </div>
                <div className="absolute left-0 top-1/2 w-6 h-6 -mt-3 bg-orange-500/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-200">£10</span>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Content */}
        <div className="flex-1 lg:flex-[0.8] flex items-center justify-center p-8 lg:p-12 xl:p-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Link href="/" className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-8">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">TimeROI</span>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Transform Your Time Into
                <span className="block text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                  Meaningful Value
                </span>
              </h1>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Join thousands of executives who've discovered the power of strategic time allocation. 
                Turn every hour into measurable business impact.
              </p>

              {/* Value Propositions */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: TrendingUp, text: "Optimize for £10K strategic work over £10 admin tasks" },
                  { icon: Target, text: "Balance Revenue, Recovery, and Relationships" },
                  { icon: Award, text: "Gain clarity on your true time ROI" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3 text-white/90"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: "10,000+", label: "Executives" },
                  { value: "73%", label: "Time Optimized" },
                  { value: "2.5hrs", label: "Daily Savings" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Form */}
        <div className="flex-1 lg:flex-[0.6] flex items-center justify-center p-6 lg:p-8 xl:p-12">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-sm"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-gray-900 mb-2">Welcome Back</CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to your TimeROI dashboard to continue optimizing your executive time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-gray-700">Password</Label>
                      <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <Button 
                      className="w-full h-11 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>
                    
                    <Button 
                      className="w-full h-11 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
                      onClick={handleMicrosoftSignIn}
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#F25022" d="M1 1h10v10H1z"/>
                        <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                        <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                        <path fill="#FFB900" d="M13 13h10v10H13z"/>
                      </svg>
                      Continue with Microsoft
                    </Button>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
                    Sign up
                  </Link>
                  <div className="text-center text-sm text-gray-600 text-[20px]">Hi, Colin</div>
                  <div className="text-center text-sm text-gray-600 text-[20px]">WhatsApp: +447973186712</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Important Message Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageCircle className="h-6 w-6" />
              Important Message
            </DialogTitle>
            <DialogDescription>
              Message from Kyrylo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Hi Colin,</p>
              
              <p>I hope you&apos;re doing well.</p>
              
              <p>I wanted to let you know that my Upwork account has been unexpectedly blocked. While I can&apos;t be certain, I suspect it may have been flagged after your message about me &quot;not seeming from Ukraine,&quot; though there could be other reasons. I take full responsibility and am trying to restore it, but this can be very difficult.</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-800">Google Calendar integration has been successfully implemented in the current project. Please check it out.</p>
                <a 
                  href="https://time-block-tagging.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  https://time-block-tagging.vercel.app
                </a>
              </div>
              
              <p>I truly value the progress and trust we&apos;ve built. If my account can&apos;t be recovered, I&apos;m happy to continue working with you outside Upwork to complete your project to the same high standard. If you&apos;d prefer not to, I will understand - but I would be grateful if you allowed me to finish what we started.</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-800">Here is my WhatsApp number. Please contact me there.</p>
                <a 
                  href="https://wa.me/380914817360" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-mono text-lg mt-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  +380 91 481 7360
                </a>
              </div>
              
              <p>Thank you,<br />Kyrylo</p>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={() => setShowDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-dashboard flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-executive">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Clock className="h-6 w-6 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;