import { 
  Activity, 
  BarChart3, 
  GitBranch, 
  Sparkles, 
  Shield, 
  Languages, 
  History, 
  Settings,
  Binary,
  BookOpen,
  Database,
  Zap
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { icon: Activity, label: "Real-time Monitor", path: "/" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: GitBranch, label: "Cross-Model", path: "/cross-model" },
  { icon: Sparkles, label: "Embeddings", path: "/embeddings" },
  { icon: Shield, label: "Cryptographic", path: "/crypto" },
  { icon: Languages, label: "Linguistic", path: "/linguistic" },
  { icon: History, label: "Anomaly Log", path: "/logs" },
  { icon: Database, label: "Enhanced Logs", path: "/enhanced-logs" },
  { icon: BookOpen, label: "Documentation", path: "/docs" },
  { icon: Settings, label: "Configuration", path: "/settings" }
];

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClasses = (active: boolean) =>
    active 
      ? "bg-primary/10 text-primary border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const handleNavClick = () => {
    // Close mobile sidebar when navigation item is clicked
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} border-r border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300`}
    >
      <SidebarContent className="p-0">
        {/* Logo Section */}
        <div className={`p-4 border-b border-border/50 ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Binary className="w-4 h-4 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-sm font-semibold text-foreground">👽 Alienator</h2>
                <p className="text-xs text-muted-foreground">Non-Human AI Detection</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2 py-4">
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink 
                      to={item.path} 
                      end 
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${getNavClasses(isActive(item.path))}`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm font-medium truncate">{item.label}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Connection Status */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-anomaly-low rounded-full animate-pulse-glow" />
              <span className="text-muted-foreground">WebSocket Connected</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
