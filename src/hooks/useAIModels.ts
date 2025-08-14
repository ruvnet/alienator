/**
 * React hooks for AI Models functionality
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  AIModel, 
  ComparisonRequest, 
  ComparisonResult, 
  ModelResponse,
  CrossModelUIState,
  ComparisonFilters,
  ModelProvider 
} from '../types/ai-models';
import { aiModelsService } from '../services/ai-models';

/**
 * Hook for managing AI models
 */
export function useAIModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const availableModels = aiModelsService.getModels();
      setModels(availableModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
    } finally {
      setLoading(false);
    }
  }, []);

  const enabledModels = useMemo(() => 
    models.filter(model => model.enabled), 
    [models]
  );

  const modelsByProvider = useMemo(() => {
    const grouped: Record<ModelProvider, AIModel[]> = {
      openai: [],
      anthropic: [],
      google: [],
      cohere: [],
      huggingface: [],
      custom: []
    };

    models.forEach(model => {
      grouped[model.provider].push(model);
    });

    return grouped;
  }, [models]);

  const updateModel = useCallback((modelId: string, updates: Partial<AIModel>) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, ...updates } : model
    ));
  }, []);

  const toggleModel = useCallback((modelId: string) => {
    updateModel(modelId, { enabled: !models.find(m => m.id === modelId)?.enabled });
  }, [models, updateModel]);

  const setApiKey = useCallback((provider: ModelProvider, apiKey: string) => {
    aiModelsService.setApiKey(provider, apiKey);
  }, []);

  return {
    models,
    enabledModels,
    modelsByProvider,
    loading,
    error,
    updateModel,
    toggleModel,
    setApiKey
  };
}

/**
 * Hook for cross-model comparisons
 */
export function useCrossModelComparison() {
  const [state, setState] = useState<CrossModelUIState>({
    selectedModels: [],
    currentPrompt: '',
    isLoading: false,
    comparisonHistory: [],
    viewMode: 'grid',
    filters: {
      providers: [],
      responseTimeRange: [0, 10000],
      costRange: [0, 1],
      qualityThreshold: 0.5,
      dateRange: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()]
    }
  });

  const runComparison = useCallback(async (prompt: string, modelIds: string[]) => {
    if (!prompt.trim() || modelIds.length === 0) {
      throw new Error('Prompt and models are required');
    }

    setState(prev => ({ ...prev, isLoading: true, currentPrompt: prompt }));

    try {
      const request: ComparisonRequest = {
        id: `comparison-${Date.now()}`,
        prompt,
        models: modelIds,
        parameters: {},
        timestamp: new Date(),
        status: 'running'
      };

      const result = await aiModelsService.runComparison(request);

      setState(prev => ({
        ...prev,
        isLoading: false,
        activeComparison: result,
        comparisonHistory: [result, ...prev.comparisonHistory].slice(0, 50) // Keep last 50
      }));

      return result;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const selectModel = useCallback((modelId: string) => {
    setState(prev => ({
      ...prev,
      selectedModels: prev.selectedModels.includes(modelId)
        ? prev.selectedModels.filter(id => id !== modelId)
        : [...prev.selectedModels, modelId]
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedModels: [] }));
  }, []);

  const setPrompt = useCallback((prompt: string) => {
    setState(prev => ({ ...prev, currentPrompt: prompt }));
  }, []);

  const setViewMode = useCallback((mode: 'grid' | 'comparison' | 'metrics') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const updateFilters = useCallback((filters: Partial<ComparisonFilters>) => {
    setState(prev => ({ 
      ...prev, 
      filters: { ...prev.filters, ...filters } 
    }));
  }, []);

  const filteredHistory = useMemo(() => {
    return state.comparisonHistory.filter(comparison => {
      const { filters } = state;
      
      // Filter by date range
      const comparisonDate = new Date(comparison.responses[0]?.timestamp || 0);
      if (comparisonDate < filters.dateRange[0] || comparisonDate > filters.dateRange[1]) {
        return false;
      }

      // Filter by response time
      const avgTime = comparison.metrics.averageResponseTime;
      if (avgTime < filters.responseTimeRange[0] || avgTime > filters.responseTimeRange[1]) {
        return false;
      }

      // Filter by cost
      const totalCost = comparison.metrics.totalCost;
      if (totalCost < filters.costRange[0] || totalCost > filters.costRange[1]) {
        return false;
      }

      // Filter by providers
      if (filters.providers.length > 0) {
        const hasSelectedProvider = comparison.responses.some(response => {
          const model = aiModelsService.getModel(response.modelId);
          return model && filters.providers.includes(model.provider);
        });
        if (!hasSelectedProvider) return false;
      }

      return true;
    });
  }, [state.comparisonHistory, state.filters]);

  const comparisonStats = useMemo(() => {
    const total = state.comparisonHistory.length;
    const avgCost = total > 0 
      ? state.comparisonHistory.reduce((sum, c) => sum + c.metrics.totalCost, 0) / total 
      : 0;
    const avgTime = total > 0 
      ? state.comparisonHistory.reduce((sum, c) => sum + c.metrics.averageResponseTime, 0) / total 
      : 0;

    return { total, avgCost, avgTime };
  }, [state.comparisonHistory]);

  return {
    ...state,
    runComparison,
    selectModel,
    clearSelection,
    setPrompt,
    setViewMode,
    updateFilters,
    filteredHistory,
    comparisonStats
  };
}

/**
 * Hook for individual model responses
 */
export function useModelResponse(modelId: string) {
  const [response, setResponse] = useState<ModelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callModel = useCallback(async (prompt: string, parameters: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await aiModelsService.callModel(modelId, prompt, parameters);
      setResponse(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to call model';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  return {
    response,
    loading,
    error,
    callModel
  };
}

/**
 * Hook for batch model operations
 */
export function useBatchModelOperations() {
  const [operations, setOperations] = useState<Map<string, ModelResponse>>(new Map());
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  const callModels = useCallback(async (
    modelIds: string[], 
    prompt: string, 
    parameters: Record<string, any> = {}
  ) => {
    // Set loading state for all models
    setLoading(new Set(modelIds));
    setErrors(new Map());

    const promises = modelIds.map(async (modelId) => {
      try {
        const response = await aiModelsService.callModel(modelId, prompt, parameters);
        setOperations(prev => new Map(prev).set(modelId, response));
        return { modelId, response, error: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setErrors(prev => new Map(prev).set(modelId, errorMessage));
        return { modelId, response: null, error: errorMessage };
      } finally {
        setLoading(prev => {
          const newLoading = new Set(prev);
          newLoading.delete(modelId);
          return newLoading;
        });
      }
    });

    const results = await Promise.allSettled(promises);
    return results.map((result, index) => ({
      modelId: modelIds[index],
      ...(result.status === 'fulfilled' ? result.value : { error: result.reason })
    }));
  }, []);

  const clearOperations = useCallback(() => {
    setOperations(new Map());
    setErrors(new Map());
    setLoading(new Set());
  }, []);

  const getModelStatus = useCallback((modelId: string) => {
    return {
      response: operations.get(modelId),
      loading: loading.has(modelId),
      error: errors.get(modelId)
    };
  }, [operations, loading, errors]);

  return {
    operations: Array.from(operations.entries()).map(([id, response]) => ({ id, response })),
    loading: Array.from(loading),
    errors: Array.from(errors.entries()).map(([id, error]) => ({ id, error })),
    callModels,
    clearOperations,
    getModelStatus
  };
}

/**
 * Hook for model performance tracking
 */
export function useModelPerformance() {
  const [metrics, setMetrics] = useState<Record<string, any>>({});

  const trackResponse = useCallback((response: ModelResponse) => {
    setMetrics(prev => {
      const modelMetrics = prev[response.modelId] || {
        totalCalls: 0,
        totalCost: 0,
        totalTokens: 0,
        averageResponseTime: 0,
        responses: []
      };

      const newResponses = [response, ...modelMetrics.responses].slice(0, 100); // Keep last 100
      const newTotalCalls = modelMetrics.totalCalls + 1;
      const newTotalCost = modelMetrics.totalCost + response.cost;
      const newTotalTokens = modelMetrics.totalTokens + response.tokenCount;
      const newAverageResponseTime = (modelMetrics.averageResponseTime * modelMetrics.totalCalls + response.duration) / newTotalCalls;

      return {
        ...prev,
        [response.modelId]: {
          totalCalls: newTotalCalls,
          totalCost: newTotalCost,
          totalTokens: newTotalTokens,
          averageResponseTime: newAverageResponseTime,
          responses: newResponses
        }
      };
    });
  }, []);

  const getModelMetrics = useCallback((modelId: string) => {
    return metrics[modelId] || null;
  }, [metrics]);

  const clearMetrics = useCallback(() => {
    setMetrics({});
  }, []);

  return {
    metrics,
    trackResponse,
    getModelMetrics,
    clearMetrics
  };
}