import { format, subHours, subDays } from 'date-fns';

export const formatXAxis = (tickItem: string, timeRange: string) => {
  const date = new Date(tickItem);
  
  switch (timeRange) {
    case '1h':
    case '6h':
      return format(date, 'HH:mm');
    case '24h':
      return format(date, 'HH:mm');
    case '7d':
      return format(date, 'MM/dd');
    case '30d':
      return format(date, 'MM/dd');
    default:
      return format(date, 'HH:mm');
  }
};

export const formatTooltipValue = (value: number, name: string) => {
  if (name.toLowerCase().includes('percentage') || name.toLowerCase().includes('ratio')) {
    return `${(value * 100).toFixed(1)}%`;
  }
  
  if (name.toLowerCase().includes('time')) {
    return `${value.toFixed(1)}ms`;
  }
  
  if (name.toLowerCase().includes('memory')) {
    return `${value.toFixed(1)}GB`;
  }
  
  if (name.toLowerCase().includes('cpu')) {
    return `${value.toFixed(1)}%`;
  }
  
  return value.toFixed(2);
};

export const getColorScale = (value: number, min: number, max: number) => {
  const normalized = (value - min) / (max - min);
  
  if (normalized < 0.33) return '#10b981'; // green
  if (normalized < 0.66) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

export const generateTickInterval = (dataLength: number, maxTicks: number = 6) => {
  return Math.ceil(dataLength / maxTicks);
};

export const aggregateDataByTimeRange = (data: any[], timeRange: string) => {
  if (timeRange === '1h' || timeRange === '6h') {
    return data; // Return raw data for short ranges
  }
  
  // For longer ranges, aggregate by hour or day
  const aggregated: Record<string, any> = {};
  
  data.forEach(item => {
    const date = new Date(item.timestamp);
    let key: string;
    
    if (timeRange === '24h') {
      key = format(date, 'yyyy-MM-dd HH:00:00');
    } else if (timeRange === '7d') {
      key = format(date, 'yyyy-MM-dd 00:00:00');
    } else {
      key = format(date, 'yyyy-MM-dd 00:00:00');
    }
    
    if (!aggregated[key]) {
      aggregated[key] = {
        timestamp: key,
        entropy: [],
        compression: [],
        anomalyScore: [],
        patternComplexity: [],
        modelConfidence: [],
        detectionAccuracy: [],
        processingTime: [],
        memoryUsage: [],
        cpuUsage: []
      };
    }
    
    // Collect values for averaging
    Object.keys(item).forEach(metric => {
      if (metric !== 'timestamp' && aggregated[key][metric]) {
        aggregated[key][metric].push(item[metric]);
      }
    });
  });
  
  // Average the collected values
  return Object.values(aggregated).map((item: any) => {
    const result: any = { timestamp: item.timestamp };
    
    Object.keys(item).forEach(metric => {
      if (metric !== 'timestamp' && Array.isArray(item[metric])) {
        const values = item[metric];
        result[metric] = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
      }
    });
    
    return result;
  });
};

export const calculateMovingAverage = (data: number[], windowSize: number = 5): number[] => {
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(average);
  }
  
  return result;
};

export const detectAnomalies = (data: number[], threshold: number = 2): boolean[] => {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  
  return data.map(val => Math.abs(val - mean) > threshold * stdDev);
};

export const getChartColors = (darkMode: boolean = false) => {
  if (darkMode) {
    return {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      danger: '#ef4444',
      muted: '#6b7280',
      background: '#1f2937',
      surface: '#374151'
    };
  }
  
  return {
    primary: '#2563eb',
    secondary: '#059669',
    accent: '#d97706',
    danger: '#dc2626',
    muted: '#9ca3af',
    background: '#ffffff',
    surface: '#f9fafb'
  };
};