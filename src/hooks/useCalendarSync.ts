"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { GoogleCalendarAPI } from "@/lib/google-calendar";
import { useToast } from "@/hooks/use-toast";

interface CalendarSyncState {
  isLoading: boolean;
  error: string | null;
  events: Array<{
    id: string;
    summary?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
    description?: string;
    location?: string;
  }> | null;
  lastSyncTime: Date | null;
}

export function useCalendarSync() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [syncState, setSyncState] = useState<CalendarSyncState>({
    isLoading: false,
    error: null,
    events: null,
    lastSyncTime: null,
  });

  const syncCalendarEvents = useCallback(async (showToast = false) => {
    if (!session?.accessToken) {
      setSyncState(prev => ({
        ...prev,
        error: "No access token available",
        isLoading: false,
      }));
      return;
    }

    setSyncState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const calendarAPI = new GoogleCalendarAPI(session.accessToken);
      
      // Get events for the current week
      const events = await calendarAPI.getEventsForWeek();
      
      setSyncState({
        isLoading: false,
        error: null,
        events,
        lastSyncTime: new Date(),
      });

      if (showToast) {
        toast({
          title: "Calendar Synced",
          description: `Successfully synced ${events.length} events from your Google Calendar.`,
        });
      }

      return events;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sync calendar";
      
      setSyncState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      if (showToast) {
        toast({
          title: "Sync Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }

      console.error("Calendar sync error:", error);
    }
  }, [session?.accessToken, toast]);

  // Auto-sync on session change (when user signs in)
  useEffect(() => {
    if (status === "authenticated" && session?.accessToken && !syncState.events) {
      syncCalendarEvents(false);
    }
  }, [status, session?.accessToken, syncCalendarEvents, syncState.events]);

  return {
    ...syncState,
    syncCalendarEvents,
    canSync: !!session?.accessToken,
  };
}