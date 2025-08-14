// Live chart component for real-time data visualization

import React, { useRef, useEffect, useState } from 'react';
import { ChartDataPoint } from '../../types/monitor';
import './LiveChart.css';

interface LiveChartProps {
  data: ChartDataPoint[];
  title: string;
  color?: string;
  unit?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  threshold?: number;
  maxValue?: number;
}

const LiveChart: React.FC<LiveChartProps> = ({
  data,
  title,
  color = '#00ff88',
  unit = '',
  height = 200,
  showGrid = true,
  showLegend = true,
  threshold,
  maxValue
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: height });
  const animationRef = useRef<number>();

  // Responsive canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width } = entry.contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(canvas.parentElement!);
    return () => resizeObserver.disconnect();
  }, [height]);

  // Chart rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = dimensions.width * window.devicePixelRatio;
    canvas.height = dimensions.height * window.devicePixelRatio;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const padding = 40;
    const chartWidth = dimensions.width - padding * 2;
    const chartHeight = dimensions.height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Calculate data bounds
    const timeRange = data.length > 1 ? data[data.length - 1].timestamp - data[0].timestamp : 1;
    const values = data.map(d => d.value);
    const minValue = Math.min(...values, 0);
    const maxVal = maxValue || Math.max(...values, threshold || 100);
    const valueRange = maxVal - minValue;

    // Helper functions
    const getX = (timestamp: number, index: number) => {
      if (timeRange === 0) return padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
      return padding + ((timestamp - data[0].timestamp) / timeRange) * chartWidth;
    };

    const getY = (value: number) => {
      return padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
    };

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();

        // Value labels
        const value = maxVal - (i / 5) * valueRange;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '12px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${value.toFixed(1)}${unit}`, padding - 8, y + 4);
      }

      // Vertical grid lines
      const timeSteps = 5;
      for (let i = 0; i <= timeSteps; i++) {
        const x = padding + (i / timeSteps) * chartWidth;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
      }
    }

    // Draw threshold line
    if (threshold && threshold >= minValue && threshold <= maxVal) {
      const thresholdY = getY(threshold);
      ctx.strokeStyle = '#ff5252';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, thresholdY);
      ctx.lineTo(padding + chartWidth, thresholdY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Threshold label
      ctx.fillStyle = '#ff5252';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Threshold: ${threshold}${unit}`, padding + 8, thresholdY - 8);
    }

    // Draw area under curve
    if (data.length > 1) {
      const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '10');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(getX(data[0].timestamp, 0), padding + chartHeight);
      
      data.forEach((point, index) => {
        ctx.lineTo(getX(point.timestamp, index), getY(point.value));
      });
      
      ctx.lineTo(getX(data[data.length - 1].timestamp, data.length - 1), padding + chartHeight);
      ctx.closePath();
      ctx.fill();
    }

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = getX(point.timestamp, index);
      const y = getY(point.value);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw data points
    data.forEach((point, index) => {
      const x = getX(point.timestamp, index);
      const y = getY(point.value);
      
      // Highlight last point
      if (index === data.length - 1) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Pulsing effect for latest point
        ctx.fillStyle = color + '60';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

  }, [data, dimensions, color, unit, threshold, maxValue, showGrid]);

  // Animation loop for smooth updates
  useEffect(() => {
    const animate = () => {
      // Redraw chart for smooth animations
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getCurrentValue = () => {
    return data.length > 0 ? data[data.length - 1].value : 0;
  };

  const getValueChange = () => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    return current - previous;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}${unit}`;
  };

  return (
    <div className="live-chart">
      <div className="live-chart__header">
        <h3 className="live-chart__title">{title}</h3>
        {showLegend && (
          <div className="live-chart__legend">
            <div className="live-chart__current-value">
              {getCurrentValue().toFixed(2)}{unit}
            </div>
            <div className={`live-chart__change ${getValueChange() >= 0 ? 'positive' : 'negative'}`}>
              {formatChange(getValueChange())}
            </div>
          </div>
        )}
      </div>
      
      <div className="live-chart__container">
        <canvas
          ref={canvasRef}
          className="live-chart__canvas"
        />
        
        {data.length === 0 && (
          <div className="live-chart__no-data">
            <div className="no-data-message">
              <div className="no-data-icon">📊</div>
              <p>Waiting for data...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="live-chart__footer">
        <div className="live-chart__info">
          Data points: {data.length}
        </div>
        <div className="live-chart__time">
          {data.length > 0 && (
            <>Last update: {new Date(data[data.length - 1].timestamp).toLocaleTimeString()}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveChart;