"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Calendar, 
  Target, 
  Shield, 
  Download,
  Trash2,
  Mail,
  Clock,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [userData, setUserData] = useState({
    name: "Demo User",
    email: "demo@timeroi.com",
    company: "ACME Corp",
    role: "CEO",
    timezone: "UTC-8",
    workingHours: {
      start: "09:00",
      end: "17:00"
    }
  });

  const [notifications, setNotifications] = useState({
    emailReports: true,
    weeklyInsights: true,
    goalReminders: true,
    calendarSync: true,
    mobilePush: false
  });

  const [goals, setGoals] = useState({
    strategicTime: 30,
    adminTime: 10,
    recoveryTime: 25,
    revenueTime: 45
  });

  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `Your ${section} settings have been updated successfully.`,
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export started",
      description: `Your data export in ${format} format will be ready shortly.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, preferences, and time allocation goals
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={userData.company}
                    onChange={(e) => setUserData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={userData.role} onValueChange={(value) => setUserData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CEO">CEO</SelectItem>
                      <SelectItem value="CTO">CTO</SelectItem>
                      <SelectItem value="VP">VP</SelectItem>
                      <SelectItem value="Director">Director</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={userData.timezone} onValueChange={(value) => setUserData(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Work Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={userData.workingHours.start}
                    onChange={(e) => setUserData(prev => ({ 
                      ...prev, 
                      workingHours: { ...prev.workingHours, start: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Work End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={userData.workingHours.end}
                    onChange={(e) => setUserData(prev => ({ 
                      ...prev, 
                      workingHours: { ...prev.workingHours, end: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("profile")}>
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how and when you want to receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Weekly Email Reports</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive detailed weekly time ROI analysis via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailReports}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailReports: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Weekly Insights</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get actionable insights and optimization suggestions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyInsights}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyInsights: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Goal Reminders</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders when you're off track from your time allocation goals
                    </p>
                  </div>
                  <Switch
                    checked={notifications.goalReminders}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, goalReminders: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Calendar Sync Alerts</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about calendar connection and sync status
                    </p>
                  </div>
                  <Switch
                    checked={notifications.calendarSync}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, calendarSync: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Mobile Push Notifications</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Real-time notifications on your mobile device
                    </p>
                  </div>
                  <Switch
                    checked={notifications.mobilePush}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, mobilePush: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("notifications")}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Time Allocation Goals</span>
              </CardTitle>
              <CardDescription>
                Set your target percentages for different types of activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center justify-between">
                      <span>Strategic Time (£10K tasks)</span>
                      <Badge variant="tier-10k">{goals.strategicTime}%</Badge>
                    </Label>
                    <Input
                      type="range"
                      min="0"
                      max="50"
                      value={goals.strategicTime}
                      onChange={(e) => setGoals(prev => ({ ...prev, strategicTime: parseInt(e.target.value) }))}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Transformational work, strategic planning, major decisions
                    </p>
                  </div>

                  <div>
                    <Label className="flex items-center justify-between">
                      <span>Revenue Focus</span>
                      <Badge variant="revenue">{goals.revenueTime}%</Badge>
                    </Label>
                    <Input
                      type="range"
                      min="0"
                      max="60"
                      value={goals.revenueTime}
                      onChange={(e) => setGoals(prev => ({ ...prev, revenueTime: parseInt(e.target.value) }))}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Revenue-generating activities, sales, growth initiatives
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center justify-between">
                      <span>Recovery Time</span>
                      <Badge variant="recovery">{goals.recoveryTime}%</Badge>
                    </Label>
                    <Input
                      type="range"
                      min="15"
                      max="40"
                      value={goals.recoveryTime}
                      onChange={(e) => setGoals(prev => ({ ...prev, recoveryTime: parseInt(e.target.value) }))}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Rest, reflection, personal recharge, deep thinking
                    </p>
                  </div>

                  <div>
                    <Label className="flex items-center justify-between">
                      <span>Admin Tasks (£10 tasks)</span>
                      <Badge variant="tier-10">{goals.adminTime}%</Badge>
                    </Label>
                    <Input
                      type="range"
                      min="5"
                      max="25"
                      value={goals.adminTime}
                      onChange={(e) => setGoals(prev => ({ ...prev, adminTime: parseInt(e.target.value) }))}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email, scheduling, routine administrative work
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Goal Summary</h4>
                <p className="text-sm text-muted-foreground">
                  Your targets: {goals.strategicTime}% strategic, {goals.revenueTime}% revenue, 
                  {goals.recoveryTime}% recovery, {goals.adminTime}% admin. 
                  Total allocated: {goals.strategicTime + goals.revenueTime + goals.recoveryTime + goals.adminTime}%
                </p>
              </div>

              <Button onClick={() => handleSave("goals")}>
                Save Goals
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Privacy & Data</span>
              </CardTitle>
              <CardDescription>
                Manage your data privacy and export options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Data Export</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export your time tracking data in various formats
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => handleExport("CSV")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button onClick={() => handleExport("Excel")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as Excel
                    </Button>
                    <Button onClick={() => handleExport("PDF")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Data Retention</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    We retain your data for analysis and reporting. You can request deletion at any time.
                  </p>
                  <Select defaultValue="12months">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 months</SelectItem>
                      <SelectItem value="6months">6 months</SelectItem>
                      <SelectItem value="12months">12 months</SelectItem>
                      <SelectItem value="24months">24 months</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Calendar Access</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review and manage calendar connections and permissions
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Google Calendar</p>
                        <p className="text-sm text-muted-foreground">Read-only access to events</p>
                      </div>
                      <Button size="sm">Revoke Access</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Account Management</span>
              </CardTitle>
              <CardDescription>
                Manage your subscription and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Subscription Status</h4>
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-success">Pro Plan</p>
                        <p className="text-sm text-muted-foreground">Active until Dec 31, 2024</p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                  <Button className="mt-3">
                    Manage Subscription
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Account Security</h4>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">
                      Change Password
                    </Button>
                    <Button className="w-full justify-start">
                      Enable Two-Factor Auth
                    </Button>
                    <Button className="w-full justify-start">
                      Download Account Data
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2 text-destructive">Danger Zone</h4>
                <div className="p-4 border border-destructive/20 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button className="flex items-center space-x-2">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;