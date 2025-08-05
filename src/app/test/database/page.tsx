"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DatabaseTestPage() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("test@example.com");

  const testConnection = async () => {
    setIsLoading(true);
    setStatus("Testing database connection...");
    
    try {
      const response = await fetch("/api/test/db-connection");
      const data = await response.json();
      
      if (data.success) {
        setStatus(`✅ Database connected! User count: ${data.userCount}`);
      } else {
        setStatus(`❌ Database connection failed: ${data.error}`);
      }
    } catch (error) {
      setStatus(`❌ Request failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUser = async () => {
    setIsLoading(true);
    setStatus("Creating test user...");
    
    try {
      const response = await fetch("/api/test/db-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: testEmail, 
          name: "Test User" 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus(`✅ Test user created! ID: ${data.user.id}`);
      } else {
        setStatus(`❌ User creation failed: ${data.error}`);
      }
    } catch (error) {
      setStatus(`❌ Request failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            className="w-full"
          >
            Test Database Connection
          </Button>
          
          <div className="space-y-2">
            <Label htmlFor="email">Test Email</Label>
            <Input
              id="email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <Button 
            onClick={createTestUser} 
            disabled={isLoading || !testEmail}
            className="w-full"
          >
            Create Test User
          </Button>
          
          {status && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-mono">{status}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
