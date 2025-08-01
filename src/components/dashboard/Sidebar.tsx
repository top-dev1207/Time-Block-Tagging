"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Calendar, 
  BarChart3, 
  Upload, 
  Settings, 
  Clock, 
  TrendingUp,
  Target,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Time ROI overview"
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar", 
    icon: Calendar,
    description: "Tag & analyze events"
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: TrendingUp,
    description: "Weekly insights"
  },
  {
    title: "Import",
    href: "/dashboard/import",
    icon: Upload,
    description: "Upload calendar data"
  },
  {
    title: "Goals",
    href: "/dashboard/goals",
    icon: Target,
    description: "Time allocation targets"
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Preferences & account"
  }
];

function UserSection({ isCollapsed, handleLogout }: { isCollapsed: boolean; handleLogout: () => void }) {
  const { session, hasHydrated } = useAuthStore();
  
  return (
    <div className="p-4 border-t border-sidebar-border">
      {!isCollapsed && hasHydrated && session?.user && (
        <div className="mb-3">
          <div className="text-sm font-medium text-sidebar-foreground">
            {session.user.name || 'User'}
          </div>
          <div className="text-xs text-sidebar-foreground/70">
            {session.user.email}
          </div>
        </div>
      )}
      <Button
        variant="ghost"
        size={isCollapsed ? "icon" : "sm"}
        onClick={handleLogout}
        className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <LogOut className="h-4 w-4" />
        {!isCollapsed && <span className="ml-2">Sign Out</span>}
      </Button>
    </div>
  );
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast({
      title: "Signed out successfully",
      description: "See you next time!",
    });
    router.push("/");
  };

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobile}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold text-sidebar-foreground">TimeROI</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group",
                    active 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "text-sidebar-primary-foreground")} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.title}</div>
                      <div className={cn(
                        "text-xs opacity-70 truncate",
                        active ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  )}
                  {active && !isCollapsed && (
                    <Badge variant="secondary" className="text-xs bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground">
                      Active
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <UserSection isCollapsed={isCollapsed} handleLogout={handleLogout} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;