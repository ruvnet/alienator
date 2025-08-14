export interface AnalyticsData {
  timestamp: string;
  entropy: number;
  compression: number;
  anomalyScore: number;
  patternComplexity: number;
  modelConfidence: number;
  detectionAccuracy: number;
  processingTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface MetricTrend {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
}

export interface PatternData {
  id: string;
  type: 'linguistic' | 'cryptographic' | 'compression' | 'entropy';
  pattern: string;
  frequency: number;
  confidence: number;
  lastSeen: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DetectionStats {
  totalAnalyses: number;
  anomaliesDetected: number;
  falsePositives: number;
  truePositives: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface CorrelationMatrix {
  metrics: string[];
  correlations: number[][];
}

export interface ModelPerformance {
  modelId: string;
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  processingTime: number;
  memoryUsage: number;
  lastUpdated: string;
}

export interface TimeRangeFilter {
  value: string;
  label: string;
  hours: number;
}

export interface AnalyticsFilter {
  timeRange: TimeRangeFilter;
  metrics: string[];
  models: string[];
  severityLevels: string[];
  patternTypes: string[];
}

export interface ExportConfig {
  format: 'csv' | 'json' | 'pdf';
  dateRange: {
    start: string;
    end: string;
  };
  metrics: string[];
  includeCharts: boolean;
}

export interface DistributionData {
  bin: string;
  count: number;
  percentage: number;
}

export interface HeatmapCell {
  x: string;
  y: string;
  value: number;
  intensity: number;
}

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metrics: Record<string, number>;
  resolved: boolean;
}