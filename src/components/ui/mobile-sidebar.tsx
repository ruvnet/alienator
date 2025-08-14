import { 
  Activity, 
  BarChart3, 
  GitBranch, 
  Sparkles, 
  Shield, 
  Languages, 
  History, 
  Settings,
  Binary
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navigationItems = [
  { icon: Activity, label: "Real-time Monitor", path: "/" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: GitBranch, label: "Cross-Model", path: "/cross-model" },
  { icon: Sparkles, label: "Embeddings", path: "/embeddings" },
  { icon: Shield, label: "Cryptographic", path: "/crypto" },
  { icon: Languages, label: "Linguistic", path: "/linguistic" },
  { icon: History, label: "Anomaly Log", path: "/logs" },
  { icon: Settings, label: "Configuration", path: "/settings" }
];

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavClasses = (active: boolean) =>
    active 
      ? "bg-primary/10 text-primary border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0 bg-card/95 backdrop-blur-sm border-border/50">
        <SheetHeader className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Binary className="w-4 h-4 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-sm font-semibold text-foreground text-left">VibeCast</SheetTitle>
              <p className="text-xs text-muted-foreground">Anomaly Detector</p>
            </div>
          </div>
        </SheetHeader>

        <div className="p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path} 
                end 
                onClick={() => onOpenChange(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 ${getNavClasses(isActive(item.path))}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-auto p-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-anomaly-low rounded-full animate-pulse-glow" />
            <span className="text-muted-foreground">WebSocket Connected</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}