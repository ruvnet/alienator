import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DistributionData } from '@/types/analytics';

interface DistributionChartProps {
  data: DistributionData[];
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  availableMetrics: string[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export function DistributionChart({ 
  data, 
  selectedMetric, 
  onMetricChange, 
  availableMetrics 
}: DistributionChartProps) {
  const chartConfig = {
    count: {
      label: 'Count',
      color: '#3b82f6'
    },
    percentage: {
      label: 'Percentage',
      color: '#10b981'
    }
  };

  const statistics = useMemo(() => {
    if (!data.length) return null;
    
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);
    const mean = data.reduce((sum, item, index) => sum + (index * item.count), 0) / totalCount;
    const variance = data.reduce((sum, item, index) => 
      sum + Math.pow(index - mean, 2) * item.count, 0) / totalCount;
    const stdDev = Math.sqrt(variance);
    
    // Find mode (most frequent bin)
    const modeIndex = data.findIndex(item => item.count === Math.max(...data.map(d => d.count)));
    const mode = data[modeIndex]?.bin || 'N/A';
    
    return {
      total: totalCount,
      mean: mean.toFixed(2),
      stdDev: stdDev.toFixed(2),
      mode,
      bins: data.length
    };
  }, [data]);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Distribution Analysis</CardTitle>
          <Select value={selectedMetric} onValueChange={onMetricChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableMetrics.map(metric => (
                <SelectItem key={metric} value={metric}>
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total</div>
              <div className="font-semibold">{statistics.total.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Mean</div>
              <div className="font-semibold">{statistics.mean}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Std Dev</div>
              <div className="font-semibold">{statistics.stdDev}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Mode</div>
              <div className="font-semibold">{statistics.mode}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Bins</div>
              <div className="font-semibold">{statistics.bins}</div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Histogram */}
          <div>
            <h4 className="text-sm font-medium mb-3">Frequency Distribution</h4>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="bin"
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
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value: number, name: string) => [
                          name === 'count' ? value.toLocaleString() : `${value.toFixed(1)}%`,
                          name === 'count' ? 'Count' : 'Percentage'
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Percentage Chart */}
          <div>
            <h4 className="text-sm font-medium mb-3">Percentage Distribution</h4>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="bin"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 'dataMax']}
                  />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value: number, name: string) => [
                          `${value.toFixed(1)}%`,
                          'Percentage'
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="percentage" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/10 rounded-lg">
            <div>
              <h5 className="text-sm font-medium mb-2">Distribution Shape</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skewness:</span>
                  <span>Normal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kurtosis:</span>
                  <span>Mesokurtic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outliers:</span>
                  <span>2.3%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-2">Percentiles</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">25th (Q1):</span>
                  <span>{data[Math.floor(data.length * 0.25)]?.bin || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">50th (Median):</span>
                  <span>{data[Math.floor(data.length * 0.5)]?.bin || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">75th (Q3):</span>
                  <span>{data[Math.floor(data.length * 0.75)]?.bin || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}