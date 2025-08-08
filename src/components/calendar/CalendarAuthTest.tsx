"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from "lucide-react";

interface AuthTestResults {
  sessionExists: boolean;
  accessTokenExists: boolean;
  calendarApiWorking: boolean;
  debugInfo?: {
    hasSession: boolean;
    sessionId?: string;
    accessToken?: boolean;
    user?: { email?: string };
    provider?: string;
    googleAccountInfo?: {
      hasGoogleAccount?: boolean;
      hasAccessToken?: boolean;
      isTokenExpired?: boolean;
      scope?: string;
    };
    [key: string]: unknown;
  };
  error?: string;
}

export default function CalendarAuthTest() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<AuthTestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAuthTest = useCallback(async () => {
    setIsLoading(true);
    setTestResults(null);

    try {
      // Test 1: Check if session exists
      const sessionExists = !!session?.user;

      // Test 2: Check debug endpoint for session info
      const debugResponse = await fetch('/api/debug/session');
      let debugInfo = null;
      let accessTokenExists = false;

      if (debugResponse.ok) {
        const debugData = await debugResponse.json();
        debugInfo = debugData.debug;
        accessTokenExists = debugData.debug?.hasAccessToken || false;
      }

      // Test 3: Test calendar API
      let calendarApiWorking = false;
      let apiError = null;

      try {
        const calendarResponse = await fetch('/api/calendar/events?timeMin=' + new Date().toISOString());
        calendarApiWorking = calendarResponse.ok;
        
        if (!calendarResponse.ok) {
          const errorData = await calendarResponse.json();
          apiError = errorData.error;
        }
      } catch (err) {
        apiError = err instanceof Error ? err.message : 'Unknown error';
      }

      setTestResults({
        sessionExists,
        accessTokenExists,
        calendarApiWorking,
        debugInfo,
        error: apiError
      });

    } catch (error) {
      setTestResults({
        sessionExists: false,
        accessTokenExists: false,
        calendarApiWorking: false,
        error: error instanceof Error ? error.message : 'Test failed'
      });
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const handleReauthorize = async () => {
    try {
      const response = await fetch('/api/auth/google-reauth');
      const data = await response.json();
      
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Reauthorization failed:', error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      runAuthTest();
    }
  }, [status, session?.user, runAuthTest]);

  if (status === "loading") {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading session...
        </CardContent>
      </Card>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please sign in to test calendar authentication</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Authentication Test</CardTitle>
        <CardDescription>
          Diagnose Google Calendar integration issues
        </CardDescription>
        <div className="flex gap-2">
          <Button onClick={runAuthTest} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
            Run Test
          </Button>
          {testResults && !testResults.calendarApiWorking && (
            <Button onClick={handleReauthorize}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Re-authorize Google
            </Button>
          )}
        </div>
      </CardHeader>
      
      {testResults && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {testResults.sessionExists ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">Session exists</span>
              <Badge>
                {testResults.sessionExists ? "PASS" : "FAIL"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {testResults.accessTokenExists ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">Access token available</span>
              <Badge>
                {testResults.accessTokenExists ? "PASS" : "FAIL"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {testResults.calendarApiWorking ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">Calendar API working</span>
              <Badge>
                {testResults.calendarApiWorking ? "PASS" : "FAIL"}
              </Badge>
            </div>
          </div>

          {testResults.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <h4 className="font-medium text-red-800">Error Details:</h4>
              <p className="text-sm text-red-600 mt-1">{testResults.error}</p>
            </div>
          )}

          {testResults.debugInfo && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="font-medium text-gray-800">Debug Information:</h4>
              <div className="text-xs text-gray-600 mt-2 space-y-1">
                <div>User: {testResults.debugInfo.user?.email}</div>
                <div>Provider: {String(testResults.debugInfo.provider || 'Not set')}</div>
                <div>Google Account: {testResults.debugInfo.googleAccountInfo?.hasGoogleAccount ? 'Found' : 'Not found'}</div>
                <div>Token in DB: {testResults.debugInfo.googleAccountInfo?.hasAccessToken ? 'Yes' : 'No'}</div>
                <div>Token Expired: {testResults.debugInfo.googleAccountInfo?.isTokenExpired ? 'Yes' : 'No'}</div>
                <div>Scopes: {testResults.debugInfo.googleAccountInfo?.scope || 'None'}</div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}