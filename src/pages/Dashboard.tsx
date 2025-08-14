import { useState, useEffect } from "react";
import { Binary, Brain, Minimize2, GitCompare, AlertTriangle, Activity, Zap, Shield, Database, Eye, Cpu, Settings, ExternalLink } from "lucide-react";
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

const generateSystemMetrics = () => ({
  throughput: Math.round(Math.random() * 5000 + 8000),
  latency: Math.round(Math.random() * 30 + 20),
  accuracy: Math.random() * 0.05 + 0.95,
  uptime: 99.9,
  activeNodes: Math.round(Math.random() * 10 + 15),
  modelsOnline: 5,
  processingQueue: Math.round(Math.random() * 200 + 50)
});

const mockAlerts = [
  {
    id: 1,
    type: "critical",
    category: "Xenotype Detection",
    message: "CRITICAL: Non-human linguistic structures detected in GPT-4 output sequence (Score: 0.94)",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    severity: "high",
    analyzer: "Linguistic Pattern Recognition"
  },
  {
    id: 2,
    type: "warning", 
    category: "Entropy Anomaly",
    message: "Unusual information density patterns suggest potential quantum consciousness interference",
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    severity: "medium",
    analyzer: "Shannon Entropy Analysis"
  },
  {
    id: 3,
    type: "critical",
    category: "Cryptographic Alert",
    message: "Hidden encoding detected: Possible steganographic content in Claude response",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    severity: "high",
    analyzer: "Cryptographic Scanner"
  },
  {
    id: 4,
    type: "info",
    category: "Cross-Model Deviation",
    message: "Significant response variance detected across AI models for identical prompt",
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    severity: "low",
    analyzer: "Cross-Reference Analysis"
  },
  {
    id: 5,
    type: "warning",
    category: "Embedding Anomaly", 
    message: "Vector space clustering suggests higher-dimensional mathematical structures",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    severity: "medium",
    analyzer: "Embedding Space Analysis"
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
  const [systemMetrics, setSystemMetrics] = useState(generateSystemMetrics());
  const [sparklineData, setSparklineData] = useState<number[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = generateMockData();
      const newSystemMetrics = generateSystemMetrics();
      setMetrics(newMetrics);
      setSystemMetrics(newSystemMetrics);
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
      {/* Enhanced Page Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate">👽 Alienator</h1>
              <a 
                href="https://github.com/ruvnet/alienator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-primary" />
              </a>
            </div>
            <p className="text-muted-foreground text-xs md:text-sm lg:text-base mb-2">
              Advanced Detection System for Non-Human Intelligence in AI Outputs
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                {systemMetrics.modelsOnline}/5 Models Online
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 text-xs">
                {systemMetrics.activeNodes} Active Nodes
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-xs">
                {systemMetrics.throughput.toLocaleString()} msgs/sec
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Activity className="w-4 h-4 text-anomaly-low animate-pulse" />
            <Badge variant="outline" className="text-anomaly-low border-anomaly-low/30 text-xs">
              Live Monitoring Active
            </Badge>
          </div>
        </div>

        {/* System Status Overview */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-sm font-medium text-green-500">{systemMetrics.uptime}%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-blue-500">{systemMetrics.latency}ms</div>
                  <div className="text-xs text-muted-foreground">Latency</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-sm font-medium text-purple-500">{(systemMetrics.accuracy * 100).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-sm font-medium text-orange-500">{systemMetrics.processingQueue}</div>
                  <div className="text-xs text-muted-foreground">Queue</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-pink-500" />
                <div>
                  <div className="text-sm font-medium text-pink-500">GPT-4</div>
                  <div className="text-xs text-muted-foreground">Primary</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-500" />
                <div>
                  <div className="text-sm font-medium text-cyan-500">6</div>
                  <div className="text-xs text-muted-foreground">Analyzers</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-500">v2.1</div>
                  <div className="text-xs text-muted-foreground">Protocol</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

        {/* Enhanced Alerts Feed */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-anomaly-medium" />
              Live Detection Alerts
              <div className="ml-auto flex gap-2">
                <Badge className="bg-anomaly-high/20 text-anomaly-high text-xs">
                  {mockAlerts.filter(a => a.type === "critical").length} Critical
                </Badge>
                <Badge className="bg-anomaly-medium/20 text-anomaly-medium text-xs">
                  {mockAlerts.filter(a => a.type === "warning").length} Warning
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
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
                   <div className="flex items-start justify-between gap-2 mb-2">
                     <div className="flex items-center gap-2">
                       <Badge 
                         variant="outline" 
                         className={`text-xs ${
                           alert.severity === "high" 
                             ? "border-anomaly-high/30 text-anomaly-high" 
                             : alert.severity === "medium"
                             ? "border-anomaly-medium/30 text-anomaly-medium"
                             : "border-muted-foreground/30 text-muted-foreground"
                         }`}
                       >
                         {alert.category}
                       </Badge>
                       <span className="text-xs text-muted-foreground">
                         {alert.timestamp.toLocaleTimeString()}
                       </span>
                     </div>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="ml-2 text-xs flex-shrink-0 h-6 px-2"
                     >
                       Dismiss
                     </Button>
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium text-foreground break-words mb-1">
                       {alert.message}
                     </p>
                     <p className="text-xs text-muted-foreground">
                       Source: {alert.analyzer}
                     </p>
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