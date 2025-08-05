"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageLoading } from "@/hooks/usePageLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  BarChart3,
  Zap
} from "lucide-react";

// Mock data for analytics
const weeklyTrendData = [
  { week: "Week 1", tenK: 12, oneK: 32, hundred: 38, ten: 18, revenue: 35, recovery: 20, relationships: 45 },
  { week: "Week 2", tenK: 15, oneK: 35, hundred: 35, ten: 15, revenue: 40, recovery: 25, relationships: 35 },
  { week: "Week 3", tenK: 18, oneK: 38, hundred: 32, ten: 12, revenue: 45, recovery: 22, relationships: 33 },
  { week: "Week 4", tenK: 15, oneK: 35, hundred: 35, ten: 15, revenue: 42, recovery: 25, relationships: 33 },
  { week: "Week 5", tenK: 22, oneK: 40, hundred: 28, ten: 10, revenue: 48, recovery: 27, relationships: 25 },
  { week: "Week 6", tenK: 25, oneK: 42, hundred: 25, ten: 8, revenue: 50, recovery: 30, relationships: 20 }
];

const dailyPatternData = [
  { time: "8 AM", productivity: 85, energy: 90 },
  { time: "10 AM", productivity: 95, energy: 85 },
  { time: "12 PM", productivity: 70, energy: 60 },
  { time: "2 PM", productivity: 60, energy: 50 },
  { time: "4 PM", productivity: 75, energy: 70 },
  { time: "6 PM", productivity: 40, energy: 30 }
];

const roleComparisonData = [
  { role: "Strategic Leader", tenK: 35, oneK: 40, hundred: 20, ten: 5 },
  { role: "Your Current", tenK: 15, oneK: 35, hundred: 35, ten: 15 },
  { role: "Operational Manager", tenK: 5, oneK: 25, hundred: 50, ten: 20 }
];

const skillRadarData = [
  { skill: "Strategic Thinking", current: 65, target: 90 },
  { skill: "Leadership", current: 80, target: 95 },
  { skill: "Delegation", current: 45, target: 85 },
  { skill: "Time Management", current: 70, target: 90 },
  { skill: "Team Development", current: 75, target: 85 },
  { skill: "Innovation", current: 60, target: 80 }
];

const AnalyticsPage = () => {
  usePageLoading();
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your time allocation patterns and ROI trends</p>
        </div>
        <div className="flex space-x-3">
          <Button>Export Report</Button>
          <Button>Schedule Review</Button>
        </div>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Time Trends</TabsTrigger>
          <TabsTrigger value="patterns">Daily Patterns</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
        </TabsList>

        {/* Time Trends */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weekly Value Tier Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Value Tier Evolution</span>
                </CardTitle>
                <CardDescription>
                  Track your progress in high-value time allocation over 6 weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip content={customTooltip} />
                      <Line 
                        type="monotone" 
                        dataKey="tenK" 
                        stroke="hsl(var(--tier-10k))" 
                        strokeWidth={3}
                        name="£10K Tasks"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="oneK" 
                        stroke="hsl(var(--tier-1k))" 
                        strokeWidth={3}
                        name="£1K Tasks"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hundred" 
                        stroke="hsl(var(--tier-100))" 
                        strokeWidth={2}
                        name="£100 Tasks"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ten" 
                        stroke="hsl(var(--tier-10))" 
                        strokeWidth={2}
                        name="£10 Tasks"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Three R's Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Three R's Balance</span>
                </CardTitle>
                <CardDescription>
                  Revenue, Recovery, and Relationships over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip content={customTooltip} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--revenue))" 
                        strokeWidth={3}
                        name="Revenue"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="recovery" 
                        stroke="hsl(var(--recovery))" 
                        strokeWidth={3}
                        name="Recovery"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="relationships" 
                        stroke="hsl(var(--relationships))" 
                        strokeWidth={3}
                        name="Relationships"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Positive Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Strategic Time Up 67%</p>
                    <p className="text-sm text-muted-foreground">
                      £10K tasks increased from 15% to 25% over 6 weeks
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Admin Reduction</p>
                    <p className="text-sm text-muted-foreground">
                      Low-value tasks down by 47% (15% to 8%)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Revenue Focus</p>
                    <p className="text-sm text-muted-foreground">
                      43% increase in revenue-generating activities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span>Areas to Watch</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Relationship Time</p>
                    <p className="text-sm text-muted-foreground">
                      Declining trend in relationship building (45% to 20%)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Recovery Balance</p>
                    <p className="text-sm text-muted-foreground">
                      Need to maintain 25-30% for sustainable performance
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Consistency</p>
                    <p className="text-sm text-muted-foreground">
                      Week-to-week variation needs stabilization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-tier-10k" />
                  <span>Next Level Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Strategic Time Target</span>
                    <span>35%</span>
                  </div>
                  <Progress value={71} className="h-2" />
                  <p className="text-xs text-muted-foreground">71% of target achieved</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Admin Elimination</span>
                    <span>5%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                  <p className="text-xs text-muted-foreground">3% more to eliminate</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Leadership Leverage</span>
                    <span>50%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  <p className="text-xs text-muted-foreground">8% increase needed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Daily Patterns */}
        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Daily Energy & Productivity Patterns</span>
              </CardTitle>
              <CardDescription>
                Understand your peak performance hours for optimal scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyPatternData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="productivity" fill="hsl(var(--primary))" name="Productivity" />
                    <Bar dataKey="energy" fill="hsl(var(--secondary))" name="Energy" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Peak Performance Windows</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-success">Prime Time</h4>
                      <p className="text-sm text-muted-foreground">9:00 AM - 11:00 AM</p>
                    </div>
                    <Badge variant="success">95% Productive</Badge>
                  </div>
                  <p className="text-sm mt-2">
                    Ideal for £10K strategic work, complex problem solving, and important decisions.
                  </p>
                </div>
                
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-warning">Energy Dip</h4>
                      <p className="text-sm text-muted-foreground">1:00 PM - 3:00 PM</p>
                    </div>
                    <Badge variant="warning">60% Productive</Badge>
                  </div>
                  <p className="text-sm mt-2">
                    Better suited for routine tasks, email processing, or recovery activities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Block Morning Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Protect 9-11 AM for strategic work only
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Schedule Admin Wisely</p>
                    <p className="text-sm text-muted-foreground">
                      Move email and admin to 1-3 PM slot
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Evening Prep</p>
                    <p className="text-sm text-muted-foreground">
                      Use 4-6 PM for next-day planning
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Benchmarks */}
        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Role-Based Benchmarks</span>
              </CardTitle>
              <CardDescription>
                Compare your time allocation against executive role benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleComparisonData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 60]} />
                    <YAxis dataKey="role" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="tenK" stackId="a" fill="hsl(var(--tier-10k))" name="£10K Tasks" />
                    <Bar dataKey="oneK" stackId="a" fill="hsl(var(--tier-1k))" name="£1K Tasks" />
                    <Bar dataKey="hundred" stackId="a" fill="hsl(var(--tier-100))" name="£100 Tasks" />
                    <Bar dataKey="ten" stackId="a" fill="hsl(var(--tier-10))" name="£10 Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Analysis */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Executive Skill Development</span>
              </CardTitle>
              <CardDescription>
                Track skill development based on time allocation patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar 
                      name="Current" 
                      dataKey="current" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      name="Target" 
                      dataKey="target" 
                      stroke="hsl(var(--tier-10k))" 
                      fill="hsl(var(--tier-10k))" 
                      fillOpacity={0.1} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;