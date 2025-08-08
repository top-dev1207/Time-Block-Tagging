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
import { Loader2, RefreshCw, Tag, Calendar as CalendarIcon, Shield, Plus, Edit, Trash2, Filter, Download, BarChart, Save, X, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
  { value: "10000", label: "£10K - Transformational", color: "bg-purple-500", bgColor: "#9333ea" },
  { value: "1000", label: "£1K - High-leverage", color: "bg-blue-600", bgColor: "#2563eb" },
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

interface FullCalendarComponentProps {
  onEventsLoaded?: (events: CalendarEvent[]) => void;
  onAnalyticsUpdate?: (analytics: any) => void;
}

export default function FullCalendarComponent({ 
  onEventsLoaded, 
  onAnalyticsUpdate 
}: FullCalendarComponentProps = {}) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const calendarRef = useRef<FullCalendar>(null);
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{start: Date, end: Date} | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    highValueEvents: 0,
    categoryDistribution: {} as Record<string, number>,
    tierDistribution: {} as Record<string, number>,
    totalHours: 0,
    highValueHours: 0
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    valueTier: '100',
    category: 'MTG'
  });

  // Calculate analytics from events
  const calculateAnalytics = (eventsList: CalendarEvent[]) => {
    const stats = {
      totalEvents: eventsList.length,
      highValueEvents: 0,
      categoryDistribution: {} as Record<string, number>,
      tierDistribution: {} as Record<string, number>,
      totalHours: 0,
      highValueHours: 0
    };

    eventsList.forEach(event => {
      // Count high-value events (£10K and £1K)
      const tier = event.extendedProps?.valueTier || '100';
      if (tier === '10000' || tier === '1000') {
        stats.highValueEvents++;
      }

      // Category distribution
      const category = event.extendedProps?.category || 'MTG';
      stats.categoryDistribution[category] = (stats.categoryDistribution[category] || 0) + 1;

      // Tier distribution
      stats.tierDistribution[tier] = (stats.tierDistribution[tier] || 0) + 1;

      // Calculate hours
      if (event.start && event.end) {
        const startTime = new Date(event.start).getTime();
        const endTime = new Date(event.end).getTime();
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        stats.totalHours += hours;
        
        if (tier === '10000' || tier === '1000') {
          stats.highValueHours += hours;
        }
      }
    });

    setAnalytics(stats);
    onAnalyticsUpdate?.(stats);
  };

  // Filter events based on selected filters
  const applyFilters = () => {
    let filtered = [...events];

    if (filterTier !== 'all') {
      filtered = filtered.filter(event => 
        event.extendedProps?.valueTier === filterTier
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(event => 
        event.extendedProps?.category === filterCategory
      );
    }

    setFilteredEvents(filtered);
    calculateAnalytics(filtered);
  };

  // Update event title
  const handleUpdateTitle = async () => {
    if (!selectedEvent || !editedTitle.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/calendar/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update API Error Response:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to update event title');
      }

      const responseData = await response.json();
      console.log('Update API Success Response:', responseData);
      
      // Update local state
      const updateEventInList = (list: CalendarEvent[]) => 
        list.map(e => e.id === selectedEvent.id 
          ? { ...e, title: editedTitle.trim() }
          : e
        );
      
      setEvents(prev => updateEventInList(prev));
      setFilteredEvents(prev => updateEventInList(prev));
      setSelectedEvent(prev => prev ? { ...prev, title: editedTitle.trim() } : null);
      
      setIsEditingTitle(false);
      
      toast({
        title: "Title Updated",
        description: "The event title has been successfully updated.",
      });
      
      // Refresh calendar view
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.refetchEvents();
      }
    } catch (error) {
      console.error('Error updating event title:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update event title.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle time slot selection for quick event creation
  const handleSelect = (selectInfo: any) => {
    const start = new Date(selectInfo.start);
    const end = new Date(selectInfo.end);
    
    // Store selected time slot
    setSelectedTimeSlot({ start, end });
    
    // Pre-fill the new event with selected times
    const startDate = start.toISOString().split('T')[0];
    const startTime = start.toTimeString().split(' ')[0].substring(0, 5);
    const endDate = end.toISOString().split('T')[0];
    const endTime = end.toTimeString().split(' ')[0].substring(0, 5);
    
    setNewEvent({
      title: '',
      description: '',
      location: '',
      startDate,
      startTime,
      endDate,
      endTime,
      valueTier: '100',
      category: 'MTG'
    });
    
    // Open quick create dialog
    setIsQuickCreateOpen(true);
    
    // Clear the selection
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
  };

  // Create new event
  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.startDate || !newEvent.startTime || !newEvent.endDate || !newEvent.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
      const endDateTime = new Date(`${newEvent.endDate}T${newEvent.endTime}`);

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: newEvent.title,
          description: newEvent.description,
          location: newEvent.location,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const data = await response.json();
      
      // Add the new event to our local state
      const createdEvent: CalendarEvent = {
        id: data.event.id,
        title: data.event.summary,
        start: data.event.start.dateTime || data.event.start.date,
        end: data.event.end.dateTime || data.event.end.date,
        description: data.event.description,
        location: data.event.location,
        extendedProps: {
          valueTier: newEvent.valueTier,
          category: newEvent.category,
          originalEvent: data.event
        }
      };

      setEvents(prev => [...prev, createdEvent]);
      setIsCreateDialogOpen(false);
      
      // Save the initial tag for the new event
      await saveEventTag(data.event.id, newEvent.valueTier, newEvent.category);
      
      // Reset form
      setNewEvent({
        title: '',
        description: '',
        location: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        valueTier: '100',
        category: 'MTG'
      });

      toast({
        title: "Event Created",
        description: "Your event has been added to Google Calendar.",
      });

      // Refresh calendar
      await loadCalendarEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    const eventId = selectedEvent?.id;
    if (!eventId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/calendar/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete event' }));
        console.error('Delete API Error Response:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to delete event');
      }

      console.log('Delete API Success: Event deleted successfully');

      setEvents(prev => prev.filter(e => e.id !== eventId));
      setFilteredEvents(prev => prev.filter(e => e.id !== eventId));
      setShowDeleteConfirm(false);
      setIsDialogOpen(false);
      setSelectedEvent(null);
      
      // Also delete the tag from database
      try {
        await fetch(`/api/calendar/tags?eventId=${eventId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting event tag:', error);
      }
      
      toast({
        title: "Event Deleted",
        description: "The event has been removed from your calendar.",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Export events to CSV
  const exportToCSV = () => {
    const csvHeader = "Title,Start,End,Value Tier,Category,Description,Location\\n";
    const csvRows = filteredEvents.map(event => {
      const tier = valueTiers.find(t => t.value === event.extendedProps?.valueTier)?.label || '';
      const category = categories.find(c => c.value === event.extendedProps?.category)?.label || '';
      return [
        event.title,
        event.start,
        event.end,
        tier,
        category,
        event.description || '',
        event.location || ''
      ].map(field => `"${field}"`).join(',');
    }).join('\\n');

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredEvents.length} events to CSV.`,
    });
  };

  // Load saved tags from database
  const loadEventTags = async () => {
    try {
      const response = await fetch('/api/calendar/tags');
      if (response.ok) {
        const data = await response.json();
        return data.tags || {};
      }
    } catch (error) {
      console.error('Error loading event tags:', error);
    }
    return {};
  };

  // Save tag to database
  const saveEventTag = async (eventId: string, valueTier: string, category: string) => {
    try {
      const response = await fetch('/api/calendar/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          valueTier,
          category
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save event tag');
      }

      console.log(`Tag saved for event ${eventId}`);
    } catch (error) {
      console.error('Error saving event tag:', error);
      toast({
        title: "Failed to save tag",
        description: "Your tag changes may not persist after refresh.",
        variant: "destructive",
      });
    }
  };

  const loadCalendarEvents = async () => {
    // Only allow authenticated users to load calendar events
    if (!session?.user || status !== "authenticated") {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your calendar events.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get events for current month using our API endpoint
      const startDate = new Date();
      startDate.setDate(1); // First day of current month
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of current month

      const params = new URLSearchParams({
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        maxResults: '100'
      });

      const response = await fetch(`/api/calendar/events?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch calendar events');
      }

      // Load saved tags from database
      const savedTags = await loadEventTags();
      console.log('Loaded tags from database:', savedTags);

      // Transform Google Calendar events to FullCalendar format
      const transformedEvents: CalendarEvent[] = data.events.map((gEvent: any) => {
        const savedTag = savedTags[gEvent.id];
        const event = {
          id: gEvent.id,
          title: gEvent.summary || 'Untitled Event',
          start: gEvent.start.dateTime || gEvent.start.date || '',
          end: gEvent.end.dateTime || gEvent.end.date || '',
          description: gEvent.description,
          location: gEvent.location,
          extendedProps: {
            originalEvent: gEvent,
            valueTier: savedTag?.valueTier || "100", // Use saved tier or default
            category: savedTag?.category || "MTG", // Use saved category or default
          }
        };
        console.log(`Event ${gEvent.id}: tier=${event.extendedProps.valueTier}, category=${event.extendedProps.category}`);
        return event;
      });

      setEvents(transformedEvents);
      setFilteredEvents(transformedEvents);
      calculateAnalytics(transformedEvents);
      onEventsLoaded?.(transformedEvents);
      
      toast({
        title: "Calendar Synced",
        description: `Successfully loaded ${transformedEvents.length} events from your Google Calendar.`,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Error loading calendar events:", err.message);
      toast({
        title: "Sync Failed",
        description: err.message || "Failed to load calendar events. Please check your authentication and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load events only when user is authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      loadCalendarEvents();
    }
  }, [status, session?.user]);

  // Apply filters when filter values change
  useEffect(() => {
    console.log('Applying filters:', { filterTier, filterCategory, eventsCount: events.length });
    applyFilters();
  }, [filterTier, filterCategory, events]);

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsDialogOpen(true);
    }
  };

  const handleEventUpdate = async (eventId: string, updates: { valueTier?: string; category?: string }) => {
    // Update local state immediately for better UX
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

    // Get current values for saving
    const event = events.find(e => e.id === eventId);
    const currentTier = event?.extendedProps?.valueTier || "100";
    const currentCategory = event?.extendedProps?.category || "MTG";
    
    const finalTier = updates.valueTier || currentTier;
    const finalCategory = updates.category || currentCategory;

    // Save to database
    await saveEventTag(eventId, finalTier, finalCategory);

    toast({
      title: "Event Updated",
      description: "Event tags have been saved successfully.",
    });
  };

  const getEventColor = (event: CalendarEvent) => {
    const tier = event.extendedProps?.valueTier || "100";
    const tierInfo = valueTiers.find(t => t.value === String(tier));
    const color = tierInfo?.bgColor || "#6b7280";
    return color;
  };

  // Format events for FullCalendar with colors and category labels
  const calendarEvents = filteredEvents.map(event => {
    const category = categories.find(c => c.value === event.extendedProps?.category);
    // Use special separator for better visual distinction
    const categoryLabel = category ? `${category.value} │ ` : "";
    return {
      ...event,
      title: `${categoryLabel}${event.title}`,
      backgroundColor: getEventColor(event),
      borderColor: getEventColor(event),
      textColor: "white",
      classNames: [`event-tier-${event.extendedProps?.valueTier || "100"}`, `event-category-${event.extendedProps?.category || "MTG"}`],
    };
  });

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
      {/* Header with action buttons */}
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
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Event
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Value Tier</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setFilterTier('all')}
              >
                {filterTier === 'all' && '✓ '}All Tiers
              </DropdownMenuItem>
              {valueTiers.map(tier => (
                <DropdownMenuItem
                  key={tier.value}
                  onClick={() => setFilterTier(tier.value)}
                >
                  {filterTier === tier.value && '✓ '}{tier.label}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setFilterCategory('all')}
              >
                {filterCategory === 'all' && '✓ '}All Categories
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem
                  key={category.value}
                  onClick={() => setFilterCategory(category.value)}
                >
                  {filterCategory === category.value && '✓ '}{category.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={exportToCSV}
            className="gap-2"
            disabled={filteredEvents.length === 0}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Button 
            onClick={loadCalendarEvents} 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalHours.toFixed(1)} hours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High-Value Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.highValueEvents}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.highValueHours.toFixed(1)} hours {analytics.totalHours > 0 ? `(${((analytics.highValueHours / analytics.totalHours) * 100).toFixed(0)}%)` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.entries(analytics.categoryDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {Object.entries(analytics.categoryDistribution).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(filterTier !== 'all' ? 1 : 0) + (filterCategory !== 'all' ? 1 : 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Showing {filteredEvents.length} of {events.length} events
            </p>
          </CardContent>
        </Card>
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
            locale="en-GB"
            timeZone="Europe/London"
            firstDay={1}
            headerToolbar={{
              left: 'prev,next Today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            titleFormat={{
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }}
            dayHeaderFormat={{
              weekday: 'short',
              day: '2-digit',
              month: '2-digit'
            }}
            dayPopoverFormat={{
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }}
            dayHeaderContent={(args) => {
              // Format as DD/MM for day headers in week view
              const date = args.date;
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
              return `${weekday} ${day}/${month}`;
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            selectable={true}
            selectMirror={true}
            select={handleSelect}
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
              // Add custom styling and enhanced tooltips
              const tier = valueTiers.find(t => t.value === info.event.extendedProps?.valueTier);
              const category = categories.find(c => c.value === info.event.extendedProps?.category);
              
              // Create enhanced tooltip (without category prefix since it's in the title)
              let tooltip = info.event.title.replace(/^[A-Z]{3} │ /, ''); // Remove category prefix for tooltip
              if (tier) tooltip += `\nValue Tier: ${tier.label}`;
              if (category) tooltip += `\nCategory: ${category.label}`;
              if (info.event.extendedProps.description) {
                tooltip += `\nDescription: ${info.event.extendedProps.description}`;
              }
              info.el.title = tooltip;
              
              // Style the category part differently
              const titleEl = info.el.querySelector('.fc-event-title');
              if (titleEl && category) {
                const titleText = titleEl.textContent || '';
                const match = titleText.match(/^([A-Z]{3}) │ (.*)$/);
                if (match) {
                  titleEl.innerHTML = `<span style="opacity: 0.8; font-weight: 700; font-size: 0.85em;">${match[1]}</span> <span style="opacity: 0.6;">│</span> <span>${match[2]}</span>`;
                }
              }
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
                <Label className="flex items-center justify-between">
                  Event Title
                  {!isEditingTitle && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditingTitle(true);
                        setEditedTitle(selectedEvent.title?.replace(/^[A-Z]{3} │ /, '') || '');
                      }}
                      className="h-6 px-2"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </Label>
                {isEditingTitle ? (
                  <div className="flex gap-2">
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdateTitle();
                        if (e.key === 'Escape') {
                          setIsEditingTitle(false);
                          setEditedTitle('');
                        }
                      }}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleUpdateTitle}
                      disabled={isLoading || !editedTitle.trim()}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingTitle(false);
                        setEditedTitle('');
                      }}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="p-2 bg-muted rounded text-sm">
                    {selectedEvent.title}
                  </div>
                )}
              </div>
              
              {/* Display current tags */}
              <div className="flex gap-2">
                {selectedEvent.extendedProps?.valueTier && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: valueTiers.find(t => t.value === selectedEvent.extendedProps?.valueTier)?.bgColor || '#6b7280' }}
                    />
                    <span className="text-sm font-medium">
                      {valueTiers.find(t => t.value === selectedEvent.extendedProps?.valueTier)?.label || 'Not Tagged'}
                    </span>
                  </div>
                )}
                {selectedEvent.extendedProps?.category && (
                  <Badge variant="outline" className="text-xs">
                    {categories.find(c => c.value === selectedEvent.extendedProps?.category)?.label || selectedEvent.extendedProps?.category}
                  </Badge>
                )}
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
                    <SelectValue>
                      {(() => {
                        const tier = valueTiers.find(t => t.value === (selectedEvent.extendedProps?.valueTier || "100"));
                        return tier ? (
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: tier.bgColor }}
                            />
                            <span>{tier.label}</span>
                          </div>
                        ) : null;
                      })()}
                    </SelectValue>
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
                    <SelectValue>
                      {(() => {
                        const cat = categories.find(c => c.value === (selectedEvent.extendedProps?.category || "MTG"));
                        return cat ? (
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {cat.value}
                            </Badge>
                            <span>{cat.label}</span>
                          </div>
                        ) : null;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${category.color}`}>
                            {category.value}
                          </div>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Event
                </Button>
                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setIsEditingTitle(false);
                    setEditedTitle('');
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add a new event to your Google Calendar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Value Tier</Label>
              <Select 
                value={newEvent.valueTier}
                onValueChange={(value) => setNewEvent({ ...newEvent, valueTier: value })}
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
                value={newEvent.category}
                onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${category.color}`}>
                          {category.value}
                        </div>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateEvent}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Create Event Dialog */}
      <Dialog open={isQuickCreateOpen} onOpenChange={setIsQuickCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>Quick Create Event</span>
            </DialogTitle>
            <DialogDescription>
              Create a new event for the selected time slot.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Selected Time Display */}
            {selectedTimeSlot && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Selected Time</div>
                <div className="font-medium">
                  {selectedTimeSlot.start.toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })} • {selectedTimeSlot.start.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })} - {selectedTimeSlot.end.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="quick-title">Event Title *</Label>
              <Input
                id="quick-title"
                type="text"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && newEvent.title.trim()) {
                    e.preventDefault();
                    handleCreateEvent();
                    setIsQuickCreateOpen(false);
                    setSelectedTimeSlot(null);
                    // Reset form after successful creation
                    setNewEvent({
                      title: '',
                      description: '',
                      location: '',
                      startDate: '',
                      startTime: '',
                      endDate: '',
                      endTime: '',
                      valueTier: '100',
                      category: 'MTG'
                    });
                  }
                }}
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="quick-description">Description</Label>
              <Textarea
                id="quick-description"
                placeholder="Add description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <Label>Value Tier</Label>
              <Select 
                value={newEvent.valueTier}
                onValueChange={(value) => setNewEvent({ ...newEvent, valueTier: value })}
              >
                <SelectTrigger>
                  <SelectValue>
                    {(() => {
                      const tier = valueTiers.find(t => t.value === newEvent.valueTier);
                      return tier ? (
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: tier.bgColor }}
                          />
                          <span>{tier.label}</span>
                        </div>
                      ) : null;
                    })()}
                  </SelectValue>
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
                value={newEvent.category}
                onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
              >
                <SelectTrigger>
                  <SelectValue>
                    {(() => {
                      const cat = categories.find(c => c.value === newEvent.category);
                      return cat ? (
                        <div className="flex items-center space-x-2">
                          <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${cat.color}`}>
                            {cat.value}
                          </div>
                          <span>{cat.label}</span>
                        </div>
                      ) : null;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${category.color}`}>
                          {category.value}
                        </div>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsQuickCreateOpen(false);
                  setSelectedTimeSlot(null);
                  // Reset form
                  setNewEvent({
                    title: '',
                    description: '',
                    location: '',
                    startDate: '',
                    startTime: '',
                    endDate: '',
                    endTime: '',
                    valueTier: '100',
                    category: 'MTG'
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await handleCreateEvent();
                  setIsQuickCreateOpen(false);
                  setSelectedTimeSlot(null);
                  // Reset form after successful creation
                  setNewEvent({
                    title: '',
                    description: '',
                    location: '',
                    startDate: '',
                    startTime: '',
                    endDate: '',
                    endTime: '',
                    valueTier: '100',
                    category: 'MTG'
                  });
                }}
                disabled={isLoading || !newEvent.title}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              "{selectedEvent?.title}" from your Google Calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete Event</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}