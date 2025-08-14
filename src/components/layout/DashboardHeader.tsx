import { Search, Bell, User, Wifi, Github, Settings, LogOut, Shield, BarChart3, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export function DashboardHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <SidebarTrigger className="w-8 h-8 md:w-8 md:h-8" />
        
        <div className="relative flex-1 max-w-xs md:max-w-md lg:w-80 lg:flex-none">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-muted/20 border-border/50 focus:bg-background/50 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Connection Status - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2">
          <Wifi className="w-4 h-4 text-anomaly-low" />
          <Badge variant="outline" className="text-xs border-anomaly-low/30 text-anomaly-low">
            Connected
          </Badge>
        </div>

        {/* GitHub Link */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 md:w-10 md:h-10" 
          asChild
        >
          <a 
            href="https://github.com/ruvnet/alienator" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </Button>

        {/* Notifications Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="relative w-8 h-8 md:w-10 md:h-10">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 p-0 flex items-center justify-center text-xs bg-anomaly-high">
                5
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Xenotype Alerts
              </DialogTitle>
              <DialogDescription>
                Recent anomaly detection notifications
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div className="p-3 rounded-lg border border-anomaly-high/30 bg-anomaly-high/5">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-anomaly-high mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Critical Xenotype Pattern</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Non-human linguistic structures detected in GPT-4 output sequence (Score: 0.94)
                </p>
              </div>
              
              <div className="p-3 rounded-lg border border-anomaly-medium/30 bg-anomaly-medium/5">
                <div className="flex items-start gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-anomaly-medium mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Entropy Anomaly</p>
                    <p className="text-xs text-muted-foreground">8 minutes ago</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unusual information density patterns detected in Claude response
                </p>
              </div>
              
              <div className="p-3 rounded-lg border border-anomaly-high/30 bg-anomaly-high/5">
                <div className="flex items-start gap-2 mb-2">
                  <Shield className="w-4 h-4 text-anomaly-high mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cryptographic Alert</p>
                    <p className="text-xs text-muted-foreground">12 minutes ago</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Hidden encoding detected: Possible steganographic content
                </p>
              </div>
              
              <div className="p-3 rounded-lg border border-border/30 bg-muted/20">
                <div className="flex items-start gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cross-Model Deviation</p>
                    <p className="text-xs text-muted-foreground">18 minutes ago</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Significant response variance detected across AI models
                </p>
              </div>
              
              <div className="p-3 rounded-lg border border-anomaly-medium/30 bg-anomaly-medium/5">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-anomaly-medium mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Embedding Anomaly</p>
                    <p className="text-xs text-muted-foreground">25 minutes ago</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vector space clustering suggests higher-dimensional structures
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm">Mark all as read</Button>
              <Button variant="ghost" size="sm">View all alerts</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 md:w-10 md:h-10">
              <User className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Dr. Alex Chen</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Xenolinguist Researcher
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Security</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}