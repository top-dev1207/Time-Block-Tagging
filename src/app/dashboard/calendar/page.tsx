"use client";

import FullCalendarComponent from "@/components/calendar/FullCalendarComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BarChart3, TrendingUp, Clock } from "lucide-react";
import { useSession } from "next-auth/react";


const valueTiers = [
  { value: "10K", label: "£10K - Transformational", color: "tier-10k" },
  { value: "1K", label: "£1K - High-leverage", color: "tier-1k" },
  { value: "100", label: "£100 - Operational", color: "tier-100" },
  { value: "10", label: "£10 - Admin", color: "tier-10" }
];

const categories = [
  { value: "REV", label: "Revenue", color: "revenue" },
  { value: "REC", label: "Recovery", color: "recovery" },
  { value: "REL", label: "Relationships", color: "relationships" },
  { value: "ADM", label: "Admin", color: "tier-10" },
  { value: "DEL", label: "Delivery", color: "tier-100" },
  { value: "MTG", label: "Meetings", color: "tier-100" }
];

const CalendarView = () => {
  const { data: session, status } = useSession();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar Management</h1>
          <p className="text-muted-foreground mt-1">
            View and tag your Google Calendar events with value tiers and categories
          </p>
        </div>
        {session?.user && (
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* FullCalendar Component */}
      <FullCalendarComponent />

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Value Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">£10K+ events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Distribution</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">By category</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Insights</CardTitle>
          <CardDescription>
            Analyze your time allocation patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="justify-start" disabled>
              <BarChart3 className="h-4 w-4 mr-2" />
              Weekly Analysis
            </Button>
            <Button className="justify-start" disabled>
              <TrendingUp className="h-4 w-4 mr-2" />
              Value Trends
            </Button>
            <Button className="justify-start" disabled>
              <Clock className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Analytics features coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;