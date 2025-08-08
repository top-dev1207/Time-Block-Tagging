interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  location?: string;
  creator?: {
    email: string;
    displayName?: string;
  };
}

interface CalendarListResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  items: CalendarEvent[];
}

export interface CreateEventData {
  title?: string;
  summary?: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  timeZone?: string;
}

export class GoogleCalendarAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Google Calendar API error: ${response.status} - ${error.error?.message || error.error || 'Unknown error'}`);
    }

    // Handle empty responses (like DELETE operations that return 204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text.trim() === '') {
        return null;
      }
      return JSON.parse(text);
    }

    return response.json();
  }

  async getCalendars() {
    return this.makeRequest('https://www.googleapis.com/calendar/v3/users/me/calendarList');
  }

  async getEvents(
    calendarId: string = 'primary',
    timeMin?: string,
    timeMax?: string,
    maxResults: number = 250
  ): Promise<CalendarListResponse> {
    const params = new URLSearchParams({
      maxResults: maxResults.toString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    if (timeMin) params.append('timeMin', timeMin);
    if (timeMax) params.append('timeMax', timeMax);

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
    return this.makeRequest(url);
  }

  async getEventsForWeek(calendarId: string = 'primary', weekStart?: Date): Promise<CalendarEvent[]> {
    const start = weekStart || new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)

    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End of week (Saturday)
    end.setHours(23, 59, 59, 999);

    const response = await this.getEvents(
      calendarId,
      start.toISOString(),
      end.toISOString()
    );

    return response.items || [];
  }

  async getEventsForDateRange(
    calendarId: string = 'primary',
    startDate: Date,
    endDate: Date
  ): Promise<CalendarEvent[]> {
    const response = await this.getEvents(
      calendarId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    return response.items || [];
  }

  // Helper function to parse event duration in minutes
  static getEventDurationMinutes(event: CalendarEvent): number {
    const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date + 'T00:00:00');
    const end = event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date + 'T23:59:59');
    
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }

  // Helper function to check if event is all-day
  static isAllDayEvent(event: CalendarEvent): boolean {
    return !!event.start.date && !event.start.dateTime;
  }

  // Helper function to format event for TimeROI analysis
  static formatEventForAnalysis(event: CalendarEvent) {
    return {
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description,
      startTime: event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date + 'T00:00:00'),
      endTime: event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date + 'T23:59:59'),
      duration: this.getEventDurationMinutes(event),
      isAllDay: this.isAllDayEvent(event),
      location: event.location,
      attendeeCount: event.attendees?.length || 0,
      creator: event.creator?.email,
    };
  }

  // Create a new calendar event
  async createEvent(calendarId: string = 'primary', eventData: CreateEventData): Promise<CalendarEvent> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
    
    const event = {
      summary: eventData.summary || eventData.title,
      description: eventData.description,
      start: {
        dateTime: eventData.startTime.toISOString(),
        timeZone: eventData.timeZone || 'UTC',
      },
      end: {
        dateTime: eventData.endTime.toISOString(),
        timeZone: eventData.timeZone || 'UTC',
      },
      location: eventData.location,
      attendees: eventData.attendees?.map(email => ({ email })),
    };

    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  // Get a single event
  async getEvent(calendarId: string = 'primary', eventId: string): Promise<CalendarEvent> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`;
    return this.makeRequest(url);
  }

  // Update an existing calendar event
  async updateEvent(calendarId: string = 'primary', eventId: string, eventData: Partial<CreateEventData>): Promise<CalendarEvent> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`;
    
    // First, get the existing event to preserve all required fields
    const existingEvent = await this.getEvent(calendarId, eventId);
    
    // Create updated event by merging existing data with new data
    const event: {
      summary: string;
      description?: string;
      location?: string;
      start: { dateTime?: string; date?: string; timeZone?: string };
      end: { dateTime?: string; date?: string; timeZone?: string };
      attendees?: { email: string }[];
    } = {
      summary: eventData.title || eventData.summary || existingEvent.summary,
      description: eventData.description !== undefined ? eventData.description : existingEvent.description,
      location: eventData.location !== undefined ? eventData.location : existingEvent.location,
      start: existingEvent.start,
      end: existingEvent.end,
    };

    // Update start/end times only if provided
    if (eventData.startTime) {
      event.start = {
        dateTime: eventData.startTime.toISOString(),
        timeZone: eventData.timeZone || existingEvent.start.timeZone || 'UTC',
      };
    }
    if (eventData.endTime) {
      event.end = {
        dateTime: eventData.endTime.toISOString(),
        timeZone: eventData.timeZone || existingEvent.end.timeZone || 'UTC',
      };
    }
    
    // Update attendees only if provided
    if (eventData.attendees) {
      event.attendees = eventData.attendees.map(email => ({ email }));
    } else if (existingEvent.attendees) {
      event.attendees = existingEvent.attendees;
    }

    return this.makeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }

  // Delete a calendar event
  async deleteEvent(calendarId: string = 'primary', eventId: string): Promise<void> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`;
    
    await this.makeRequest(url, {
      method: 'DELETE',
    });
  }
}

// Hook for using Google Calendar API with session
export function useGoogleCalendar(session: { accessToken?: string } | null) {
  if (!session?.accessToken) {
    return null;
  }

  return new GoogleCalendarAPI(session.accessToken);
}