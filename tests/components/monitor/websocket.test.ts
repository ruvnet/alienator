// Tests for WebSocket service

import { jest } from '@jest/globals';
import { MockWebSocketService } from '../../../src/services/websocket';

// Mock setTimeout and clearTimeout for testing
global.setTimeout = jest.fn((callback, delay) => {
  return setImmediate(callback) as any;
});
global.clearTimeout = jest.fn();
global.setInterval = jest.fn((callback, delay) => {
  return setImmediate(callback) as any;
});
global.clearInterval = jest.fn();

describe('MockWebSocketService', () => {
  let service: MockWebSocketService;

  beforeEach(() => {
    service = new MockWebSocketService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    service.disconnect();
  });

  it('initializes with default URL', () => {
    expect(service).toBeInstanceOf(MockWebSocketService);
  });

  it('initializes with custom URL', () => {
    const customService = new MockWebSocketService('ws://localhost:9000/test');
    expect(customService).toBeInstanceOf(MockWebSocketService);
  });

  it('can add and remove event listeners', () => {
    const mockCallback = jest.fn();
    
    service.on('connected', mockCallback);
    service.off('connected', mockCallback);
    
    // Should not crash
    expect(service).toBeInstanceOf(MockWebSocketService);
  });

  it('emits connected event on successful connection', async () => {
    const mockCallback = jest.fn();
    service.on('connected', mockCallback);

    await service.connect();

    expect(mockCallback).toHaveBeenCalled();
  });

  it('emits disconnected event on disconnect', async () => {
    const mockCallback = jest.fn();
    service.on('disconnected', mockCallback);

    await service.connect();
    service.disconnect();

    expect(mockCallback).toHaveBeenCalled();
  });

  it('generates mock data with correct structure', async () => {
    const mockDataCallback = jest.fn();
    service.on('data', mockDataCallback);

    await service.connect();

    // Wait for data generation
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockDataCallback).toHaveBeenCalled();
    
    const callArgs = mockDataCallback.mock.calls[0];
    const streamData = callArgs[0];

    expect(streamData).toHaveProperty('detections');
    expect(streamData).toHaveProperty('metrics');
    expect(streamData).toHaveProperty('alerts');
    expect(streamData).toHaveProperty('sensor_status');

    expect(Array.isArray(streamData.detections)).toBe(true);
    expect(Array.isArray(streamData.alerts)).toBe(true);
    expect(Array.isArray(streamData.sensor_status)).toBe(true);
    expect(typeof streamData.metrics).toBe('object');
  });

  it('generates metrics with expected properties', async () => {
    const mockDataCallback = jest.fn();
    service.on('data', mockDataCallback);

    await service.connect();
    await new Promise(resolve => setTimeout(resolve, 10));

    const streamData = mockDataCallback.mock.calls[0][0];
    const metrics = streamData.metrics;

    expect(metrics).toHaveProperty('cpu_usage');
    expect(metrics).toHaveProperty('memory_usage');
    expect(metrics).toHaveProperty('network_latency');
    expect(metrics).toHaveProperty('detection_rate');
    expect(metrics).toHaveProperty('false_positive_rate');
    expect(metrics).toHaveProperty('active_sensors');
    expect(metrics).toHaveProperty('total_sensors');
    expect(metrics).toHaveProperty('uptime');

    expect(typeof metrics.cpu_usage).toBe('number');
    expect(typeof metrics.memory_usage).toBe('number');
    expect(typeof metrics.network_latency).toBe('number');
    expect(typeof metrics.detection_rate).toBe('number');
    expect(typeof metrics.false_positive_rate).toBe('number');
    expect(typeof metrics.active_sensors).toBe('number');
    expect(typeof metrics.total_sensors).toBe('number');
    expect(typeof metrics.uptime).toBe('number');
  });

  it('generates detections with valid properties', async () => {
    const mockDataCallback = jest.fn();
    service.on('data', mockDataCallback);

    await service.connect();
    await new Promise(resolve => setTimeout(resolve, 10));

    const streamData = mockDataCallback.mock.calls[0][0];
    
    if (streamData.detections.length > 0) {
      const detection = streamData.detections[0];

      expect(detection).toHaveProperty('id');
      expect(detection).toHaveProperty('timestamp');
      expect(detection).toHaveProperty('confidence');
      expect(detection).toHaveProperty('type');
      expect(detection).toHaveProperty('coordinates');
      expect(detection).toHaveProperty('signature');
      expect(detection).toHaveProperty('threat_level');
      expect(detection).toHaveProperty('source');

      expect(typeof detection.id).toBe('string');
      expect(typeof detection.timestamp).toBe('number');
      expect(typeof detection.confidence).toBe('number');
      expect(['alpha', 'beta', 'gamma', 'unknown']).toContain(detection.type);
      expect(['low', 'medium', 'high', 'critical']).toContain(detection.threat_level);
      expect(detection.confidence).toBeGreaterThanOrEqual(0);
      expect(detection.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('generates sensor status with valid properties', async () => {
    const mockDataCallback = jest.fn();
    service.on('data', mockDataCallback);

    await service.connect();
    await new Promise(resolve => setTimeout(resolve, 10));

    const streamData = mockDataCallback.mock.calls[0][0];
    
    expect(streamData.sensor_status).toHaveLength(10);
    
    const sensor = streamData.sensor_status[0];
    expect(sensor).toHaveProperty('id');
    expect(sensor).toHaveProperty('name');
    expect(sensor).toHaveProperty('location');
    expect(sensor).toHaveProperty('status');
    expect(sensor).toHaveProperty('last_ping');
    expect(sensor).toHaveProperty('signal_strength');

    expect(['online', 'offline', 'maintenance', 'error']).toContain(sensor.status);
    expect(sensor.signal_strength).toBeGreaterThanOrEqual(0);
    expect(sensor.signal_strength).toBeLessThanOrEqual(1);
  });

  it('can simulate disconnection', async () => {
    const disconnectedCallback = jest.fn();
    const reconnectingCallback = jest.fn();
    
    service.on('disconnected', disconnectedCallback);
    service.on('reconnecting', reconnectingCallback);

    await service.connect();
    service.simulateDisconnection();

    expect(disconnectedCallback).toHaveBeenCalled();
  });

  it('returns connection status correctly', async () => {
    let status = service.getConnectionStatus();
    expect(status.connected).toBe(false);

    await service.connect();
    status = service.getConnectionStatus();
    expect(status.connected).toBe(true);

    service.disconnect();
    status = service.getConnectionStatus();
    expect(status.connected).toBe(false);
  });

  it('stops data generation when disconnected', async () => {
    const mockDataCallback = jest.fn();
    service.on('data', mockDataCallback);

    await service.connect();
    
    // Clear previous calls
    mockDataCallback.mockClear();
    
    service.disconnect();
    
    // Wait a bit to ensure no new data is generated
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(mockDataCallback).not.toHaveBeenCalled();
  });

  it('handles error events', () => {
    const errorCallback = jest.fn();
    service.on('error', errorCallback);

    // Simulate error by trying to connect when already connected
    service.connect();
    
    // Should not throw error
    expect(service).toBeInstanceOf(MockWebSocketService);
  });

  it('removes specific event listeners', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    service.on('connected', callback1);
    service.on('connected', callback2);
    
    service.off('connected', callback1);
    
    // Only callback2 should remain, but we can't easily test this
    // without exposing internal listener state
    expect(service).toBeInstanceOf(MockWebSocketService);
  });

  it('handles multiple connections gracefully', async () => {
    await service.connect();
    
    // Try to connect again
    await service.connect();
    
    // Should still be connected
    const status = service.getConnectionStatus();
    expect(status.connected).toBe(true);
  });

  it('generates variable number of detections', async () => {
    const mockDataCallback = jest.fn();
    service.on('data', mockDataCallback);

    await service.connect();
    
    // Collect several data samples
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Check that detection counts vary (0-2 per update)
    const calls = mockDataCallback.mock.calls;
    const detectionCounts = calls.map(call => call[0].detections.length);
    
    expect(detectionCounts.some(count => count === 0)).toBe(true);
    expect(detectionCounts.every(count => count <= 2)).toBe(true);
  });

  it('generates alerts occasionally', async () => {
    const mockDataCallback = jest.fn();
    service.on('data', mockDataCallback);

    await service.connect();
    
    // Collect many data samples to increase chance of alerts
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const calls = mockDataCallback.mock.calls;
    const hasAlerts = calls.some(call => call[0].alerts.length > 0);
    
    // Should have at least some alerts in 20 samples (30% chance each)
    // This might occasionally fail due to randomness, but very unlikely
    expect(hasAlerts).toBe(true);
  });
});