// Tests for RealTimeMonitor component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import RealTimeMonitor from '../../../src/components/monitor/RealTimeMonitor';
import { useRealTimeData } from '../../../src/hooks/useRealTimeData';

// Mock the hook
jest.mock('../../../src/hooks/useRealTimeData');
const mockUseRealTimeData = useRealTimeData as jest.MockedFunction<typeof useRealTimeData>;

// Mock WebSocket
global.WebSocket = jest.fn() as any;

describe('RealTimeMonitor', () => {
  const mockData = {
    detections: [
      {
        id: 'det_1',
        timestamp: Date.now(),
        confidence: 0.85,
        type: 'alpha' as const,
        coordinates: { x: 100, y: 200, z: 50 },
        signature: 'SIG_TEST123',
        threat_level: 'high' as const,
        source: 'sensor_1'
      }
    ],
    metrics: {
      cpu_usage: 45.2,
      memory_usage: 62.1,
      network_latency: 25.5,
      detection_rate: 92.3,
      false_positive_rate: 2.1,
      active_sensors: 8,
      total_sensors: 10,
      uptime: Date.now() - 86400000
    },
    alerts: [
      {
        id: 'alert_1',
        level: 'warning' as const,
        message: 'High CPU usage detected',
        timestamp: Date.now(),
        resolved: false,
        source: 'system'
      }
    ],
    sensor_status: [
      {
        id: 'sensor_1',
        name: 'Sensor 1',
        location: 'Sector A',
        status: 'online' as const,
        last_ping: Date.now() - 5000,
        signal_strength: 0.95
      }
    ]
  };

  const mockConnectionStatus = {
    connected: true,
    reconnecting: false,
    error: null,
    last_connected: Date.now()
  };

  const mockChartData = {
    cpu: [{ timestamp: Date.now(), value: 45.2 }],
    memory: [{ timestamp: Date.now(), value: 62.1 }],
    detections: [{ timestamp: Date.now(), value: 1 }],
    latency: [{ timestamp: Date.now(), value: 25.5 }]
  };

  beforeEach(() => {
    mockUseRealTimeData.mockReturnValue({
      data: mockData,
      connectionStatus: mockConnectionStatus,
      isLoading: false,
      error: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
      clearError: jest.fn(),
      chartData: mockChartData
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the monitor title and description', () => {
    render(<RealTimeMonitor />);
    
    expect(screen.getByText('Xenotype Detection Monitor')).toBeInTheDocument();
    expect(screen.getByText('Real-time alien activity surveillance system')).toBeInTheDocument();
  });

  it('displays connection status correctly', () => {
    render(<RealTimeMonitor />);
    
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  it('shows loading state when loading', () => {
    mockUseRealTimeData.mockReturnValue({
      data: null,
      connectionStatus: mockConnectionStatus,
      isLoading: true,
      error: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
      clearError: jest.fn(),
      chartData: mockChartData
    });

    render(<RealTimeMonitor />);
    
    expect(screen.getByText('Establishing connection to monitoring systems...')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    const errorMessage = 'Connection failed';
    mockUseRealTimeData.mockReturnValue({
      data: null,
      connectionStatus: { ...mockConnectionStatus, error: errorMessage },
      isLoading: false,
      error: errorMessage,
      connect: jest.fn(),
      disconnect: jest.fn(),
      clearError: jest.fn(),
      chartData: mockChartData
    });

    render(<RealTimeMonitor />);
    
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders metrics panel with system metrics', () => {
    render(<RealTimeMonitor />);
    
    expect(screen.getByText('System Metrics')).toBeInTheDocument();
    expect(screen.getByText('45.2%')).toBeInTheDocument(); // CPU usage
    expect(screen.getByText('62.1%')).toBeInTheDocument(); // Memory usage
  });

  it('renders status indicators with alerts and sensors', () => {
    render(<RealTimeMonitor />);
    
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('High CPU usage detected')).toBeInTheDocument();
    expect(screen.getByText('Sensor 1')).toBeInTheDocument();
  });

  it('renders live charts for different metrics', () => {
    render(<RealTimeMonitor />);
    
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('Detection Rate')).toBeInTheDocument();
    expect(screen.getByText('Network Latency')).toBeInTheDocument();
  });

  it('renders detection list with recent detections', () => {
    render(<RealTimeMonitor />);
    
    expect(screen.getByText('Recent Detections')).toBeInTheDocument();
    expect(screen.getByText('ALPHA')).toBeInTheDocument();
    expect(screen.getByText('SIG_TEST123')).toBeInTheDocument();
  });

  it('handles connection toggle button click', () => {
    const mockDisconnect = jest.fn();
    mockUseRealTimeData.mockReturnValue({
      data: mockData,
      connectionStatus: mockConnectionStatus,
      isLoading: false,
      error: null,
      connect: jest.fn(),
      disconnect: mockDisconnect,
      clearError: jest.fn(),
      chartData: mockChartData
    });

    render(<RealTimeMonitor />);
    
    const disconnectButton = screen.getByText('Disconnect');
    fireEvent.click(disconnectButton);
    
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('handles detection item click and shows modal', async () => {
    render(<RealTimeMonitor />);
    
    const detectionItem = screen.getByText('SIG_TEST123').closest('.detection-item');
    expect(detectionItem).toBeInTheDocument();
    
    fireEvent.click(detectionItem!);
    
    await waitFor(() => {
      expect(screen.getByText('Detection Details')).toBeInTheDocument();
    });
  });

  it('closes detection modal when close button is clicked', async () => {
    render(<RealTimeMonitor />);
    
    // Open modal
    const detectionItem = screen.getByText('SIG_TEST123').closest('.detection-item');
    fireEvent.click(detectionItem!);
    
    await waitFor(() => {
      expect(screen.getByText('Detection Details')).toBeInTheDocument();
    });
    
    // Close modal
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Detection Details')).not.toBeInTheDocument();
    });
  });

  it('handles retry connection on error', () => {
    const mockConnect = jest.fn();
    const mockClearError = jest.fn();
    
    mockUseRealTimeData.mockReturnValue({
      data: null,
      connectionStatus: { ...mockConnectionStatus, error: 'Connection failed' },
      isLoading: false,
      error: 'Connection failed',
      connect: mockConnect,
      disconnect: jest.fn(),
      clearError: mockClearError,
      chartData: mockChartData
    });

    render(<RealTimeMonitor />);
    
    const retryButton = screen.getByText('Retry Connection');
    fireEvent.click(retryButton);
    
    expect(mockConnect).toHaveBeenCalled();
  });

  it('handles clear error button click', () => {
    const mockClearError = jest.fn();
    
    mockUseRealTimeData.mockReturnValue({
      data: null,
      connectionStatus: { ...mockConnectionStatus, error: 'Connection failed' },
      isLoading: false,
      error: 'Connection failed',
      connect: jest.fn(),
      disconnect: jest.fn(),
      clearError: mockClearError,
      chartData: mockChartData
    });

    render(<RealTimeMonitor />);
    
    const clearButton = screen.getByText('Clear Error');
    fireEvent.click(clearButton);
    
    expect(mockClearError).toHaveBeenCalled();
  });

  it('shows empty state when no detections', () => {
    const emptyData = {
      ...mockData,
      detections: []
    };

    mockUseRealTimeData.mockReturnValue({
      data: emptyData,
      connectionStatus: mockConnectionStatus,
      isLoading: false,
      error: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
      clearError: jest.fn(),
      chartData: mockChartData
    });

    render(<RealTimeMonitor />);
    
    expect(screen.getByText('No recent detections')).toBeInTheDocument();
    expect(screen.getByText('System is monitoring...')).toBeInTheDocument();
  });

  it('displays reconnecting state correctly', () => {
    mockUseRealTimeData.mockReturnValue({
      data: mockData,
      connectionStatus: { ...mockConnectionStatus, connected: false, reconnecting: true },
      isLoading: false,
      error: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
      clearError: jest.fn(),
      chartData: mockChartData
    });

    render(<RealTimeMonitor />);
    
    expect(screen.getByText('Reconnecting...')).toBeInTheDocument();
  });

  it('accumulates detections over time', () => {
    const { rerender } = render(<RealTimeMonitor />);
    
    // Initial detections
    expect(screen.getByText('1 shown')).toBeInTheDocument();
    
    // Add more detections
    const newDetection = {
      id: 'det_2',
      timestamp: Date.now(),
      confidence: 0.75,
      type: 'beta' as const,
      coordinates: { x: 150, y: 250 },
      signature: 'SIG_TEST456',
      threat_level: 'medium' as const,
      source: 'sensor_2'
    };

    mockUseRealTimeData.mockReturnValue({
      data: {
        ...mockData,
        detections: [newDetection]
      },
      connectionStatus: mockConnectionStatus,
      isLoading: false,
      error: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
      clearError: jest.fn(),
      chartData: mockChartData
    });

    rerender(<RealTimeMonitor />);
    
    // Should show accumulated detections
    expect(screen.getByText('SIG_TEST123')).toBeInTheDocument();
    expect(screen.getByText('SIG_TEST456')).toBeInTheDocument();
  });
});