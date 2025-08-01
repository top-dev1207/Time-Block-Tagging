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
}

// Hook for using Google Calendar API with session
export function useGoogleCalendar(session: any) {
  if (!session?.accessToken) {
    return null;
  }

  return new GoogleCalendarAPI(session.accessToken);
}