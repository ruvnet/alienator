import { useMemo } from 'react';
import { useAnomalyStore } from '@/stores/anomalyStore';
import { AnomalyRecord } from '@/types/anomaly';

export function useAnomalyFilters() {
  const { anomalies, currentFilter } = useAnomalyStore();

  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((anomaly: AnomalyRecord) => {
      // Search filter
      if (currentFilter.search) {
        const searchTerm = currentFilter.search.toLowerCase();
        const searchFields = [
          anomaly.id,
          anomaly.description,
          anomaly.text_preview,
          anomaly.model,
          ...anomaly.tags,
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchTerm)) {
          return false;
        }
      }

      // Severity filter
      if (currentFilter.severity.length > 0 && !currentFilter.severity.includes(anomaly.severity)) {
        return false;
      }

      // Type filter
      if (currentFilter.type.length > 0 && !currentFilter.type.includes(anomaly.type)) {
        return false;
      }

      // Model filter
      if (currentFilter.model.length > 0 && !currentFilter.model.includes(anomaly.model)) {
        return false;
      }

      // Status filter
      if (currentFilter.status.length > 0 && !currentFilter.status.includes(anomaly.status)) {
        return false;
      }

      // Date range filter
      if (currentFilter.dateRange.start && anomaly.timestamp < currentFilter.dateRange.start) {
        return false;
      }
      if (currentFilter.dateRange.end && anomaly.timestamp > currentFilter.dateRange.end) {
        return false;
      }

      // Entropy range filter
      if (anomaly.entropy < currentFilter.entropyRange.min || anomaly.entropy > currentFilter.entropyRange.max) {
        return false;
      }

      // Tags filter
      if (currentFilter.tags.length > 0) {
        const hasMatchingTag = currentFilter.tags.some(tag => 
          anomaly.tags.some(anomalyTag => 
            anomalyTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Confidence range filter
      const confidence = anomaly.metadata.confidence_score;
      if (confidence < currentFilter.confidenceRange.min || confidence > currentFilter.confidenceRange.max) {
        return false;
      }

      return true;
    });
  }, [anomalies, currentFilter]);

  const filterStats = useMemo(() => {
    const total = anomalies.length;
    const filtered = filteredAnomalies.length;
    const percentage = total > 0 ? Math.round((filtered / total) * 100) : 0;

    return {
      total,
      filtered,
      percentage,
      hidden: total - filtered,
    };
  }, [anomalies.length, filteredAnomalies.length]);

  const availableFilters = useMemo(() => {
    const severities = [...new Set(anomalies.map(a => a.severity))];
    const types = [...new Set(anomalies.map(a => a.type))];
    const models = [...new Set(anomalies.map(a => a.model))];
    const statuses = [...new Set(anomalies.map(a => a.status))];
    const tags = [...new Set(anomalies.flatMap(a => a.tags))];

    return {
      severities,
      types,
      models,
      statuses,
      tags,
      entropyRange: {
        min: Math.min(...anomalies.map(a => a.entropy)),
        max: Math.max(...anomalies.map(a => a.entropy)),
      },
      confidenceRange: {
        min: Math.min(...anomalies.map(a => a.metadata.confidence_score)),
        max: Math.max(...anomalies.map(a => a.metadata.confidence_score)),
      },
    };
  }, [anomalies]);

  return {
    filteredAnomalies,
    filterStats,
    availableFilters,
    currentFilter,
  };
}