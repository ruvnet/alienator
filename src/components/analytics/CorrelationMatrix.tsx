import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CorrelationMatrix as CorrelationMatrixType } from '@/types/analytics';

interface CorrelationMatrixProps {
  data: CorrelationMatrixType;
}

export function CorrelationMatrix({ data }: CorrelationMatrixProps) {
  const cellSize = 60;
  const padding = 120;
  
  const getCorrelationColor = (value: number) => {
    const intensity = Math.abs(value);
    const alpha = Math.max(0.2, intensity);
    
    if (value > 0) {
      return `rgba(34, 197, 94, ${alpha})`; // Green for positive correlation
    } else {
      return `rgba(239, 68, 68, ${alpha})`; // Red for negative correlation
    }
  };

  const getCorrelationStrength = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    if (abs >= 0.2) return 'Weak';
    return 'Very Weak';
  };

  const getTextColor = (value: number) => {
    const abs = Math.abs(value);
    return abs > 0.5 ? 'white' : 'black';
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle>Correlation Matrix</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Showing correlations between metrics</span>
          <Badge variant="outline" className="text-xs">
            Pearson r
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* SVG Matrix */}
          <div className="overflow-x-auto">
            <svg 
              width={data.metrics.length * cellSize + padding} 
              height={data.metrics.length * cellSize + padding}
              className="border border-border/30 rounded-lg"
            >
              {/* Background */}
              <rect 
                width="100%" 
                height="100%" 
                fill="hsl(var(--muted) / 0.1)"
              />
              
              {/* Column labels */}
              {data.metrics.map((metric, colIndex) => (
                <text
                  key={`col-${colIndex}`}
                  x={padding + colIndex * cellSize + cellSize / 2}
                  y={padding - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="hsl(var(--foreground))"
                  transform={`rotate(-45, ${padding + colIndex * cellSize + cellSize / 2}, ${padding - 10})`}
                >
                  {metric}
                </text>
              ))}
              
              {/* Row labels */}
              {data.metrics.map((metric, rowIndex) => (
                <text
                  key={`row-${rowIndex}`}
                  x={padding - 10}
                  y={padding + rowIndex * cellSize + cellSize / 2 + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="hsl(var(--foreground))"
                >
                  {metric}
                </text>
              ))}
              
              {/* Correlation cells */}
              {data.correlations.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <g key={`cell-${rowIndex}-${colIndex}`}>
                    <rect
                      x={padding + colIndex * cellSize}
                      y={padding + rowIndex * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill={getCorrelationColor(value)}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                    />
                    <text
                      x={padding + colIndex * cellSize + cellSize / 2}
                      y={padding + rowIndex * cellSize + cellSize / 2 + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="500"
                      fill={getTextColor(value)}
                    >
                      {value.toFixed(2)}
                    </text>
                  </g>
                ))
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/70"></div>
                <span>Positive Correlation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500/70"></div>
                <span>Negative Correlation</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Correlation Strength:</div>
              <div className="flex gap-3">
                <span>|r| ≥ 0.7: Strong</span>
                <span>|r| ≥ 0.4: Moderate</span>
                <span>|r| &lt; 0.4: Weak</span>
              </div>
            </div>
          </div>

          {/* Notable Correlations */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Notable Correlations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {data.correlations.flatMap((row, rowIndex) =>
                row.map((value, colIndex) => ({
                  metric1: data.metrics[rowIndex],
                  metric2: data.metrics[colIndex],
                  value,
                  rowIndex,
                  colIndex
                }))
              )
              .filter(({ value, rowIndex, colIndex }) => 
                Math.abs(value) >= 0.6 && rowIndex !== colIndex
              )
              .slice(0, 6)
              .map(({ metric1, metric2, value }) => (
                <div 
                  key={`${metric1}-${metric2}`}
                  className="p-2 rounded border border-border/30 bg-muted/10"
                >
                  <div className="text-xs font-medium truncate">
                    {metric1} ↔ {metric2}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-mono">{value.toFixed(2)}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        Math.abs(value) >= 0.7 ? 'border-green-500/30 text-green-600' :
                        Math.abs(value) >= 0.4 ? 'border-yellow-500/30 text-yellow-600' :
                        'border-gray-500/30 text-gray-600'
                      }`}
                    >
                      {getCorrelationStrength(value)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}