import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, TrendingUp, Target, Calendar, BarChart3, Users } from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-dashboard">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">TimeROI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="tier-10k" className="mb-6">
            Executive Time Analytics
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Are You Spending Your Best Hours on Your Highest-Value Work?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Help time-starved executives see whether they're spending time on £10K work — 
            and where they're leaking hours into low-value tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="xl" className="group">
                Start Your Time Audit
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="xl">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 bg-background/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">The Executive Time Crisis</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-lg">Misaligned Priorities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Executives spend 60% of their time on operational tasks worth £100/hour instead of strategic work worth £10K/hour.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <CardTitle className="text-lg">No Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Without clear metrics, leaders can't see where their time actually goes versus where it should go.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-tier-10/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-tier-10" />
                </div>
                <CardTitle className="text-lg">Reactive Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Leaders get pulled into meetings and admin work, leaving no time for the transformational thinking that drives growth.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Calendar ROI Scan</h2>
            <p className="text-xl text-muted-foreground">
              Get a fast diagnostic to identify high-leverage time blocks and spot low-leverage tasks you could delegate or eliminate.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Time Value Hierarchy</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Badge variant="tier-10k">£10K</Badge>
                  <div>
                    <p className="font-semibold">Transformational / Strategic</p>
                    <p className="text-sm text-muted-foreground">Vision, strategy, major decisions, scaling</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="tier-1k">£1K</Badge>
                  <div>
                    <p className="font-semibold">High-leverage / Leadership</p>
                    <p className="text-sm text-muted-foreground">Coaching, key relationships, high-impact delivery</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="tier-100">£100</Badge>
                  <div>
                    <p className="font-semibold">Operational / Team execution</p>
                    <p className="text-sm text-muted-foreground">Team meetings, coordination, oversight</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="tier-10">£10</Badge>
                  <div>
                    <p className="font-semibold">Admin / Low-value busywork</p>
                    <p className="text-sm text-muted-foreground">Email, scheduling, routine admin</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">The Three R's Framework</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Badge variant="revenue">REV</Badge>
                  <div>
                    <p className="font-semibold">Revenue</p>
                    <p className="text-sm text-muted-foreground">Strategic thinking, selling, scaling, growth initiatives</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="recovery">REC</Badge>
                  <div>
                    <p className="font-semibold">Recovery</p>
                    <p className="text-sm text-muted-foreground">Rest, reflection, personal recharge, deep thinking</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="relationships">REL</Badge>
                  <div>
                    <p className="font-semibold">Relationships</p>
                    <p className="text-sm text-muted-foreground">Coaching, collaboration, team development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-background/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to transform your time allocation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Tag Your Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect your calendar or upload a screenshot. Tag each time block with value tier (£10K, £1K, £100, £10) and category (REV, REC, REL).
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-success" />
                </div>
                <CardTitle>2. Get Instant Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See your time breakdown by value tier and the Three R's. Track weekly trends and identify patterns of misalignment.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-tier-10k/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-tier-10k" />
                </div>
                <CardTitle>3. Optimize & Delegate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get AI-powered suggestions to upgrade your time use. Identify tasks to delegate and reclaim hours for high-value work.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Reclaim Your Strategic Time?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join forward-thinking executives who've transformed their time allocation with TimeROI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="xl" className="group">
                Start Free Analysis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">TimeROI</span>
              </div>
              <p className="text-muted-foreground">
                Executive time analytics for strategic leaders.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Case Studies</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TimeROI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;