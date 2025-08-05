"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { TrendingUp, TrendingDown, Clock, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { usePageLoading } from "@/hooks/usePageLoading";

// Mock data for time allocation
const timeAllocationData = [
  { name: "£10K Tasks", value: 15, hours: 6, color: "hsl(var(--tier-10k))" },
  { name: "£1K Tasks", value: 35, hours: 14, color: "hsl(var(--tier-1k))" },
  { name: "£100 Tasks", value: 35, hours: 14, color: "hsl(var(--tier-100))" },
  { name: "£10 Tasks", value: 15, hours: 6, color: "hsl(var(--tier-10))" }
];

const threeRsData = [
  { name: "Revenue (REV)", value: 40, hours: 16, color: "hsl(var(--revenue))" },
  { name: "Recovery (REC)", value: 25, hours: 10, color: "hsl(var(--recovery))" },
  { name: "Relationships (REL)", value: 35, hours: 14, color: "hsl(var(--relationships))" }
];

const weeklyTrendData = [
  { week: "Week 1", tenK: 12, oneK: 32, hundred: 38, ten: 18 },
  { week: "Week 2", tenK: 15, oneK: 35, hundred: 35, ten: 15 },
  { week: "Week 3", tenK: 18, oneK: 38, hundred: 32, ten: 12 },
  { week: "Week 4", tenK: 15, oneK: 35, hundred: 35, ten: 15 }
];

const roiMetrics = [
  {
    title: "Strategic Time",
    value: "15%",
    target: "25%",
    trend: "up",
    description: "Time spent on £10K+ tasks"
  },
  {
    title: "Recovery Balance",
    value: "25%",
    target: "20%",
    trend: "up",
    description: "Time for reflection & recharge"
  },
  {
    title: "Admin Overhead", 
    value: "15%",
    target: "10%",
    trend: "down",
    description: "Low-value administrative tasks"
  },
  {
    title: "Revenue Focus",
    value: "40%",
    target: "45%",
    trend: "up",
    description: "Time on revenue-generating activities"
  }
];

const DashboardOverview = () => {
  usePageLoading();
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {`${payload[0].value}% (${Math.round((payload[0].value / 100) * 40)} hours)`}
          </p>
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
          <h1 className="text-3xl font-bold text-foreground">Time ROI Dashboard</h1>
          <p className="text-muted-foreground mt-1">Week of July 28 - August 3, 2024</p>
        </div>
        <div className="flex space-x-3">
          <Button>Export Report</Button>
          <Button>Optimize Schedule</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roiMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm">{metric.title}</CardDescription>
                {metric.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">/ {metric.target} target</span>
                </div>
                <Progress 
                  value={parseInt(metric.value)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Time Value Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Time Value Allocation</span>
            </CardTitle>
            <CardDescription>
              Breakdown of your time by value tier this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeAllocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {timeAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={customTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {timeAllocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {item.hours}h ({item.value}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Three R's Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>The Three R's Framework</span>
            </CardTitle>
            <CardDescription>
              Revenue, Recovery, and Relationships balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threeRsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 50]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip content={customTooltip} />
                  <Bar dataKey="value" radius={4}>
                    {threeRsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="revenue">REV: 16h</Badge>
              <Badge variant="recovery">REC: 10h</Badge>
              <Badge variant="relationships">REL: 14h</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Time Value Trends</CardTitle>
          <CardDescription>
            Track your progress over the past 4 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
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

      {/* Insights & Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Key Wins</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2" />
              <div>
                <p className="font-medium">Strategic Time Increased</p>
                <p className="text-sm text-muted-foreground">
                  You've increased £10K task time by 3% this week
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2" />
              <div>
                <p className="font-medium">Better Recovery Balance</p>
                <p className="text-sm text-muted-foreground">
                  Recovery time is well-balanced at 25% of your week
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2" />
              <div>
                <p className="font-medium">Strong Relationship Focus</p>
                <p className="text-sm text-muted-foreground">
                  35% of time spent on relationship building activities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Optimization Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full mt-2" />
              <div>
                <p className="font-medium">Reduce Admin Overhead</p>
                <p className="text-sm text-muted-foreground">
                  6h of admin tasks could be delegated or automated
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full mt-2" />
              <div>
                <p className="font-medium">Increase Strategic Focus</p>
                <p className="text-sm text-muted-foreground">
                  Target 25% time on £10K tasks (currently 15%)
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full mt-2" />
              <div>
                <p className="font-medium">Block Focused Time</p>
                <p className="text-sm text-muted-foreground">
                  Schedule 2-3 hour blocks for deep strategic work
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;