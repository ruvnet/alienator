import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/types/analytics';
import { formatXAxis, formatTooltipValue, calculateMovingAverage } from '@/utils/chartUtils';

interface TimeSeriesChartProps {
  data: AnalyticsData[];
  timeRange: string;
  selectedMetrics: string[];
  showMovingAverage?: boolean;
  showAnomalies?: boolean;
}

const METRIC_COLORS = {
  entropy: '#3b82f6',
  compression: '#10b981',
  anomalyScore: '#ef4444',
  patternComplexity: '#f59e0b',
  modelConfidence: '#8b5cf6',
  detectionAccuracy: '#06b6d4',
  processingTime: '#ec4899',
  memoryUsage: '#84cc16',
  cpuUsage: '#f97316'
};

const METRIC_LABELS = {
  entropy: 'Entropy',
  compression: 'Compression Ratio',
  anomalyScore: 'Anomaly Score',
  patternComplexity: 'Pattern Complexity',
  modelConfidence: 'Model Confidence',
  detectionAccuracy: 'Detection Accuracy',
  processingTime: 'Processing Time (ms)',
  memoryUsage: 'Memory Usage (%)',
  cpuUsage: 'CPU Usage (%)'
};

export function TimeSeriesChart({ 
  data, 
  timeRange, 
  selectedMetrics,
  showMovingAverage = false,
  showAnomalies = false
}: TimeSeriesChartProps) {
  const chartData = useMemo(() => {
    if (!showMovingAverage) return data;
    
    // Add moving averages
    return data.map((point, index) => {
      const result = { ...point };
      
      selectedMetrics.forEach(metric => {
        if (metric in point) {
          const values = data.slice(Math.max(0, index - 4), index + 1)
            .map(p => p[metric as keyof AnalyticsData] as number);
          const average = values.reduce((sum, val) => sum + val, 0) / values.length;
          result[`${metric}_ma` as keyof AnalyticsData] = average as any;
        }
      });
      
      return result;
    });
  }, [data, selectedMetrics, showMovingAverage]);

  const chartConfig = useMemo(() => {
    const config: any = {};
    
    selectedMetrics.forEach(metric => {
      config[metric] = {
        label: METRIC_LABELS[metric as keyof typeof METRIC_LABELS],
        color: METRIC_COLORS[metric as keyof typeof METRIC_COLORS]
      };
      
      if (showMovingAverage) {
        config[`${metric}_ma`] = {
          label: `${METRIC_LABELS[metric as keyof typeof METRIC_LABELS]} (MA)`,
          color: METRIC_COLORS[metric as keyof typeof METRIC_COLORS]
        };
      }
    });
    
    return config;
  }, [selectedMetrics, showMovingAverage]);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Metric Trends Over Time</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {selectedMetrics.length} metrics selected
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <ChartTooltip content={
                <ChartTooltipContent 
                  labelFormatter={(value) => formatXAxis(value, timeRange)}
                  formatter={(value: number, name: string) => [
                    formatTooltipValue(value, name),
                    METRIC_LABELS[name.replace('_ma', '') as keyof typeof METRIC_LABELS] || name
                  ]}
                />
              } />
              <Legend />
              
              {selectedMetrics.map(metric => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={METRIC_COLORS[metric as keyof typeof METRIC_COLORS]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  connectNulls={false}
                />
              ))}
              
              {showMovingAverage && selectedMetrics.map(metric => (
                <Line
                  key={`${metric}_ma`}
                  type="monotone"
                  dataKey={`${metric}_ma`}
                  stroke={METRIC_COLORS[metric as keyof typeof METRIC_COLORS]}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 3 }}
                  opacity={0.7}
                />
              ))}
              
              {data.length > 20 && (
                <Brush 
                  dataKey="timestamp"
                  height={30}
                  stroke="hsl(var(--primary))"
                  tickFormatter={(value) => formatXAxis(value, timeRange)}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}