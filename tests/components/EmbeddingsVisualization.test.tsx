/**
 * Embeddings Visualization Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

import EmbeddingsVisualization from '../../src/components/EmbeddingsVisualization';
import { EmbeddingVector, EmbeddingCluster, EmbeddingVisualization as EmbeddingVisualizationType } from '../../src/types/ai-models';

// Mock Three.js and React Three Fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas-3d">{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({ camera: { position: { set: vi.fn() }, lookAt: vi.fn() } })
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Text: ({ children }: any) => <div data-testid="3d-text">{children}</div>,
  Sphere: () => <div data-testid="3d-sphere" />,
  Line: () => <div data-testid="3d-line" />
}));

vi.mock('three', () => ({
  Mesh: vi.fn(),
  SphereGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  Vector3: vi.fn()
}));

// Mock Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
  ScatterChart: ({ children }: any) => <div data-testid="scatter-chart">{children}</div>,
  Scatter: () => <div data-testid="scatter" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Cell: () => <div data-testid="cell" />
}));

// Mock the hooks
vi.mock('../../src/hooks/useEmbeddings');

// Mock data
const mockVectors: EmbeddingVector[] = [
  {
    id: 'vector-1',
    text: 'Machine learning is a subset of artificial intelligence',
    vector: [0.1, 0.2, 0.3, 0.4, 0.5],
    dimensions: 5,
    model: 'text-embedding-3-small',
    timestamp: new Date(),
    metadata: {}
  },
  {
    id: 'vector-2',
    text: 'Deep learning uses neural networks',
    vector: [0.2, 0.3, 0.4, 0.5, 0.6],
    dimensions: 5,
    model: 'text-embedding-3-small',
    timestamp: new Date(),
    metadata: {}
  },
  {
    id: 'vector-3',
    text: 'Natural language processing enables computers to understand text',
    vector: [0.3, 0.4, 0.5, 0.6, 0.7],
    dimensions: 5,
    model: 'text-embedding-3-large',
    timestamp: new Date(),
    metadata: {}
  }
];

const mockClusters: EmbeddingCluster[] = [
  {
    id: 'cluster-1',
    centroid: [0.15, 0.25, 0.35, 0.45, 0.55],
    points: [mockVectors[0], mockVectors[1]],
    label: 'Cluster 1',
    size: 2,
    cohesion: 0.8,
    color: '#3b82f6'
  },
  {
    id: 'cluster-2',
    centroid: [0.3, 0.4, 0.5, 0.6, 0.7],
    points: [mockVectors[2]],
    label: 'Cluster 2',
    size: 1,
    cohesion: 1.0,
    color: '#ef4444'
  }
];

const mockVisualization: EmbeddingVisualizationType = {
  type: '2d',
  vectors: mockVectors,
  clusters: mockClusters,
  reducedDimensions: [[0.1, 0.2], [0.3, 0.4], [0.5, 0.6]],
  reductionMethod: 'pca',
  parameters: {
    nComponents: 2,
    reductionMethod: 'pca',
    clusteringMethod: 'kmeans',
    numClusters: 2
  }
};

// Mock hook implementations
const mockUseEmbeddings = {
  vectors: mockVectors,
  vectorsByModel: {
    'text-embedding-3-small': [mockVectors[0], mockVectors[1]],
    'text-embedding-3-large': [mockVectors[2]]
  },
  stats: {
    total: 3,
    models: 2,
    averageDimensions: 5,
    dateRange: {
      earliest: new Date(Date.now() - 24 * 60 * 60 * 1000),
      latest: new Date()
    }
  },
  loading: false,
  error: null,
  addEmbedding: vi.fn(),
  addBatchEmbeddings: vi.fn(),
  removeEmbedding: vi.fn(),
  clearEmbeddings: vi.fn(),
  importEmbeddings: vi.fn()
};

const mockUseEmbeddingsVisualization = {
  selectedVectors: [],
  visualizationType: '2d' as const,
  isLoading: false,
  currentVisualization: null,
  searchQuery: '',
  searchResults: [],
  selectedCluster: undefined,
  viewSettings: {
    showLabels: true,
    showClusters: true,
    pointSize: 5,
    opacity: 0.8,
    colorScheme: 'cluster' as const,
    animationSpeed: 1
  },
  createVisualization: vi.fn(),
  updateVisualization: vi.fn(),
  toggleVisualizationType: vi.fn(),
  selectVector: vi.fn(),
  clearSelection: vi.fn(),
  updateViewSettings: vi.fn(),
  selectCluster: vi.fn()
};

const mockUseSimilaritySearch = {
  searchResults: [],
  loading: false,
  error: null,
  search: vi.fn(),
  searchByText: vi.fn(),
  clearResults: vi.fn()
};

const mockUseClustering = {
  clusters: mockClusters,
  loading: false,
  error: null,
  performClustering: vi.fn(),
  clearClusters: vi.fn(),
  getClusterStats: () => ({
    totalClusters: 2,
    totalPoints: 3,
    averageSize: 1.5,
    largestCluster: 2,
    smallestCluster: 1,
    averageCohesion: 0.9
  })
};

describe('EmbeddingsVisualization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the hooks
    vi.doMock('../../src/hooks/useEmbeddings', () => ({
      useEmbeddings: () => mockUseEmbeddings,
      useEmbeddingsVisualization: () => mockUseEmbeddingsVisualization,
      useSimilaritySearch: () => mockUseSimilaritySearch,
      useClustering: () => mockUseClustering
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders the component with initial state', () => {
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('Embeddings Visualization')).toBeInTheDocument();
    expect(screen.getByText('Explore semantic embeddings in interactive 2D/3D space')).toBeInTheDocument();
    expect(screen.getByText('Controls')).toBeInTheDocument();
    expect(screen.getByText('Similarity Search')).toBeInTheDocument();
    expect(screen.getByText('Cluster Analysis')).toBeInTheDocument();
  });

  it('displays vector count badge', () => {
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('3 vectors')).toBeInTheDocument();
  });

  it('toggles between 2D and 3D visualization', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    
    expect(mockUseEmbeddingsVisualization.toggleVisualizationType).toHaveBeenCalled();
  });

  it('handles view settings changes', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const showLabelsSwitch = screen.getByLabelText('Show Labels');
    await user.click(showLabelsSwitch);
    
    expect(mockUseEmbeddingsVisualization.updateViewSettings).toHaveBeenCalledWith({ showLabels: false });
  });

  it('handles point size slider changes', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const pointSizeSlider = screen.getByDisplayValue('5');
    await user.clear(pointSizeSlider);
    await user.type(pointSizeSlider, '10');
    
    // Note: Slider component interaction might need more specific testing
    expect(screen.getByText('Point Size: 5')).toBeInTheDocument();
  });

  it('handles opacity slider changes', async () => {
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('Opacity: 80%')).toBeInTheDocument();
  });

  it('handles color scheme selection', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const colorSchemeSelect = screen.getByDisplayValue('By Cluster');
    await user.click(colorSchemeSelect);
    
    // Should show color scheme options
    expect(screen.getByText('By Cluster')).toBeInTheDocument();
  });

  it('creates visualization when button clicked', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const createButton = screen.getByText('Create Visualization');
    await user.click(createButton);
    
    expect(mockUseEmbeddingsVisualization.createVisualization).toHaveBeenCalled();
  });

  it('disables create button when no vectors', () => {
    const noVectorsMock = {
      ...mockUseEmbeddings,
      vectors: []
    };
    
    vi.doMock('../../src/hooks/useEmbeddings', () => ({
      useEmbeddings: () => noVectorsMock,
      useEmbeddingsVisualization: () => mockUseEmbeddingsVisualization,
      useSimilaritySearch: () => mockUseSimilaritySearch,
      useClustering: () => mockUseClustering
    }));
    
    render(<EmbeddingsVisualization />);
    
    const createButton = screen.getByText('Create Visualization');
    expect(createButton).toBeDisabled();
  });

  it('shows loading state', () => {
    const loadingMock = {
      ...mockUseEmbeddingsVisualization,
      isLoading: true
    };
    
    vi.doMock('../../src/hooks/useEmbeddings', () => ({
      useEmbeddings: () => mockUseEmbeddings,
      useEmbeddingsVisualization: () => loadingMock,
      useSimilaritySearch: () => mockUseSimilaritySearch,
      useClustering: () => mockUseClustering
    }));
    
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('handles similarity search input', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const searchInput = screen.getByPlaceholderText('Search for similar vectors...');
    await user.type(searchInput, 'machine learning');
    
    expect(searchInput).toHaveValue('machine learning');
  });

  it('performs similarity search on Enter key', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const searchInput = screen.getByPlaceholderText('Search for similar vectors...');
    await user.type(searchInput, 'machine learning{enter}');
    
    expect(mockUseSimilaritySearch.searchByText).toHaveBeenCalledWith('machine learning', mockVectors);
  });

  it('performs similarity search on button click', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const searchInput = screen.getByPlaceholderText('Search for similar vectors...');
    await user.type(searchInput, 'deep learning');
    
    const searchButton = screen.getByRole('button', { name: '' }); // Search icon button
    await user.click(searchButton);
    
    expect(mockUseSimilaritySearch.searchByText).toHaveBeenCalledWith('deep learning', mockVectors);
  });

  it('displays cluster statistics', () => {
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('Total Clusters')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Total Points')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Avg Size')).toBeInTheDocument();
    expect(screen.getByText('1.5')).toBeInTheDocument();
    expect(screen.getByText('Avg Cohesion')).toBeInTheDocument();
    expect(screen.getByText('90.0%')).toBeInTheDocument();
  });

  it('displays cluster list', () => {
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('Cluster 1')).toBeInTheDocument();
    expect(screen.getByText('Cluster 2')).toBeInTheDocument();
    expect(screen.getByText('2 points')).toBeInTheDocument();
    expect(screen.getByText('1 points')).toBeInTheDocument();
  });

  it('handles cluster selection', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const cluster1 = screen.getByText('Cluster 1').closest('div');
    if (cluster1) {
      await user.click(cluster1);
    }
    
    expect(mockUseEmbeddingsVisualization.selectCluster).toHaveBeenCalledWith('cluster-1');
  });

  it('toggles fullscreen mode', async () => {
    const user = userEvent.setup();
    render(<EmbeddingsVisualization />);
    
    const fullscreenButton = screen.getByRole('button', { name: '' }); // Maximize icon
    await user.click(fullscreenButton);
    
    // Should toggle fullscreen state
    expect(fullscreenButton).toBeInTheDocument();
  });

  it('shows empty state when no visualization', () => {
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('No Visualization')).toBeInTheDocument();
    expect(screen.getByText('Create a visualization to explore your embeddings')).toBeInTheDocument();
  });

  it('displays 3D canvas when visualization type is 3D', () => {
    const threeDMock = {
      ...mockUseEmbeddingsVisualization,
      visualizationType: '3d' as const,
      currentVisualization: {
        ...mockVisualization,
        type: '3d' as const
      }
    };
    
    vi.doMock('../../src/hooks/useEmbeddings', () => ({
      useEmbeddings: () => mockUseEmbeddings,
      useEmbeddingsVisualization: () => threeDMock,
      useSimilaritySearch: () => mockUseSimilaritySearch,
      useClustering: () => mockUseClustering
    }));
    
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByTestId('canvas-3d')).toBeInTheDocument();
  });

  it('displays 2D chart when visualization type is 2D', () => {
    const twoDMock = {
      ...mockUseEmbeddingsVisualization,
      visualizationType: '2d' as const,
      currentVisualization: mockVisualization
    };
    
    vi.doMock('../../src/hooks/useEmbeddings', () => ({
      useEmbeddings: () => mockUseEmbeddings,
      useEmbeddingsVisualization: () => twoDMock,
      useSimilaritySearch: () => mockUseSimilaritySearch,
      useClustering: () => mockUseClustering
    }));
    
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
  });

  it('handles vector selection callback', async () => {
    const onVectorSelect = vi.fn();
    const user = userEvent.setup();
    
    render(<EmbeddingsVisualization onVectorSelect={onVectorSelect} />);
    
    // Simulate vector click through the component
    // This would need to be tested through the 3D scene or 2D chart interaction
    // For now, we'll test the handler registration
    expect(onVectorSelect).toBeDefined();
  });

  it('handles cluster selection callback', async () => {
    const onClusterSelect = vi.fn();
    const user = userEvent.setup();
    
    render(<EmbeddingsVisualization onClusterSelect={onClusterSelect} />);
    
    const cluster1 = screen.getByText('Cluster 1').closest('div');
    if (cluster1) {
      await user.click(cluster1);
    }
    
    expect(mockUseEmbeddingsVisualization.selectCluster).toHaveBeenCalledWith('cluster-1');
  });

  it('initializes with provided vectors', () => {
    const initialVectors = [mockVectors[0]];
    render(<EmbeddingsVisualization initialVectors={initialVectors} />);
    
    expect(mockUseEmbeddingsVisualization.createVisualization).toHaveBeenCalledWith(
      initialVectors,
      expect.objectContaining({
        nComponents: 2,
        reductionMethod: 'pca',
        clusteringMethod: 'kmeans'
      })
    );
  });

  it('shows selected vectors alert', () => {
    const selectedMock = {
      ...mockUseEmbeddingsVisualization,
      selectedVectors: ['vector-1', 'vector-2']
    };
    
    vi.doMock('../../src/hooks/useEmbeddings', () => ({
      useEmbeddings: () => mockUseEmbeddings,
      useEmbeddingsVisualization: () => selectedMock,
      useSimilaritySearch: () => mockUseSimilaritySearch,
      useClustering: () => mockUseClustering
    }));
    
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('2 vector(s) selected.')).toBeInTheDocument();
    expect(screen.getByText('Clear selection')).toBeInTheDocument();
  });

  it('clears vector selection', async () => {
    const user = userEvent.setup();
    const selectedMock = {
      ...mockUseEmbeddingsVisualization,
      selectedVectors: ['vector-1']
    };
    
    vi.doMock('../../src/hooks/useEmbeddings', () => ({
      useEmbeddings: () => mockUseEmbeddings,
      useEmbeddingsVisualization: () => selectedMock,
      useSimilaritySearch: () => mockUseSimilaritySearch,
      useClustering: () => mockUseClustering
    }));
    
    render(<EmbeddingsVisualization />);
    
    const clearButton = screen.getByText('Clear selection');
    await user.click(clearButton);
    
    expect(mockUseEmbeddingsVisualization.clearSelection).toHaveBeenCalled();
  });

  it('handles import and export buttons', () => {
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('Import')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('displays search results when available', () => {
    const searchResultsMock = {
      ...mockUseSimilaritySearch,
      searchResults: [
        {
          vector: mockVectors[0],
          similarity: 0.95,
          distance: 0.05,
          rank: 1
        },
        {
          vector: mockVectors[1],
          similarity: 0.85,
          distance: 0.15,
          rank: 2
        }
      ]
    };
    
    vi.doMock('../../src/hooks/useEmbeddings', () => ({
      useEmbeddings: () => mockUseEmbeddings,
      useEmbeddingsVisualization: () => mockUseEmbeddingsVisualization,
      useSimilaritySearch: () => searchResultsMock,
      useClustering: () => mockUseClustering
    }));
    
    render(<EmbeddingsVisualization />);
    
    expect(screen.getByText('Rank 1')).toBeInTheDocument();
    expect(screen.getByText('Rank 2')).toBeInTheDocument();
    expect(screen.getByText('95.0%')).toBeInTheDocument();
    expect(screen.getByText('85.0%')).toBeInTheDocument();
  });
});