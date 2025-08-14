// Mock WebSocket service for real-time data streaming

import { StreamData, XenotypeDetection, SystemMetrics, AlertStatus, SensorStatus } from '../types/monitor';

export class MockWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private dataTimer: NodeJS.Timeout | null = null;
  private isConnected = false;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private url: string = 'ws://localhost:8080/monitor') {
    this.initializeListeners();
  }

  private initializeListeners(): void {
    ['data', 'connected', 'disconnected', 'error', 'reconnecting'].forEach(event => {
      this.listeners.set(event, []);
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Mock connection since we're simulating WebSocket
        this.simulateConnection();
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
        this.startDataStream();
        resolve();
      } catch (error) {
        this.emit('error', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.dataTimer) {
      clearInterval(this.dataTimer);
      this.dataTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.emit('disconnected');
  }

  on(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.push(callback);
    this.listeners.set(event, eventListeners);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event) || [];
    const index = eventListeners.indexOf(callback);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
  }

  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(callback => callback(data));
  }

  private simulateConnection(): void {
    // Simulate connection delay
    setTimeout(() => {
      console.log('Mock WebSocket connected');
    }, 100);
  }

  private startDataStream(): void {
    this.dataTimer = setInterval(() => {
      if (this.isConnected) {
        const streamData = this.generateMockData();
        this.emit('data', streamData);
      }
    }, 1000); // Send data every second
  }

  private generateMockData(): StreamData {
    const now = Date.now();
    
    return {
      detections: this.generateDetections(now),
      metrics: this.generateMetrics(),
      alerts: this.generateAlerts(now),
      sensor_status: this.generateSensorStatus(now)
    };
  }

  private generateDetections(timestamp: number): XenotypeDetection[] {
    const detections: XenotypeDetection[] = [];
    const count = Math.floor(Math.random() * 3); // 0-2 detections per update
    
    for (let i = 0; i < count; i++) {
      const types = ['alpha', 'beta', 'gamma', 'unknown'] as const;
      const threatLevels = ['low', 'medium', 'high', 'critical'] as const;
      
      detections.push({
        id: `det_${timestamp}_${i}`,
        timestamp: timestamp - Math.random() * 5000,
        confidence: 0.3 + Math.random() * 0.7,
        type: types[Math.floor(Math.random() * types.length)],
        coordinates: {
          x: Math.random() * 1000,
          y: Math.random() * 1000,
          z: Math.random() * 100
        },
        signature: `SIG_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        threat_level: threatLevels[Math.floor(Math.random() * threatLevels.length)],
        source: `sensor_${Math.floor(Math.random() * 10) + 1}`
      });
    }
    
    return detections;
  }

  private generateMetrics(): SystemMetrics {
    return {
      cpu_usage: 20 + Math.random() * 60,
      memory_usage: 30 + Math.random() * 50,
      network_latency: 10 + Math.random() * 50,
      detection_rate: 85 + Math.random() * 10,
      false_positive_rate: Math.random() * 5,
      active_sensors: 8 + Math.floor(Math.random() * 3),
      total_sensors: 10,
      uptime: Date.now() - (24 * 60 * 60 * 1000) // 24 hours ago
    };
  }

  private generateAlerts(timestamp: number): AlertStatus[] {
    const alerts: AlertStatus[] = [];
    
    if (Math.random() < 0.3) { // 30% chance of new alert
      const levels = ['info', 'warning', 'error', 'critical'] as const;
      const messages = [
        'High CPU usage detected',
        'Sensor communication timeout',
        'Unusual xenotype activity pattern',
        'System performance degraded',
        'New threat signature identified'
      ];
      
      alerts.push({
        id: `alert_${timestamp}`,
        level: levels[Math.floor(Math.random() * levels.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp,
        resolved: false,
        source: 'system'
      });
    }
    
    return alerts;
  }

  private generateSensorStatus(timestamp: number): SensorStatus[] {
    const sensors: SensorStatus[] = [];
    const statuses = ['online', 'offline', 'maintenance', 'error'] as const;
    const locations = ['Sector A', 'Sector B', 'Sector C', 'Perimeter', 'Central Hub'];
    
    for (let i = 1; i <= 10; i++) {
      sensors.push({
        id: `sensor_${i}`,
        name: `Sensor ${i}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        status: Math.random() < 0.8 ? 'online' : statuses[Math.floor(Math.random() * statuses.length)],
        last_ping: timestamp - Math.random() * 30000,
        signal_strength: 0.5 + Math.random() * 0.5
      });
    }
    
    return sensors;
  }

  // Simulate connection issues for testing
  simulateDisconnection(): void {
    if (this.isConnected) {
      this.isConnected = false;
      this.emit('disconnected');
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.emit('reconnecting', this.reconnectAttempts);
      
      this.reconnectTimer = setTimeout(() => {
        this.connect().catch(() => {
          this.attemptReconnect();
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      this.emit('error', new Error('Max reconnection attempts reached'));
    }
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Singleton instance
export const websocketService = new MockWebSocketService();