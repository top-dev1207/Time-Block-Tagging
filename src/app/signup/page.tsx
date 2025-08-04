"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, ArrowLeft, TrendingUp, Target, BarChart3, Timer, Award, Lightbulb, Users, Activity, PieChart, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match", 
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Accept terms",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast({
        title: "Account created successfully!",
        description: "Please sign in with your new account.",
      });

      // Automatically sign in the user after successful signup
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }

    } catch (error) {
      toast({
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
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
              className="absolute top-[15%] right-[10%] w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Clock className="h-8 w-8 text-white/70" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[25%] right-[15%] w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <BarChart3 className="h-7 w-7 text-purple-300" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
              className="absolute bottom-[30%] right-[8%] w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Timer className="h-6 w-6 text-white/70" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 2, duration: 2.2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[35%] right-[5%] w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Target className="h-5 w-5 text-green-300" />
            </motion.div>

            {/* Value Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 3, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[20%] right-[25%] px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
            >
              <span className="text-white/80 text-sm font-medium">£10K Strategic Time</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
              className="absolute bottom-[35%] right-[20%] px-3 py-1 bg-primary/20 rounded-full backdrop-blur-sm border border-primary/30"
            >
              <span className="text-purple-200 text-xs font-medium">Executive Growth</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ delay: 1.8, duration: 2.8, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-[45%] right-[12%] px-3 py-1 bg-primary/20 rounded-full backdrop-blur-sm border border-primary/30"
            >
              <span className="text-white/80 text-xs font-medium">Time Optimization</span>
            </motion.div>

            {/* Orbiting Elements */}
            <div className="absolute top-[40%] right-[30%] w-32 h-32">
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-full h-full"
              >
                <div className="absolute top-0 left-1/2 w-6 h-6 -ml-3 bg-yellow-500/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-200">£10K</span>
                </div>
                <div className="absolute right-0 top-1/2 w-6 h-6 -mt-3 bg-primary/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-200">£1K</span>
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
        {/* Left Form */}
        <div className="flex-1 lg:flex-[0.6] flex items-center justify-center p-6 lg:p-8 xl:p-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 warm-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">Welcome to TimeROI Beta</CardTitle>
                <CardDescription className="text-gray-600">
                  You have exclusive access to our executive time analytics platform. Create your account to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-700">Company</Label>
                      <Input
                        id="company"
                        placeholder="ACME Corp"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link href="#" className="text-primary hover:text-primary/80">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-primary hover:text-primary/80">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 btn-elegant text-white font-medium" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Beta Account..." : "Access Beta Platform"}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      className="w-full h-11 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign up with Google
                    </Button>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Content */}
        <div className="flex-1 lg:flex-[0.8] flex items-center justify-center p-8 lg:p-12 xl:p-16">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
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
                Transform Your Executive
                <span className="block text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                  Time Portfolio
                </span>
              </h1>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Join the elite community of executives who've mastered strategic time allocation. 
                Start building your time ROI today.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: TrendingUp, text: "Track £10K strategic hours vs £10 admin tasks" },
                  { icon: Users, text: "Connect with 10,000+ executive community" },
                  { icon: Award, text: "Proven framework: Revenue, Recovery, Relationships" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
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

              {/* Success Metrics */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: "14 Days", label: "Free Trial" },
                  { value: "2.5hrs", label: "Daily Savings" },
                  { value: "73%", label: "Optimization Rate" }
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
      </div>
    </div>
  );
};

export default SignupPage;