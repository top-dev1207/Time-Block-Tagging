"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Calendar, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Smartphone,
  Laptop
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePageLoading } from "@/hooks/usePageLoading";

const ImportPage = () => {
  usePageLoading();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Upload successful!",
            description: "Your calendar data has been imported and is ready for tagging.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const connectCalendar = (provider: string) => {
    toast({
      title: `Connecting to ${provider}`,
      description: "Redirecting to authentication...",
    });
    // In a real app, this would redirect to OAuth flow
    setTimeout(() => {
      toast({
        title: "Calendar connected!",
        description: `Successfully connected your ${provider} calendar. Events are now syncing.`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Import Calendar Data</h1>
        <p className="text-muted-foreground mt-1">
          Connect your calendar or upload a screenshot to start analyzing your time allocation
        </p>
      </div>

      <Tabs defaultValue="connect" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connect">Connect Calendar</TabsTrigger>
          <TabsTrigger value="upload">Upload Screenshot</TabsTrigger>
        </TabsList>

        {/* Connect Calendar Tab */}
        <TabsContent value="connect" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Connect Your Calendar</span>
              </CardTitle>
              <CardDescription>
                Automatically sync your calendar events for real-time time tracking and analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  // variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => connectCalendar("Google Calendar")}
                >
                  <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  <span>Google Calendar</span>
                </Button>
                
                <Button 
                  // variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => connectCalendar("Outlook")}
                >
                  <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M23.5 12.25c0-1.72-.17-3.42-.49-5.08H12v9.61h6.45c-.28 1.47-1.12 2.73-2.39 3.56v2.94h3.87c2.26-2.08 3.57-5.14 3.57-8.78l-.01-.25z"/>
                  </svg>
                  <span>Microsoft Outlook</span>
                </Button>

                <Button 
                  // variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => connectCalendar("Apple Calendar")}
                >
                  <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>Apple Calendar</span>
                </Button>

                <Button 
                  // variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => connectCalendar("Other Calendar")}
                >
                  <Calendar className="w-8 h-8 mb-2" />
                  <span>Other Calendar</span>
                </Button>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium">Secure Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      We use industry-standard OAuth 2.0 to securely connect to your calendar. 
                      We only read event titles, times, and descriptions - never modify your calendar.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connected Calendars */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Calendars</CardTitle>
              <CardDescription>
                Manage your connected calendar accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">Demo Calendar</p>
                      <p className="text-sm text-muted-foreground">demo@timeroi.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success">Connected</Badge>
                    <Button size="sm">Disconnect</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Screenshot Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileImage className="h-5 w-5 text-primary" />
                <span>Upload Calendar Screenshot</span>
              </CardTitle>
              <CardDescription>
                No calendar connection? Upload a screenshot or photo of your calendar instead.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Upload Calendar Image</h3>
                    <p className="text-muted-foreground">
                      Drag and drop your calendar screenshot here, or click to browse
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                    <span>PNG, JPG up to 10MB</span>
                  </div>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Uploaded File */}
              {uploadedFile && !isUploading && (
                <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button size="sm">
                    Process Image
                  </Button>
                </div>
              )}

              {/* Tips */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Mobile Tips</h4>
                      <p className="text-sm text-muted-foreground">
                        Take a clear screenshot of your weekly calendar view. 
                        Ensure event titles and times are visible.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Laptop className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Desktop Tips</h4>
                      <p className="text-sm text-muted-foreground">
                        Capture your full weekly view with event details visible. 
                        Higher resolution images work better.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help? Download Sample Templates</CardTitle>
              <CardDescription>
                Use these templates to manually input your calendar data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
                <Button className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Imports</CardTitle>
          <CardDescription>
            Your recent calendar imports and their processing status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">Google Calendar Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Imported 47 events from July 2024
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success">Completed</Badge>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium">calendar_screenshot.png</p>
                  <p className="text-sm text-muted-foreground">
                    Manual upload - requires tagging
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="warning">Pending Tags</Badge>
                <span className="text-sm text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportPage;