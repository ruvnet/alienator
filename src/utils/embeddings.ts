/**
 * Embeddings Utilities
 * Mathematical operations and visualization helpers for embeddings
 */

import { 
  EmbeddingVector, 
  EmbeddingCluster, 
  EmbeddingVisualization,
  VisualizationParameters,
  SimilarityResult,
  EmbeddingDistance 
} from '../types/ai-models';

/**
 * Mathematical utilities for embeddings
 */
export class EmbeddingMath {
  /**
   * Calculate cosine similarity between two vectors
   */
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensionality');
    }

    const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Calculate Euclidean distance between two vectors
   */
  static euclideanDistance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensionality');
    }

    const squaredDifferences = a.map((ai, i) => Math.pow(ai - b[i], 2));
    return Math.sqrt(squaredDifferences.reduce((sum, diff) => sum + diff, 0));
  }

  /**
   * Calculate Manhattan distance between two vectors
   */
  static manhattanDistance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensionality');
    }

    return a.reduce((sum, ai, i) => sum + Math.abs(ai - b[i]), 0);
  }

  /**
   * Calculate dot product between two vectors
   */
  static dotProduct(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensionality');
    }

    return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  }

  /**
   * Normalize a vector to unit length
   */
  static normalize(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vector;
    return vector.map(val => val / magnitude);
  }

  /**
   * Calculate distance based on specified method
   */
  static calculateDistance(a: number[], b: number[], method: EmbeddingDistance): number {
    switch (method) {
      case 'cosine':
        return 1 - this.cosineSimilarity(a, b);
      case 'euclidean':
        return this.euclideanDistance(a, b);
      case 'manhattan':
        return this.manhattanDistance(a, b);
      case 'dot':
        return -this.dotProduct(a, b); // Negative for distance (higher dot product = closer)
      default:
        return this.euclideanDistance(a, b);
    }
  }
}

/**
 * Dimensionality reduction utilities
 */
export class DimensionalityReduction {
  /**
   * Simple PCA implementation for 2D/3D reduction
   */
  static async pca(vectors: number[][], targetDimensions: number = 2): Promise<number[][]> {
    const numVectors = vectors.length;
    const numDimensions = vectors[0].length;

    // Center the data
    const means = new Array(numDimensions).fill(0);
    vectors.forEach(vector => {
      vector.forEach((val, i) => {
        means[i] += val / numVectors;
      });
    });

    const centeredVectors = vectors.map(vector =>
      vector.map((val, i) => val - means[i])
    );

    // For simplicity, use random projection for now
    // In production, implement proper PCA with eigenvalue decomposition
    return this.randomProjection(centeredVectors, targetDimensions);
  }

  /**
   * Simplified t-SNE implementation
   * Note: This is a simplified version. For production, use a proper t-SNE library
   */
  static async tsne(
    vectors: number[][], 
    targetDimensions: number = 2,
    perplexity: number = 30,
    iterations: number = 1000
  ): Promise<number[][]> {
    // Simplified t-SNE using random initialization and basic gradient descent
    const numPoints = vectors.length;
    
    // Initialize random low-dimensional points
    const lowDimPoints = Array.from({ length: numPoints }, () =>
      Array.from({ length: targetDimensions }, () => Math.random() * 2 - 1)
    );

    // For simplicity, return random projection
    // In production, implement proper t-SNE algorithm
    return this.randomProjection(vectors, targetDimensions);
  }

  /**
   * Random projection for dimensionality reduction
   */
  static randomProjection(vectors: number[][], targetDimensions: number): number[][] {
    const sourceDimensions = vectors[0].length;
    
    // Create random projection matrix
    const projectionMatrix = Array.from({ length: sourceDimensions }, () =>
      Array.from({ length: targetDimensions }, () => Math.random() * 2 - 1)
    );

    // Apply projection
    return vectors.map(vector => {
      const projected = new Array(targetDimensions).fill(0);
      for (let i = 0; i < targetDimensions; i++) {
        for (let j = 0; j < sourceDimensions; j++) {
          projected[i] += vector[j] * projectionMatrix[j][i];
        }
      }
      return projected;
    });
  }
}

/**
 * Clustering utilities
 */
export class ClusteringAlgorithms {
  /**
   * K-means clustering
   */
  static kmeans(
    vectors: EmbeddingVector[], 
    k: number, 
    maxIterations: number = 100
  ): EmbeddingCluster[] {
    const points = vectors.map(v => v.vector);
    const dimensions = points[0].length;

    // Initialize centroids randomly
    let centroids = Array.from({ length: k }, () =>
      Array.from({ length: dimensions }, () => Math.random() * 2 - 1)
    );

    let assignments = new Array(points.length).fill(0);
    let previousAssignments = new Array(points.length).fill(-1);

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      // Assign points to nearest centroid
      for (let i = 0; i < points.length; i++) {
        let minDistance = Infinity;
        let bestCluster = 0;

        for (let j = 0; j < k; j++) {
          const distance = EmbeddingMath.euclideanDistance(points[i], centroids[j]);
          if (distance < minDistance) {
            minDistance = distance;
            bestCluster = j;
          }
        }

        assignments[i] = bestCluster;
      }

      // Check for convergence
      if (assignments.every((assignment, i) => assignment === previousAssignments[i])) {
        break;
      }

      previousAssignments = [...assignments];

      // Update centroids
      for (let j = 0; j < k; j++) {
        const clusterPoints = points.filter((_, i) => assignments[i] === j);
        if (clusterPoints.length > 0) {
          for (let d = 0; d < dimensions; d++) {
            centroids[j][d] = clusterPoints.reduce((sum, point) => sum + point[d], 0) / clusterPoints.length;
          }
        }
      }
    }

    // Create clusters
    const clusters: EmbeddingCluster[] = [];
    const colors = this.generateColors(k);

    for (let j = 0; j < k; j++) {
      const clusterVectors = vectors.filter((_, i) => assignments[i] === j);
      const cohesion = this.calculateCohesion(clusterVectors.map(v => v.vector), centroids[j]);

      clusters.push({
        id: `cluster-${j}`,
        centroid: centroids[j],
        points: clusterVectors,
        label: `Cluster ${j + 1}`,
        size: clusterVectors.length,
        cohesion,
        color: colors[j]
      });
    }

    return clusters;
  }

  /**
   * DBSCAN clustering
   */
  static dbscan(
    vectors: EmbeddingVector[], 
    eps: number = 0.5, 
    minSamples: number = 5
  ): EmbeddingCluster[] {
    const points = vectors.map(v => v.vector);
    const visited = new Array(points.length).fill(false);
    const clusters: EmbeddingCluster[] = [];
    const noise: EmbeddingVector[] = [];
    const colors = this.generateColors(Math.ceil(points.length / 10)); // Estimate cluster count

    let clusterIndex = 0;

    for (let i = 0; i < points.length; i++) {
      if (visited[i]) continue;

      visited[i] = true;
      const neighbors = this.regionQuery(points, i, eps);

      if (neighbors.length < minSamples) {
        noise.push(vectors[i]);
      } else {
        const clusterVectors = this.expandCluster(points, vectors, i, neighbors, visited, eps, minSamples);
        const centroid = this.calculateCentroid(clusterVectors.map(v => v.vector));
        const cohesion = this.calculateCohesion(clusterVectors.map(v => v.vector), centroid);

        clusters.push({
          id: `cluster-${clusterIndex}`,
          centroid,
          points: clusterVectors,
          label: `Cluster ${clusterIndex + 1}`,
          size: clusterVectors.length,
          cohesion,
          color: colors[clusterIndex % colors.length]
        });

        clusterIndex++;
      }
    }

    // Add noise as a separate cluster if it exists
    if (noise.length > 0) {
      clusters.push({
        id: 'noise',
        centroid: this.calculateCentroid(noise.map(v => v.vector)),
        points: noise,
        label: 'Noise',
        size: noise.length,
        cohesion: 0,
        color: '#999999'
      });
    }

    return clusters;
  }

  /**
   * Find neighbors within epsilon distance
   */
  private static regionQuery(points: number[][], pointIndex: number, eps: number): number[] {
    const neighbors: number[] = [];
    const currentPoint = points[pointIndex];

    for (let i = 0; i < points.length; i++) {
      if (EmbeddingMath.euclideanDistance(currentPoint, points[i]) <= eps) {
        neighbors.push(i);
      }
    }

    return neighbors;
  }

  /**
   * Expand cluster for DBSCAN
   */
  private static expandCluster(
    points: number[][],
    vectors: EmbeddingVector[],
    pointIndex: number,
    neighbors: number[],
    visited: boolean[],
    eps: number,
    minSamples: number
  ): EmbeddingVector[] {
    const cluster: EmbeddingVector[] = [vectors[pointIndex]];
    let i = 0;

    while (i < neighbors.length) {
      const neighborIndex = neighbors[i];

      if (!visited[neighborIndex]) {
        visited[neighborIndex] = true;
        const neighborNeighbors = this.regionQuery(points, neighborIndex, eps);

        if (neighborNeighbors.length >= minSamples) {
          neighbors.push(...neighborNeighbors);
        }
      }

      // Add to cluster if not already in another cluster
      if (!cluster.some(v => v.id === vectors[neighborIndex].id)) {
        cluster.push(vectors[neighborIndex]);
      }

      i++;
    }

    return cluster;
  }

  /**
   * Calculate centroid of vectors
   */
  private static calculateCentroid(vectors: number[][]): number[] {
    if (vectors.length === 0) return [];

    const dimensions = vectors[0].length;
    const centroid = new Array(dimensions).fill(0);

    vectors.forEach(vector => {
      vector.forEach((val, i) => {
        centroid[i] += val / vectors.length;
      });
    });

    return centroid;
  }

  /**
   * Calculate cluster cohesion (average distance to centroid)
   */
  private static calculateCohesion(vectors: number[][], centroid: number[]): number {
    if (vectors.length === 0) return 0;

    const totalDistance = vectors.reduce((sum, vector) => {
      return sum + EmbeddingMath.euclideanDistance(vector, centroid);
    }, 0);

    return 1 / (1 + totalDistance / vectors.length); // Normalize to 0-1 range
  }

  /**
   * Generate distinct colors for clusters
   */
  private static generateColors(count: number): string[] {
    const colors: string[] = [];
    const hueStep = 360 / count;

    for (let i = 0; i < count; i++) {
      const hue = i * hueStep;
      const saturation = 70 + (i % 3) * 10; // Vary saturation
      const lightness = 50 + (i % 2) * 20; // Vary lightness
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  }
}

/**
 * Similarity search utilities
 */
export class SimilaritySearch {
  /**
   * Find most similar vectors to a query
   */
  static findSimilar(
    queryVector: EmbeddingVector,
    vectors: EmbeddingVector[],
    maxResults: number = 10,
    threshold: number = 0.7,
    distanceMethod: EmbeddingDistance = 'cosine'
  ): SimilarityResult[] {
    const similarities: SimilarityResult[] = [];

    vectors.forEach(vector => {
      if (vector.id === queryVector.id) return; // Skip self

      const distance = EmbeddingMath.calculateDistance(
        queryVector.vector,
        vector.vector,
        distanceMethod
      );

      // Convert distance to similarity (0-1 range)
      const similarity = distanceMethod === 'cosine' 
        ? 1 - distance 
        : 1 / (1 + distance);

      if (similarity >= threshold) {
        similarities.push({
          vector,
          similarity,
          distance,
          rank: 0 // Will be set after sorting
        });
      }
    });

    // Sort by similarity (descending) and add ranks
    similarities.sort((a, b) => b.similarity - a.similarity);
    similarities.forEach((result, index) => {
      result.rank = index + 1;
    });

    return similarities.slice(0, maxResults);
  }

  /**
   * Semantic search with text preprocessing
   */
  static semanticSearch(
    query: string,
    vectors: EmbeddingVector[],
    maxResults: number = 10,
    threshold: number = 0.7
  ): SimilarityResult[] {
    // For text-based search, you would first need to generate embeddings for the query
    // This is a simplified version that searches by text similarity
    const queryLower = query.toLowerCase();
    const results: SimilarityResult[] = [];

    vectors.forEach(vector => {
      const textSimilarity = this.calculateTextSimilarity(queryLower, vector.text.toLowerCase());
      
      if (textSimilarity >= threshold) {
        results.push({
          vector,
          similarity: textSimilarity,
          distance: 1 - textSimilarity,
          rank: 0
        });
      }
    });

    results.sort((a, b) => b.similarity - a.similarity);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return results.slice(0, maxResults);
  }

  /**
   * Simple text similarity calculation
   */
  private static calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }
}

/**
 * Main embeddings visualization utility class
 */
export class EmbeddingsVisualization {
  /**
   * Create visualization data for embeddings
   */
  static async createVisualization(
    vectors: EmbeddingVector[],
    parameters: VisualizationParameters
  ): Promise<EmbeddingVisualization> {
    // Reduce dimensionality
    const vectorData = vectors.map(v => v.vector);
    let reducedDimensions: number[][];

    switch (parameters.reductionMethod) {
      case 'pca':
        reducedDimensions = await DimensionalityReduction.pca(vectorData, parameters.nComponents);
        break;
      case 'tsne':
        reducedDimensions = await DimensionalityReduction.tsne(
          vectorData, 
          parameters.nComponents,
          parameters.perplexity || 30
        );
        break;
      case 'umap':
        // Simplified UMAP - in production, use proper UMAP implementation
        reducedDimensions = await DimensionalityReduction.pca(vectorData, parameters.nComponents);
        break;
      default:
        reducedDimensions = await DimensionalityReduction.pca(vectorData, parameters.nComponents);
    }

    // Perform clustering
    let clusters: EmbeddingCluster[];

    switch (parameters.clusteringMethod) {
      case 'kmeans':
        clusters = ClusteringAlgorithms.kmeans(vectors, parameters.numClusters || 5);
        break;
      case 'dbscan':
        clusters = ClusteringAlgorithms.dbscan(
          vectors, 
          parameters.eps || 0.5, 
          parameters.minSamples || 5
        );
        break;
      case 'hierarchical':
        // Simplified hierarchical clustering - use k-means as fallback
        clusters = ClusteringAlgorithms.kmeans(vectors, parameters.numClusters || 5);
        break;
      default:
        clusters = ClusteringAlgorithms.kmeans(vectors, parameters.numClusters || 5);
    }

    return {
      type: parameters.nComponents === 3 ? '3d' : '2d',
      vectors,
      clusters,
      reducedDimensions,
      reductionMethod: parameters.reductionMethod,
      parameters
    };
  }

  /**
   * Update visualization with new parameters
   */
  static async updateVisualization(
    currentVisualization: EmbeddingVisualization,
    newParameters: Partial<VisualizationParameters>
  ): Promise<EmbeddingVisualization> {
    const updatedParameters = { ...currentVisualization.parameters, ...newParameters };
    return this.createVisualization(currentVisualization.vectors, updatedParameters);
  }
}

// Export utility functions
export const embeddingUtils = {
  math: EmbeddingMath,
  dimensionalityReduction: DimensionalityReduction,
  clustering: ClusteringAlgorithms,
  similarity: SimilaritySearch,
  visualization: EmbeddingsVisualization
};