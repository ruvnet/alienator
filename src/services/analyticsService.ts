import { 
  AnalyticsData, 
  MetricTrend, 
  PatternData, 
  DetectionStats, 
  CorrelationMatrix, 
  ModelPerformance,
  DistributionData,
  HeatmapCell,
  AnomalyEvent
} from '@/types/analytics';

class AnalyticsService {
  private generateTimeSeriesData(hours: number): AnalyticsData[] {
    const data: AnalyticsData[] = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      
      // Generate realistic data with some patterns and anomalies
      const baseEntropy = 6.5 + Math.sin(i / 12) * 1.5;
      const noiseEntropy = (Math.random() - 0.5) * 0.8;
      const anomalyFactor = Math.random() < 0.05 ? 2 : 1; // 5% chance of anomaly
      
      data.push({
        timestamp: timestamp.toISOString(),
        entropy: Math.max(0, Math.min(10, baseEntropy + noiseEntropy * anomalyFactor)),
        compression: Math.max(0.1, Math.min(1, 0.75 + (Math.random() - 0.5) * 0.3)),
        anomalyScore: Math.max(0, Math.min(1, 0.3 + Math.random() * 0.4 * anomalyFactor)),
        patternComplexity: Math.max(0, Math.min(10, 5.5 + Math.sin(i / 8) * 2 + (Math.random() - 0.5) * 1)),
        modelConfidence: Math.max(0.5, Math.min(1, 0.85 + (Math.random() - 0.5) * 0.2)),
        detectionAccuracy: Math.max(0.7, Math.min(1, 0.92 + (Math.random() - 0.5) * 0.1)),
        processingTime: Math.max(10, 50 + Math.random() * 100),
        memoryUsage: Math.max(20, 45 + Math.sin(i / 6) * 15 + Math.random() * 10),
        cpuUsage: Math.max(10, 35 + Math.sin(i / 4) * 20 + Math.random() * 15)
      });
    }
    
    return data.reverse();
  }

  async getTimeSeriesData(timeRange: string): Promise<AnalyticsData[]> {
    const hoursMap: Record<string, number> = {
      '1h': 1,
      '6h': 6,
      '24h': 24,
      '7d': 168,
      '30d': 720
    };
    
    const hours = hoursMap[timeRange] || 24;
    return this.generateTimeSeriesData(hours);
  }

  async getMetricTrends(): Promise<MetricTrend[]> {
    const trends: MetricTrend[] = [
      {
        metric: 'Total Analyses',
        current: 12847,
        previous: 11435,
        change: 12.34,
        trend: 'up',
        status: 'normal'
      },
      {
        metric: 'Anomalies Detected',
        current: 1429,
        previous: 1321,
        change: 8.18,
        trend: 'up',
        status: 'warning'
      },
      {
        metric: 'Critical Alerts',
        current: 23,
        previous: 20,
        change: 15.0,
        trend: 'up',
        status: 'critical'
      },
      {
        metric: 'Detection Accuracy',
        current: 94.7,
        previous: 93.2,
        change: 1.61,
        trend: 'up',
        status: 'normal'
      },
      {
        metric: 'Processing Speed',
        current: 1247,
        previous: 1156,
        change: 7.87,
        trend: 'up',
        status: 'normal'
      },
      {
        metric: 'Model Confidence',
        current: 87.3,
        previous: 89.1,
        change: -2.02,
        trend: 'down',
        status: 'warning'
      }
    ];

    return trends;
  }

  async getPatternData(): Promise<PatternData[]> {
    const patterns: PatternData[] = [
      {
        id: 'p1',
        type: 'linguistic',
        pattern: 'Repetitive character sequences',
        frequency: 847,
        confidence: 0.92,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        severity: 'medium'
      },
      {
        id: 'p2',
        type: 'cryptographic',
        pattern: 'Base64 encoded data blocks',
        frequency: 234,
        confidence: 0.87,
        lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        severity: 'high'
      },
      {
        id: 'p3',
        type: 'compression',
        pattern: 'High compression ratios',
        frequency: 156,
        confidence: 0.94,
        lastSeen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        severity: 'low'
      },
      {
        id: 'p4',
        type: 'entropy',
        pattern: 'Sudden entropy spikes',
        frequency: 67,
        confidence: 0.89,
        lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        severity: 'critical'
      },
      {
        id: 'p5',
        type: 'linguistic',
        pattern: 'Unusual language patterns',
        frequency: 423,
        confidence: 0.76,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        severity: 'medium'
      }
    ];

    return patterns;
  }

  async getDetectionStats(): Promise<DetectionStats> {
    return {
      totalAnalyses: 12847,
      anomaliesDetected: 1429,
      falsePositives: 87,
      truePositives: 1342,
      accuracy: 0.947,
      precision: 0.939,
      recall: 0.956,
      f1Score: 0.947
    };
  }

  async getCorrelationMatrix(): Promise<CorrelationMatrix> {
    const metrics = ['Entropy', 'Compression', 'Anomaly Score', 'Pattern Complexity', 'Model Confidence'];
    
    // Generate a realistic correlation matrix
    const correlations = [
      [1.00, -0.72, 0.84, 0.91, -0.45],
      [-0.72, 1.00, -0.63, -0.68, 0.34],
      [0.84, -0.63, 1.00, 0.76, -0.52],
      [0.91, -0.68, 0.76, 1.00, -0.48],
      [-0.45, 0.34, -0.52, -0.48, 1.00]
    ];

    return { metrics, correlations };
  }

  async getModelPerformance(): Promise<ModelPerformance[]> {
    return [
      {
        modelId: 'gpt-4',
        modelName: 'GPT-4',
        accuracy: 0.943,
        precision: 0.921,
        recall: 0.967,
        f1Score: 0.943,
        processingTime: 124.5,
        memoryUsage: 2.3,
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        modelId: 'claude-3',
        modelName: 'Claude-3',
        accuracy: 0.937,
        precision: 0.945,
        recall: 0.928,
        f1Score: 0.936,
        processingTime: 98.7,
        memoryUsage: 1.9,
        lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        modelId: 'cohere',
        modelName: 'Cohere Command',
        accuracy: 0.912,
        precision: 0.898,
        recall: 0.927,
        f1Score: 0.912,
        processingTime: 156.3,
        memoryUsage: 2.8,
        lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ];
  }

  async getDistributionData(metric: string): Promise<DistributionData[]> {
    const distributions: Record<string, DistributionData[]> = {
      entropy: [
        { bin: '0-1', count: 45, percentage: 3.5 },
        { bin: '1-2', count: 123, percentage: 9.6 },
        { bin: '2-3', count: 289, percentage: 22.5 },
        { bin: '3-4', count: 345, percentage: 26.9 },
        { bin: '4-5', count: 298, percentage: 23.2 },
        { bin: '5-6', count: 156, percentage: 12.1 },
        { bin: '6-7', count: 89, percentage: 6.9 },
        { bin: '7-8', count: 34, percentage: 2.6 },
        { bin: '8-9', count: 12, percentage: 0.9 },
        { bin: '9-10', count: 5, percentage: 0.4 }
      ],
      compression: [
        { bin: '0.0-0.1', count: 12, percentage: 0.9 },
        { bin: '0.1-0.2', count: 34, percentage: 2.6 },
        { bin: '0.2-0.3', count: 89, percentage: 6.9 },
        { bin: '0.3-0.4', count: 156, percentage: 12.1 },
        { bin: '0.4-0.5', count: 234, percentage: 18.2 },
        { bin: '0.5-0.6', count: 298, percentage: 23.2 },
        { bin: '0.6-0.7', count: 245, percentage: 19.1 },
        { bin: '0.7-0.8', count: 189, percentage: 14.7 },
        { bin: '0.8-0.9', count: 78, percentage: 6.1 },
        { bin: '0.9-1.0', count: 23, percentage: 1.8 }
      ]
    };

    return distributions[metric] || distributions.entropy;
  }

  async getHeatmapData(): Promise<HeatmapCell[]> {
    const models = ['GPT-4', 'Claude-3', 'Cohere'];
    const timeSlots = ['00-06', '06-12', '12-18', '18-24'];
    const data: HeatmapCell[] = [];

    models.forEach(model => {
      timeSlots.forEach(slot => {
        const value = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
        data.push({
          x: slot,
          y: model,
          value,
          intensity: value
        });
      });
    });

    return data;
  }

  async getAnomalyEvents(): Promise<AnomalyEvent[]> {
    return [
      {
        id: 'ae1',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        type: 'Entropy Spike',
        severity: 'critical',
        description: 'Unusual entropy pattern detected in text stream',
        metrics: { entropy: 8.7, confidence: 0.92 },
        resolved: false
      },
      {
        id: 'ae2',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        type: 'Compression Anomaly',
        severity: 'medium',
        description: 'Unexpected compression ratio variation',
        metrics: { compression: 0.23, anomalyScore: 0.67 },
        resolved: true
      },
      {
        id: 'ae3',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        type: 'Pattern Recognition',
        severity: 'high',
        description: 'Novel pattern structure identified',
        metrics: { patternComplexity: 9.2, confidence: 0.89 },
        resolved: false
      }
    ];
  }

  async exportData(config: any): Promise<string> {
    // Mock export functionality
    const data = await this.getTimeSeriesData('24h');
    
    if (config.format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      return `${headers}\n${rows}`;
    }
    
    if (config.format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    
    return 'Export completed';
  }
}

export const analyticsService = new AnalyticsService();