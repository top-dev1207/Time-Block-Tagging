"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Clock, TrendingUp, Target, Calendar, BarChart3, Users,
  Sparkles, Zap, Shield, ChevronRight, Timer, DollarSign, Brain,
  Award, Rocket, Globe, Star, Check, Play
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const LandingPage = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const timeValues = [
    { value: "£10K", label: "Strategic", color: "from-purple-600 to-pink-600", delay: 0 },
    { value: "£1K", label: "Leadership", color: "from-blue-600 to-cyan-600", delay: 0.1 },
    { value: "£100", label: "Operational", color: "from-green-600 to-emerald-600", delay: 0.2 },
    { value: "£10", label: "Admin", color: "from-orange-600 to-yellow-600", delay: 0.3 },
  ];

  const features = [
    {
      icon: Calendar,
      title: "Smart Calendar Integration",
      description: "Sync with Google Calendar and auto-tag your time blocks with AI-powered categorization.",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      icon: Brain,
      title: "AI-Driven Insights",
      description: "Get personalized recommendations to optimize your time allocation and increase ROI.",
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      icon: BarChart3,
      title: "Executive Analytics",
      description: "Track your time value distribution with beautiful visualizations and actionable metrics.",
      gradient: "from-green-600 to-emerald-600",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechVentures",
      content: "TimeROI revealed I was spending 70% of my time on £100 tasks. After 3 months, I've shifted to 60% on £10K strategic work.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    {
      name: "Michael Roberts",
      role: "Founder, Growth Co",
      content: "The Three R's framework transformed how I think about time. My revenue has doubled while working fewer hours.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    },
    {
      name: "Lisa Martinez",
      role: "VP Sales, Enterprise Inc",
      content: "Finally, a tool that speaks executive language. TimeROI helped me delegate £10 tasks and focus on £10K opportunities.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-time opacity-20" />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {mounted && [...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.5)`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 20 + 20}s`,
            }}
          />
        ))}
      </div>

      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl animate-pulse-glow" />
                <div className="relative w-full h-full bg-black rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-gradient-premium">TimeROI</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link href="/login">
                <Button className="text-white hover:text-white/80">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Interactive Clock */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Animated Background Layers */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        </motion.div>
        
        <motion.div 
          style={{ y: y2 }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&h=1080&fit=crop"
            alt="Time Network"
            fill
            className="object-cover opacity-10"
            priority
          />
        </motion.div>

        {/* Interactive Clock Background */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="relative w-[800px] h-[800px] opacity-10"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="10"
                  x2="100"
                  y2="30"
                  stroke="currentColor"
                  strokeWidth="2"
                  transform={`rotate(${i * 30} 100 100)`}
                />
              ))}
            </svg>
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-white/90">Executive Time Analytics Platform</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Transform Your</span>
              <br />
              <span className="text-gradient-premium text-6xl md:text-8xl">Time Into Value</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover if you're spending your peak hours on £10K strategic work 
              or getting trapped in £10 administrative tasks.
            </p>

            {/* Animated Time Values */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
              {timeValues.map((item, index) => (
                <motion.div
                  key={item.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + item.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-20 group-hover:opacity-30 rounded-2xl transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${item.color})`
                    }}
                  />
                  <div className="relative glass rounded-2xl p-6 text-center hover-lift">
                    <div className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                      {item.value}
                    </div>
                    <div className="text-sm text-white/60">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/signup">
                <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
                  Start Your Time Audit
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" className="group border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Problem Statement with 3D Cards */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-premium">
              The Hidden Cost of Misaligned Time
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Most executives lose £2M+ annually by spending premium hours on low-value tasks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Value Misalignment",
                stat: "73%",
                description: "of executives spend most time on tasks worth 10x less than their strategic value",
                gradient: "from-red-600 to-pink-600",
              },
              {
                icon: Clock,
                title: "Time Blindness",
                stat: "2.5hrs",
                description: "daily average lost to untracked low-value activities and context switching",
                gradient: "from-yellow-600 to-orange-600",
              },
              {
                icon: Target,
                title: "Strategic Deficit",
                stat: "18%",
                description: "of time spent on transformational work that drives real business growth",
                gradient: "from-purple-600 to-blue-600",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group perspective-1000"
              >
                <div className="card-3d relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${item.gradient})`
                    }}
                  />
                  <Card className="relative h-full border-white/10 bg-white/5 backdrop-blur-sm hover-glow">
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} p-0.5 mb-4`}>
                        <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                          <item.icon className="h-8 w-8" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl">{item.title}</CardTitle>
                      <div className={`text-5xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                        {item.stat}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Time Value Visualization */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-premium opacity-5" />
        
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left: Time Value Framework */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">The TimeROI Method</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                <span className="text-gradient-premium">Categorize Every Hour</span>
                <br />
                <span className="text-foreground">By Its True Value</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    tier: "£10K/hour",
                    title: "Transformational",
                    description: "Vision setting, strategic partnerships, major decisions",
                    examples: ["Strategy sessions", "Key negotiations", "Innovation planning"],
                    color: "badge-tier-10k",
                  },
                  {
                    tier: "£1K/hour",
                    title: "High-Leverage",
                    description: "Team leadership, coaching, high-impact delivery",
                    examples: ["1:1 coaching", "Team alignment", "Customer meetings"],
                    color: "badge-tier-1k",
                  },
                  {
                    tier: "£100/hour",
                    title: "Operational",
                    description: "Process management, routine meetings, oversight",
                    examples: ["Status updates", "Process reviews", "Team meetings"],
                    color: "badge-tier-100",
                  },
                  {
                    tier: "£10/hour",
                    title: "Administrative",
                    description: "Email, scheduling, data entry, routine tasks",
                    examples: ["Email management", "Calendar tetris", "Expense reports"],
                    color: "badge-tier-10",
                  },
                ].map((level, index) => (
                  <motion.div
                    key={level.tier}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                      <Badge className={`${level.color} px-3 py-1 text-sm font-bold min-w-[100px] text-center`}>
                        {level.tier}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{level.title}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{level.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {level.examples.map((example) => (
                            <span key={example} className="text-xs px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Interactive Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Animated Circles */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#15803d" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                      <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ea580c" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                    
                    {/* Outer ring - £10K */}
                    <circle cx="200" cy="200" r="180" fill="none" stroke="url(#gradient1)" strokeWidth="20" opacity="0.8" />
                    
                    {/* Second ring - £1K */}
                    <circle cx="200" cy="200" r="140" fill="none" stroke="url(#gradient2)" strokeWidth="20" opacity="0.7" />
                    
                    {/* Third ring - £100 */}
                    <circle cx="200" cy="200" r="100" fill="none" stroke="url(#gradient3)" strokeWidth="20" opacity="0.6" />
                    
                    {/* Inner ring - £10 */}
                    <circle cx="200" cy="200" r="60" fill="none" stroke="url(#gradient4)" strokeWidth="20" opacity="0.5" />
                  </svg>
                </motion.div>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gradient-premium mb-2">ROI</div>
                    <div className="text-sm text-muted-foreground">Time Value Analysis</div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 right-0 glass rounded-xl p-4"
              >
                <div className="text-2xl font-bold text-purple-400">+340%</div>
                <div className="text-xs text-muted-foreground">Avg. ROI Increase</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 glass rounded-xl p-4"
              >
                <div className="text-2xl font-bold text-blue-400">2.5hrs</div>
                <div className="text-xs text-muted-foreground">Daily Time Saved</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Premium Cards */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium">Enterprise-Grade Platform</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-premium">Powerful Features</span>
              <br />
              <span className="text-foreground">For Time-Conscious Leaders</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm hover-lift overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl glass flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-sm font-medium group-hover:text-primary transition-colors">
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Three R's Framework */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-900/5 to-background" />
        
        <div className="container mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Award className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">The Three R's Framework</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-premium">Balance Your Time Portfolio</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Optimize across the three pillars of sustainable executive performance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                category: "Revenue",
                icon: DollarSign,
                description: "Strategic thinking, business development, and growth initiatives",
                percentage: "40%",
                color: "from-blue-600 to-cyan-600",
                activities: ["Strategy planning", "Key negotiations", "Market analysis", "Innovation"],
              },
              {
                category: "Recovery",
                icon: Brain,
                description: "Rest, reflection, learning, and personal development",
                percentage: "30%",
                color: "from-green-600 to-emerald-600",
                activities: ["Deep thinking", "Exercise", "Learning", "Creative time"],
              },
              {
                category: "Relationships",
                icon: Users,
                description: "Team development, networking, and stakeholder management",
                percentage: "30%",
                color: "from-purple-600 to-pink-600",
                activities: ["1:1 coaching", "Team building", "Client relationships", "Mentoring"],
              },
            ].map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${item.color})`
                  }}
                />
                <Card className="relative h-full border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 mb-4 mx-auto`}>
                      <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                        <item.icon className="h-8 w-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-center">{item.category}</CardTitle>
                    <div className={`text-4xl font-bold text-center bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.percentage}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center mb-4">
                      {item.description}
                    </CardDescription>
                    <div className="space-y-2">
                      {item.activities.map((activity) => (
                        <div key={activity} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Interactive Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden glass p-1"
          >
            <div className="absolute inset-0 gradient-premium opacity-20" />
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop"
                alt="TimeROI Dashboard"
                width={1200}
                height={600}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">See Your Time Transform</h3>
                  <p className="text-muted-foreground mb-4">
                    Watch how executives shift from 70% operational to 60% strategic time
                  </p>
                  <Button className="bg-white text-black hover:bg-white/90">
                    <Play className="mr-2 h-4 w-4" />
                    Watch 2-min Demo
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">Trusted by 500+ Executives</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-premium">Real Results</span>
              <span className="text-foreground"> From Real Leaders</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base italic">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-premium opacity-10" />
        <motion.div
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
        
        <div className="container mx-auto max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center glass rounded-3xl p-12 md:p-16"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-8"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Rocket className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-premium">Ready to 10x</span>
              <br />
              <span className="text-white">Your Time Value?</span>
            </h2>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join 500+ executives who've transformed their time allocation 
              and unlocked millions in hidden value.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button size="lg" className="group bg-white text-black hover:bg-white/90 px-8 py-6 text-lg font-semibold">
                  Start Free 14-Day Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-white/50">
              No credit card required • 5-minute setup • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-16 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" />
                  <div className="relative w-full h-full bg-background rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-gradient-premium">TimeROI</span>
              </div>
              <p className="text-muted-foreground">
                Transform time into strategic value with executive-grade analytics.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">ROI Calculator</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 TimeROI. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Users className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;