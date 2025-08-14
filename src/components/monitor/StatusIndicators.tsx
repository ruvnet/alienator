// Status indicators and alerts component

import React, { useState, useMemo } from 'react';
import { AlertStatus, SensorStatus, ConnectionStatus } from '../../types/monitor';
import './StatusIndicators.css';

interface StatusIndicatorsProps {
  alerts: AlertStatus[];
  sensors: SensorStatus[];
  connectionStatus: ConnectionStatus;
  onAlertDismiss?: (alertId: string) => void;
  onSensorClick?: (sensorId: string) => void;
}

interface AlertItemProps {
  alert: AlertStatus;
  onDismiss?: (alertId: string) => void;
}

interface SensorItemProps {
  sensor: SensorStatus;
  onClick?: (sensorId: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onDismiss }) => {
  const getAlertIcon = (level: string): string => {
    switch (level) {
      case 'critical': return '🚨';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={`alert-item alert-item--${alert.level} ${alert.resolved ? 'alert-item--resolved' : ''}`}>
      <div className="alert-item__icon">
        {getAlertIcon(alert.level)}
      </div>
      <div className="alert-item__content">
        <div className="alert-item__message">{alert.message}</div>
        <div className="alert-item__meta">
          <span className="alert-item__source">{alert.source}</span>
          <span className="alert-item__time">{getTimeAgo(alert.timestamp)}</span>
        </div>
      </div>
      {onDismiss && !alert.resolved && (
        <button
          className="alert-item__dismiss"
          onClick={() => onDismiss(alert.id)}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

const SensorItem: React.FC<SensorItemProps> = ({ sensor, onClick }) => {
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'maintenance': return '🟡';
      case 'error': return '🔶';
      default: return '⚪';
    }
  };

  const getSignalBars = (strength: number): React.ReactNode => {
    const bars = Math.ceil(strength * 4);
    return (
      <div className="signal-bars">
        {[1, 2, 3, 4].map(bar => (
          <div
            key={bar}
            className={`signal-bar ${bar <= bars ? 'signal-bar--active' : ''}`}
          />
        ))}
      </div>
    );
  };

  const getLastPingText = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div
      className={`sensor-item sensor-item--${sensor.status}`}
      onClick={() => onClick?.(sensor.id)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="sensor-item__status">
        <span className="sensor-item__icon">{getStatusIcon(sensor.status)}</span>
        <div className="sensor-item__info">
          <div className="sensor-item__name">{sensor.name}</div>
          <div className="sensor-item__location">{sensor.location}</div>
        </div>
      </div>
      <div className="sensor-item__metrics">
        <div className="sensor-item__signal">
          {getSignalBars(sensor.signal_strength)}
          <span className="sensor-item__signal-text">
            {(sensor.signal_strength * 100).toFixed(0)}%
          </span>
        </div>
        <div className="sensor-item__ping">
          {getLastPingText(sensor.last_ping)}
        </div>
      </div>
    </div>
  );
};

const ConnectionIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  const getStatusText = (): string => {
    if (status.reconnecting) return 'Reconnecting...';
    if (status.connected) return 'Connected';
    if (status.error) return 'Connection Error';
    return 'Disconnected';
  };

  const getStatusClass = (): string => {
    if (status.reconnecting) return 'reconnecting';
    if (status.connected) return 'connected';
    if (status.error) return 'error';
    return 'disconnected';
  };

  return (
    <div className={`connection-indicator connection-indicator--${getStatusClass()}`}>
      <div className="connection-indicator__dot"></div>
      <span className="connection-indicator__text">{getStatusText()}</span>
      {status.last_connected && (
        <span className="connection-indicator__time">
          Last: {new Date(status.last_connected).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  alerts,
  sensors,
  connectionStatus,
  onAlertDismiss,
  onSensorClick
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'sensors'>('alerts');

  const alertStats = useMemo(() => {
    const unresolved = alerts.filter(alert => !alert.resolved);
    const critical = unresolved.filter(alert => alert.level === 'critical').length;
    const warnings = unresolved.filter(alert => alert.level === 'warning').length;
    const errors = unresolved.filter(alert => alert.level === 'error').length;
    
    return { total: unresolved.length, critical, warnings, errors };
  }, [alerts]);

  const sensorStats = useMemo(() => {
    const online = sensors.filter(sensor => sensor.status === 'online').length;
    const offline = sensors.filter(sensor => sensor.status === 'offline').length;
    const maintenance = sensors.filter(sensor => sensor.status === 'maintenance').length;
    const error = sensors.filter(sensor => sensor.status === 'error').length;
    
    return { total: sensors.length, online, offline, maintenance, error };
  }, [sensors]);

  return (
    <div className="status-indicators">
      <div className="status-indicators__header">
        <h2>System Status</h2>
        <ConnectionIndicator status={connectionStatus} />
      </div>

      <div className="status-tabs">
        <button
          className={`status-tab ${activeTab === 'alerts' ? 'status-tab--active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <span className="status-tab__label">Alerts</span>
          {alertStats.total > 0 && (
            <span className="status-tab__badge">{alertStats.total}</span>
          )}
        </button>
        <button
          className={`status-tab ${activeTab === 'sensors' ? 'status-tab--active' : ''}`}
          onClick={() => setActiveTab('sensors')}
        >
          <span className="status-tab__label">Sensors</span>
          <span className="status-tab__badge">{sensorStats.online}/{sensorStats.total}</span>
        </button>
      </div>

      <div className="status-content">
        {activeTab === 'alerts' && (
          <div className="alerts-panel">
            <div className="alerts-summary">
              <div className="summary-stat">
                <span className="summary-stat__value">{alertStats.critical}</span>
                <span className="summary-stat__label critical">Critical</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat__value">{alertStats.errors}</span>
                <span className="summary-stat__label error">Errors</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat__value">{alertStats.warnings}</span>
                <span className="summary-stat__label warning">Warnings</span>
              </div>
            </div>

            <div className="alerts-list">
              {alerts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">✅</div>
                  <p>No alerts at this time</p>
                </div>
              ) : (
                alerts
                  .filter(alert => !alert.resolved)
                  .sort((a, b) => {
                    const levelOrder = { critical: 4, error: 3, warning: 2, info: 1 };
                    return levelOrder[b.level] - levelOrder[a.level] || b.timestamp - a.timestamp;
                  })
                  .map(alert => (
                    <AlertItem
                      key={alert.id}
                      alert={alert}
                      onDismiss={onAlertDismiss}
                    />
                  ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'sensors' && (
          <div className="sensors-panel">
            <div className="sensors-summary">
              <div className="summary-stat">
                <span className="summary-stat__value">{sensorStats.online}</span>
                <span className="summary-stat__label online">Online</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat__value">{sensorStats.offline}</span>
                <span className="summary-stat__label offline">Offline</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat__value">{sensorStats.maintenance}</span>
                <span className="summary-stat__label maintenance">Maintenance</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat__value">{sensorStats.error}</span>
                <span className="summary-stat__label error">Error</span>
              </div>
            </div>

            <div className="sensors-list">
              {sensors
                .sort((a, b) => {
                  const statusOrder = { error: 4, offline: 3, maintenance: 2, online: 1 };
                  return statusOrder[b.status] - statusOrder[a.status] || a.name.localeCompare(b.name);
                })
                .map(sensor => (
                  <SensorItem
                    key={sensor.id}
                    sensor={sensor}
                    onClick={onSensorClick}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusIndicators;