import { cn } from "@/lib/utils";

interface AnomalyGaugeProps {
  value: number; // 0-1
  size?: "sm" | "md" | "lg" | "xl";
  showThresholds?: boolean;
  animated?: boolean;
  glowEffect?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { container: "w-16 h-16", stroke: 3, text: "text-xs" },
  md: { container: "w-24 h-24", stroke: 4, text: "text-sm" },
  lg: { container: "w-32 h-32", stroke: 5, text: "text-base" },
  xl: { container: "w-40 h-40", stroke: 6, text: "text-lg" }
};

export function AnomalyGauge({
  value,
  size = "md",
  showThresholds = true,
  animated = true,
  glowEffect = true,
  className
}: AnomalyGaugeProps) {
  const config = sizeConfig[size];
  const normalizedValue = Math.max(0, Math.min(1, value));
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedValue * circumference);
  
  // Determine color based on value
  const getGaugeColor = () => {
    if (normalizedValue >= 0.7) return "hsl(var(--anomaly-high))";
    if (normalizedValue >= 0.3) return "hsl(var(--anomaly-medium))";
    return "hsl(var(--anomaly-low))";
  };

  const gaugeColor = getGaugeColor();
  
  return (
    <div className={cn("relative", config.container, className)}>
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={config.stroke}
          className="opacity-20"
        />
        
        {/* Threshold indicators */}
        {showThresholds && (
          <>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--anomaly-medium))"
              strokeWidth="1"
              strokeDasharray="2 4"
              strokeDashoffset={circumference - (0.3 * circumference)}
              className="opacity-40"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--anomaly-high))"
              strokeWidth="1"
              strokeDasharray="2 4"
              strokeDashoffset={circumference - (0.7 * circumference)}
              className="opacity-40"
            />
          </>
        )}
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={gaugeColor}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            animated && "transition-all duration-1000 ease-out",
            glowEffect && normalizedValue > 0.7 && "animate-anomaly-pulse"
          )}
          style={{
            filter: glowEffect && normalizedValue > 0.7 
              ? `drop-shadow(0 0 8px ${gaugeColor})`
              : undefined
          }}
        />
      </svg>
      
      {/* Center value display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn("font-bold text-foreground", config.text)}>
            {Math.round(normalizedValue * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">anomaly</div>
        </div>
      </div>
    </div>
  );
}