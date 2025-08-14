export interface AnomalyRecord {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'entropy_spike' | 'cross_model_divergence' | 'compression_anomaly' | 'linguistic_pattern' | 'cryptographic_pattern' | 'embedding_anomaly' | 'threshold_breach' | 'pattern_deviation' | 'statistical_outlier';
  model: string;
  description: string;
  entropy: number;
  text_preview: string;
  full_text?: string;
  status: 'investigating' | 'acknowledged' | 'resolved' | 'dismissed' | 'escalated';
  tags: string[];
  metadata: {
    confidence_score: number;
    analysis_version: string;
    processing_time_ms: number;
    source_ip?: string;
    user_agent?: string;
    session_id?: string;
    request_id?: string;
  };
  metrics: {
    compression_ratio?: number;
    divergence_score?: number;
    pattern_strength?: number;
    linguistic_complexity?: number;
    cryptographic_entropy?: number;
    embedding_distance?: number;
  };
  related_anomalies?: string[];
  resolution_notes?: string;
  assigned_to?: string;
  escalation_level?: number;
}

export interface AnomalyFilter {
  search: string;
  severity: string[];
  type: string[];
  model: string[];
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  entropyRange: {
    min: number;
    max: number;
  };
  tags: string[];
  confidenceRange: {
    min: number;
    max: number;
  };
}

export interface AnomalyStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  investigating: number;
  acknowledged: number;
  resolved: number;
  dismissed: number;
  escalated: number;
  byType: Record<string, number>;
  byModel: Record<string, number>;
  byHour: Array<{ hour: string; count: number }>;
  averageEntropy: number;
  averageConfidence: number;
  topTags: Array<{ tag: string; count: number }>;
}

export interface AnomalyCorrelation {
  id: string;
  anomaly_ids: string[];
  correlation_type: 'temporal' | 'pattern' | 'source' | 'model';
  correlation_strength: number;
  description: string;
  discovered_at: Date;
  patterns: string[];
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filter: Partial<AnomalyFilter>;
  created_at: Date;
  is_public: boolean;
  usage_count: number;
}

export interface AnomalyAnalysis {
  id: string;
  anomaly_id: string;
  analysis_type: 'pattern' | 'correlation' | 'prediction' | 'root_cause';
  results: {
    summary: string;
    details: Record<string, any>;
    recommendations: string[];
    confidence: number;
  };
  created_at: Date;
  analyst: string;
}