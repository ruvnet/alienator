// TypeScript types for real-time monitoring system

export interface XenotypeDetection {
  id: string;
  timestamp: number;
  confidence: number;
  type: 'alpha' | 'beta' | 'gamma' | 'unknown';
  coordinates: {
    x: number;
    y: number;
    z?: number;
  };
  signature: string;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  network_latency: number;
  detection_rate: number;
  false_positive_rate: number;
  active_sensors: number;
  total_sensors: number;
  uptime: number;
}

export interface AlertStatus {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
  source: string;
}

export interface StreamData {
  detections: XenotypeDetection[];
  metrics: SystemMetrics;
  alerts: AlertStatus[];
  sensor_status: SensorStatus[];
}

export interface SensorStatus {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  last_ping: number;
  signal_strength: number;
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface ConnectionStatus {
  connected: boolean;
  reconnecting: boolean;
  error: string | null;
  last_connected: number | null;
}

export interface MonitorConfig {
  updateInterval: number;
  maxDataPoints: number;
  alertThresholds: {
    cpu: number;
    memory: number;
    latency: number;
    detection_rate: number;
  };
  autoReconnect: boolean;
  reconnectDelay: number;
}