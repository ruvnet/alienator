import { useState, useEffect } from "react";
import { Binary, Brain, Eye, Zap } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    { text: "Initializing quantum consciousness detectors...", icon: Brain },
    { text: "Calibrating entropy analysis matrices...", icon: Binary },
    { text: "Establishing interdimensional communication channels...", icon: Zap },
    { text: "Scanning for non-human intelligence signatures...", icon: Eye },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        
        // Update phase based on progress
        const phaseIndex = Math.floor((newProgress / 100) * phases.length);
        setCurrentPhase(Math.min(phaseIndex, phases.length - 1));
        
        if (newProgress >= 100) {
          setIsComplete(true);
          setTimeout(() => {
            onComplete?.();
          }, 500);
          clearInterval(interval);
        }
        
        return newProgress;
      });
    }, duration / 100);

    return () => clearInterval(interval);
  }, [duration, onComplete, phases.length]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
      isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background" />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* Scanning lines */}
        <div className="absolute inset-0">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent absolute top-1/4 w-full animate-pulse" />
          <div className="h-px bg-gradient-to-r from-transparent via-anomaly-low/50 to-transparent absolute top-2/4 w-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="h-px bg-gradient-to-r from-transparent via-anomaly-medium/50 to-transparent absolute top-3/4 w-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="relative">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <Binary className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-anomaly-low to-anomaly-medium bg-clip-text text-transparent">
              👽 Alienator
            </h1>
            <p className="text-sm text-muted-foreground">Detection System</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="space-y-4">
          <div className="relative w-full h-2 bg-muted/20 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-anomaly-low via-anomaly-medium to-anomaly-high rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            {progress}% Complete
          </div>
        </div>

        {/* Current phase */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 min-h-[24px]">
            {phases[currentPhase] && (
              <>
                {(() => {
                  const CurrentIcon = phases[currentPhase].icon;
                  return <CurrentIcon className="w-5 h-5 text-anomaly-medium animate-pulse" />;
                })()}
                <span className="text-sm text-foreground/80 animate-fade-in">
                  {phases[currentPhase].text}
                </span>
              </>
            )}
          </div>
          
          {/* Phase indicators */}
          <div className="flex justify-center gap-2">
            {phases.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentPhase 
                    ? 'bg-anomaly-low' 
                    : 'bg-muted/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Status text */}
        <div className="text-xs text-muted-foreground/60 italic">
          "Searching for intelligence beyond human understanding..."
        </div>
      </div>
    </div>
  );
}