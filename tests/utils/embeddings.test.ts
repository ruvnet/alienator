/**
 * Embeddings Utilities Tests
 */

import { describe, beforeEach, it, expect, vi } from 'vitest';
import {
  EmbeddingMath,
  DimensionalityReduction,
  ClusteringAlgorithms,
  SimilaritySearch,
  EmbeddingsVisualization
} from '../../src/utils/embeddings';
import { EmbeddingVector, EmbeddingCluster, VisualizationParameters } from '../../src/types/ai-models';

describe('EmbeddingMath', () => {
  describe('cosineSimilarity', () => {
    it('calculates cosine similarity correctly', () => {
      const a = [1, 0, 0];
      const b = [1, 0, 0];
      
      const similarity = EmbeddingMath.cosineSimilarity(a, b);
      expect(similarity).toBeCloseTo(1, 5);
    });

    it('calculates cosine similarity for orthogonal vectors', () => {
      const a = [1, 0, 0];
      const b = [0, 1, 0];
      
      const similarity = EmbeddingMath.cosineSimilarity(a, b);
      expect(similarity).toBeCloseTo(0, 5);
    });

    it('calculates cosine similarity for opposite vectors', () => {
      const a = [1, 0, 0];
      const b = [-1, 0, 0];
      
      const similarity = EmbeddingMath.cosineSimilarity(a, b);
      expect(similarity).toBeCloseTo(-1, 5);
    });

    it('throws error for different vector lengths', () => {
      const a = [1, 0];
      const b = [1, 0, 0];
      
      expect(() => EmbeddingMath.cosineSimilarity(a, b)).toThrow('Vectors must have the same dimensionality');
    });

    it('handles zero vectors', () => {
      const a = [0, 0, 0];
      const b = [1, 0, 0];
      
      const similarity = EmbeddingMath.cosineSimilarity(a, b);
      expect(similarity).toBe(0);
    });
  });

  describe('euclideanDistance', () => {
    it('calculates Euclidean distance correctly', () => {
      const a = [0, 0, 0];
      const b = [3, 4, 0];
      
      const distance = EmbeddingMath.euclideanDistance(a, b);
      expect(distance).toBeCloseTo(5, 5);
    });

    it('calculates distance for identical vectors', () => {
      const a = [1, 2, 3];
      const b = [1, 2, 3];
      
      const distance = EmbeddingMath.euclideanDistance(a, b);
      expect(distance).toBeCloseTo(0, 5);
    });

    it('throws error for different vector lengths', () => {
      const a = [1, 0];
      const b = [1, 0, 0];
      
      expect(() => EmbeddingMath.euclideanDistance(a, b)).toThrow('Vectors must have the same dimensionality');
    });
  });

  describe('manhattanDistance', () => {
    it('calculates Manhattan distance correctly', () => {
      const a = [0, 0, 0];
      const b = [1, 1, 1];
      
      const distance = EmbeddingMath.manhattanDistance(a, b);
      expect(distance).toBe(3);
    });

    it('calculates distance for identical vectors', () => {
      const a = [1, 2, 3];
      const b = [1, 2, 3];
      
      const distance = EmbeddingMath.manhattanDistance(a, b);
      expect(distance).toBe(0);
    });
  });

  describe('dotProduct', () => {
    it('calculates dot product correctly', () => {
      const a = [1, 2, 3];
      const b = [4, 5, 6];
      
      const product = EmbeddingMath.dotProduct(a, b);
      expect(product).toBe(32); // 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
    });

    it('calculates dot product for orthogonal vectors', () => {
      const a = [1, 0, 0];
      const b = [0, 1, 0];
      
      const product = EmbeddingMath.dotProduct(a, b);
      expect(product).toBe(0);
    });
  });

  describe('normalize', () => {
    it('normalizes vector to unit length', () => {
      const vector = [3, 4, 0];
      const normalized = EmbeddingMath.normalize(vector);
      
      expect(normalized[0]).toBeCloseTo(0.6, 5);
      expect(normalized[1]).toBeCloseTo(0.8, 5);
      expect(normalized[2]).toBeCloseTo(0, 5);
      
      // Check unit length
      const magnitude = Math.sqrt(normalized.reduce((sum, val) => sum + val * val, 0));
      expect(magnitude).toBeCloseTo(1, 5);
    });

    it('handles zero vector', () => {
      const vector = [0, 0, 0];
      const normalized = EmbeddingMath.normalize(vector);
      
      expect(normalized).toEqual([0, 0, 0]);
    });
  });

  describe('calculateDistance', () => {
    it('calculates cosine distance', () => {
      const a = [1, 0, 0];
      const b = [1, 0, 0];
      
      const distance = EmbeddingMath.calculateDistance(a, b, 'cosine');
      expect(distance).toBeCloseTo(0, 5); // 1 - cosine_similarity(1)
    });

    it('calculates euclidean distance', () => {
      const a = [0, 0, 0];
      const b = [3, 4, 0];
      
      const distance = EmbeddingMath.calculateDistance(a, b, 'euclidean');
      expect(distance).toBeCloseTo(5, 5);
    });

    it('defaults to euclidean for unknown method', () => {
      const a = [0, 0, 0];
      const b = [3, 4, 0];
      
      const distance = EmbeddingMath.calculateDistance(a, b, 'unknown' as any);
      expect(distance).toBeCloseTo(5, 5);
    });
  });
});

describe('DimensionalityReduction', () => {
  describe('randomProjection', () => {
    it('reduces dimensionality correctly', () => {
      const vectors = [
        [1, 2, 3, 4, 5],
        [2, 3, 4, 5, 6],
        [3, 4, 5, 6, 7]
      ];
      
      const reduced = DimensionalityReduction.randomProjection(vectors, 2);
      
      expect(reduced).toHaveLength(3);
      expect(reduced[0]).toHaveLength(2);
      expect(reduced[1]).toHaveLength(2);
      expect(reduced[2]).toHaveLength(2);
    });

    it('handles single vector', () => {
      const vectors = [[1, 2, 3, 4, 5]];
      
      const reduced = DimensionalityReduction.randomProjection(vectors, 3);
      
      expect(reduced).toHaveLength(1);
      expect(reduced[0]).toHaveLength(3);
    });
  });

  describe('pca', () => {
    it('performs PCA reduction', async () => {
      const vectors = [
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
        [4, 5, 6]
      ];
      
      const reduced = await DimensionalityReduction.pca(vectors, 2);
      
      expect(reduced).toHaveLength(4);
      expect(reduced[0]).toHaveLength(2);
    });
  });

  describe('tsne', () => {
    it('performs t-SNE reduction', async () => {
      const vectors = [
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5]
      ];
      
      const reduced = await DimensionalityReduction.tsne(vectors, 2);
      
      expect(reduced).toHaveLength(3);
      expect(reduced[0]).toHaveLength(2);
    });
  });
});

describe('ClusteringAlgorithms', () => {
  let mockVectors: EmbeddingVector[];

  beforeEach(() => {
    mockVectors = [
      {
        id: 'v1',
        text: 'vector 1',
        vector: [1, 1],
        dimensions: 2,
        model: 'test',
        timestamp: new Date()
      },
      {
        id: 'v2',
        text: 'vector 2',
        vector: [1, 2],
        dimensions: 2,
        model: 'test',
        timestamp: new Date()
      },
      {
        id: 'v3',
        text: 'vector 3',
        vector: [5, 5],
        dimensions: 2,
        model: 'test',
        timestamp: new Date()
      },
      {
        id: 'v4',
        text: 'vector 4',
        vector: [5, 6],
        dimensions: 2,
        model: 'test',
        timestamp: new Date()
      }
    ];
  });

  describe('kmeans', () => {
    it('performs k-means clustering', () => {
      const clusters = ClusteringAlgorithms.kmeans(mockVectors, 2);
      
      expect(clusters).toHaveLength(2);
      expect(clusters[0].points.length + clusters[1].points.length).toBe(4);
      
      clusters.forEach(cluster => {
        expect(cluster.id).toBeDefined();
        expect(cluster.label).toBeDefined();
        expect(cluster.centroid).toBeDefined();
        expect(cluster.color).toBeDefined();
        expect(cluster.cohesion).toBeGreaterThanOrEqual(0);
        expect(cluster.cohesion).toBeLessThanOrEqual(1);
      });
    });

    it('handles single cluster', () => {
      const clusters = ClusteringAlgorithms.kmeans(mockVectors, 1);
      
      expect(clusters).toHaveLength(1);
      expect(clusters[0].points).toHaveLength(4);
    });

    it('handles more clusters than points', () => {
      const singleVector = [mockVectors[0]];
      const clusters = ClusteringAlgorithms.kmeans(singleVector, 3);
      
      expect(clusters).toHaveLength(3);
      // Some clusters might be empty
    });
  });

  describe('dbscan', () => {
    it('performs DBSCAN clustering', () => {
      const clusters = ClusteringAlgorithms.dbscan(mockVectors, 2, 2);
      
      expect(clusters.length).toBeGreaterThanOrEqual(1);
      
      clusters.forEach(cluster => {
        expect(cluster.id).toBeDefined();
        expect(cluster.label).toBeDefined();
        expect(cluster.centroid).toBeDefined();
        expect(cluster.points.length).toBeGreaterThan(0);
      });
    });

    it('handles noise points', () => {
      // Use very small epsilon to create noise
      const clusters = ClusteringAlgorithms.dbscan(mockVectors, 0.1, 2);
      
      // Should create noise cluster
      const noiseCluster = clusters.find(c => c.id === 'noise');
      if (noiseCluster) {
        expect(noiseCluster.cohesion).toBe(0);
        expect(noiseCluster.color).toBe('#999999');
      }
    });
  });
});

describe('SimilaritySearch', () => {
  let mockVectors: EmbeddingVector[];
  let queryVector: EmbeddingVector;

  beforeEach(() => {
    mockVectors = [
      {
        id: 'v1',
        text: 'machine learning algorithms',
        vector: [0.1, 0.2, 0.3],
        dimensions: 3,
        model: 'test',
        timestamp: new Date()
      },
      {
        id: 'v2',
        text: 'deep learning networks',
        vector: [0.2, 0.3, 0.4],
        dimensions: 3,
        model: 'test',
        timestamp: new Date()
      },
      {
        id: 'v3',
        text: 'natural language processing',
        vector: [0.8, 0.9, 1.0],
        dimensions: 3,
        model: 'test',
        timestamp: new Date()
      }
    ];

    queryVector = {
      id: 'query',
      text: 'artificial intelligence',
      vector: [0.15, 0.25, 0.35],
      dimensions: 3,
      model: 'test',
      timestamp: new Date()
    };
  });

  describe('findSimilar', () => {
    it('finds similar vectors', () => {
      const results = SimilaritySearch.findSimilar(queryVector, mockVectors, 5, 0.0);
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(5);
      
      results.forEach((result, index) => {
        expect(result.vector).toBeDefined();
        expect(result.similarity).toBeGreaterThanOrEqual(0);
        expect(result.similarity).toBeLessThanOrEqual(1);
        expect(result.distance).toBeGreaterThanOrEqual(0);
        expect(result.rank).toBe(index + 1);
      });

      // Results should be sorted by similarity (descending)
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].similarity).toBeGreaterThanOrEqual(results[i].similarity);
      }
    });

    it('respects similarity threshold', () => {
      const results = SimilaritySearch.findSimilar(queryVector, mockVectors, 5, 0.99);
      
      // With high threshold, should return fewer or no results
      results.forEach(result => {
        expect(result.similarity).toBeGreaterThanOrEqual(0.99);
      });
    });

    it('limits number of results', () => {
      const results = SimilaritySearch.findSimilar(queryVector, mockVectors, 2, 0.0);
      
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('excludes query vector from results', () => {
      const vectorsWithQuery = [...mockVectors, queryVector];
      const results = SimilaritySearch.findSimilar(queryVector, vectorsWithQuery, 5, 0.0);
      
      expect(results.every(result => result.vector.id !== queryVector.id)).toBe(true);
    });
  });

  describe('semanticSearch', () => {
    it('performs text-based semantic search', () => {
      const results = SimilaritySearch.semanticSearch('machine learning', mockVectors, 5, 0.0);
      
      expect(results.length).toBeGreaterThan(0);
      
      results.forEach(result => {
        expect(result.vector).toBeDefined();
        expect(result.similarity).toBeGreaterThanOrEqual(0);
        expect(result.rank).toBeGreaterThan(0);
      });
    });

    it('finds exact text matches', () => {
      const results = SimilaritySearch.semanticSearch('machine learning algorithms', mockVectors, 5, 0.0);
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].similarity).toBe(1); // Exact match should have similarity 1
      expect(results[0].vector.text).toBe('machine learning algorithms');
    });

    it('handles case insensitivity', () => {
      const results = SimilaritySearch.semanticSearch('MACHINE LEARNING', mockVectors, 5, 0.0);
      
      expect(results.length).toBeGreaterThan(0);
    });
  });
});

describe('EmbeddingsVisualization', () => {
  let mockVectors: EmbeddingVector[];
  let mockParameters: VisualizationParameters;

  beforeEach(() => {
    mockVectors = [
      {
        id: 'v1',
        text: 'vector 1',
        vector: [1, 2, 3, 4, 5],
        dimensions: 5,
        model: 'test',
        timestamp: new Date()
      },
      {
        id: 'v2',
        text: 'vector 2',
        vector: [2, 3, 4, 5, 6],
        dimensions: 5,
        model: 'test',
        timestamp: new Date()
      },
      {
        id: 'v3',
        text: 'vector 3',
        vector: [6, 7, 8, 9, 10],
        dimensions: 5,
        model: 'test',
        timestamp: new Date()
      }
    ];

    mockParameters = {
      nComponents: 2,
      reductionMethod: 'pca',
      clusteringMethod: 'kmeans',
      numClusters: 2
    };
  });

  describe('createVisualization', () => {
    it('creates 2D visualization', async () => {
      const visualization = await EmbeddingsVisualization.createVisualization(mockVectors, mockParameters);
      
      expect(visualization.type).toBe('2d');
      expect(visualization.vectors).toEqual(mockVectors);
      expect(visualization.reducedDimensions).toHaveLength(3);
      expect(visualization.reducedDimensions[0]).toHaveLength(2);
      expect(visualization.clusters.length).toBeGreaterThan(0);
      expect(visualization.reductionMethod).toBe('pca');
      expect(visualization.parameters).toEqual(mockParameters);
    });

    it('creates 3D visualization', async () => {
      const params3D = { ...mockParameters, nComponents: 3 };
      const visualization = await EmbeddingsVisualization.createVisualization(mockVectors, params3D);
      
      expect(visualization.type).toBe('3d');
      expect(visualization.reducedDimensions[0]).toHaveLength(3);
    });

    it('performs different reduction methods', async () => {
      const paramstsne = { ...mockParameters, reductionMethod: 'tsne' as const };
      const visualization = await EmbeddingsVisualization.createVisualization(mockVectors, paramstsne);
      
      expect(visualization.reductionMethod).toBe('tsne');
    });

    it('performs different clustering methods', async () => {
      const paramsDBSCAN = { 
        ...mockParameters, 
        clusteringMethod: 'dbscan' as const,
        eps: 0.5,
        minSamples: 2
      };
      const visualization = await EmbeddingsVisualization.createVisualization(mockVectors, paramsDBSCAN);
      
      expect(visualization.clusters.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('updateVisualization', () => {
    it('updates existing visualization with new parameters', async () => {
      const originalVisualization = await EmbeddingsVisualization.createVisualization(mockVectors, mockParameters);
      
      const newParameters = { nComponents: 3 };
      const updatedVisualization = await EmbeddingsVisualization.updateVisualization(
        originalVisualization, 
        newParameters
      );
      
      expect(updatedVisualization.type).toBe('3d');
      expect(updatedVisualization.parameters.nComponents).toBe(3);
      expect(updatedVisualization.reducedDimensions[0]).toHaveLength(3);
    });
  });
});