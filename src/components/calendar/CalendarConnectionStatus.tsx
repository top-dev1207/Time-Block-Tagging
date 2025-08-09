"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, CheckCircle, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConnectionStatus {
  hasCalendarAccess: boolean;
  needsReauth: boolean;
  accountEmail: string | null;
  lastConnected: string | null;
}

export default function CalendarConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/calendar/connection-status');
      const data = await response.json();
      
      if (response.ok) {
        setStatus(data);
      } else {
        console.error('Failed to fetch connection status:', data.error);
      }
    } catch (error) {
      console.error('Error fetching connection status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const response = await fetch('/api/auth/google-connect');
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        toast({
          title: "Connection Failed",
          description: data.error || "Failed to initiate Google Calendar connection",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        title: "Connection Failed",
        description: "An error occurred while connecting to Google Calendar",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Check for success/error messages from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'calendar_connected') {
      toast({
        title: "Calendar Connected",
        description: "Google Calendar has been successfully connected!",
      });
      // Clean up URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      // Refresh status
      setTimeout(fetchStatus, 1000);
    } else if (error) {
      let errorMessage = "Failed to connect Google Calendar";
      switch (error) {
        case 'oauth_denied':
          errorMessage = "Google Calendar permission was denied";
          break;
        case 'token_exchange_failed':
          errorMessage = "Failed to exchange authorization code";
          break;
        case 'database_error':
          errorMessage = "Database error occurred";
          break;
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      // Clean up URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <span>Checking calendar connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Google Calendar Connection</span>
        </CardTitle>
        <CardDescription>
          Connect your Google Calendar to view and manage events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status?.hasCalendarAccess ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium text-green-700">Google Calendar Connected</p>
                <p className="text-sm text-green-600">
                  Account: {status.accountEmail}
                </p>
                {status.lastConnected && (
                  <p className="text-xs text-green-500">
                    Last updated: {new Date(status.lastConnected).toLocaleDateString()}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium text-orange-700">Google Calendar Not Connected</p>
                <p className="text-sm text-orange-600">
                  Connect your Google Calendar to view and manage your events in the dashboard.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {status?.needsReauth && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium text-yellow-700">Reconnection Required</p>
              <p className="text-sm text-yellow-600">
                Your Google Calendar access has expired. Please reconnect to continue using calendar features.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-3">
          {!status?.hasCalendarAccess || status?.needsReauth ? (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="flex items-center space-x-2"
            >
              {isConnecting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              <span>
                {status?.needsReauth ? 'Reconnect' : 'Connect'} Google Calendar
              </span>
            </Button>
          ) : (
            <Button 
              onClick={fetchStatus} 
              variant={"outline" as any}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Status</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}