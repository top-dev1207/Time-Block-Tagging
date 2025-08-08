"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Calendar,
  Download,
  Filter,
  ChevronRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface AnalyticsData {
  totalEvents: number;
  highValueEvents: number;
  categoryDistribution: Record<string, number>;
  tierDistribution: Record<string, number>;
  totalHours: number;
  highValueHours: number;
}

interface CalendarAnalyticsProps {
  events: any[];
  analytics: AnalyticsData;
}

const valueTiers = [
  { value: "10000", label: "£10K", color: "#a855f7" },
  { value: "1000", label: "£1K", color: "#102C46" },
  { value: "100", label: "£100", color: "#22c55e" },
  { value: "10", label: "£10", color: "#f97316" }
];

const categories = [
  { value: "REV", label: "Revenue", color: "#22c55e" },
  { value: "REC", label: "Recovery", color: "#64748b" },
  { value: "REL", label: "Relationships", color: "#102C46" },
  { value: "ADM", label: "Admin", color: "#9ca3af" },
  { value: "DEL", label: "Delivery", color: "#eab308" },
  { value: "MTG", label: "Meetings", color: "#1e40af" }
];

export default function CalendarAnalytics({ events, analytics }: CalendarAnalyticsProps) {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  useEffect(() => {
    calculateWeeklyAnalysis();
    calculateMonthlyTrend();
  }, [events]);

  const calculateWeeklyAnalysis = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map(day => ({
      day,
      high: 0,
      medium: 0,
      low: 0,
      admin: 0
    }));

    events.forEach(event => {
      if (event.start) {
        const date = new Date(event.start);
        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert Sunday (0) to 6
        const tier = event.extendedProps?.valueTier || '100';
        
        if (dayIndex >= 0 && dayIndex < 7) {
          if (tier === '10000') weekData[dayIndex].high++;
          else if (tier === '1000') weekData[dayIndex].medium++;
          else if (tier === '100') weekData[dayIndex].low++;
          else if (tier === '10') weekData[dayIndex].admin++;
        }
      }
    });

    setWeeklyData(weekData);
  };

  const calculateMonthlyTrend = () => {
    const monthsData: Record<string, { high: number; total: number }> = {};
    
    events.forEach(event => {
      if (event.start) {
        const date = new Date(event.start);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthsData[monthKey]) {
          monthsData[monthKey] = { high: 0, total: 0 };
        }
        
        monthsData[monthKey].total++;
        const tier = event.extendedProps?.valueTier || '100';
        if (tier === '10000' || tier === '1000') {
          monthsData[monthKey].high++;
        }
      }
    });

    const sortedMonths = Object.keys(monthsData).sort().slice(-6); // Last 6 months
    const trendData = sortedMonths.map(month => ({
      month: new Date(month + '-01').toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      percentage: monthsData[month].total > 0 
        ? Math.round((monthsData[month].high / monthsData[month].total) * 100)
        : 0,
      highValue: monthsData[month].high,
      total: monthsData[month].total
    }));

    setMonthlyTrend(trendData);
  };

  const categoryChartData = Object.entries(analytics.categoryDistribution).map(([key, value]) => ({
    name: categories.find(c => c.value === key)?.label || key,
    value,
    color: categories.find(c => c.value === key)?.color || "#gray"
  }));

  const tierChartData = Object.entries(analytics.tierDistribution).map(([key, value]) => ({
    name: valueTiers.find(t => t.value === key)?.label || key,
    value,
    color: valueTiers.find(t => t.value === key)?.color || "#gray"
  }));

  const exportAnalyticsReport = () => {
    const report = {
      summary: {
        totalEvents: analytics.totalEvents,
        totalHours: analytics.totalHours,
        highValueEvents: analytics.highValueEvents,
        highValueHours: analytics.highValueHours,
        highValuePercentage: ((analytics.highValueEvents / analytics.totalEvents) * 100).toFixed(1)
      },
      categoryBreakdown: analytics.categoryDistribution,
      tierBreakdown: analytics.tierDistribution,
      weeklyPattern: weeklyData,
      monthlyTrend: monthlyTrend,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Analysis Dashboard</CardTitle>
          <CardDescription>
            Analyze your time allocation patterns and optimize for high-value activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Weekly Pattern</TabsTrigger>
              <TabsTrigger value="trend">Value Trends</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="week" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="high" stackId="a" fill="#a855f7" name="£10K" />
                    <Bar dataKey="medium" stackId="a" fill="#102C46" name="£1K" />
                    <Bar dataKey="low" stackId="a" fill="#22c55e" name="£100" />
                    <Bar dataKey="admin" stackId="a" fill="#f97316" name="£10" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Most Productive Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {weeklyData.length > 0 
                        ? weeklyData.reduce((max, day) => 
                            (day.high + day.medium) > (max.high + max.medium) ? day : max
                          ).day
                        : '-'
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Highest concentration of high-value activities
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Weekly Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress 
                      value={analytics.totalHours > 0 ? (analytics.highValueHours / analytics.totalHours) * 100 : 0} 
                      className="mb-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {analytics.totalHours > 0 
                        ? `${((analytics.highValueHours / analytics.totalHours) * 100).toFixed(0)}% high-value time`
                        : 'No events tracked'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trend" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded p-2">
                              <p className="font-semibold">{data.month}</p>
                              <p className="text-sm">High-Value: {data.percentage}%</p>
                              <p className="text-sm">{data.highValue} of {data.total} events</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#a855f7" 
                      strokeWidth={2}
                      name="High-Value %" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Trend Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    {monthlyTrend.length > 1 && 
                      monthlyTrend[monthlyTrend.length - 1].percentage > monthlyTrend[monthlyTrend.length - 2].percentage
                      ? "Improving focus on high-value activities"
                      : "Consider reallocating time to higher-value tasks"
                    }
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-4">By Category</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-4">By Value Tier</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tierChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {tierChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(analytics.categoryDistribution).map(([key, value]) => {
                  const category = categories.find(c => c.value === key);
                  return (
                    <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs">
                          {key}
                        </Badge>
                        <span className="text-sm">{category?.label}</span>
                      </div>
                      <span className="text-sm font-bold">{value}</span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button onClick={exportAnalyticsReport} className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}