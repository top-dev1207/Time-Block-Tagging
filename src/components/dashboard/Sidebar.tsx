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
    <div className={cn("border-t border-sidebar-border", isCollapsed ? "p-2" : "p-4")}>
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
      <button
        onClick={handleLogout}
        className={cn(
          "flex items-center justify-center rounded-lg transition-all duration-300 text-sidebar-foreground hover:text-red-500 group relative overflow-hidden",
          isCollapsed ? "w-12 h-12 mx-auto p-3" : "w-full px-3 py-2 space-x-2"
        )}
        title={isCollapsed ? "Sign Out" : undefined}
      >
        <LogOut className={cn(
          "transition-all duration-300 group-hover:scale-110 drop-shadow-sm group-hover:drop-shadow-md",
          isCollapsed ? "h-7 w-7" : "h-4 w-4"
        )} />
        {!isCollapsed && <span className="text-sm font-medium transition-colors duration-300">Sign Out</span>}
        <div className={cn(
          "absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 transition-all duration-300 rounded-lg",
          "scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100"
        )}></div>
      </button>
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
      <button
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-12 h-12 text-sidebar-foreground hover:text-sidebar-primary transition-all duration-300 group relative"
        onClick={toggleMobile}
      >
        {isMobileOpen ? <X className="h-6 w-6 transition-all duration-300 group-hover:scale-125 group-hover:rotate-90 drop-shadow-sm group-hover:drop-shadow-md" /> : <Menu className="h-6 w-6 transition-all duration-300 group-hover:scale-125 group-hover:rotate-90 drop-shadow-sm group-hover:drop-shadow-md" />}
        <div className="absolute inset-0 rounded-lg bg-sidebar-primary/0 group-hover:bg-sidebar-primary/10 transition-all duration-300 scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>
      </button>

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
          <div className={cn("border-b border-sidebar-border", isCollapsed ? "p-2" : "p-4")}>
            {isCollapsed ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden md:flex h-10 w-10 items-center justify-center text-sidebar-foreground hover:text-sidebar-primary transition-all duration-300 group relative"
                >
                  <Menu className="h-5 w-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-90 drop-shadow-sm group-hover:drop-shadow-md" />
                  <div className="absolute inset-0 rounded-lg bg-sidebar-primary/0 group-hover:bg-sidebar-primary/10 transition-all duration-300 scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold text-sidebar-foreground">TimeROI</span>
                </div>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden md:flex h-10 w-10 items-center justify-center text-sidebar-foreground hover:text-sidebar-primary transition-all duration-300 group relative"
                >
                  <Menu className="h-5 w-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-90 drop-shadow-sm group-hover:drop-shadow-md" />
                  <div className="absolute inset-0 rounded-lg bg-sidebar-primary/0 group-hover:bg-sidebar-primary/10 transition-all duration-300 scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn("flex-1 space-y-2", isCollapsed ? "p-2" : "p-4")}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setIsMobileOpen(false);
                  }}
                  className={cn(
                    "flex items-center rounded-lg transition-all duration-200 group relative",
                    isCollapsed 
                      ? "justify-center p-3 mx-1 hover:scale-105" 
                      : "space-x-3 px-3 py-2",
                    active 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn(
                    active && "text-sidebar-primary-foreground",
                    isCollapsed ? "h-7 w-7" : "h-5 w-5"
                  )} />
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
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className={cn(
                      "absolute left-full ml-2 px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none",
                      active 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                        : "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border"
                    )}>
                      {item.title}
                      <div className="text-xs opacity-70 mt-1">
                        {item.description}
                      </div>
                    </div>
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