// Main Real-time Monitor component

import React, { useState, useCallback, useMemo } from 'react';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import MetricsPanel from './MetricsPanel';
import LiveChart from './LiveChart';
import StatusIndicators from './StatusIndicators';
import { XenotypeDetection } from '../../types/monitor';
import './RealTimeMonitor.css';

interface RealTimeMonitorProps {
  className?: string;
  updateInterval?: number;
  maxDataPoints?: number;
}

interface DetectionListProps {
  detections: XenotypeDetection[];
  onDetectionClick?: (detection: XenotypeDetection) => void;
}

const DetectionItem: React.FC<{ detection: XenotypeDetection; onClick?: () => void }> = ({ 
  detection, 
  onClick 
}) => {
  const getThreatColor = (level: string): string => {
    switch (level) {
      case 'critical': return '#ff5252';
      case 'high': return '#ff9800';
      case 'medium': return '#ffc107';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'alpha': return '👽';
      case 'beta': return '🛸';
      case 'gamma': return '⚡';
      case 'unknown': return '❓';
      default: return '📡';
    }
  };

  const formatCoordinates = (coords: { x: number; y: number; z?: number }): string => {
    const { x, y, z } = coords;
    if (z !== undefined) {
      return `${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`;
    }
    return `${x.toFixed(1)}, ${y.toFixed(1)}`;
  };

  const getTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div 
      className={`detection-item detection-item--${detection.threat_level}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="detection-item__header">
        <div className="detection-item__type">
          <span className="detection-item__icon">{getTypeIcon(detection.type)}</span>
          <span className="detection-item__type-text">{detection.type.toUpperCase()}</span>
        </div>
        <div 
          className="detection-item__threat"
          style={{ color: getThreatColor(detection.threat_level) }}
        >
          {detection.threat_level.toUpperCase()}
        </div>
      </div>
      
      <div className="detection-item__content">
        <div className="detection-item__signature">
          <span className="detection-item__label">Signature:</span>
          <span className="detection-item__value">{detection.signature}</span>
        </div>
        
        <div className="detection-item__coordinates">
          <span className="detection-item__label">Location:</span>
          <span className="detection-item__value">{formatCoordinates(detection.coordinates)}</span>
        </div>
        
        <div className="detection-item__confidence">
          <span className="detection-item__label">Confidence:</span>
          <div className="confidence-bar">
            <div 
              className="confidence-bar__fill" 
              style={{ 
                width: `${detection.confidence * 100}%`,
                backgroundColor: getThreatColor(detection.threat_level)
              }}
            ></div>
            <span className="confidence-bar__text">
              {(detection.confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="detection-item__meta">
          <span className="detection-item__source">Source: {detection.source}</span>
          <span className="detection-item__time">{getTimeAgo(detection.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

const DetectionList: React.FC<DetectionListProps> = ({ detections, onDetectionClick }) => {
  const recentDetections = useMemo(() => {
    return detections
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10); // Show last 10 detections
  }, [detections]);

  if (recentDetections.length === 0) {
    return (
      <div className="detection-list detection-list--empty">
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p>No recent detections</p>
          <span className="empty-state__subtitle">System is monitoring...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="detection-list">
      <div className="detection-list__header">
        <h3>Recent Detections</h3>
        <span className="detection-list__count">{recentDetections.length} shown</span>
      </div>
      <div className="detection-list__items">
        {recentDetections.map(detection => (
          <DetectionItem
            key={detection.id}
            detection={detection}
            onClick={() => onDetectionClick?.(detection)}
          />
        ))}
      </div>
    </div>
  );
};

const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({
  className = '',
  updateInterval = 1000,
  maxDataPoints = 50
}) => {
  const [allDetections, setAllDetections] = useState<XenotypeDetection[]>([]);
  const [selectedDetection, setSelectedDetection] = useState<XenotypeDetection | null>(null);

  const {
    data,
    connectionStatus,
    isLoading,
    error,
    connect,
    disconnect,
    clearError,
    chartData
  } = useRealTimeData({
    autoConnect: true,
    maxDataPoints,
    config: {
      updateInterval,
      autoReconnect: true,
      reconnectDelay: 2000
    }
  });

  // Accumulate detections over time
  React.useEffect(() => {
    if (data?.detections) {
      setAllDetections(prev => {
        const newDetections = [...prev, ...data.detections];
        // Keep only last 100 detections to prevent memory issues
        return newDetections.slice(-100);
      });
    }
  }, [data?.detections]);

  const handleAlertDismiss = useCallback((alertId: string) => {
    // In a real app, this would update the alert status on the server
    console.log('Dismissing alert:', alertId);
  }, []);

  const handleSensorClick = useCallback((sensorId: string) => {
    // In a real app, this would show sensor details
    console.log('Sensor clicked:', sensorId);
  }, []);

  const handleDetectionClick = useCallback((detection: XenotypeDetection) => {
    setSelectedDetection(detection);
  }, []);

  const handleConnectionToggle = useCallback(() => {
    if (connectionStatus.connected) {
      disconnect();
    } else {
      connect();
    }
  }, [connectionStatus.connected, connect, disconnect]);

  if (error) {
    return (
      <div className={`real-time-monitor real-time-monitor--error ${className}`}>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={clearError} className="btn btn--secondary">
              Clear Error
            </button>
            <button onClick={connect} className="btn btn--primary">
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`real-time-monitor ${className}`}>
      <div className="real-time-monitor__header">
        <div className="monitor-title">
          <h1>Xenotype Detection Monitor</h1>
          <p>Real-time alien activity surveillance system</p>
        </div>
        
        <div className="monitor-controls">
          <button
            onClick={handleConnectionToggle}
            className={`btn btn--connection ${connectionStatus.connected ? 'btn--connected' : 'btn--disconnected'}`}
            disabled={isLoading || connectionStatus.reconnecting}
          >
            {connectionStatus.reconnecting 
              ? 'Reconnecting...' 
              : connectionStatus.connected 
                ? 'Disconnect' 
                : 'Connect'
            }
          </button>
        </div>
      </div>

      {isLoading && !data && (
        <div className="real-time-monitor__loading">
          <div className="loading-spinner"></div>
          <p>Establishing connection to monitoring systems...</p>
        </div>
      )}

      {data && (
        <div className="real-time-monitor__content">
          <div className="monitor-grid">
            <div className="monitor-section monitor-section--metrics">
              <MetricsPanel
                metrics={data.metrics}
                isLoading={isLoading}
                error={error}
              />
            </div>

            <div className="monitor-section monitor-section--status">
              <StatusIndicators
                alerts={data.alerts}
                sensors={data.sensor_status}
                connectionStatus={connectionStatus}
                onAlertDismiss={handleAlertDismiss}
                onSensorClick={handleSensorClick}
              />
            </div>

            <div className="monitor-section monitor-section--charts">
              <div className="charts-grid">
                <LiveChart
                  data={chartData.cpu}
                  title="CPU Usage"
                  color="#ff6b6b"
                  unit="%"
                  threshold={80}
                  maxValue={100}
                />
                
                <LiveChart
                  data={chartData.memory}
                  title="Memory Usage"
                  color="#4ecdc4"
                  unit="%"
                  threshold={85}
                  maxValue={100}
                />
                
                <LiveChart
                  data={chartData.detections}
                  title="Detection Rate"
                  color="#45b7d1"
                  unit=" detections"
                />
                
                <LiveChart
                  data={chartData.latency}
                  title="Network Latency"
                  color="#f9ca24"
                  unit="ms"
                  threshold={100}
                />
              </div>
            </div>

            <div className="monitor-section monitor-section--detections">
              <DetectionList
                detections={allDetections}
                onDetectionClick={handleDetectionClick}
              />
            </div>
          </div>
        </div>
      )}

      {selectedDetection && (
        <div className="detection-modal-overlay" onClick={() => setSelectedDetection(null)}>
          <div className="detection-modal" onClick={e => e.stopPropagation()}>
            <div className="detection-modal__header">
              <h3>Detection Details</h3>
              <button
                className="detection-modal__close"
                onClick={() => setSelectedDetection(null)}
              >
                ×
              </button>
            </div>
            <div className="detection-modal__content">
              <DetectionItem detection={selectedDetection} />
              <div className="detection-modal__extra">
                <p><strong>Detected at:</strong> {new Date(selectedDetection.timestamp).toLocaleString()}</p>
                <p><strong>Full Signature:</strong> {selectedDetection.signature}</p>
                <p><strong>Source Sensor:</strong> {selectedDetection.source}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeMonitor;