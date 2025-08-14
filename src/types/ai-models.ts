/**
 * AI Model Types and Interfaces
 * Cross-Model comparison and embeddings visualization types
 */

export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'cohere' | 'huggingface' | 'custom';

export type ModelType = 'text-generation' | 'embedding' | 'chat' | 'completion';

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  type: ModelType;
  version: string;
  maxTokens: number;
  costPerToken: number;
  enabled: boolean;
  apiEndpoint?: string;
  apiKey?: string;
  description?: string;
  capabilities: string[];
}

export interface ModelResponse {
  id: string;
  modelId: string;
  prompt: string;
  response: string;
  timestamp: Date;
  duration: number;
  tokenCount: number;
  cost: number;
  metadata: Record<string, any>;
}

export interface ComparisonRequest {
  id: string;
  prompt: string;
  models: string[];
  parameters: Record<string, any>;
  timestamp: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface ComparisonResult {
  requestId: string;
  responses: ModelResponse[];
  metrics: ComparisonMetrics;
  analysis: ComparisonAnalysis;
}

export interface ComparisonMetrics {
  averageResponseTime: number;
  totalCost: number;
  totalTokens: number;
  successRate: number;
  similarityScores: SimilarityMatrix;
}

export interface SimilarityMatrix {
  [modelId: string]: {
    [otherModelId: string]: number;
  };
}

export interface ComparisonAnalysis {
  sentiment: SentimentAnalysis;
  quality: QualityMetrics;
  coherence: CoherenceMetrics;
  creativity: CreativityMetrics;
  factualAccuracy?: FactualAccuracyMetrics;
}

export interface SentimentAnalysis {
  [modelId: string]: {
    positive: number;
    negative: number;
    neutral: number;
    confidence: number;
  };
}

export interface QualityMetrics {
  [modelId: string]: {
    clarity: number;
    relevance: number;
    completeness: number;
    overall: number;
  };
}

export interface CoherenceMetrics {
  [modelId: string]: {
    logicalFlow: number;
    consistency: number;
    structure: number;
  };
}

export interface CreativityMetrics {
  [modelId: string]: {
    originality: number;
    diversity: number;
    innovation: number;
  };
}

export interface FactualAccuracyMetrics {
  [modelId: string]: {
    accuracy: number;
    citations: number;
    verifiability: number;
  };
}

// Embeddings Types
export interface EmbeddingVector {
  id: string;
  text: string;
  vector: number[];
  dimensions: number;
  model: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface EmbeddingCluster {
  id: string;
  centroid: number[];
  points: EmbeddingVector[];
  label: string;
  size: number;
  cohesion: number;
  color: string;
}

export interface EmbeddingVisualization {
  type: '2d' | '3d';
  vectors: EmbeddingVector[];
  clusters: EmbeddingCluster[];
  reducedDimensions: number[][];
  reductionMethod: 'pca' | 'tsne' | 'umap';
  parameters: VisualizationParameters;
}

export interface VisualizationParameters {
  perplexity?: number; // for t-SNE
  learningRate?: number; // for t-SNE
  nComponents: number; // 2 or 3
  minDist?: number; // for UMAP
  nNeighbors?: number; // for UMAP
  clusteringMethod: 'kmeans' | 'dbscan' | 'hierarchical';
  numClusters?: number; // for k-means
  eps?: number; // for DBSCAN
  minSamples?: number; // for DBSCAN
}

export interface SimilaritySearch {
  query: EmbeddingVector;
  results: SimilarityResult[];
  threshold: number;
  maxResults: number;
}

export interface SimilarityResult {
  vector: EmbeddingVector;
  similarity: number;
  distance: number;
  rank: number;
}

export interface EmbeddingModel {
  id: string;
  name: string;
  provider: ModelProvider;
  dimensions: number;
  maxInputLength: number;
  costPerToken: number;
  enabled: boolean;
}

// UI State Types
export interface CrossModelUIState {
  selectedModels: string[];
  currentPrompt: string;
  isLoading: boolean;
  activeComparison?: ComparisonResult;
  comparisonHistory: ComparisonResult[];
  viewMode: 'grid' | 'comparison' | 'metrics';
  filters: ComparisonFilters;
}

export interface ComparisonFilters {
  providers: ModelProvider[];
  responseTimeRange: [number, number];
  costRange: [number, number];
  qualityThreshold: number;
  dateRange: [Date, Date];
}

export interface EmbeddingsUIState {
  selectedVectors: string[];
  visualizationType: '2d' | '3d';
  isLoading: boolean;
  currentVisualization?: EmbeddingVisualization;
  searchQuery: string;
  searchResults: SimilarityResult[];
  selectedCluster?: string;
  viewSettings: EmbeddingViewSettings;
}

export interface EmbeddingViewSettings {
  showLabels: boolean;
  showClusters: boolean;
  pointSize: number;
  opacity: number;
  colorScheme: 'cluster' | 'model' | 'timestamp' | 'similarity';
  animationSpeed: number;
}

// Error Types
export interface ModelError {
  modelId: string;
  error: string;
  code: string;
  timestamp: Date;
  retryable: boolean;
}

export interface APIError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

// Export utility types
export type ModelComparison = {
  [K in keyof ComparisonAnalysis]: ComparisonAnalysis[K];
};

export type EmbeddingDistance = 'cosine' | 'euclidean' | 'manhattan' | 'dot';

export type VisualizationTheme = 'light' | 'dark' | 'auto';