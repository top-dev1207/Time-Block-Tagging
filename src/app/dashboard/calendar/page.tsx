"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ChevronLeft, ChevronRight, Edit, Plus, Save, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock calendar events
const mockEvents = [
  {
    id: 1,
    title: "Board Strategy Meeting",
    time: "9:00 AM - 11:00 AM",
    day: "Monday",
    date: "July 29",
    valueTier: "10K",
    category: "REV",
    description: "Quarterly strategic planning session"
  },
  {
    id: 2,
    title: "1:1 with Sarah (VP Sales)",
    time: "2:00 PM - 3:00 PM", 
    day: "Monday",
    date: "July 29",
    valueTier: "1K",
    category: "REL",
    description: "Weekly coaching and pipeline review"
  },
  {
    id: 3,
    title: "Email & Admin Tasks",
    time: "3:30 PM - 4:30 PM",
    day: "Monday", 
    date: "July 29",
    valueTier: "10",
    category: "ADM",
    description: "Daily email processing and admin"
  },
  {
    id: 4,
    title: "Product Development Review",
    time: "10:00 AM - 12:00 PM",
    day: "Tuesday",
    date: "July 30",
    valueTier: "1K",
    category: "REV",
    description: "Q3 product roadmap alignment"
  },
  {
    id: 5,
    title: "Team All-Hands Meeting",
    time: "1:00 PM - 2:00 PM",
    day: "Tuesday",
    date: "July 30", 
    valueTier: "100",
    category: "REL",
    description: "Monthly company update"
  },
  {
    id: 6,
    title: "Strategic Planning Deep Work",
    time: "9:00 AM - 12:00 PM",
    day: "Wednesday",
    date: "July 31",
    valueTier: "10K",
    category: "REV",
    description: "Uninterrupted strategy development time"
  },
  {
    id: 7,
    title: "Lunch & Walk",
    time: "12:00 PM - 1:00 PM",
    day: "Wednesday",
    date: "July 31",
    valueTier: "100",
    category: "REC",
    description: "Recovery and reflection time"
  }
];

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
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentWeek, setCurrentWeek] = useState("July 29 - August 3, 2024");
  const { toast } = useToast();

  const weekDays = [
    { day: "Monday", date: "29", events: events.filter(e => e.day === "Monday") },
    { day: "Tuesday", date: "30", events: events.filter(e => e.day === "Tuesday") },
    { day: "Wednesday", date: "31", events: events.filter(e => e.day === "Wednesday") },
    { day: "Thursday", date: "1", events: events.filter(e => e.day === "Thursday") },
    { day: "Friday", date: "2", events: events.filter(e => e.day === "Friday") },
  ];

  const handleEventUpdate = (eventId: number, updates: any) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
    toast({
      title: "Event updated",
      description: "Time allocation tags have been saved.",
    });
  };

  const getValueTierInfo = (tier: string) => {
    return valueTiers.find(t => t.value === tier);
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category);
  };

  const EventCard = ({ event }: { event: any }) => {
    const tierInfo = getValueTierInfo(event.valueTier);
    const categoryInfo = getCategoryInfo(event.category);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate">{event.title}</h4>
                  <Edit className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{event.time}</p>
                <div className="flex space-x-1">
                  <Badge 
                    variant={tierInfo?.color as any}
                    className="text-xs px-1 py-0"
                  >
                    {event.valueTier}
                  </Badge>
                  <Badge 
                    variant={categoryInfo?.color as any}
                    className="text-xs px-1 py-0"
                  >
                    {event.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-primary" />
              <span>Edit Event Tags</span>
            </DialogTitle>
            <DialogDescription>
              Update the value tier and category for this calendar event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Event Title</Label>
              <Input value={event.title} readOnly className="bg-muted" />
            </div>
            <div>
              <Label>Time</Label>
              <Input value={event.time} readOnly className="bg-muted" />
            </div>
            <div>
              <Label>Value Tier</Label>
              <Select 
                value={event.valueTier}
                onValueChange={(value) => handleEventUpdate(event.id, { valueTier: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {valueTiers.map(tier => (
                    <SelectItem key={tier.value} value={tier.value}>
                      <div className="flex items-center space-x-2">
                        <Badge variant={tier.color as any} className="text-xs">
                          {tier.value}
                        </Badge>
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
                value={event.category}
                onValueChange={(value) => handleEventUpdate(event.id, { category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        <Badge variant={category.color as any} className="text-xs">
                          {category.value}
                        </Badge>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={event.description}
                onChange={(e) => handleEventUpdate(event.id, { description: e.target.value })}
                placeholder="Add notes about this time block..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar Tagging</h1>
          <p className="text-muted-foreground mt-1">Tag your calendar events with value tiers and categories</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous Week
          </Button>
          <span className="text-sm font-medium">{currentWeek}</span>
          <Button variant="outline" size="sm">
            Next Week
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Tagging Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tagging System</CardTitle>
          <CardDescription>
            Use this system to categorize your time blocks for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Value Tiers</h4>
              <div className="space-y-2">
                {valueTiers.map(tier => (
                  <div key={tier.value} className="flex items-center space-x-2">
                    <Badge variant={tier.color as any}>{tier.value}</Badge>
                    <span className="text-sm">{tier.label.split(' - ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.slice(0, 6).map(category => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Badge variant={category.color as any}>{category.value}</Badge>
                    <span className="text-sm">{category.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weekDays.map((day) => (
          <Card key={day.day} className="min-h-[400px]">
            <CardHeader className="pb-3">
              <div className="text-center">
                <CardTitle className="text-lg">{day.day}</CardTitle>
                <CardDescription>July {day.date}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {day.events.length > 0 ? (
                day.events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No events</p>
                </div>
              )}
              
              {/* Add Event Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>
                      Create a new calendar event for {day.day}, July {day.date}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Event Title</Label>
                      <Input placeholder="Enter event title..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Time</Label>
                        <Input type="time" />
                      </div>
                      <div>
                        <Label>End Time</Label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Value Tier</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                          <SelectContent>
                            {valueTiers.map(tier => (
                              <SelectItem key={tier.value} value={tier.value}>
                                {tier.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea placeholder="Add event description..." rows={3} />
                    </div>
                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Event
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Streamline your calendar tagging process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Tag className="h-4 w-4 mr-2" />
              Auto-tag Recurring Events
            </Button>
            <Button variant="outline" className="justify-start">
              <Save className="h-4 w-4 mr-2" />
              Save as Template
            </Button>
            <Button variant="hero" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Analyze Week
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;