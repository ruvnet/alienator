/**
 * React hooks for Embeddings functionality
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  EmbeddingVector, 
  EmbeddingVisualization, 
  EmbeddingCluster,
  EmbeddingsUIState,
  EmbeddingViewSettings,
  VisualizationParameters,
  SimilarityResult,
  EmbeddingDistance 
} from '../types/ai-models';
import { aiModelsService } from '../services/ai-models';
import { embeddingUtils } from '../utils/embeddings';

/**
 * Hook for managing embedding vectors
 */
export function useEmbeddings() {
  const [vectors, setVectors] = useState<EmbeddingVector[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEmbedding = useCallback(async (text: string, modelId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const embedding = await aiModelsService.generateEmbeddings(text, modelId);
      setVectors(prev => [embedding, ...prev]);
      return embedding;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate embedding';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addBatchEmbeddings = useCallback(async (texts: string[], modelId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const embeddings = await aiModelsService.batchGenerateEmbeddings(texts, modelId);
      setVectors(prev => [...embeddings, ...prev]);
      return embeddings;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate batch embeddings';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeEmbedding = useCallback((embeddingId: string) => {
    setVectors(prev => prev.filter(v => v.id !== embeddingId));
  }, []);

  const clearEmbeddings = useCallback(() => {
    setVectors([]);
    setError(null);
  }, []);

  const importEmbeddings = useCallback((newVectors: EmbeddingVector[]) => {
    setVectors(prev => [...newVectors, ...prev]);
  }, []);

  const vectorsByModel = useMemo(() => {
    const grouped: Record<string, EmbeddingVector[]> = {};
    vectors.forEach(vector => {
      if (!grouped[vector.model]) {
        grouped[vector.model] = [];
      }
      grouped[vector.model].push(vector);
    });
    return grouped;
  }, [vectors]);

  const stats = useMemo(() => ({
    total: vectors.length,
    models: Object.keys(vectorsByModel).length,
    averageDimensions: vectors.length > 0 
      ? vectors.reduce((sum, v) => sum + v.dimensions, 0) / vectors.length 
      : 0,
    dateRange: vectors.length > 0 
      ? {
          earliest: new Date(Math.min(...vectors.map(v => v.timestamp.getTime()))),
          latest: new Date(Math.max(...vectors.map(v => v.timestamp.getTime())))
        }
      : null
  }), [vectors, vectorsByModel]);

  return {
    vectors,
    vectorsByModel,
    stats,
    loading,
    error,
    addEmbedding,
    addBatchEmbeddings,
    removeEmbedding,
    clearEmbeddings,
    importEmbeddings
  };
}

/**
 * Hook for embeddings visualization
 */
export function useEmbeddingsVisualization() {
  const [state, setState] = useState<EmbeddingsUIState>({
    selectedVectors: [],
    visualizationType: '2d',
    isLoading: false,
    searchQuery: '',
    searchResults: [],
    viewSettings: {
      showLabels: true,
      showClusters: true,
      pointSize: 5,
      opacity: 0.8,
      colorScheme: 'cluster',
      animationSpeed: 1
    }
  });

  const [visualization, setVisualization] = useState<EmbeddingVisualization | null>(null);

  const createVisualization = useCallback(async (
    vectors: EmbeddingVector[], 
    parameters: VisualizationParameters
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const vis = await embeddingUtils.visualization.createVisualization(vectors, parameters);
      setVisualization(vis);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        currentVisualization: vis,
        visualizationType: vis.type
      }));
      return vis;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const updateVisualization = useCallback(async (parameters: Partial<VisualizationParameters>) => {
    if (!visualization) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedVis = await embeddingUtils.visualization.updateVisualization(
        visualization, 
        parameters
      );
      setVisualization(updatedVis);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        currentVisualization: updatedVis,
        visualizationType: updatedVis.type
      }));
      return updatedVis;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [visualization]);

  const toggleVisualizationType = useCallback(() => {
    const newType = state.visualizationType === '2d' ? '3d' : '2d';
    setState(prev => ({ ...prev, visualizationType: newType }));
    
    if (visualization) {
      updateVisualization({ nComponents: newType === '3d' ? 3 : 2 });
    }
  }, [state.visualizationType, visualization, updateVisualization]);

  const selectVector = useCallback((vectorId: string) => {
    setState(prev => ({
      ...prev,
      selectedVectors: prev.selectedVectors.includes(vectorId)
        ? prev.selectedVectors.filter(id => id !== vectorId)
        : [...prev.selectedVectors, vectorId]
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedVectors: [] }));
  }, []);

  const updateViewSettings = useCallback((settings: Partial<EmbeddingViewSettings>) => {
    setState(prev => ({ 
      ...prev, 
      viewSettings: { ...prev.viewSettings, ...settings } 
    }));
  }, []);

  const selectCluster = useCallback((clusterId: string) => {
    setState(prev => ({ ...prev, selectedCluster: clusterId }));
  }, []);

  return {
    ...state,
    visualization,
    createVisualization,
    updateVisualization,
    toggleVisualizationType,
    selectVector,
    clearSelection,
    updateViewSettings,
    selectCluster
  };
}

/**
 * Hook for similarity search
 */
export function useSimilaritySearch() {
  const [searchResults, setSearchResults] = useState<SimilarityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (
    queryVector: EmbeddingVector,
    vectors: EmbeddingVector[],
    options: {
      maxResults?: number;
      threshold?: number;
      distanceMethod?: EmbeddingDistance;
    } = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const results = embeddingUtils.similarity.findSimilar(
        queryVector,
        vectors,
        options.maxResults || 10,
        options.threshold || 0.7,
        options.distanceMethod || 'cosine'
      );

      setSearchResults(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByText = useCallback(async (
    query: string,
    vectors: EmbeddingVector[],
    options: {
      maxResults?: number;
      threshold?: number;
    } = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const results = embeddingUtils.similarity.semanticSearch(
        query,
        vectors,
        options.maxResults || 10,
        options.threshold || 0.7
      );

      setSearchResults(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Text search failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    search,
    searchByText,
    clearResults
  };
}

/**
 * Hook for clustering operations
 */
export function useClustering() {
  const [clusters, setClusters] = useState<EmbeddingCluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performClustering = useCallback(async (
    vectors: EmbeddingVector[],
    method: 'kmeans' | 'dbscan' | 'hierarchical',
    parameters: Record<string, any> = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      let results: EmbeddingCluster[];

      switch (method) {
        case 'kmeans':
          results = embeddingUtils.clustering.kmeans(
            vectors, 
            parameters.k || 5,
            parameters.maxIterations || 100
          );
          break;
        case 'dbscan':
          results = embeddingUtils.clustering.dbscan(
            vectors,
            parameters.eps || 0.5,
            parameters.minSamples || 5
          );
          break;
        case 'hierarchical':
          // Use k-means as fallback for hierarchical
          results = embeddingUtils.clustering.kmeans(vectors, parameters.k || 5);
          break;
        default:
          throw new Error(`Unsupported clustering method: ${method}`);
      }

      setClusters(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Clustering failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearClusters = useCallback(() => {
    setClusters([]);
    setError(null);
  }, []);

  const getClusterStats = useCallback(() => {
    if (clusters.length === 0) return null;

    const totalPoints = clusters.reduce((sum, cluster) => sum + cluster.size, 0);
    const averageSize = totalPoints / clusters.length;
    const largestCluster = Math.max(...clusters.map(c => c.size));
    const smallestCluster = Math.min(...clusters.map(c => c.size));
    const averageCohesion = clusters.reduce((sum, c) => sum + c.cohesion, 0) / clusters.length;

    return {
      totalClusters: clusters.length,
      totalPoints,
      averageSize,
      largestCluster,
      smallestCluster,
      averageCohesion
    };
  }, [clusters]);

  return {
    clusters,
    loading,
    error,
    performClustering,
    clearClusters,
    getClusterStats
  };
}

/**
 * Hook for dimensionality reduction
 */
export function useDimensionalityReduction() {
  const [reducedVectors, setReducedVectors] = useState<number[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reduceVectors = useCallback(async (
    vectors: number[][],
    method: 'pca' | 'tsne' | 'umap',
    targetDimensions: number = 2,
    parameters: Record<string, any> = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      let results: number[][];

      switch (method) {
        case 'pca':
          results = await embeddingUtils.dimensionalityReduction.pca(vectors, targetDimensions);
          break;
        case 'tsne':
          results = await embeddingUtils.dimensionalityReduction.tsne(
            vectors,
            targetDimensions,
            parameters.perplexity || 30,
            parameters.iterations || 1000
          );
          break;
        case 'umap':
          // Use PCA as fallback for UMAP
          results = await embeddingUtils.dimensionalityReduction.pca(vectors, targetDimensions);
          break;
        default:
          throw new Error(`Unsupported reduction method: ${method}`);
      }

      setReducedVectors(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Dimensionality reduction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setReducedVectors([]);
    setError(null);
  }, []);

  return {
    reducedVectors,
    loading,
    error,
    reduceVectors,
    clearResults
  };
}

/**
 * Combined hook for complete embeddings workflow
 */
export function useEmbeddingsWorkflow() {
  const embeddings = useEmbeddings();
  const visualization = useEmbeddingsVisualization();
  const similarity = useSimilaritySearch();
  const clustering = useClustering();
  const dimensionalityReduction = useDimensionalityReduction();

  const createCompleteVisualization = useCallback(async (
    texts: string[],
    modelId?: string,
    parameters?: Partial<VisualizationParameters>
  ) => {
    try {
      // Generate embeddings
      const vectors = await embeddings.addBatchEmbeddings(texts, modelId);
      
      // Create visualization with default parameters
      const defaultParams: VisualizationParameters = {
        nComponents: 2,
        reductionMethod: 'pca',
        clusteringMethod: 'kmeans',
        numClusters: Math.min(5, Math.ceil(vectors.length / 10)),
        ...parameters
      };

      const vis = await visualization.createVisualization(vectors, defaultParams);
      return vis;
    } catch (error) {
      throw error;
    }
  }, [embeddings.addBatchEmbeddings, visualization.createVisualization]);

  return {
    embeddings,
    visualization,
    similarity,
    clustering,
    dimensionalityReduction,
    createCompleteVisualization
  };
}