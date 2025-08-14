// Real-time metrics panel component

import React from 'react';
import { SystemMetrics } from '../../types/monitor';
import './MetricsPanel.css';

interface MetricsPanelProps {
  metrics: SystemMetrics | null;
  isLoading: boolean;
  error: string | null;
}

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  threshold?: number;
  format?: 'percentage' | 'number' | 'time';
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  threshold, 
  format = 'number',
  icon 
}) => {
  const formatValue = (val: number): string => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'time':
        return formatUptime(val);
      default:
        return val.toFixed(1);
    }
  };

  const getStatusColor = (): string => {
    if (!threshold) return 'normal';
    if (value >= threshold) return 'critical';
    if (value >= threshold * 0.8) return 'warning';
    return 'normal';
  };

  const formatUptime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className={`metric-card metric-card--${getStatusColor()}`}>
      <div className="metric-card__header">
        {icon && <div className="metric-card__icon">{icon}</div>}
        <h3 className="metric-card__title">{title}</h3>
      </div>
      <div className="metric-card__content">
        <div className="metric-card__value">
          {formatValue(value)}
          <span className="metric-card__unit">{unit}</span>
        </div>
        {threshold && (
          <div className="metric-card__threshold">
            Threshold: {formatValue(threshold)}{unit}
          </div>
        )}
      </div>
    </div>
  );
};

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, isLoading, error }) => {
  if (error) {
    return (
      <div className="metrics-panel metrics-panel--error">
        <div className="error-message">
          <h3>Metrics Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !metrics) {
    return (
      <div className="metrics-panel metrics-panel--loading">
        <div className="loading-skeleton">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-header"></div>
              <div className="skeleton-value"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cpuIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 7h1V5h12v2h1V3H5v4zm14 8v2H7v-2H5v4h14v-4h-2z"/>
      <path d="M9 9h6v6H9z"/>
    </svg>
  );

  const memoryIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 17h20v2H2v-2zM1.15 12.95L4 15l1.4-1.4-2.85-2.85L1.15 12.95zM22.85 12.95l-1.4-1.4L18.6 14.6 20 16l2.85-2.05zM12 2L7.5 6.5 4 10h16l-3.5-3.5L12 2z"/>
    </svg>
  );

  const networkIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 9l2 2c2.88-2.88 6.78-2.88 9.66 0L15 9c-4.79-4.79-12.58-4.79-17.37 0l-1.41 1.41L1 9zm3.53 3.53c1.95-1.95 5.12-1.95 7.07 0L13 11.07c-2.73-2.73-7.16-2.73-9.9 0l1.43 1.46z"/>
    </svg>
  );

  const sensorIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  );

  return (
    <div className="metrics-panel">
      <div className="metrics-panel__header">
        <h2>System Metrics</h2>
        <div className="metrics-panel__timestamp">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="metrics-grid">
        <MetricCard
          title="CPU Usage"
          value={metrics.cpu_usage}
          unit="%"
          threshold={80}
          format="percentage"
          icon={cpuIcon}
        />
        
        <MetricCard
          title="Memory Usage"
          value={metrics.memory_usage}
          unit="%"
          threshold={85}
          format="percentage"
          icon={memoryIcon}
        />
        
        <MetricCard
          title="Network Latency"
          value={metrics.network_latency}
          unit="ms"
          threshold={100}
          icon={networkIcon}
        />
        
        <MetricCard
          title="Detection Rate"
          value={metrics.detection_rate}
          unit="%"
          format="percentage"
          icon={sensorIcon}
        />
        
        <MetricCard
          title="False Positive Rate"
          value={metrics.false_positive_rate}
          unit="%"
          format="percentage"
        />
        
        <MetricCard
          title="Active Sensors"
          value={metrics.active_sensors}
          unit={`/${metrics.total_sensors}`}
          threshold={metrics.total_sensors * 0.8}
        />
        
        <MetricCard
          title="System Uptime"
          value={metrics.uptime}
          unit=""
          format="time"
        />
        
        <MetricCard
          title="Total Sensors"
          value={metrics.total_sensors}
          unit=""
        />
      </div>
    </div>
  );
};

export default MetricsPanel;