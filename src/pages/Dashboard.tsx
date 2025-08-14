import { useState, useEffect } from "react";
import { Binary, Brain, Minimize2, GitCompare, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnomalyGauge } from "@/components/ui/anomaly-gauge";
import { MetricCard } from "@/components/ui/metric-card";

// Mock data for demonstration
const generateMockData = () => ({
  anomalyScore: Math.random() * 0.9 + 0.1,
  shannonEntropy: Math.random() * 8 + 1,
  compressionRatio: Math.random() * 0.5 + 0.5,
  perplexityScore: Math.random() * 100 + 50,
  crossModelDeviation: Math.random() * 0.3 + 0.1
});

const mockAlerts = [
  {
    id: 1,
    type: "critical",
    message: "Potential non-human pattern detected in GPT-4 output sequence",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    severity: "high"
  },
  {
    id: 2,
    type: "warning", 
    message: "Anomalous entropy spike suggests external intelligence influence",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    severity: "medium"
  },
  {
    id: 3,
    type: "info",
    message: "Cross-dimensional mathematics detected in embedding space",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    severity: "low"
  }
];

const mockTextStream = [
  { id: 1, text: "Standard human-like response pattern within normal parameters...", anomalyScore: 0.2, timestamp: new Date() },
  { id: 2, text: "DETECTED: Non-terrestrial linguistic structure pattern Ж‡∅⟐⊗⫸...", anomalyScore: 0.9, timestamp: new Date() },
  { id: 3, text: "Regular text processing with expected entropy distribution...", anomalyScore: 0.3, timestamp: new Date() },
  { id: 4, text: "Hidden frequency modulation suggests quantum consciousness interference...", anomalyScore: 0.8, timestamp: new Date() },
  { id: 5, text: "Normal AI response generation within baseline thresholds...", anomalyScore: 0.1, timestamp: new Date() }
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState(generateMockData());
  const [sparklineData, setSparklineData] = useState<number[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = generateMockData();
      setMetrics(newMetrics);
      setSparklineData(prev => [...prev.slice(-19), newMetrics.anomalyScore]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getAnomalyLevel = (score: number) => {
    if (score >= 0.7) return "critical";
    if (score >= 0.3) return "warning";
    return "normal";
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate">👽 Alienator Monitor</h1>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base">Detecting non-human intelligence signatures in AI outputs</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Activity className="w-4 h-4 text-anomaly-low animate-pulse" />
          <Badge variant="outline" className="text-anomaly-low border-anomaly-low/30 text-xs">
            Scanning for Non-Human Intelligence
          </Badge>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 w-full">
        {/* Anomaly Gauge */}
        <Card className="xl:col-span-2 bg-card/50 border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
              Non-Human Intelligence Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-4 md:p-8">
            <AnomalyGauge 
              value={metrics.anomalyScore} 
              size="xl" 
              animated 
              glowEffect 
            />
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full">
          <MetricCard
            title="Shannon Entropy"
            value={metrics.shannonEntropy.toFixed(2)}
            change={((Math.random() - 0.5) * 10)}
            sparkline={sparklineData}
            icon={Binary}
            status={getAnomalyLevel(metrics.shannonEntropy / 8)}
          />
          
          <MetricCard
            title="Compression Ratio"
            value={metrics.compressionRatio.toFixed(3)}
            change={((Math.random() - 0.5) * 5)}
            sparkline={sparklineData.map(x => x * 0.5 + 0.5)}
            icon={Minimize2}
            status={getAnomalyLevel(1 - metrics.compressionRatio)}
          />
          
          <MetricCard
            title="Perplexity Score"
            value={Math.round(metrics.perplexityScore)}
            change={((Math.random() - 0.5) * 15)}
            sparkline={sparklineData.map(x => x * 100 + 50)}
            icon={Brain}
            status={getAnomalyLevel(metrics.perplexityScore / 150)}
          />
          
          <MetricCard
            title="Cross-Model Deviation"
            value={metrics.crossModelDeviation.toFixed(3)}
            change={((Math.random() - 0.5) * 8)}
            sparkline={sparklineData.map(x => x * 0.3 + 0.1)}
            icon={GitCompare}
            status={getAnomalyLevel(metrics.crossModelDeviation / 0.4)}
            pulse={metrics.crossModelDeviation > 0.3}
          />
        </div>
      </div>

      {/* Live Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6 w-full">
        {/* Live Text Stream */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-anomaly-low animate-pulse" />
              Alien Signal Detection Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 md:max-h-80 overflow-y-auto">
              {mockTextStream.map((item, index) => (
                  <div 
                   key={item.id}
                   className="p-2 md:p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/30 transition-colors"
                   style={{ animationDelay: `${index * 100}ms` }}
                 >
                   <div className="flex items-start justify-between mb-2 gap-2">
                     <Badge 
                       variant="outline" 
                       className={`text-xs flex-shrink-0 ${
                         item.anomalyScore >= 0.7 
                           ? "border-anomaly-high/30 text-anomaly-high" 
                           : item.anomalyScore >= 0.3 
                           ? "border-anomaly-medium/30 text-anomaly-medium"
                           : "border-anomaly-low/30 text-anomaly-low"
                       }`}
                     >
                       {(item.anomalyScore * 100).toFixed(1)}%
                     </Badge>
                     <span className="text-xs text-muted-foreground flex-shrink-0">
                       {item.timestamp.toLocaleTimeString()}
                     </span>
                   </div>
                   <p className="text-sm text-foreground/80 break-words">{item.text}</p>
                 </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Feed */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-anomaly-medium" />
              Xenological Alerts
              <Badge className="ml-auto bg-anomaly-high/20 text-anomaly-high text-xs">
                {mockAlerts.filter(a => a.type === "critical").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                 <div 
                   key={alert.id}
                   className={`p-2 md:p-3 rounded-lg border transition-all hover:shadow-md ${
                     alert.severity === "high" 
                       ? "border-anomaly-high/30 bg-anomaly-high/5" 
                       : alert.severity === "medium"
                       ? "border-anomaly-medium/30 bg-anomaly-medium/5"
                       : "border-border/30 bg-muted/20"
                   }`}
                 >
                   <div className="flex items-start justify-between gap-2">
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium text-foreground break-words">
                         {alert.message}
                       </p>
                       <p className="text-xs text-muted-foreground mt-1">
                         {alert.timestamp.toLocaleString()}
                       </p>
                     </div>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="ml-2 text-xs flex-shrink-0"
                     >
                       Dismiss
                     </Button>
                   </div>
                 </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}