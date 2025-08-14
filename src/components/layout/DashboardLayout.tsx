import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { MobileSidebar } from "@/components/ui/mobile-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-mesh">
        {/* Desktop Sidebar */}
        {!isMobile && <AppSidebar />}
        
        {/* Mobile Sidebar */}
        {isMobile && (
          <MobileSidebar 
            open={mobileMenuOpen} 
            onOpenChange={setMobileMenuOpen} 
          />
        )}
        
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader 
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            isMobile={isMobile}
          />
          
          <main className="flex-1 p-3 sm:p-6 overflow-auto">
            <div className="max-w-full mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}