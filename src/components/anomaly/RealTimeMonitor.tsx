import { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Pause, 
  Play, 
  Settings, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Clock,
  RefreshCw,
  Filter,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useAnomalyStore } from '@/stores/anomalyStore';
import { AnomalyRecord } from '@/types/anomaly';
import { formatTimestamp, getSeverityColor, calculateAnomalyScore } from '@/utils/anomalyUtils';

interface LiveFeedItem {
  id: string;
  timestamp: Date;
  type: 'anomaly' | 'alert' | 'system' | 'correlation';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  message: string;
  data?: any;
}

export function RealTimeMonitor() {
  const { addAnomaly, stats } = useAnomalyStore();
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [refreshRate, setRefreshRate] = useState(5); // seconds
  const [autoScroll, setAutoScroll] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(7.5);
  const [liveFeed, setLiveFeed] = useState<LiveFeedItem[]>([]);
  const [realtimeStats, setRealtimeStats] = useState({
    totalToday: 0,
    lastHour: 0,
    avgEntropy: 0,
    criticalCount: 0,
    trend: 'stable' as 'up' | 'down' | 'stable'
  });
  
  const feedRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate real-time data generation
  useEffect(() => {
    if (!isMonitoring) return;

    const generateMockAnomaly = (): AnomalyRecord => {
      const types = [
        'entropy_spike', 'cross_model_divergence', 'compression_anomaly', 
        'linguistic_pattern', 'cryptographic_pattern', 'embedding_anomaly'
      ];
      const models = ['GPT-4', 'Claude-3', 'Cohere', 'GPT-3.5', 'Gemini'];
      const severities = ['critical', 'high', 'medium', 'low'] as const;
      
      const entropy = Math.random() * 10;
      const severity = entropy > 8.5 ? 'critical' : 
                      entropy > 7 ? 'high' : 
                      entropy > 5 ? 'medium' : 'low';

      return {
        id: `ANO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        severity,
        type: types[Math.floor(Math.random() * types.length)] as any,
        model: models[Math.floor(Math.random() * models.length)],
        description: `Detected ${severity} anomaly with ${entropy.toFixed(2)} entropy`,
        entropy,
        text_preview: `Sample text with entropy ${entropy.toFixed(2)}...`,
        status: Math.random() > 0.7 ? 'investigating' : 'acknowledged' as any,
        tags: ['real-time', 'automated'],
        metadata: {
          confidence_score: Math.random(),
          analysis_version: '2.1.0',
          processing_time_ms: Math.floor(Math.random() * 500) + 50,
          session_id: `session-${Math.random().toString(36).substr(2, 8)}`
        },
        metrics: {
          compression_ratio: Math.random(),
          pattern_strength: Math.random()
        }
      };
    };

    const generateLiveFeedItem = (anomaly?: AnomalyRecord): LiveFeedItem => {
      if (anomaly) {
        return {
          id: `feed-${Date.now()}`,
          timestamp: new Date(),
          type: 'anomaly',
          severity: anomaly.severity,
          message: `New ${anomaly.severity} anomaly detected: ${anomaly.type.replace(/_/g, ' ')}`,
          data: anomaly
        };
      }

      const feedTypes = [
        {
          type: 'system' as const,
          severity: 'info' as const,
          message: 'System status: All analyzers operational'
        },
        {
          type: 'alert' as const,
          severity: 'medium' as const,
          message: 'Threshold exceeded: Entropy spike pattern detected'
        },
        {
          type: 'correlation' as const,
          severity: 'high' as const,
          message: 'Correlation discovered: 3 anomalies from same source'
        }
      ];

      const item = feedTypes[Math.floor(Math.random() * feedTypes.length)];
      return {
        id: `feed-${Date.now()}`,
        timestamp: new Date(),
        ...item
      };
    };

    const updateData = () => {
      // Randomly generate new anomalies (20% chance)
      if (Math.random() < 0.2) {
        const newAnomaly = generateMockAnomaly();
        addAnomaly(newAnomaly);
        
        const feedItem = generateLiveFeedItem(newAnomaly);
        setLiveFeed(prev => [feedItem, ...prev.slice(0, 49)]); // Keep last 50 items

        // Trigger alert if threshold exceeded
        if (showAlerts && newAnomaly.entropy > alertThreshold) {
          // Would trigger system notification here
          console.log('Alert triggered:', newAnomaly);
        }
      } else {
        // Generate other feed items (60% chance)
        if (Math.random() < 0.6) {
          const feedItem = generateLiveFeedItem();
          setLiveFeed(prev => [feedItem, ...prev.slice(0, 49)]);
        }
      }

      // Update real-time stats
      setRealtimeStats(prev => ({
        ...prev,
        totalToday: prev.totalToday + (Math.random() < 0.1 ? 1 : 0),
        lastHour: Math.floor(Math.random() * 20),
        avgEntropy: 5 + Math.random() * 3,
        criticalCount: Math.floor(Math.random() * 5),
        trend: Math.random() < 0.33 ? 'up' : Math.random() < 0.66 ? 'down' : 'stable'
      }));
    };

    intervalRef.current = setInterval(updateData, refreshRate * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring, refreshRate, addAnomaly, showAlerts, alertThreshold]);

  // Auto-scroll to latest
  useEffect(() => {
    if (autoScroll && feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [liveFeed, autoScroll]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const getFeedIcon = (type: string, severity: string) => {
    switch (type) {
      case 'anomaly':
        return severity === 'critical' ? (
          <AlertTriangle className="w-4 h-4 text-red-500" />
        ) : (
          <Zap className="w-4 h-4 text-orange-500" />
        );
      case 'alert':
        return <Bell className="w-4 h-4 text-yellow-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-blue-500" />;
      case 'correlation':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-Time Monitor
            {isMonitoring && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          </h2>
          <p className="text-sm text-muted-foreground">
            Live anomaly detection and system monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isMonitoring ? "default" : "outline"}
            onClick={toggleMonitoring}
            className="flex items-center gap-2"
          >
            {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isMonitoring ? 'Pause' : 'Start'} Monitoring
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Today</div>
                <div className="text-2xl font-bold">{realtimeStats.totalToday}</div>
              </div>
              {getTrendIcon(realtimeStats.trend)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Last Hour</div>
                <div className="text-2xl font-bold">{realtimeStats.lastHour}</div>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Avg Entropy</div>
                <div className="text-2xl font-bold">{realtimeStats.avgEntropy.toFixed(1)}</div>
              </div>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Critical</div>
                <div className="text-2xl font-bold text-red-500">{realtimeStats.criticalCount}</div>
              </div>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className="text-sm font-bold text-green-500">
                  {isMonitoring ? 'Active' : 'Paused'}
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Monitor Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Refresh Rate (seconds)</Label>
                <Select value={refreshRate.toString()} onValueChange={(v) => setRefreshRate(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 second</SelectItem>
                    <SelectItem value="2">2 seconds</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Auto-scroll</Label>
                <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Show Alerts</Label>
                <Switch checked={showAlerts} onCheckedChange={setShowAlerts} />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Alert Threshold: {alertThreshold.toFixed(1)}
                </Label>
                <Slider
                  value={[alertThreshold]}
                  onValueChange={([value]) => setAlertThreshold(value)}
                  max={10}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Performance</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>CPU Usage:</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span>Memory:</span>
                    <span>156MB</span>
                  </div>
                  <Progress value={45} className="h-1" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Activity Feed
              <Badge variant="outline">{liveFeed.length}</Badge>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoScroll(!autoScroll)}
              >
                {autoScroll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiveFeed([])}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96" ref={feedRef}>
            <div className="space-y-2">
              {liveFeed.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No activity yet. Start monitoring to see live updates.</p>
                </div>
              ) : (
                liveFeed.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-md bg-muted/20 border-l-2 border-transparent hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getFeedIcon(item.type, item.severity)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(item.severity)}`}
                        >
                          {item.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm">{item.message}</p>
                      
                      {item.data && item.type === 'anomaly' && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>Entropy: {item.data.entropy.toFixed(2)}</span>
                          <span className="mx-2">•</span>
                          <span>Model: {item.data.model}</span>
                          <span className="mx-2">•</span>
                          <span>Score: {calculateAnomalyScore(item.data)}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}