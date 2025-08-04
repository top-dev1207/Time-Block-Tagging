"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/fullcalendar.css";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { GoogleCalendarAPI } from "@/lib/google-calendar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw, Tag, Calendar as CalendarIcon } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  creator?: string;
  extendedProps?: {
    valueTier?: string;
    category?: string;
    originalEvent?: any;
  };
}

const valueTiers = [
  { value: "10000", label: "£10K - Transformational", color: "bg-purple-500", bgColor: "#a855f7" },
  { value: "1000", label: "£1K - High-leverage", color: "bg-primary", bgColor: "#102C46" },
  { value: "100", label: "£100 - Operational", color: "bg-green-500", bgColor: "#22c55e" },
  { value: "10", label: "£10 - Admin", color: "bg-orange-500", bgColor: "#f97316" }
];

const categories = [
  { value: "REV", label: "Revenue", color: "bg-green-100 text-green-800" },
  { value: "REC", label: "Recovery", color: "bg-slate-100 text-slate-800" },
  { value: "REL", label: "Relationships", color: "bg-primary/10 text-primary" },
  { value: "ADM", label: "Admin", color: "bg-gray-100 text-gray-800" },
  { value: "DEL", label: "Delivery", color: "bg-yellow-100 text-yellow-800" },
  { value: "MTG", label: "Meetings", color: "bg-primary/20 text-primary" }
];

export default function FullCalendarComponent() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const calendarRef = useRef<FullCalendar>(null);
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadCalendarEvents = async () => {
    // Only allow authenticated users to load calendar events
    if (!session?.accessToken || status !== "authenticated") {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your calendar events.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create Google Calendar API instance with user's access token
      const calendarAPI = new GoogleCalendarAPI(session.accessToken);
      
      // Get events for current month (only this user's events)
      const startDate = new Date();
      startDate.setDate(1); // First day of current month
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of current month

      // This will only fetch events from the authenticated user's Google Calendar
      const googleEvents = await calendarAPI.getEventsForDateRange('primary', startDate, endDate);
      
      // Transform Google Calendar events to FullCalendar format
      const transformedEvents: CalendarEvent[] = googleEvents.map((gEvent) => ({
        id: gEvent.id,
        title: gEvent.summary || 'Untitled Event',
        start: gEvent.start.dateTime || gEvent.start.date || '',
        end: gEvent.end.dateTime || gEvent.end.date || '',
        description: gEvent.description,
        location: gEvent.location,
        extendedProps: {
          originalEvent: gEvent,
          valueTier: "100", // Default value tier
          category: "MTG", // Default category
        }
      }));

      setEvents(transformedEvents);
      
      toast({
        title: "Calendar Synced",
        description: `Successfully loaded ${transformedEvents.length} events from your Google Calendar.`,
      });
    } catch (error) {
      console.error("Error loading calendar events:", error);
      toast({
        title: "Sync Failed",
        description: "Failed to load calendar events. Please check your authentication and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load events only when user is authenticated and has access token
  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      loadCalendarEvents();
    }
  }, [status, session?.accessToken]);

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsDialogOpen(true);
    }
  };

  const handleEventUpdate = (eventId: string, updates: { valueTier?: string; category?: string }) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            extendedProps: { 
              ...event.extendedProps, 
              ...updates 
            }
          } 
        : event
    ));

    // Update the selected event if it's the one being modified
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(prev => prev ? {
        ...prev,
        extendedProps: {
          ...prev.extendedProps,
          ...updates
        }
      } : null);
    }

    toast({
      title: "Event Updated",
      description: "Event tags have been saved successfully.",
    });
  };

  const getEventColor = (event: CalendarEvent) => {
    const tier = event.extendedProps?.valueTier;
    const tierInfo = valueTiers.find(t => t.value === tier);
    return tierInfo?.bgColor || "#6b7280";
  };

  // Format events for FullCalendar with colors
  const calendarEvents = events.map(event => ({
    ...event,
    backgroundColor: getEventColor(event),
    borderColor: getEventColor(event),
    textColor: "white",
    classNames: [`event-tier-${event.extendedProps?.valueTier || "100"}`],
  }));

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your calendar...</span>
      </div>
    );
  }

  // Show authentication required message for unauthenticated users
  if (status === "unauthenticated") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96">
          <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground text-center">
            Please sign in to view and manage your Google Calendar events.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Google Calendar</h2>
          <p className="text-muted-foreground">
            Tag your calendar events with value tiers and categories
          </p>
          {session?.user && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing calendar for: {session.user.email}
            </p>
          )}
        </div>
        <Button 
          onClick={loadCalendarEvents} 
          disabled={isLoading}
          // variant="outline"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Calendar
        </Button>
      </div>

      {/* Value Tier Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Value Tier Legend</CardTitle>
          <CardDescription>
            Events are color-coded based on their assigned value tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {valueTiers.map((tier) => (
              <div key={tier.value} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: tier.bgColor }}
                />
                <span className="text-sm">{tier.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FullCalendar */}
      <Card>
        <CardContent className="p-6">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={true}
            nowIndicator={true}
            eventDisplay="block"
            eventTextColor="white"
            weekends={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: '09:00',
              endTime: '18:00',
            }}
            eventDidMount={(info) => {
              // Add custom styling or tooltips here if needed
              info.el.title = info.event.title + (info.event.extendedProps.description ? '\n' + info.event.extendedProps.description : '');
            }}
          />
        </CardContent>
      </Card>

      {/* Event tagging dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-primary" />
              <span>Tag Event</span>
            </DialogTitle>
            <DialogDescription>
              Assign value tier and category to this calendar event.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Label>Event Title</Label>
                <div className="p-2 bg-muted rounded text-sm">
                  {selectedEvent.title}
                </div>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <Label>Description</Label>
                  <div className="p-2 bg-muted rounded text-sm max-h-20 overflow-y-auto">
                    {selectedEvent.description}
                  </div>
                </div>
              )}

              {selectedEvent.location && (
                <div>
                  <Label>Location</Label>
                  <div className="p-2 bg-muted rounded text-sm">
                    {selectedEvent.location}
                  </div>
                </div>
              )}

              <div>
                <Label>Value Tier</Label>
                <Select 
                  value={selectedEvent.extendedProps?.valueTier || "100"}
                  onValueChange={(value) => 
                    handleEventUpdate(selectedEvent.id, { valueTier: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {valueTiers.map(tier => (
                      <SelectItem key={tier.value} value={tier.value}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: tier.bgColor }}
                          />
                          <span>{tier.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category</Label>
                <Select 
                  value={selectedEvent.extendedProps?.category || "MTG"}
                  onValueChange={(value) => 
                    handleEventUpdate(selectedEvent.id, { category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${category.color}`}>
                            {category.value}
                          </Badge>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}