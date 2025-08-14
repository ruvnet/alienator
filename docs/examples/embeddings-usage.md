# Embeddings Visualization Usage Guide

## Overview

The Embeddings Visualization component provides interactive 2D and 3D visualization of semantic embeddings with clustering, similarity analysis, and dimensional reduction. This guide demonstrates comprehensive usage patterns.

## Basic Usage

### Simple Implementation

```tsx
import React from 'react';
import EmbeddingsVisualization from '../components/EmbeddingsVisualization';

function App() {
  return (
    <div>
      <EmbeddingsVisualization />
    </div>
  );
}
```

### With Initial Data

```tsx
import React from 'react';
import EmbeddingsVisualization from '../components/EmbeddingsVisualization';

function EmbeddingsPage() {
  const initialVectors = [
    {
      id: 'v1',
      text: 'Machine learning is a subset of artificial intelligence',
      vector: [0.1, 0.2, 0.3, 0.4, 0.5],
      dimensions: 5,
      model: 'text-embedding-3-small',
      timestamp: new Date(),
      metadata: { source: 'textbook' }
    },
    {
      id: 'v2',
      text: 'Deep learning uses neural networks with multiple layers',
      vector: [0.2, 0.3, 0.4, 0.5, 0.6],
      dimensions: 5,
      model: 'text-embedding-3-small',
      timestamp: new Date(),
      metadata: { source: 'research_paper' }
    }
  ];

  const handleVectorSelect = (vector) => {
    console.log('Selected vector:', vector);
  };

  const handleClusterSelect = (cluster) => {
    console.log('Selected cluster:', cluster);
  };

  return (
    <EmbeddingsVisualization
      initialVectors={initialVectors}
      onVectorSelect={handleVectorSelect}
      onClusterSelect={handleClusterSelect}
    />
  );
}
```

## Working with Embeddings

### Generating Embeddings

```tsx
import { useEmbeddings } from '../hooks/useEmbeddings';

function EmbeddingGenerator() {
  const { vectors, addEmbedding, addBatchEmbeddings } = useEmbeddings();

  const generateSingleEmbedding = async () => {
    try {
      const embedding = await addEmbedding(
        'Natural language processing enables computers to understand text',
        'text-embedding-3-large'
      );
      console.log('Generated embedding:', embedding);
    } catch (error) {
      console.error('Failed to generate embedding:', error);
    }
  };

  const generateBatchEmbeddings = async () => {
    const texts = [
      'Artificial intelligence is transforming technology',
      'Machine learning algorithms learn from data',
      'Deep learning mimics human neural networks',
      'Computer vision enables machines to see',
      'Natural language processing understands human language'
    ];

    try {
      const embeddings = await addBatchEmbeddings(texts, 'text-embedding-3-small');
      console.log('Generated batch embeddings:', embeddings);
    } catch (error) {
      console.error('Failed to generate batch embeddings:', error);
    }
  };

  return (
    <div>
      <button onClick={generateSingleEmbedding}>
        Generate Single Embedding
      </button>
      <button onClick={generateBatchEmbeddings}>
        Generate Batch Embeddings
      </button>
      
      <p>Total vectors: {vectors.length}</p>
      
      <EmbeddingsVisualization initialVectors={vectors} />
    </div>
  );
}
```

### Custom Embedding Workflow

```tsx
import { useEmbeddingsWorkflow } from '../hooks/useEmbeddings';

function CustomEmbeddingWorkflow() {
  const { createCompleteVisualization } = useEmbeddingsWorkflow();

  const processTextCollection = async (texts) => {
    const parameters = {
      nComponents: 3, // 3D visualization
      reductionMethod: 'tsne',
      clusteringMethod: 'dbscan',
      eps: 0.5,
      minSamples: 3
    };

    try {
      const visualization = await createCompleteVisualization(
        texts,
        'text-embedding-3-large',
        parameters
      );
      console.log('Complete visualization created:', visualization);
    } catch (error) {
      console.error('Workflow failed:', error);
    }
  };

  return (
    <div>
      <button onClick={() => processTextCollection([
        'Scientific research papers',
        'Technical documentation',
        'User manuals and guides',
        'Marketing content',
        'Social media posts'
      ])}>
        Process Text Collection
      </button>
    </div>
  );
}
```

## Visualization Configuration

### Using Hooks Directly

```tsx
import { useEmbeddingsVisualization } from '../hooks/useEmbeddings';

function CustomVisualizationControls() {
  const {
    visualizationType,
    viewSettings,
    currentVisualization,
    createVisualization,
    updateVisualization,
    toggleVisualizationType,
    updateViewSettings
  } = useEmbeddingsVisualization();

  const handleCreateVisualization = async (vectors) => {
    const parameters = {
      nComponents: visualizationType === '3d' ? 3 : 2,
      reductionMethod: 'pca',
      clusteringMethod: 'kmeans',
      numClusters: 5,
      perplexity: 30, // for t-SNE
      learningRate: 200 // for t-SNE
    };

    await createVisualization(vectors, parameters);
  };

  const handleUpdateReductionMethod = async (method) => {
    if (currentVisualization) {
      await updateVisualization({ reductionMethod: method });
    }
  };

  const handleUpdateClustering = async (method, params) => {
    if (currentVisualization) {
      await updateVisualization({
        clusteringMethod: method,
        ...params
      });
    }
  };

  return (
    <div>
      <div>
        <label>
          Visualization Type:
          <select onChange={() => toggleVisualizationType()}>
            <option value="2d" selected={visualizationType === '2d'}>2D</option>
            <option value="3d" selected={visualizationType === '3d'}>3D</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Point Size:
          <input
            type="range"
            min="1"
            max="20"
            value={viewSettings.pointSize}
            onChange={(e) => updateViewSettings({ pointSize: parseInt(e.target.value) })}
          />
        </label>
      </div>

      <div>
        <label>
          Show Labels:
          <input
            type="checkbox"
            checked={viewSettings.showLabels}
            onChange={(e) => updateViewSettings({ showLabels: e.target.checked })}
          />
        </label>
      </div>

      <div>
        <label>
          Show Clusters:
          <input
            type="checkbox"
            checked={viewSettings.showClusters}
            onChange={(e) => updateViewSettings({ showClusters: e.target.checked })}
          />
        </label>
      </div>

      <div>
        <button onClick={() => handleUpdateReductionMethod('pca')}>
          Use PCA
        </button>
        <button onClick={() => handleUpdateReductionMethod('tsne')}>
          Use t-SNE
        </button>
        <button onClick={() => handleUpdateReductionMethod('umap')}>
          Use UMAP
        </button>
      </div>

      <div>
        <button onClick={() => handleUpdateClustering('kmeans', { numClusters: 5 })}>
          K-Means (5 clusters)
        </button>
        <button onClick={() => handleUpdateClustering('dbscan', { eps: 0.5, minSamples: 3 })}>
          DBSCAN
        </button>
      </div>
    </div>
  );
}
```

### Advanced Clustering

```tsx
import { useClustering } from '../hooks/useEmbeddings';

function AdvancedClustering() {
  const { clusters, performClustering, getClusterStats } = useClustering();

  const runKMeansClustering = async (vectors) => {
    const clusters = await performClustering(vectors, 'kmeans', {
      k: 5,
      maxIterations: 100
    });
    console.log('K-means clusters:', clusters);
  };

  const runDBSCANClustering = async (vectors) => {
    const clusters = await performClustering(vectors, 'dbscan', {
      eps: 0.5,        // Maximum distance between points in same cluster
      minSamples: 3    // Minimum points required to form cluster
    });
    console.log('DBSCAN clusters:', clusters);
  };

  const analyzeClusterQuality = () => {
    const stats = getClusterStats();
    if (stats) {
      console.log('Cluster Analysis:');
      console.log(`Total clusters: ${stats.totalClusters}`);
      console.log(`Average cluster size: ${stats.averageSize.toFixed(1)}`);
      console.log(`Largest cluster: ${stats.largestCluster} points`);
      console.log(`Smallest cluster: ${stats.smallestCluster} points`);
      console.log(`Average cohesion: ${(stats.averageCohesion * 100).toFixed(1)}%`);
    }
  };

  return (
    <div>
      <h3>Clustering Analysis</h3>
      <button onClick={analyzeClusterQuality}>
        Analyze Cluster Quality
      </button>
      
      {clusters.map(cluster => (
        <div key={cluster.id} style={{ borderLeft: `4px solid ${cluster.color}` }}>
          <h4>{cluster.label}</h4>
          <p>Size: {cluster.size} points</p>
          <p>Cohesion: {(cluster.cohesion * 100).toFixed(1)}%</p>
          <details>
            <summary>Points in cluster</summary>
            <ul>
              {cluster.points.map(point => (
                <li key={point.id}>
                  {point.text.substring(0, 50)}...
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}
```

## Similarity Search

### Basic Similarity Search

```tsx
import { useSimilaritySearch } from '../hooks/useEmbeddings';

function SimilaritySearchExample() {
  const { searchResults, search, searchByText } = useSimilaritySearch();

  const handleVectorSimilaritySearch = async (queryVector, allVectors) => {
    const results = await search(queryVector, allVectors, {
      maxResults: 10,
      threshold: 0.7,
      distanceMethod: 'cosine'
    });
    console.log('Similar vectors:', results);
  };

  const handleTextSimilaritySearch = async (query, allVectors) => {
    const results = await searchByText(query, allVectors, {
      maxResults: 5,
      threshold: 0.5
    });
    console.log('Text search results:', results);
  };

  return (
    <div>
      <h3>Similarity Search Results</h3>
      {searchResults.map((result, index) => (
        <div key={result.vector.id} className="search-result">
          <div className="rank">#{result.rank}</div>
          <div className="similarity">{(result.similarity * 100).toFixed(1)}%</div>
          <div className="text">{result.vector.text}</div>
          <div className="distance">Distance: {result.distance.toFixed(4)}</div>
        </div>
      ))}
    </div>
  );
}
```

### Advanced Search Features

```tsx
function AdvancedSimilaritySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOptions, setSearchOptions] = useState({
    maxResults: 10,
    threshold: 0.7,
    distanceMethod: 'cosine'
  });

  const performSearch = async () => {
    // Implementation depends on your data source
    const vectors = await loadEmbeddingVectors();
    
    if (searchQuery) {
      const results = await searchByText(searchQuery, vectors, searchOptions);
      
      // Process results
      const enhancedResults = results.map(result => ({
        ...result,
        relevanceScore: calculateRelevanceScore(result),
        category: categorizeVector(result.vector),
        snippet: generateSnippet(result.vector.text, searchQuery)
      }));
      
      console.log('Enhanced search results:', enhancedResults);
    }
  };

  const calculateRelevanceScore = (result) => {
    // Combine similarity with other factors
    return result.similarity * 0.7 + 
           (1 / (result.rank + 1)) * 0.2 + 
           textMatchScore(result.vector.text, searchQuery) * 0.1;
  };

  const categorizeVector = (vector) => {
    // Categorize based on metadata or content analysis
    if (vector.metadata?.category) {
      return vector.metadata.category;
    }
    
    // Simple keyword-based categorization
    const text = vector.text.toLowerCase();
    if (text.includes('machine learning') || text.includes('neural network')) {
      return 'ml';
    } else if (text.includes('data science') || text.includes('analytics')) {
      return 'data';
    }
    return 'general';
  };

  const generateSnippet = (text, query) => {
    // Generate highlighted snippet around search terms
    const words = query.toLowerCase().split(' ');
    const textLower = text.toLowerCase();
    
    for (const word of words) {
      const index = textLower.indexOf(word);
      if (index !== -1) {
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + word.length + 50);
        return text.substring(start, end);
      }
    }
    
    return text.substring(0, 100) + '...';
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search embeddings..."
      />
      
      <div>
        <label>
          Max Results:
          <input
            type="number"
            value={searchOptions.maxResults}
            onChange={(e) => setSearchOptions(prev => ({
              ...prev,
              maxResults: parseInt(e.target.value)
            }))}
          />
        </label>
      </div>
      
      <div>
        <label>
          Threshold:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={searchOptions.threshold}
            onChange={(e) => setSearchOptions(prev => ({
              ...prev,
              threshold: parseFloat(e.target.value)
            }))}
          />
          {searchOptions.threshold}
        </label>
      </div>
      
      <div>
        <label>
          Distance Method:
          <select
            value={searchOptions.distanceMethod}
            onChange={(e) => setSearchOptions(prev => ({
              ...prev,
              distanceMethod: e.target.value
            }))}
          >
            <option value="cosine">Cosine</option>
            <option value="euclidean">Euclidean</option>
            <option value="manhattan">Manhattan</option>
            <option value="dot">Dot Product</option>
          </select>
        </label>
      </div>
      
      <button onClick={performSearch}>Search</button>
    </div>
  );
}
```

## 3D Visualization Customization

### Custom 3D Scene

```tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

function Custom3DVisualization({ vectors, clusters }) {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      
      <CustomScene vectors={vectors} clusters={clusters} />
      
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
}

function CustomScene({ vectors, clusters }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    // Add animation if desired
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {vectors.map((vector, index) => {
        const cluster = clusters.find(c => 
          c.points.some(p => p.id === vector.id)
        );
        
        return (
          <VectorPoint
            key={vector.id}
            position={[
              vector.reducedPosition[0],
              vector.reducedPosition[1], 
              vector.reducedPosition[2]
            ]}
            color={cluster?.color || '#888888'}
            scale={vector.importance || 1}
            label={vector.text.substring(0, 20)}
          />
        );
      })}
      
      {clusters.map(cluster => (
        <ClusterBoundary
          key={cluster.id}
          points={cluster.points}
          color={cluster.color}
          label={cluster.label}
        />
      ))}
    </group>
  );
}

function VectorPoint({ position, color, scale, label }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <mesh
        scale={hovered ? scale * 1.2 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {hovered && (
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

function ClusterBoundary({ points, color, label }) {
  if (points.length === 0) return null;
  
  // Calculate bounding sphere
  const center = points.reduce(
    (acc, point) => [
      acc[0] + point.reducedPosition[0],
      acc[1] + point.reducedPosition[1],
      acc[2] + point.reducedPosition[2]
    ],
    [0, 0, 0]
  ).map(coord => coord / points.length);
  
  const radius = Math.max(...points.map(point => 
    Math.sqrt(
      Math.pow(point.reducedPosition[0] - center[0], 2) +
      Math.pow(point.reducedPosition[1] - center[1], 2) +
      Math.pow(point.reducedPosition[2] - center[2], 2)
    )
  )) + 0.2;
  
  return (
    <group position={center}>
      <mesh>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.1} 
          wireframe 
        />
      </mesh>
      
      <Text
        position={[0, radius + 0.2, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}
```

## Data Import/Export

### Import Embeddings

```tsx
function EmbeddingImporter() {
  const { importEmbeddings } = useEmbeddings();

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const vectors = data.map(item => ({
            id: item.id || `imported-${Date.now()}-${Math.random()}`,
            text: item.text,
            vector: item.vector || item.embedding,
            dimensions: item.vector?.length || item.embedding?.length,
            model: item.model || 'imported',
            timestamp: new Date(item.timestamp || Date.now()),
            metadata: item.metadata || {}
          }));
          
          importEmbeddings(vectors);
          console.log(`Imported ${vectors.length} embeddings`);
        } catch (error) {
          console.error('Failed to import embeddings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCSVImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          
          const vectors = lines.slice(1).map((line, index) => {
            const values = line.split(',');
            const textIndex = headers.indexOf('text');
            const vectorIndex = headers.indexOf('vector');
            
            return {
              id: `csv-${index}`,
              text: values[textIndex],
              vector: JSON.parse(values[vectorIndex]),
              dimensions: JSON.parse(values[vectorIndex]).length,
              model: 'csv-import',
              timestamp: new Date(),
              metadata: { source: 'csv' }
            };
          });
          
          importEmbeddings(vectors);
          console.log(`Imported ${vectors.length} embeddings from CSV`);
        } catch (error) {
          console.error('Failed to import CSV:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <div>
        <label>
          Import JSON:
          <input type="file" accept=".json" onChange={handleFileImport} />
        </label>
      </div>
      
      <div>
        <label>
          Import CSV:
          <input type="file" accept=".csv" onChange={handleCSVImport} />
        </label>
      </div>
    </div>
  );
}
```

### Export Embeddings

```tsx
function EmbeddingExporter() {
  const { vectors } = useEmbeddings();
  const { currentVisualization } = useEmbeddingsVisualization();

  const exportAsJSON = () => {
    const data = JSON.stringify(vectors, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `embeddings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    const headers = ['id', 'text', 'vector', 'model', 'timestamp'];
    const csvContent = [
      headers.join(','),
      ...vectors.map(vector => [
        vector.id,
        `"${vector.text.replace(/"/g, '""')}"`,
        `"${JSON.stringify(vector.vector)}"`,
        vector.model,
        vector.timestamp.toISOString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `embeddings-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const exportVisualization = () => {
    if (!currentVisualization) return;
    
    const exportData = {
      vectors: currentVisualization.vectors,
      clusters: currentVisualization.clusters,
      reducedDimensions: currentVisualization.reducedDimensions,
      parameters: currentVisualization.parameters,
      metadata: {
        exportDate: new Date().toISOString(),
        type: currentVisualization.type,
        reductionMethod: currentVisualization.reductionMethod
      }
    };
    
    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `visualization-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={exportAsJSON}>Export as JSON</button>
      <button onClick={exportAsCSV}>Export as CSV</button>
      <button onClick={exportVisualization}>Export Visualization</button>
    </div>
  );
}
```

## Integration with Other Components

### Combined with Cross-Model Comparison

```tsx
function IntegratedAnalysis() {
  const [selectedText, setSelectedText] = useState('');
  const { vectors, addEmbedding } = useEmbeddings();

  const handleComparisonComplete = async (comparisonResult) => {
    // Generate embeddings for each model response
    const embeddingPromises = comparisonResult.responses.map(async (response) => {
      return await addEmbedding(response.response, 'text-embedding-3-small');
    });
    
    const embeddings = await Promise.all(embeddingPromises);
    console.log('Generated embeddings for comparison responses:', embeddings);
  };

  const handleVectorSelect = (vector) => {
    setSelectedText(vector.text);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <h2>Cross-Model Comparison</h2>
        <CrossModelComparison
          defaultPrompt={selectedText}
          onComparisonComplete={handleComparisonComplete}
        />
      </div>
      
      <div>
        <h2>Embeddings Visualization</h2>
        <EmbeddingsVisualization
          initialVectors={vectors}
          onVectorSelect={handleVectorSelect}
        />
      </div>
    </div>
  );
}
```

This comprehensive guide covers all aspects of using the Embeddings Visualization component, from basic usage to advanced customization and integration patterns.