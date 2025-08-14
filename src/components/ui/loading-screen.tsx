import { useState, useEffect } from "react";
import { Binary } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({ onComplete, duration = 2500 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    "INITIALIZING",
    "SCANNING",
    "ANALYZING", 
    "READY"
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
          }, 300);
          clearInterval(interval);
        }
        
        return newProgress;
      });
    }, duration / 100);

    return () => clearInterval(interval);
  }, [duration, onComplete, phases.length]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-300 ${
      isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Single scanning line */}
      <div className="absolute inset-0">
        <div 
          className="h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent absolute w-full transition-all duration-1000"
          style={{ 
            top: `${20 + (progress * 0.6)}%`,
            opacity: isComplete ? 0 : 0.6
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 max-w-sm mx-auto px-6">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 border border-foreground/20 rounded-sm flex items-center justify-center">
            <Binary className="w-4 h-4 text-foreground/60" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-mono font-medium text-foreground/90 tracking-wider">
              ALIENATOR
            </h1>
            <p className="text-xs text-foreground/40 font-mono tracking-widest">
              DETECTION SYSTEM
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="w-48 h-px bg-foreground/10 mx-auto relative">
            <div 
              className="absolute top-0 left-0 h-full bg-foreground/60 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="font-mono text-xs text-foreground/50 tracking-widest">
            {progress.toString().padStart(3, '0')}%
          </div>
        </div>

        {/* Current phase */}
        <div className="min-h-[20px]">
          <div className="font-mono text-sm text-foreground/70 tracking-widest">
            {phases[currentPhase]}
          </div>
        </div>

      </div>
    </div>
  );
}