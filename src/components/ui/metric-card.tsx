import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  sparkline?: number[];
  icon?: LucideIcon;
  status?: "normal" | "warning" | "critical";
  pulse?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  sparkline = [],
  icon: Icon,
  status = "normal",
  pulse = false,
  className
}: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "critical": return "text-anomaly-high border-anomaly-high/20 bg-anomaly-high/5";
      case "warning": return "text-anomaly-medium border-anomaly-medium/20 bg-anomaly-medium/5";
      default: return "text-foreground border-border/50 bg-card/50";
    }
  };

  const getChangeColor = () => {
    if (!change) return "text-muted-foreground";
    return change > 0 ? "text-anomaly-high" : "text-anomaly-low";
  };

  // Create sparkline path
  const createSparklinePath = () => {
    if (sparkline.length < 2) return "";
    
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min || 1;
    
    const points = sparkline.map((value, index) => {
      const x = (index / (sparkline.length - 1)) * 100;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    }).join(" ");
    
    return `M ${points}`;
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      getStatusColor(),
      pulse && status === "critical" && "animate-anomaly-pulse",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn(
            "h-4 w-4",
            status === "critical" ? "text-anomaly-high" : "text-muted-foreground"
          )} />
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          
          {change !== undefined && (
            <div className={cn("flex items-center text-xs", getChangeColor())}>
              <span>{change > 0 ? "+" : ""}{change.toFixed(2)}%</span>
            </div>
          )}
        </div>
        
        {sparkline.length > 0 && (
          <div className="mt-3 h-5">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <path
                d={createSparklinePath()}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="opacity-60"
              />
            </svg>
          </div>
        )}
        
        {status !== "normal" && (
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                status === "critical" 
                  ? "border-anomaly-high/30 text-anomaly-high bg-anomaly-high/10" 
                  : "border-anomaly-medium/30 text-anomaly-medium bg-anomaly-medium/10"
              )}
            >
              {status === "critical" ? "Critical" : "Warning"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}