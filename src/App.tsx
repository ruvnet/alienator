
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import CrossModel from "./pages/CrossModel";
import Embeddings from "./pages/Embeddings";
import Cryptographic from "./pages/Cryptographic";
import Linguistic from "./pages/Linguistic";
import AnomalyLog from "./pages/AnomalyLog";
import EnhancedAnomalyLog from "./pages/EnhancedAnomalyLog";
import Configuration from "./pages/Configuration";
import Documentation from "./pages/Documentation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {showLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} duration={5000} />
      )}
      {!showLoading && (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="cross-model" element={<CrossModel />} />
                  <Route path="embeddings" element={<Embeddings />} />
                  <Route path="crypto" element={<Cryptographic />} />
                  <Route path="linguistic" element={<Linguistic />} />
                  <Route path="logs" element={<AnomalyLog />} />
                  <Route path="enhanced-logs" element={<EnhancedAnomalyLog />} />
                  <Route path="settings" element={<Configuration />} />
                  <Route path="docs" element={<Documentation />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      )}
    </div>
  );
};

export default App;
