// React hook for managing real-time data streams

import { useState, useEffect, useCallback, useRef } from 'react';
import { StreamData, ConnectionStatus, MonitorConfig, ChartDataPoint } from '../types/monitor';
import { websocketService } from '../services/websocket';

interface UseRealTimeDataOptions {
  autoConnect?: boolean;
  maxDataPoints?: number;
  config?: Partial<MonitorConfig>;
}

interface UseRealTimeDataReturn {
  data: StreamData | null;
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
  chartData: {
    cpu: ChartDataPoint[];
    memory: ChartDataPoint[];
    detections: ChartDataPoint[];
    latency: ChartDataPoint[];
  };
}

const defaultConfig: MonitorConfig = {
  updateInterval: 1000,
  maxDataPoints: 50,
  alertThresholds: {
    cpu: 80,
    memory: 85,
    latency: 100,
    detection_rate: 70
  },
  autoReconnect: true,
  reconnectDelay: 2000
};

export const useRealTimeData = (options: UseRealTimeDataOptions = {}): UseRealTimeDataReturn => {
  const { autoConnect = true, maxDataPoints = 50 } = options;
  const config = { ...defaultConfig, ...options.config };
  
  const [data, setData] = useState<StreamData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    reconnecting: false,
    error: null,
    last_connected: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Chart data storage
  const [chartData, setChartData] = useState({
    cpu: [] as ChartDataPoint[],
    memory: [] as ChartDataPoint[],
    detections: [] as ChartDataPoint[],
    latency: [] as ChartDataPoint[]
  });
  
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataBufferRef = useRef<StreamData[]>([]);

  // Update chart data when new data arrives
  const updateChartData = useCallback((newData: StreamData) => {
    const timestamp = Date.now();
    
    setChartData(prev => {
      const addDataPoint = (series: ChartDataPoint[], value: number) => {
        const newSeries = [...series, { timestamp, value }];
        return newSeries.slice(-maxDataPoints);
      };
      
      return {
        cpu: addDataPoint(prev.cpu, newData.metrics.cpu_usage),
        memory: addDataPoint(prev.memory, newData.metrics.memory_usage),
        detections: addDataPoint(prev.detections, newData.detections.length),
        latency: addDataPoint(prev.latency, newData.metrics.network_latency)
      };
    });
  }, [maxDataPoints]);

  // WebSocket event handlers
  const handleData = useCallback((streamData: StreamData) => {
    setData(streamData);
    updateChartData(streamData);
    
    // Buffer data for analysis
    dataBufferRef.current.push(streamData);
    if (dataBufferRef.current.length > 100) {
      dataBufferRef.current = dataBufferRef.current.slice(-50);
    }
  }, [updateChartData]);

  const handleConnected = useCallback(() => {
    setConnectionStatus(prev => ({
      ...prev,
      connected: true,
      reconnecting: false,
      error: null,
      last_connected: Date.now()
    }));
    setIsLoading(false);
    setError(null);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const handleDisconnected = useCallback(() => {
    setConnectionStatus(prev => ({
      ...prev,
      connected: false,
      reconnecting: config.autoReconnect
    }));
    
    if (config.autoReconnect) {
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, config.reconnectDelay);
    }
  }, [config.autoReconnect, config.reconnectDelay]);

  const handleError = useCallback((wsError: Error) => {
    const errorMessage = wsError.message || 'WebSocket connection error';
    setError(errorMessage);
    setConnectionStatus(prev => ({
      ...prev,
      connected: false,
      reconnecting: false,
      error: errorMessage
    }));
    setIsLoading(false);
  }, []);

  const handleReconnecting = useCallback((attempt: number) => {
    setConnectionStatus(prev => ({
      ...prev,
      reconnecting: true,
      error: null
    }));
  }, []);

  // Connection management
  const connect = useCallback(async () => {
    if (connectionStatus.connected) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await websocketService.connect();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [connectionStatus.connected]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setConnectionStatus(prev => ({ ...prev, error: null }));
  }, []);

  // Setup WebSocket listeners
  useEffect(() => {
    websocketService.on('data', handleData);
    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('error', handleError);
    websocketService.on('reconnecting', handleReconnecting);

    return () => {
      websocketService.off('data', handleData);
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('error', handleError);
      websocketService.off('reconnecting', handleReconnecting);
    };
  }, [handleData, handleConnected, handleDisconnected, handleError, handleReconnecting]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    connectionStatus,
    isLoading,
    error,
    connect,
    disconnect,
    clearError,
    chartData
  };
};