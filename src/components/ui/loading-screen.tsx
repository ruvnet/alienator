import { useState, useEffect } from "react";
import { Binary } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({ onComplete, duration = 5000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentDiagnostic, setCurrentDiagnostic] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState("");

  const phases = [
    "SYSTEM INITIALIZATION",
    "QUANTUM SENSORS ONLINE",
    "PATTERN RECOGNITION ACTIVE", 
    "XENOLOGICAL PROTOCOLS READY"
  ];

  const glitchPhrases = [
    "SIGNAL INTERFERENCE DETECTED",
    "UNKNOWN TRANSMISSION INTERCEPTED", 
    "DIMENSIONAL BREACH ANOMALY",
    "ALIEN PROTOCOL ANALYSIS...",
    "◊∆◊∆ NON-HUMAN SIGNATURE ∆◊∆◊"
  ];

  const diagnostics = [
    "Loading neural pattern matrices...",
    "Calibrating entropy detection arrays...", 
    "Establishing quantum coherence baselines...",
    "Initializing dimensional frequency scanners...",
    "Configuring linguistic anomaly filters...",
    "Activating cryptographic signature analysis...",
    "Synchronizing cross-model validation protocols...",
    "Enabling non-human intelligence detection...",
    "Loading xenological pattern database...",
    "Finalizing consciousness detection algorithms...",
    "Starting real-time monitoring systems...",
    "All systems operational. Scanning initiated."
  ];

  useEffect(() => {
    // Progress and phase updates
    const progressInterval = setInterval(() => {
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
          clearInterval(progressInterval);
          clearInterval(diagnosticInterval);
          clearInterval(glitchInterval);
        }
        
        return newProgress;
      });
    }, duration / 100);

    // Diagnostic text updates (faster than progress)
    const diagnosticInterval = setInterval(() => {
      setCurrentDiagnostic((prev) => {
        if (prev < diagnostics.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, duration / 12); // Show diagnostics faster than progress

    // Random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.15) { // 15% chance every interval
        setIsGlitching(true);
        setGlitchText(glitchPhrases[Math.floor(Math.random() * glitchPhrases.length)]);
        setTimeout(() => {
          setIsGlitching(false);
          setGlitchText("");
        }, 200 + Math.random() * 300); // Glitch for 200-500ms
      }
    }, 1000); // Check for glitch every second

    return () => {
      clearInterval(progressInterval);
      clearInterval(diagnosticInterval);
      clearInterval(glitchInterval);
    };
  }, [duration, onComplete, phases.length, diagnostics.length, glitchPhrases.length]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-center bg-background transition-opacity duration-300 ${
      isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
    } ${isGlitching ? 'animate-pulse' : ''}`}>
      
      {/* Glitch overlay */}
      {isGlitching && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="font-mono text-lg text-foreground/80 tracking-wider animate-pulse bg-background/90 px-4 py-2 border border-foreground/20">
              {glitchText}
            </div>
          </div>
          {/* Static lines */}
          <div className="absolute inset-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-px bg-foreground/30 absolute w-full animate-pulse"
                style={{ 
                  top: `${30 + i * 20}%`,
                  animationDuration: '0.1s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Single scanning line */}
      <div className="absolute inset-0">
        <div 
          className={`h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent absolute w-full transition-all duration-1000 ${
            isGlitching ? 'animate-pulse' : ''
          }`}
          style={{ 
            top: `${20 + (progress * 0.6)}%`,
            opacity: isComplete ? 0 : 0.6
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 max-w-xl mx-auto px-6">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-8 h-8 border border-foreground/20 rounded-sm flex items-center justify-center">
            <Binary className="w-4 h-4 text-foreground/60" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-mono font-medium text-foreground/90 tracking-wider">
              ALIENATOR v2.1.7
            </h1>
            <p className="text-xs text-foreground/40 font-mono tracking-widest">
              NON-HUMAN INTELLIGENCE DETECTION SYSTEM
            </p>
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-6">
          <div className="text-left font-mono text-xs text-foreground/60 leading-relaxed max-w-md mx-auto">
            <div className="border-l-2 border-foreground/20 pl-4 space-y-2">
              <div className="flex justify-between">
                <span>CORE_TEMP:</span>
                <span className="text-foreground/40">293.15K</span>
              </div>
              <div className="flex justify-between">
                <span>QUANTUM_STATE:</span>
                <span className="text-foreground/40">COHERENT</span>
              </div>
              <div className="flex justify-between">
                <span>NET_STATUS:</span>
                <span className="text-foreground/40">ENCRYPTED</span>
              </div>
              <div className="flex justify-between">
                <span>ANOMALY_THR:</span>
                <span className="text-foreground/40">0.750</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="w-64 h-px bg-foreground/10 mx-auto relative">
              <div 
                className="absolute top-0 left-0 h-full bg-foreground/60 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="font-mono text-xs text-foreground/50 tracking-widest">
              [{progress.toString().padStart(3, '0')}%] {isGlitching ? glitchText : phases[currentPhase]}
            </div>
          </div>

          {/* Diagnostic Output */}
          <div className={`bg-foreground/5 border border-foreground/10 rounded-sm p-4 text-left font-mono text-xs ${
            isGlitching ? 'animate-pulse border-foreground/30' : ''
          }`}>
            <div className="text-foreground/40 mb-2">SYSTEM_LOG:</div>
            <div className="space-y-1 max-h-24 overflow-hidden">
              {diagnostics.slice(Math.max(0, currentDiagnostic - 3), currentDiagnostic + 1).map((diagnostic, index, array) => (
                <div 
                  key={currentDiagnostic - array.length + 1 + index}
                  className={`text-foreground/${index === array.length - 1 ? '70' : '40'} transition-opacity duration-300 ${
                    isGlitching && index === array.length - 1 ? 'animate-pulse' : ''
                  }`}
                >
                  <span className="text-foreground/30">&gt; </span>
                  {isGlitching && index === array.length - 1 ? 
                    "ERROR: █▓▒░ UNKNOWN SIGNAL DETECTED ░▒▓█" : 
                    diagnostic
                  }
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}