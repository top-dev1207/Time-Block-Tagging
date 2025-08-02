"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Clock, TrendingUp, Target, Calendar, BarChart3, Users,
  Heart, Sparkles, Shield, ChevronRight, Timer, DollarSign, 
  Award, Rocket, Star, Check, Play, Activity, 
  BookOpen, Coffee, Lightbulb, PieChart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const timeValues = [
    {
      value: "£10K",
      label: "Strategic",
      description: "Vision & Innovation",
      gradient: "warm-gradient",
      icon: Lightbulb,
      example: "Strategic planning, innovation sessions"
    },
    {
      value: "£1K", 
      label: "Leadership",
      description: "Team & Growth",
      gradient: "ocean-gradient",
      icon: Users,
      example: "Team coaching, key client meetings"
    },
    {
      value: "£100",
      label: "Operational", 
      description: "Process & Delivery",
      gradient: "sunset-gradient",
      icon: Activity,
      example: "Project oversight, process improvement"
    },
    {
      value: "£10",
      label: "Administrative",
      description: "Tasks & Maintenance", 
      gradient: "warm-gradient",
      icon: BookOpen,
      example: "Email management, routine admin"
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: "Intelligent Calendar Sync",
      description: "Seamlessly connect your calendar and let our AI automatically categorize your time blocks based on meeting content and patterns.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      accent: "#6366f1"
    },
    {
      icon: PieChart,
      title: "Beautiful Analytics Dashboard", 
      description: "Visualize your time allocation with elegant charts and gain insights into where your most valuable hours are being spent.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      accent: "#8b5cf6"
    },
    {
      icon: Target,
      title: "Three R's Framework",
      description: "Balance your time across Revenue, Recovery, and Relationships for sustainable executive performance and wellbeing.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop", 
      accent: "#a855f7"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechVentures",
      content: "TimeROI helped me realize I was spending 70% of my time on £100 tasks. Now I've optimized to focus 60% on strategic £10K work. The clarity is transformational.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      company: "TechVentures",
      improvement: "60% more strategic time"
    },
    {
      name: "Michael Roberts", 
      role: "Founder, Growth Partners",
      content: "The Three R's framework changed everything. I now protect time for recovery and relationships, not just revenue. My team's performance has never been better.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      company: "Growth Partners", 
      improvement: "3x team engagement"
    },
    {
      name: "Dr. Lisa Martinez",
      role: "VP Innovation, MedTech Inc",
      content: "TimeROI doesn't just track time - it helps you think about value creation differently. I've reclaimed 2 hours daily for innovation work.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      company: "MedTech Inc",
      improvement: "2hrs daily for innovation"
    }
  ];

  return (
    <div className="min-h-screen elegant-bg">
      {/* Clean Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-subtle border-b border-gray-200/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 warm-gradient rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient-warm">TimeROI</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link href="/login">
                <Button className="btn-header-signin">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="btn-header-getstarted">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Executive Time Management Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"
            alt="Executive Time Management and Strategic Planning"
            fill
            className="object-cover"
            priority
          />
          <div className="hero-vivid-overlay" />
        </div>

        {/* Dynamic Grid Pattern */}
        <div className="dynamic-grid" />
        
        {/* Time Block Visualization */}
        <div className="absolute inset-0 overflow-hidden">
          {mounted && (
            <>
              <div className="time-block" style={{ top: '20%' }} />
              <div className="time-block" style={{ top: '30%' }} />
              <div className="time-block" style={{ top: '60%' }} />
              <div className="time-block" style={{ top: '80%' }} />
            </>
          )}
        </div>
        
        {/* Time Clock Overlay */}
        <div className="time-clock-overlay" />
        
        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {mounted && (
            <>
              {/* Core Time Management Icons */}
              <div className="productivity-icon" style={{ top: '15%', left: '10%' }}>
                <Clock className="h-8 w-8" />
              </div>
              <div className="productivity-icon" style={{ top: '20%', right: '15%' }}>
                <BarChart3 className="h-8 w-8" />
              </div>
              <div className="productivity-icon" style={{ bottom: '25%', left: '8%' }}>
                <Timer className="h-8 w-8" />
              </div>
              <div className="productivity-icon" style={{ top: '65%', right: '12%' }}>
                <PieChart className="h-8 w-8" />
              </div>
              <div className="productivity-icon" style={{ top: '45%', left: '5%' }}>
                <Target className="h-7 w-7" />
              </div>
              
              {/* Strategic Value Elements */}
              <div className="floating-time-element clock" style={{ top: '18%', left: '25%' }}>
                <span>£10K Strategic Time</span>
              </div>
              <div className="floating-time-element chart" style={{ top: '35%', right: '25%' }}>
                <span>Time Block Analytics</span>
              </div>
              <div className="floating-time-element timer" style={{ bottom: '30%', left: '30%' }}>
                <span>Executive ROI</span>
              </div>
              <div className="floating-time-element clock" style={{ top: '55%', right: '35%' }}>
                <span>Value Optimization</span>
              </div>
              
              {/* Orbiting Time Values */}
              <div className="orbit-container" style={{ top: '25%', left: '50%' }}>
                <div className="orbit-element">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-bold text-white">£10K</span>
                  </div>
                </div>
                <div className="orbit-element">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-bold text-white">£1K</span>
                  </div>
                </div>
                <div className="orbit-element">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-bold text-white">£100</span>
                  </div>
                </div>
                <div className="orbit-element">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-bold text-white">£10</span>
                  </div>
                </div>
              </div>

              {/* Additional Productivity Indicators */}
              <div className="productivity-icon" style={{ bottom: '40%', right: '8%' }}>
                <TrendingUp className="h-7 w-7" />
              </div>
              <div className="productivity-icon" style={{ top: '75%', left: '15%' }}>
                <Activity className="h-7 w-7" />
              </div>
              <div className="productivity-icon" style={{ bottom: '15%', right: '20%' }}>
                <Award className="h-7 w-7" />
              </div>
            </>
          )}
        </div>

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-8 border border-indigo-200/30"
            >
              <Heart className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium text-warm">Executive Time Analytics</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-warm leading-tight">
              Transform Your Time Into
              <br />
              <span className="text-gradient-warm">Meaningful Value</span>
            </h1>

            <p className="text-xl md:text-2xl text-warm-light mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover whether you're investing your precious hours in £10K strategic work 
              or getting caught up in £10 administrative tasks.
            </p>

            {/* Time Value Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
              {timeValues.map((item, index) => (
                <motion.div
                  key={item.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="time-card card-elegant p-6 text-center warm-pulse"
                  // style={{ '--card-accent': item.accent } as React.CSSProperties}
                >
                  <div className={`w-12 h-12 ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gradient-warm mb-2">{item.value}</div>
                  <div className="font-semibold text-warm mb-1">{item.label}</div>
                  <div className="text-sm text-warm-light mb-3">{item.description}</div>
                  <div className="text-xs text-warm-light italic">{item.example}</div>
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
                <Button className="btn-elegant px-8 py-4 text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Your Time Audit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button className="btn-elegant-outline px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="section-padding px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-warm">
              The Hidden Cost of 
              <span className="text-gradient-warm"> Time Misalignment</span>
            </h2>
            <p className="text-xl text-warm-light max-w-3xl mx-auto">
              Most executives unknowingly lose millions in value by spending premium hours on low-impact activities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                stat: "73%",
                title: "Value Leak",
                description: "of executive time spent on tasks worth 10x less than their strategic potential"
              },
              {
                icon: Clock,
                stat: "2.5hrs",
                title: "Daily Loss", 
                description: "average time lost to untracked activities and inefficient context switching"
              },
              {
                icon: Target,
                stat: "18%",
                title: "Strategic Time",
                description: "actual time spent on transformational work that drives exponential growth"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elegant p-8 text-center"
              >
                <div className="w-16 h-16 warm-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gradient-warm mb-2">{item.stat}</div>
                <h3 className="text-xl font-semibold text-warm mb-3">{item.title}</h3>
                <p className="text-warm-light">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-6 border border-indigo-200/30">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-warm">Elegant Solutions</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-warm">
              Beautiful Tools for
              <span className="text-gradient-warm"> Mindful Leaders</span>
            </h2>
            <p className="text-xl text-warm-light max-w-3xl mx-auto">
              Thoughtfully designed features that respect your time and support your wellbeing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card-elegant overflow-hidden"
              >
                <div className="relative h-48 image-overlay">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: feature.accent }}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-warm">{feature.title}</h3>
                  </div>
                  
                  <p className="text-warm-light mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-accent font-medium">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Three R's Framework */}
      <section className="section-padding px-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-6 border border-purple-200/30">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-warm">The Three R's</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-warm">
              Balance Your 
              <span className="text-gradient-warm">Life Portfolio</span>
            </h2>
            <p className="text-xl text-warm-light max-w-3xl mx-auto">
              Sustainable success comes from balancing three essential pillars of executive life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Revenue",
                percentage: "40%",
                icon: DollarSign,
                description: "Strategic thinking, business development, and growth initiatives that drive value creation",
                color: "#6366f1",
                activities: ["Strategy planning", "Key partnerships", "Innovation projects", "Market expansion"]
              },
              {
                title: "Recovery", 
                percentage: "30%",
                icon: Coffee,
                description: "Rest, reflection, learning, and personal development for sustainable performance",
                color: "#8b5cf6",
                activities: ["Deep thinking time", "Exercise & wellness", "Learning & reading", "Creative pursuits"]
              },
              {
                title: "Relationships",
                percentage: "30%", 
                icon: Users,
                description: "Team development, networking, and meaningful connections that amplify impact",
                color: "#a855f7",
                activities: ["Team coaching", "Mentoring", "Client relationships", "Family time"]
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elegant p-8 text-center"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: item.color }}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-warm mb-2">{item.title}</h3>
                <div className="text-4xl font-bold text-gradient-warm mb-4">{item.percentage}</div>
                <p className="text-warm-light mb-6">{item.description}</p>
                
                <div className="space-y-2">
                  {item.activities.map((activity, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-warm-light">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visual Demo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-elegant p-1 rounded-2xl overflow-hidden"
          >
            <div className="relative h-64 md:h-80 image-overlay">
              <Image
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=400&fit=crop"
                alt="Executive Dashboard"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">See Your Balance in Action</h3>
                <p className="text-white/80 mb-4">
                  Watch how successful executives optimize across all three dimensions
                </p>
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  <Play className="mr-2 h-4 w-4" />
                  View Dashboard Demo
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-6 border border-yellow-200/30">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-warm">Success Stories</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-warm">
              Real Results from
              <span className="text-gradient-warm"> Real Leaders</span>
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
                className="card-elegant p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-warm">{testimonial.name}</div>
                    <div className="text-sm text-accent">{testimonial.role}</div>
                    <div className="text-xs text-warm-light">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-warm-light italic mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  {testimonial.improvement}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding px-4 bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-elegant p-12 md:p-16 text-center"
          >
            <div className="w-20 h-20 warm-gradient rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-warm">
              Ready to Transform Your
              <span className="text-gradient-warm"> Time Into Value?</span>
            </h2>
            
            <p className="text-xl text-warm-light mb-8 max-w-2xl mx-auto">
              Join hundreds of thoughtful executives who've discovered the power of 
              intentional time allocation and balanced living.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button className="btn-elegant px-10 py-4 text-lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-warm-light">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="py-16 px-4 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 warm-gradient rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient-warm">TimeROI</span>
              </div>
              <p className="text-warm-light">
                Thoughtful time analytics for mindful executives.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-warm">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Features</Link></li>
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Integrations</Link></li>
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-warm">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Case Studies</Link></li>
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Time Audit Guide</Link></li>
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-warm">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">About</Link></li>
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-warm-light hover:text-accent transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-warm-light text-sm">
              © 2024 TimeROI. Made with care for thoughtful leaders.
            </p>
            <div className="flex items-center gap-2 mt-4 md:mt-0 text-warm-light text-sm">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>Designed for human flourishing</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;