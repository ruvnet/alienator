import { Search, Bell, User, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";

interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void;
  isMobile?: boolean;
}

export function DashboardHeader({ onMobileMenuToggle, isMobile }: DashboardHeaderProps) {
  return (
    <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {isMobile ? (
          <HamburgerMenu 
            isOpen={false}
            onClick={onMobileMenuToggle || (() => {})}
            className="flex-shrink-0"
          />
        ) : (
          <SidebarTrigger className="w-8 h-8 flex-shrink-0" />
        )}
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={isMobile ? "Search..." : "Search anomalies, alerts, or patterns..."} 
            className="pl-10 bg-muted/20 border-border/50 focus:bg-background/50 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Connection Status - Hidden on mobile */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-anomaly-low" />
            <Badge variant="outline" className="text-xs border-anomaly-low/30 text-anomaly-low">
              Connected
            </Badge>
          </div>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 p-0 flex items-center justify-center text-xs bg-anomaly-high">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}