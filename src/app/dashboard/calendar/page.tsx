"use client";

import { useState } from "react";
import FullCalendarComponent from "@/components/calendar/FullCalendarComponent";
import CalendarAnalytics from "@/components/calendar/CalendarAnalytics";
// Removed unused imports
import { useSession } from "next-auth/react";




const CalendarView = () => {
  const { data: session } = useSession();
  const [calendarEvents, setCalendarEvents] = useState<Array<{ id: string; title: string; start: string; end: string }>>([]);
  const [calendarAnalytics, setCalendarAnalytics] = useState({
    totalEvents: 0,
    highValueEvents: 0,
    categoryDistribution: {} as Record<string, number>,
    tierDistribution: {} as Record<string, number>,
    totalHours: 0,
    highValueHours: 0
  });

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
      <FullCalendarComponent 
        onEventsLoaded={setCalendarEvents}
        onAnalyticsUpdate={setCalendarAnalytics}
      />

      {/* Analytics Component */}
      {calendarEvents.length > 0 && (
        <CalendarAnalytics 
          events={calendarEvents} 
          analytics={calendarAnalytics}
        />
      )}
    </div>
  );
};

export default CalendarView;