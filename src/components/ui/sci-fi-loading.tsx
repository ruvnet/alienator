import { Binary, Cpu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SciFiLoadingProps {
  className?: string;
}

export function SciFiLoading({ className }: SciFiLoadingProps) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background",
      "bg-gradient-mesh",
      className
    )}>
      {/* Background animated grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse" />
      </div>

      {/* Main loading content */}
      <div className="relative flex flex-col items-center space-y-8">
        {/* Logo with animated border */}
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-pulse-glow" />
          <div className="relative bg-background/90 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <Binary className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>

        {/* Brand text */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">VibeCast</h1>
          <p className="text-sm text-muted-foreground">Anomaly Detector</p>
        </div>

        {/* Loading indicators */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Cpu className="w-4 h-4 animate-spin" />
            <span>Initializing neural networks...</span>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="w-64 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Loading modules</span>
              <span>100%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Establishing connections</span>
              <span>95%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[95%] animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Calibrating sensors</span>
              <span>87%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[87%] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <Zap className="absolute top-1/4 left-1/4 w-4 h-4 text-primary/30 animate-bounce" style={{ animationDelay: '0s' }} />
          <Zap className="absolute top-1/3 right-1/4 w-3 h-3 text-primary/20 animate-bounce" style={{ animationDelay: '0.5s' }} />
          <Zap className="absolute bottom-1/3 left-1/3 w-5 h-5 text-primary/40 animate-bounce" style={{ animationDelay: '1s' }} />
          <Zap className="absolute bottom-1/4 right-1/3 w-4 h-4 text-primary/25 animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
    </div>
  );
}