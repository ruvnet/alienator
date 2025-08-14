import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Activity, AlertTriangle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/ui/metric-card";
import { TimeSeriesChart } from "@/components/analytics/TimeSeriesChart";
import { CorrelationMatrix } from "@/components/analytics/CorrelationMatrix";
import { DistributionChart } from "@/components/analytics/DistributionChart";
import { ModelPerformanceHeatmap } from "@/components/analytics/ModelPerformanceHeatmap";
import { PatternRecognitionPanel } from "@/components/analytics/PatternRecognitionPanel";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { RealTimeMonitor } from "@/components/analytics/RealTimeMonitor";
import { ExportManager } from "@/components/analytics/ExportManager";
import { analyticsService } from "@/services/analyticsService";
import { 
  AnalyticsData, 
  MetricTrend, 
  PatternData, 
  DetectionStats, 
  CorrelationMatrix as CorrelationMatrixType,
  ModelPerformance,
  DistributionData,
  HeatmapCell,
  AnomalyEvent,
  AnalyticsFilter,
  ExportConfig
} from "@/types/analytics";

export default function Analytics() {
  // State for analytics data
  const [timeSeriesData, setTimeSeriesData] = useState<AnalyticsData[]>([]);
  const [metricTrends, setMetricTrends] = useState<MetricTrend[]>([]);
  const [patternData, setPatternData] = useState<PatternData[]>([]);
  const [detectionStats, setDetectionStats] = useState<DetectionStats | null>(null);
  const [correlationMatrix, setCorrelationMatrix] = useState<CorrelationMatrixType | null>(null);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
  const [distributionData, setDistributionData] = useState<DistributionData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
  const [anomalyEvents, setAnomalyEvents] = useState<AnomalyEvent[]>([]);
  
  // State for UI controls
  const [isLoading, setIsLoading] = useState(true);
  const [isMonitoringConnected, setIsMonitoringConnected] = useState(true);
  const [selectedDistributionMetric, setSelectedDistributionMetric] = useState('entropy');
  const [isExporting, setIsExporting] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState<AnalyticsFilter>({
    timeRange: { value: '24h', label: 'Last 24 Hours', hours: 24 },
    metrics: ['entropy', 'compression', 'anomalyScore', 'patternComplexity'],
    models: ['all'],
    severityLevels: ['low', 'medium', 'high', 'critical'],
    patternTypes: ['linguistic', 'cryptographic', 'compression', 'entropy']
  });
  
  const availableMetrics = ['entropy', 'compression', 'anomalyScore', 'patternComplexity', 'modelConfidence', 'detectionAccuracy', 'processingTime', 'memoryUsage', 'cpuUsage'];

  // Load initial data
  useEffect(() => {
    loadAnalyticsData();
  }, [filters.timeRange]);
  
  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [timeSeries, trends, patterns, stats, correlation, models, distribution, heatmap, events] = await Promise.all([
        analyticsService.getTimeSeriesData(filters.timeRange.value),
        analyticsService.getMetricTrends(),
        analyticsService.getPatternData(),
        analyticsService.getDetectionStats(),
        analyticsService.getCorrelationMatrix(),
        analyticsService.getModelPerformance(),
        analyticsService.getDistributionData(selectedDistributionMetric),
        analyticsService.getHeatmapData(),
        analyticsService.getAnomalyEvents()
      ]);
      
      setTimeSeriesData(timeSeries);
      setMetricTrends(trends);
      setPatternData(patterns);
      setDetectionStats(stats);
      setCorrelationMatrix(correlation);
      setModelPerformance(models);
      setDistributionData(distribution);
      setHeatmapData(heatmap);
      setAnomalyEvents(events);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = async (config: ExportConfig) => {
    setIsExporting(true);
    try {
      const result = await analyticsService.exportData(config);
      // Create download link
      const blob = new Blob([result], { 
        type: config.format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.${config.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleResolveEvent = (eventId: string) => {
    setAnomalyEvents(events => 
      events.map(event => 
        event.id === eventId ? { ...event, resolved: true } : event
      )
    );
  };
  
  const handleToggleMonitoring = (enabled: boolean) => {
    // In a real app, this would control the monitoring service
    console.log('Monitoring toggled:', enabled);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6 animate-fade-in max-w-full overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base">Comprehensive analysis and visualization of detection metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isMonitoringConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-muted-foreground">
            {isMonitoringConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExport={(format) => handleExport({ format, dateRange: { start: '', end: '' }, metrics: filters.metrics, includeCharts: false })}
        onRefresh={loadAnalyticsData}
        isLoading={isLoading}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 w-full">
        {metricTrends.map((trend, index) => (
          <MetricCard
            key={trend.metric}
            title={trend.metric}
            value={typeof trend.current === 'number' && trend.metric.includes('%') ? 
              `${trend.current.toFixed(1)}%` : 
              trend.current.toLocaleString()
            }
            change={trend.change}
            status={trend.status}
            pulse={trend.status === 'critical'}
            icon={index === 0 ? BarChart3 : index === 1 ? AlertTriangle : TrendingUp}
          />
        ))}
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="timeseries" className="space-y-4">
        <TabsList className="bg-muted/20 flex-wrap h-auto p-1">
          <TabsTrigger value="timeseries" className="data-[state=active]:bg-background">
            <BarChart3 className="w-4 h-4 mr-2" />
            Time Series
          </TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-background">
            <Activity className="w-4 h-4 mr-2" />
            Pattern Analysis
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-background">
            <TrendingUp className="w-4 h-4 mr-2" />
            Model Performance
          </TabsTrigger>
          <TabsTrigger value="distribution" className="data-[state=active]:bg-background">
            Distribution
          </TabsTrigger>
          <TabsTrigger value="correlation" className="data-[state=active]:bg-background">
            Correlation
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-background">
            <Activity className="w-4 h-4 mr-2" />
            Live Monitor
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-background">
            <Download className="w-4 h-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeseries" className="space-y-4">
          <TimeSeriesChart
            data={timeSeriesData}
            timeRange={filters.timeRange.value}
            selectedMetrics={filters.metrics}
            showMovingAverage={true}
            showAnomalies={true}
          />
          
          {detectionStats && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Detection Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{(detectionStats.accuracy * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{(detectionStats.precision * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Precision</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{(detectionStats.recall * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Recall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{(detectionStats.f1Score * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">F1 Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <PatternRecognitionPanel patterns={patternData} />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <ModelPerformanceHeatmap 
            data={heatmapData}
            modelPerformance={modelPerformance}
          />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <DistributionChart
            data={distributionData}
            selectedMetric={selectedDistributionMetric}
            onMetricChange={setSelectedDistributionMetric}
            availableMetrics={['entropy', 'compression', 'anomalyScore', 'patternComplexity']}
          />
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          {correlationMatrix && (
            <CorrelationMatrix data={correlationMatrix} />
          )}
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-4">
          <RealTimeMonitor
            events={anomalyEvents}
            isConnected={isMonitoringConnected}
            onToggleMonitoring={handleToggleMonitoring}
            onResolveEvent={handleResolveEvent}
          />
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <ExportManager
            onExport={handleExport}
            isExporting={isExporting}
            availableMetrics={availableMetrics}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}