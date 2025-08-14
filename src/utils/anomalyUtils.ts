import { AnomalyRecord, AnomalyStats } from '@/types/anomaly';

export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ago`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function getSeverityColor(severity: string): string {
  const colors = {
    critical: 'text-red-500 border-red-500/30 bg-red-500/5',
    high: 'text-orange-500 border-orange-500/30 bg-orange-500/5',
    medium: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5',
    low: 'text-blue-500 border-blue-500/30 bg-blue-500/5',
  };
  return colors[severity as keyof typeof colors] || colors.low;
}

export function getStatusColor(status: string): string {
  const colors = {
    investigating: 'text-red-500 border-red-500/30',
    acknowledged: 'text-yellow-500 border-yellow-500/30',
    resolved: 'text-green-500 border-green-500/30',
    dismissed: 'text-gray-500 border-gray-500/30',
    escalated: 'text-purple-500 border-purple-500/30',
  };
  return colors[status as keyof typeof colors] || colors.acknowledged;
}

export function getSeverityIcon(severity: string): string {
  const icons = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵',
  };
  return icons[severity as keyof typeof icons] || '⚪';
}

export function calculateAnomalyScore(anomaly: AnomalyRecord): number {
  let score = 0;
  
  // Severity weight
  const severityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
  score += severityWeights[anomaly.severity as keyof typeof severityWeights] * 25;
  
  // Entropy weight (normalize to 0-100)
  score += (anomaly.entropy / 10) * 20;
  
  // Confidence weight
  score += anomaly.metadata.confidence_score * 20;
  
  // Recency weight (more recent = higher score)
  const now = new Date();
  const ageHours = (now.getTime() - anomaly.timestamp.getTime()) / (1000 * 60 * 60);
  const recencyScore = Math.max(0, 100 - ageHours * 2); // Decreases over time
  score += (recencyScore / 100) * 15;
  
  // Status weight (unresolved = higher score)
  const statusWeights = { 
    investigating: 4, 
    escalated: 3, 
    acknowledged: 2, 
    resolved: 0, 
    dismissed: 0 
  };
  score += statusWeights[anomaly.status as keyof typeof statusWeights] * 5;
  
  return Math.min(100, Math.round(score));
}

export function groupAnomaliesByTimeframe(
  anomalies: AnomalyRecord[], 
  timeframe: 'hour' | 'day' | 'week' | 'month'
): Array<{ period: string; count: number; anomalies: AnomalyRecord[] }> {
  const groups: Record<string, AnomalyRecord[]> = {};
  
  anomalies.forEach(anomaly => {
    let key: string;
    const date = anomaly.timestamp;
    
    switch (timeframe) {
      case 'hour':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth()}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(anomaly);
  });
  
  return Object.entries(groups)
    .map(([period, anomalies]) => ({
      period,
      count: anomalies.length,
      anomalies: anomalies.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

export function detectAnomalyPatterns(anomalies: AnomalyRecord[]): Array<{
  pattern: string;
  count: number;
  severity: string;
  description: string;
}> {
  const patterns = [];
  
  // Pattern 1: Repeated error types
  const typeGroups = anomalies.reduce((acc, anomaly) => {
    acc[anomaly.type] = (acc[anomaly.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(typeGroups).forEach(([type, count]) => {
    if (count >= 3) {
      patterns.push({
        pattern: `repeated_${type}`,
        count,
        severity: count >= 5 ? 'high' : 'medium',
        description: `${count} occurrences of ${type.replace(/_/g, ' ')} anomalies`,
      });
    }
  });
  
  // Pattern 2: High entropy clusters
  const highEntropyAnomalies = anomalies.filter(a => a.entropy > 7.5);
  if (highEntropyAnomalies.length >= 3) {
    patterns.push({
      pattern: 'high_entropy_cluster',
      count: highEntropyAnomalies.length,
      severity: 'critical',
      description: `Cluster of ${highEntropyAnomalies.length} high-entropy anomalies`,
    });
  }
  
  // Pattern 3: Model-specific patterns
  const modelGroups = anomalies.reduce((acc, anomaly) => {
    acc[anomaly.model] = (acc[anomaly.model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(modelGroups).forEach(([model, count]) => {
    const modelAnomalies = anomalies.filter(a => a.model === model);
    const avgSeverity = modelAnomalies.filter(a => ['critical', 'high'].includes(a.severity)).length / count;
    
    if (count >= 3 && avgSeverity > 0.5) {
      patterns.push({
        pattern: `model_${model.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        count,
        severity: avgSeverity > 0.8 ? 'critical' : 'high',
        description: `${model} showing ${count} anomalies with ${Math.round(avgSeverity * 100)}% high severity`,
      });
    }
  });
  
  return patterns.sort((a, b) => {
    const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
    return severityOrder[b.severity as keyof typeof severityOrder] - 
           severityOrder[a.severity as keyof typeof severityOrder];
  });
}

export function exportAnomalyData(
  anomalies: AnomalyRecord[], 
  format: 'csv' | 'json' | 'xlsx'
): string | Blob {
  switch (format) {
    case 'csv':
      const headers = [
        'ID', 'Timestamp', 'Severity', 'Type', 'Model', 'Description',
        'Entropy', 'Status', 'Confidence', 'Tags', 'Text Preview'
      ];
      
      const csvContent = [
        headers.join(','),
        ...anomalies.map(anomaly => [
          anomaly.id,
          anomaly.timestamp.toISOString(),
          anomaly.severity,
          anomaly.type,
          anomaly.model,
          `"${anomaly.description.replace(/"/g, '""')}"`,
          anomaly.entropy,
          anomaly.status,
          anomaly.metadata.confidence_score,
          `"${anomaly.tags.join(', ')}"`,
          `"${anomaly.text_preview.replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');
      
      return csvContent;
      
    case 'json':
      return JSON.stringify(anomalies, null, 2);
      
    case 'xlsx':
      // For XLSX, we'd need a library like xlsx or exceljs
      // For now, return JSON as fallback
      return JSON.stringify(anomalies, null, 2);
      
    default:
      return JSON.stringify(anomalies, null, 2);
  }
}

export function generateAnomalyReport(
  anomalies: AnomalyRecord[],
  timeframe: { start: Date; end: Date }
): {
  summary: string;
  stats: AnomalyStats;
  patterns: ReturnType<typeof detectAnomalyPatterns>;
  recommendations: string[];
} {
  const stats: AnomalyStats = {
    total: anomalies.length,
    critical: anomalies.filter(a => a.severity === 'critical').length,
    high: anomalies.filter(a => a.severity === 'high').length,
    medium: anomalies.filter(a => a.severity === 'medium').length,
    low: anomalies.filter(a => a.severity === 'low').length,
    investigating: anomalies.filter(a => a.status === 'investigating').length,
    acknowledged: anomalies.filter(a => a.status === 'acknowledged').length,
    resolved: anomalies.filter(a => a.status === 'resolved').length,
    dismissed: anomalies.filter(a => a.status === 'dismissed').length,
    escalated: anomalies.filter(a => a.status === 'escalated').length,
    byType: {},
    byModel: {},
    byHour: [],
    averageEntropy: anomalies.reduce((sum, a) => sum + a.entropy, 0) / anomalies.length || 0,
    averageConfidence: anomalies.reduce((sum, a) => sum + a.metadata.confidence_score, 0) / anomalies.length || 0,
    topTags: [],
  };

  const patterns = detectAnomalyPatterns(anomalies);
  
  const summary = `
Anomaly Report: ${timeframe.start.toLocaleDateString()} - ${timeframe.end.toLocaleDateString()}

Total Anomalies: ${stats.total}
Critical: ${stats.critical} | High: ${stats.high} | Medium: ${stats.medium} | Low: ${stats.low}

Average Entropy: ${stats.averageEntropy.toFixed(2)}
Average Confidence: ${(stats.averageConfidence * 100).toFixed(1)}%

Status Distribution:
- Investigating: ${stats.investigating}
- Acknowledged: ${stats.acknowledged}
- Resolved: ${stats.resolved}
- Escalated: ${stats.escalated}
- Dismissed: ${stats.dismissed}
  `.trim();

  const recommendations = [];
  
  if (stats.critical > 0) {
    recommendations.push(`Address ${stats.critical} critical anomalies immediately`);
  }
  
  if (stats.investigating > stats.total * 0.3) {
    recommendations.push('High number of unresolved anomalies - consider increasing analysis resources');
  }
  
  if (stats.averageEntropy > 7.5) {
    recommendations.push('High average entropy detected - review detection thresholds');
  }
  
  patterns.forEach(pattern => {
    if (pattern.severity === 'critical') {
      recommendations.push(`Critical pattern detected: ${pattern.description}`);
    }
  });

  return {
    summary,
    stats,
    patterns,
    recommendations,
  };
}