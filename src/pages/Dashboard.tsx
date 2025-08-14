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
    message: "High entropy spike detected in GPT-4 responses",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    severity: "high"
  },
  {
    id: 2,
    type: "warning", 
    message: "Cross-model deviation above threshold",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    severity: "medium"
  },
  {
    id: 3,
    type: "info",
    message: "Compression ratio normalization complete",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    severity: "low"
  }
];

const mockTextStream = [
  { id: 1, text: "The quick brown fox jumps over the lazy dog...", anomalyScore: 0.2, timestamp: new Date() },
  { id: 2, text: "Anomalous pattern detected in linguistic structure...", anomalyScore: 0.8, timestamp: new Date() },
  { id: 3, text: "Regular text processing with normal entropy levels...", anomalyScore: 0.3, timestamp: new Date() },
  { id: 4, text: "Cryptographic signature found in output stream...", anomalyScore: 0.9, timestamp: new Date() },
  { id: 5, text: "Standard response generation within parameters...", anomalyScore: 0.1, timestamp: new Date() }
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
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Real-time Monitor</h1>
          <p className="text-muted-foreground">AI output anomaly detection dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-anomaly-low animate-pulse" />
          <Badge variant="outline" className="text-anomaly-low border-anomaly-low/30">
            Live Monitoring
          </Badge>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Anomaly Gauge */}
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Anomaly Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <AnomalyGauge 
              value={metrics.anomalyScore} 
              size="xl" 
              animated 
              glowEffect 
            />
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Text Stream */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-anomaly-low animate-pulse" />
              Live Text Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {mockTextStream.map((item, index) => (
                <div 
                  key={item.id}
                  className="p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/30 transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.anomalyScore >= 0.7 
                          ? "border-anomaly-high/30 text-anomaly-high" 
                          : item.anomalyScore >= 0.3 
                          ? "border-anomaly-medium/30 text-anomaly-medium"
                          : "border-anomaly-low/30 text-anomaly-low"
                      }`}
                    >
                      {(item.anomalyScore * 100).toFixed(1)}% anomaly
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80">{item.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Feed */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-anomaly-medium" />
              Active Alerts
              <Badge className="ml-auto bg-anomaly-high/20 text-anomaly-high">
                {mockAlerts.filter(a => a.type === "critical").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                    alert.severity === "high" 
                      ? "border-anomaly-high/30 bg-anomaly-high/5" 
                      : alert.severity === "medium"
                      ? "border-anomaly-medium/30 bg-anomaly-medium/5"
                      : "border-border/30 bg-muted/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2 text-xs"
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