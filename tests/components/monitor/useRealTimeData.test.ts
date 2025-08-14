// Tests for useRealTimeData hook

import { renderHook, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { useRealTimeData } from '../../../src/hooks/useRealTimeData';
import { websocketService } from '../../../src/services/websocket';

// Mock the WebSocket service
jest.mock('../../../src/services/websocket', () => ({
  websocketService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  }
}));

const mockWebsocketService = websocketService as jest.Mocked<typeof websocketService>;

describe('useRealTimeData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWebsocketService.connect.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    expect(result.current.data).toBeNull();
    expect(result.current.connectionStatus.connected).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.chartData.cpu).toEqual([]);
    expect(result.current.chartData.memory).toEqual([]);
    expect(result.current.chartData.detections).toEqual([]);
    expect(result.current.chartData.latency).toEqual([]);
  });

  it('auto-connects when autoConnect is true', () => {
    renderHook(() => useRealTimeData({ autoConnect: true }));

    expect(mockWebsocketService.connect).toHaveBeenCalled();
  });

  it('does not auto-connect when autoConnect is false', () => {
    renderHook(() => useRealTimeData({ autoConnect: false }));

    expect(mockWebsocketService.connect).not.toHaveBeenCalled();
  });

  it('sets up WebSocket event listeners', () => {
    renderHook(() => useRealTimeData());

    expect(mockWebsocketService.on).toHaveBeenCalledWith('data', expect.any(Function));
    expect(mockWebsocketService.on).toHaveBeenCalledWith('connected', expect.any(Function));
    expect(mockWebsocketService.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
    expect(mockWebsocketService.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockWebsocketService.on).toHaveBeenCalledWith('reconnecting', expect.any(Function));
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useRealTimeData());

    unmount();

    expect(mockWebsocketService.off).toHaveBeenCalledWith('data', expect.any(Function));
    expect(mockWebsocketService.off).toHaveBeenCalledWith('connected', expect.any(Function));
    expect(mockWebsocketService.off).toHaveBeenCalledWith('disconnected', expect.any(Function));
    expect(mockWebsocketService.off).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockWebsocketService.off).toHaveBeenCalledWith('reconnecting', expect.any(Function));
  });

  it('handles manual connect', async () => {
    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    await act(async () => {
      await result.current.connect();
    });

    expect(mockWebsocketService.connect).toHaveBeenCalled();
  });

  it('handles manual disconnect', () => {
    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    act(() => {
      result.current.disconnect();
    });

    expect(mockWebsocketService.disconnect).toHaveBeenCalled();
  });

  it('handles connection success', () => {
    let connectedCallback: Function;
    mockWebsocketService.on.mockImplementation((event, callback) => {
      if (event === 'connected') {
        connectedCallback = callback;
      }
    });

    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    act(() => {
      connectedCallback();
    });

    expect(result.current.connectionStatus.connected).toBe(true);
    expect(result.current.connectionStatus.reconnecting).toBe(false);
    expect(result.current.connectionStatus.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles connection error', () => {
    let errorCallback: Function;
    mockWebsocketService.on.mockImplementation((event, callback) => {
      if (event === 'error') {
        errorCallback = callback;
      }
    });

    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    const testError = new Error('Connection failed');
    act(() => {
      errorCallback(testError);
    });

    expect(result.current.connectionStatus.connected).toBe(false);
    expect(result.current.connectionStatus.error).toBe('Connection failed');
    expect(result.current.error).toBe('Connection failed');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles disconnection', () => {
    let disconnectedCallback: Function;
    mockWebsocketService.on.mockImplementation((event, callback) => {
      if (event === 'disconnected') {
        disconnectedCallback = callback;
      }
    });

    const { result } = renderHook(() => useRealTimeData({ 
      autoConnect: false,
      config: { autoReconnect: false, reconnectDelay: 1000 }
    }));

    act(() => {
      disconnectedCallback();
    });

    expect(result.current.connectionStatus.connected).toBe(false);
  });

  it('handles reconnecting state', () => {
    let reconnectingCallback: Function;
    mockWebsocketService.on.mockImplementation((event, callback) => {
      if (event === 'reconnecting') {
        reconnectingCallback = callback;
      }
    });

    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    act(() => {
      reconnectingCallback(1);
    });

    expect(result.current.connectionStatus.reconnecting).toBe(true);
    expect(result.current.connectionStatus.error).toBeNull();
  });

  it('updates data and chart data when receiving new data', () => {
    let dataCallback: Function;
    mockWebsocketService.on.mockImplementation((event, callback) => {
      if (event === 'data') {
        dataCallback = callback;
      }
    });

    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    const mockStreamData = {
      detections: [{
        id: 'det_1',
        timestamp: Date.now(),
        confidence: 0.85,
        type: 'alpha' as const,
        coordinates: { x: 100, y: 200 },
        signature: 'SIG_TEST',
        threat_level: 'high' as const,
        source: 'sensor_1'
      }],
      metrics: {
        cpu_usage: 45.2,
        memory_usage: 62.1,
        network_latency: 25.5,
        detection_rate: 92.3,
        false_positive_rate: 2.1,
        active_sensors: 8,
        total_sensors: 10,
        uptime: Date.now()
      },
      alerts: [],
      sensor_status: []
    };

    act(() => {
      dataCallback(mockStreamData);
    });

    expect(result.current.data).toEqual(mockStreamData);
    expect(result.current.chartData.cpu).toHaveLength(1);
    expect(result.current.chartData.memory).toHaveLength(1);
    expect(result.current.chartData.detections).toHaveLength(1);
    expect(result.current.chartData.latency).toHaveLength(1);
    expect(result.current.chartData.cpu[0].value).toBe(45.2);
    expect(result.current.chartData.memory[0].value).toBe(62.1);
    expect(result.current.chartData.detections[0].value).toBe(1);
    expect(result.current.chartData.latency[0].value).toBe(25.5);
  });

  it('limits chart data points to maxDataPoints', () => {
    let dataCallback: Function;
    mockWebsocketService.on.mockImplementation((event, callback) => {
      if (event === 'data') {
        dataCallback = callback;
      }
    });

    const { result } = renderHook(() => useRealTimeData({ 
      autoConnect: false,
      maxDataPoints: 2
    }));

    const createMockData = (cpu: number) => ({
      detections: [],
      metrics: {
        cpu_usage: cpu,
        memory_usage: 50,
        network_latency: 20,
        detection_rate: 90,
        false_positive_rate: 1,
        active_sensors: 8,
        total_sensors: 10,
        uptime: Date.now()
      },
      alerts: [],
      sensor_status: []
    });

    // Add 3 data points
    act(() => {
      dataCallback(createMockData(30));
    });
    act(() => {
      dataCallback(createMockData(40));
    });
    act(() => {
      dataCallback(createMockData(50));
    });

    // Should only keep last 2 points
    expect(result.current.chartData.cpu).toHaveLength(2);
    expect(result.current.chartData.cpu[0].value).toBe(40);
    expect(result.current.chartData.cpu[1].value).toBe(50);
  });

  it('clears error when clearError is called', () => {
    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    // Set an error first
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.connectionStatus.error).toBeNull();
  });

  it('handles connect failure', async () => {
    mockWebsocketService.connect.mockRejectedValue(new Error('Connect failed'));

    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    await act(async () => {
      try {
        await result.current.connect();
      } catch (error) {
        // Expected to fail
      }
    });

    expect(result.current.error).toBe('Connect failed');
    expect(result.current.isLoading).toBe(false);
  });

  it('sets loading state during connection', async () => {
    let resolveConnect: Function;
    mockWebsocketService.connect.mockImplementation(() => 
      new Promise(resolve => { resolveConnect = resolve; })
    );

    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    act(() => {
      result.current.connect();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveConnect();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('skips connection if already connected', async () => {
    let connectedCallback: Function;
    mockWebsocketService.on.mockImplementation((event, callback) => {
      if (event === 'connected') {
        connectedCallback = callback;
      }
    });

    const { result } = renderHook(() => useRealTimeData({ autoConnect: false }));

    // Simulate connected state
    act(() => {
      connectedCallback();
    });

    // Clear the connect mock calls
    mockWebsocketService.connect.mockClear();

    // Try to connect again
    await act(async () => {
      await result.current.connect();
    });

    // Should not call connect again
    expect(mockWebsocketService.connect).not.toHaveBeenCalled();
  });
});