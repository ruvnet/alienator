import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeatmapCell, ModelPerformance } from '@/types/analytics';

interface ModelPerformanceHeatmapProps {
  data: HeatmapCell[];
  modelPerformance: ModelPerformance[];
}

export function ModelPerformanceHeatmap({ data, modelPerformance }: ModelPerformanceHeatmapProps) {
  const { xLabels, yLabels, heatmapMatrix } = useMemo(() => {
    if (!data.length) return { xLabels: [], yLabels: [], heatmapMatrix: [] };
    
    const xLabels = [...new Set(data.map(d => d.x))].sort();
    const yLabels = [...new Set(data.map(d => d.y))].sort();
    
    // Create matrix
    const matrix = yLabels.map(y => 
      xLabels.map(x => {
        const cell = data.find(d => d.x === x && d.y === y);
        return cell || { x, y, value: 0, intensity: 0 };
      })
    );
    
    return { xLabels, yLabels, heatmapMatrix: matrix };
  }, [data]);

  const cellSize = 80;
  const padding = 120;
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  const getHeatmapColor = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    
    // Use a color scale from blue (low) to red (high)
    if (normalized < 0.33) {
      const intensity = normalized / 0.33;
      return `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`; // Blue
    } else if (normalized < 0.66) {
      const intensity = (normalized - 0.33) / 0.33;
      return `rgba(245, 158, 11, ${0.3 + intensity * 0.7})`; // Yellow
    } else {
      const intensity = (normalized - 0.66) / 0.34;
      return `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`; // Red
    }
  };

  const getTextColor = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    return normalized > 0.6 ? 'white' : 'black';
  };

  const getPerformanceLevel = (value: number) => {
    if (value >= 0.7) return 'High';
    if (value >= 0.4) return 'Medium';
    return 'Low';
  };

  const getPerformanceBadgeColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (value >= 0.4) return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    return 'bg-red-500/20 text-red-700 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Heatmap */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Model Performance Heatmap</CardTitle>
          <div className="text-sm text-muted-foreground">
            Performance metrics across different time periods
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* SVG Heatmap */}
            <div className="overflow-x-auto">
              <svg 
                width={xLabels.length * cellSize + padding} 
                height={yLabels.length * cellSize + padding + 60}
                className="border border-border/30 rounded-lg"
              >
                {/* Background */}
                <rect 
                  width="100%" 
                  height="100%" 
                  fill="hsl(var(--muted) / 0.1)"
                />
                
                {/* Column labels */}
                {xLabels.map((label, colIndex) => (
                  <text
                    key={`col-${colIndex}`}
                    x={padding + colIndex * cellSize + cellSize / 2}
                    y={padding - 10}
                    textAnchor="middle"
                    fontSize="14"
                    fill="hsl(var(--foreground))"
                    fontWeight="500"
                  >
                    {label}
                  </text>
                ))}
                
                {/* Row labels */}
                {yLabels.map((label, rowIndex) => (
                  <text
                    key={`row-${rowIndex}`}
                    x={padding - 10}
                    y={padding + rowIndex * cellSize + cellSize / 2 + 5}
                    textAnchor="end"
                    fontSize="14"
                    fill="hsl(var(--foreground))"
                    fontWeight="500"
                  >
                    {label}
                  </text>
                ))}
                
                {/* Heatmap cells */}
                {heatmapMatrix.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <g key={`cell-${rowIndex}-${colIndex}`}>
                      <rect
                        x={padding + colIndex * cellSize + 2}
                        y={padding + rowIndex * cellSize + 2}
                        width={cellSize - 4}
                        height={cellSize - 4}
                        fill={getHeatmapColor(cell.value)}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                        rx="4"
                      />
                      <text
                        x={padding + colIndex * cellSize + cellSize / 2}
                        y={padding + rowIndex * cellSize + cellSize / 2 - 8}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="600"
                        fill={getTextColor(cell.value)}
                      >
                        {(cell.value * 100).toFixed(0)}%
                      </text>
                      <text
                        x={padding + colIndex * cellSize + cellSize / 2}
                        y={padding + rowIndex * cellSize + cellSize / 2 + 8}
                        textAnchor="middle"
                        fontSize="10"
                        fill={getTextColor(cell.value)}
                        opacity="0.8"
                      >
                        {getPerformanceLevel(cell.value)}
                      </text>
                    </g>
                  ))
                )}
                
                {/* Legend */}
                <g transform={`translate(${padding}, ${padding + yLabels.length * cellSize + 20})`}>
                  <text x="0" y="15" fontSize="12" fontWeight="500" fill="hsl(var(--foreground))">
                    Performance Level:
                  </text>
                  <rect x="120" y="2" width="20" height="12" fill="rgba(59, 130, 246, 0.8)" rx="2" />
                  <text x="145" y="12" fontSize="11" fill="hsl(var(--foreground))">Low (0-40%)</text>
                  <rect x="220" y="2" width="20" height="12" fill="rgba(245, 158, 11, 0.8)" rx="2" />
                  <text x="245" y="12" fontSize="11" fill="hsl(var(--foreground))">Medium (40-70%)</text>
                  <rect x="340" y="2" width="20" height="12" fill="rgba(239, 68, 68, 0.8)" rx="2" />
                  <text x="365" y="12" fontSize="11" fill="hsl(var(--foreground))">High (70%+)</text>
                </g>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Performance Summary */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Model Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelPerformance.map(model => (
              <div 
                key={model.modelId}
                className="p-4 border border-border/30 rounded-lg bg-muted/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{model.modelName}</h4>
                  <Badge 
                    variant="outline" 
                    className={getPerformanceBadgeColor(model.accuracy)}
                  >
                    {getPerformanceLevel(model.accuracy)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="font-mono">{(model.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precision:</span>
                    <span className="font-mono">{(model.precision * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recall:</span>
                    <span className="font-mono">{(model.recall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">F1 Score:</span>
                    <span className="font-mono">{(model.f1Score * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border/20 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Avg. Processing:</span>
                    <span>{model.processingTime.toFixed(1)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Usage:</span>
                    <span>{model.memoryUsage.toFixed(1)}GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{new Date(model.lastUpdated).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}