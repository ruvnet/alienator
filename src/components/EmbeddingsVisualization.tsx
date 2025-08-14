/**
 * Embeddings Visualization Component
 * Visualizes semantic embeddings in 2D/3D space with clustering and similarity analysis
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card';
import { 
  Button 
} from '../components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../components/ui/tabs';
import { 
  Badge 
} from '../components/ui/badge';
import { 
  Slider 
} from '../components/ui/slider';
import { 
  Switch 
} from '../components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { 
  Input 
} from '../components/ui/input';
import { 
  Label 
} from '../components/ui/label';
import { 
  Separator 
} from '../components/ui/separator';
import { 
  ScrollArea 
} from '../components/ui/scroll-area';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '../components/ui/sheet';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '../components/ui/tooltip';
import { 
  Alert, 
  AlertDescription 
} from '../components/ui/alert';
import { 
  Progress 
} from '../components/ui/progress';

import {
  Search,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Palette,
  MousePointer,
  Layers,
  BarChart3,
  Zap,
  Filter,
  Play,
  Pause,
  RotateCcw,
  Loader2
} from 'lucide-react';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from 'recharts';

import { 
  useEmbeddingsVisualization, 
  useEmbeddings, 
  useSimilaritySearch,
  useClustering 
} from '../hooks/useEmbeddings';
import { 
  EmbeddingVector, 
  EmbeddingCluster, 
  VisualizationParameters,
  EmbeddingViewSettings 
} from '../types/ai-models';

export interface EmbeddingsVisualizationProps {
  className?: string;
  initialVectors?: EmbeddingVector[];
  onVectorSelect?: (vector: EmbeddingVector) => void;
  onClusterSelect?: (cluster: EmbeddingCluster) => void;
}

// 3D Point Component
const Point3D: React.FC<{
  position: [number, number, number];
  color: string;
  size: number;
  label?: string;
  selected?: boolean;
  onClick?: () => void;
}> = ({ position, color, size, label, selected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(selected ? size * 1.5 : hovered ? size * 1.2 : size);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {(hovered || selected) && label && (
        <Text
          position={[position[0], position[1] + 0.2, position[2]]}
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
};

// 3D Cluster Component
const Cluster3D: React.FC<{
  cluster: EmbeddingCluster;
  points: Array<{ position: [number, number, number]; vector: EmbeddingVector }>;
  visible: boolean;
}> = ({ cluster, points, visible }) => {
  if (!visible || points.length === 0) return null;

  // Calculate cluster bounds
  const bounds = points.reduce(
    (acc, point) => ({
      min: [
        Math.min(acc.min[0], point.position[0]),
        Math.min(acc.min[1], point.position[1]),
        Math.min(acc.min[2], point.position[2])
      ],
      max: [
        Math.max(acc.max[0], point.position[0]),
        Math.max(acc.max[1], point.position[1]),
        Math.max(acc.max[2], point.position[2])
      ]
    }),
    { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] }
  );

  const center = [
    (bounds.min[0] + bounds.max[0]) / 2,
    (bounds.min[1] + bounds.max[1]) / 2,
    (bounds.min[2] + bounds.max[2]) / 2
  ] as [number, number, number];

  const size = Math.max(
    bounds.max[0] - bounds.min[0],
    bounds.max[1] - bounds.min[1],
    bounds.max[2] - bounds.min[2]
  ) / 2;

  return (
    <group>
      <mesh position={center}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial 
          color={cluster.color} 
          transparent 
          opacity={0.1} 
          wireframe 
        />
      </mesh>
      <Text
        position={[center[0], center[1] + size + 0.2, center[2]]}
        fontSize={0.12}
        color={cluster.color}
        anchorX="center"
        anchorY="middle"
      >
        {cluster.label}
      </Text>
    </group>
  );
};

// 3D Scene Component
const Scene3D: React.FC<{
  vectors: EmbeddingVector[];
  reducedDimensions: number[][];
  clusters: EmbeddingCluster[];
  selectedVectors: string[];
  viewSettings: EmbeddingViewSettings;
  onVectorClick: (vector: EmbeddingVector) => void;
}> = ({ vectors, reducedDimensions, clusters, selectedVectors, viewSettings, onVectorClick }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const pointData = useMemo(() => {
    return vectors.map((vector, index) => {
      const position = reducedDimensions[index] || [0, 0, 0];
      // Ensure 3D position
      const position3D: [number, number, number] = [
        position[0] || 0,
        position[1] || 0,
        position[2] || 0
      ];

      // Find cluster color
      let color = '#888888';
      if (viewSettings.colorScheme === 'cluster') {
        const cluster = clusters.find(c => c.points.some(p => p.id === vector.id));
        if (cluster) color = cluster.color;
      } else if (viewSettings.colorScheme === 'model') {
        // Color by model
        const modelColors: Record<string, string> = {
          'text-embedding-3-small': '#3b82f6',
          'text-embedding-3-large': '#ef4444',
          'text-embedding-ada-002': '#10b981'
        };
        color = modelColors[vector.model] || '#888888';
      }

      return {
        position: position3D,
        vector,
        color,
        selected: selectedVectors.includes(vector.id)
      };
    });
  }, [vectors, reducedDimensions, clusters, selectedVectors, viewSettings.colorScheme]);

  const clusterData = useMemo(() => {
    return clusters.map(cluster => ({
      cluster,
      points: pointData.filter(point => 
        cluster.points.some(p => p.id === point.vector.id)
      )
    }));
  }, [clusters, pointData]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Grid */}
      <gridHelper args={[10, 10]} />
      
      {/* Points */}
      {pointData.map((point, index) => (
        <Point3D
          key={point.vector.id}
          position={point.position}
          color={point.color}
          size={viewSettings.pointSize / 100}
          label={viewSettings.showLabels ? point.vector.text.substring(0, 20) + '...' : undefined}
          selected={point.selected}
          onClick={() => onVectorClick(point.vector)}
        />
      ))}
      
      {/* Clusters */}
      {viewSettings.showClusters && clusterData.map(({ cluster, points }) => (
        <Cluster3D
          key={cluster.id}
          cluster={cluster}
          points={points}
          visible={viewSettings.showClusters}
        />
      ))}
      
      <OrbitControls enablePan enableZoom enableRotate />
    </>
  );
};

const EmbeddingsVisualization: React.FC<EmbeddingsVisualizationProps> = ({
  className = '',
  initialVectors = [],
  onVectorSelect,
  onClusterSelect
}) => {
  const { vectors, loading: embeddingsLoading, addBatchEmbeddings } = useEmbeddings();
  const { 
    selectedVectors,
    visualizationType,
    isLoading,
    currentVisualization,
    viewSettings,
    createVisualization,
    updateVisualization,
    toggleVisualizationType,
    selectVector,
    clearSelection,
    updateViewSettings,
    selectCluster
  } = useEmbeddingsVisualization();
  
  const { searchResults, search, searchByText } = useSimilaritySearch();
  const { clusters, performClustering, getClusterStats } = useClustering();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationPlaying, setAnimationPlaying] = useState(false);

  // Initialize with provided vectors
  useEffect(() => {
    if (initialVectors.length > 0) {
      const defaultParams: VisualizationParameters = {
        nComponents: visualizationType === '3d' ? 3 : 2,
        reductionMethod: 'pca',
        clusteringMethod: 'kmeans',
        numClusters: Math.min(5, Math.ceil(initialVectors.length / 10))
      };
      createVisualization(initialVectors, defaultParams);
    }
  }, [initialVectors, createVisualization, visualizationType]);

  const handleCreateVisualization = useCallback(async () => {
    if (vectors.length === 0) return;

    const params: VisualizationParameters = {
      nComponents: visualizationType === '3d' ? 3 : 2,
      reductionMethod: 'pca',
      clusteringMethod: 'kmeans',
      numClusters: Math.min(5, Math.ceil(vectors.length / 10))
    };

    try {
      await createVisualization(vectors, params);
      await performClustering(vectors, 'kmeans', { k: params.numClusters });
    } catch (error) {
      console.error('Failed to create visualization:', error);
    }
  }, [vectors, visualizationType, createVisualization, performClustering]);

  const handleVectorClick = useCallback((vector: EmbeddingVector) => {
    selectVector(vector.id);
    onVectorSelect?.(vector);
  }, [selectVector, onVectorSelect]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || vectors.length === 0) return;

    try {
      await searchByText(searchQuery, vectors);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [searchQuery, vectors, searchByText]);

  const ControlPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visualization Type */}
        <div className="flex items-center justify-between">
          <Label>Visualization Type</Label>
          <div className="flex items-center gap-2">
            <Badge variant={visualizationType === '2d' ? 'default' : 'outline'}>2D</Badge>
            <Switch
              checked={visualizationType === '3d'}
              onCheckedChange={toggleVisualizationType}
            />
            <Badge variant={visualizationType === '3d' ? 'default' : 'outline'}>3D</Badge>
          </div>
        </div>

        <Separator />

        {/* View Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Show Labels</Label>
            <Switch
              checked={viewSettings.showLabels}
              onCheckedChange={(checked) => updateViewSettings({ showLabels: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Show Clusters</Label>
            <Switch
              checked={viewSettings.showClusters}
              onCheckedChange={(checked) => updateViewSettings({ showClusters: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Point Size: {viewSettings.pointSize}</Label>
            <Slider
              value={[viewSettings.pointSize]}
              onValueChange={([value]) => updateViewSettings({ pointSize: value })}
              min={1}
              max={20}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Opacity: {(viewSettings.opacity * 100).toFixed(0)}%</Label>
            <Slider
              value={[viewSettings.opacity * 100]}
              onValueChange={([value]) => updateViewSettings({ opacity: value / 100 })}
              min={10}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <Select
              value={viewSettings.colorScheme}
              onValueChange={(value: any) => updateViewSettings({ colorScheme: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cluster">By Cluster</SelectItem>
                <SelectItem value="model">By Model</SelectItem>
                <SelectItem value="timestamp">By Timestamp</SelectItem>
                <SelectItem value="similarity">By Similarity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            onClick={handleCreateVisualization}
            disabled={vectors.length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Processing...' : 'Create Visualization'}
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SearchPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Similarity Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search for similar vectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <div
                  key={result.vector.id}
                  className="p-2 border rounded cursor-pointer hover:bg-muted"
                  onClick={() => handleVectorClick(result.vector)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline">Rank {result.rank}</Badge>
                    <Badge variant="secondary">
                      {(result.similarity * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.vector.text.substring(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );

  const ClusterInfo = () => {
    const stats = getClusterStats();
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Cluster Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Clusters</p>
                <p className="text-lg font-semibold">{stats.totalClusters}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Points</p>
                <p className="text-lg font-semibold">{stats.totalPoints}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Size</p>
                <p className="text-lg font-semibold">{stats.averageSize.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Cohesion</p>
                <p className="text-lg font-semibold">{(stats.averageCohesion * 100).toFixed(1)}%</p>
              </div>
            </div>
          )}

          {clusters.length > 0 && (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {clusters.map(cluster => (
                  <div
                    key={cluster.id}
                    className="p-2 border rounded cursor-pointer hover:bg-muted"
                    onClick={() => {
                      selectCluster(cluster.id);
                      onClusterSelect?.(cluster);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: cluster.color }}
                        />
                        <span className="font-medium">{cluster.label}</span>
                      </div>
                      <Badge variant="outline">{cluster.size} points</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Cohesion: {(cluster.cohesion * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );
  };

  const Visualization2D = () => {
    if (!currentVisualization || currentVisualization.type !== '2d') return null;

    const chartData = currentVisualization.vectors.map((vector, index) => {
      const position = currentVisualization.reducedDimensions[index] || [0, 0];
      const cluster = currentVisualization.clusters.find(c => 
        c.points.some(p => p.id === vector.id)
      );
      
      return {
        x: position[0],
        y: position[1],
        text: vector.text.substring(0, 30) + '...',
        cluster: cluster?.label || 'Unclustered',
        color: cluster?.color || '#888888'
      };
    });

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" type="number" />
          <YAxis dataKey="y" type="number" />
          <Scatter>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  const Visualization3D = () => {
    if (!currentVisualization || currentVisualization.type !== '3d') return null;

    return (
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
        <Scene3D
          vectors={currentVisualization.vectors}
          reducedDimensions={currentVisualization.reducedDimensions}
          clusters={currentVisualization.clusters}
          selectedVectors={selectedVectors}
          viewSettings={viewSettings}
          onVectorClick={handleVectorClick}
        />
      </Canvas>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Embeddings Visualization</h2>
          <p className="text-muted-foreground">
            Explore semantic embeddings in interactive 2D/3D space
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {vectors.length} vectors
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
        {!isFullscreen && (
          <div className="space-y-4">
            <ControlPanel />
            <SearchPanel />
            <ClusterInfo />
          </div>
        )}
        
        <div className={isFullscreen ? 'col-span-1' : 'lg:col-span-3'}>
          <Card className={isFullscreen ? 'h-screen' : 'h-[600px]'}>
            <CardContent className="p-0 h-full">
              {currentVisualization ? (
                visualizationType === '3d' ? (
                  <Visualization3D />
                ) : (
                  <Visualization2D />
                )
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Visualization</h3>
                    <p className="text-muted-foreground mb-4">
                      Create a visualization to explore your embeddings
                    </p>
                    <Button onClick={handleCreateVisualization} disabled={vectors.length === 0}>
                      <Play className="w-4 h-4 mr-2" />
                      Create Visualization
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedVectors.length > 0 && (
        <Alert>
          <Eye className="h-4 w-4" />
          <AlertDescription>
            {selectedVectors.length} vector(s) selected. 
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2" 
              onClick={clearSelection}
            >
              Clear selection
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EmbeddingsVisualization;