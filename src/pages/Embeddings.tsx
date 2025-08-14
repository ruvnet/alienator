import { useState } from "react";
import { Sparkles, Layers, Search, Download, Maximize2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

const mockEmbeddingData = [
  { id: "1", text: "The quick brown fox", cluster: "A", distance: 0.12, outlier: false },
  { id: "2", text: "Quantum mechanics principles", cluster: "B", distance: 0.89, outlier: true },
  { id: "3", text: "Machine learning algorithms", cluster: "B", distance: 0.23, outlier: false },
  { id: "4", text: "Neural network architectures", cluster: "B", distance: 0.31, outlier: false },
  { id: "5", text: "Cryptocurrency blockchain", cluster: "C", distance: 0.76, outlier: true },
  { id: "6", text: "Data science methodology", cluster: "B", distance: 0.18, outlier: false },
];

const clusteringMethods = [
  { value: "kmeans", label: "K-Means" },
  { value: "dbscan", label: "DBSCAN" },
  { value: "isolation-forest", label: "Isolation Forest" },
  { value: "hierarchical", label: "Hierarchical" },
];

const reductionMethods = [
  { value: "tsne", label: "t-SNE" },
  { value: "umap", label: "UMAP" },
  { value: "pca", label: "PCA" },
];

export default function Embeddings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clusteringMethod, setClusteringMethod] = useState("kmeans");
  const [reductionMethod, setReductionMethod] = useState("tsne");
  const [outlierThreshold, setOutlierThreshold] = useState([0.7]);
  const [selectedCluster, setSelectedCluster] = useState("all");

  const filteredData = mockEmbeddingData.filter(item => 
    item.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCluster === "all" || item.cluster === selectedCluster)
  );

  const clusterCounts = mockEmbeddingData.reduce((acc, item) => {
    acc[item.cluster] = (acc[item.cluster] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const outlierCount = mockEmbeddingData.filter(item => item.outlier).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Embedding Visualization</h1>
          <p className="text-muted-foreground text-sm md:text-base">3D clustering and outlier detection</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-anomaly-medium border-anomaly-medium/30">
            {outlierCount} Outliers
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Configuration Panel */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Visualization Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Clustering Method</label>
              <Select value={clusteringMethod} onValueChange={setClusteringMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clusteringMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dimension Reduction</label>
              <Select value={reductionMethod} onValueChange={setReductionMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reductionMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Outlier Threshold: {outlierThreshold[0].toFixed(1)}
              </label>
              <Slider
                value={outlierThreshold}
                onValueChange={setOutlierThreshold}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Cluster</label>
              <Select value={selectedCluster} onValueChange={setSelectedCluster}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clusters</SelectItem>
                  {Object.keys(clusterCounts).map((cluster) => (
                    <SelectItem key={cluster} value={cluster}>
                      Cluster {cluster} ({clusterCounts[cluster]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Visualization */}
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                3D Embedding Space
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center border border-border/30 rounded-lg bg-muted/10 relative">
              <div className="text-center space-y-2">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">3D embedding visualization will be rendered here</p>
                <p className="text-xs text-muted-foreground">
                  Using {reductionMethod.toUpperCase()} reduction with {clusteringMethod} clustering
                </p>
              </div>
              
              {/* Simulated 3D Points */}
              <div className="absolute inset-4">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full ${
                      Math.random() > 0.8 
                        ? "bg-anomaly-high animate-pulse" 
                        : Math.random() > 0.6 
                        ? "bg-anomaly-medium" 
                        : "bg-anomaly-low"
                    }`}
                    style={{
                      left: `${Math.random() * 90}%`,
                      top: `${Math.random() * 90}%`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* 3D Controls */}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>Click and drag to rotate • Scroll to zoom</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-anomaly-low rounded-full"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-anomaly-medium rounded-full"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-anomaly-high rounded-full"></div>
                  <span>Outlier</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outlier List */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Data Points
            </CardTitle>
            <div className="mt-2">
              <Input
                placeholder="Search embeddings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted/20 border-border/50"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/30 ${
                    item.outlier
                      ? "border-anomaly-high/30 bg-anomaly-high/5"
                      : "border-border/30 bg-muted/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        item.outlier
                          ? "border-anomaly-high/30 text-anomaly-high"
                          : "border-anomaly-low/30 text-anomaly-low"
                      }`}
                    >
                      Cluster {item.cluster}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      d: {item.distance.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 break-words">{item.text}</p>
                  {item.outlier && (
                    <div className="mt-2">
                      <Badge variant="destructive" className="text-xs">
                        Outlier
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Tabs */}
      <Tabs defaultValue="clusters" className="space-y-4">
        <TabsList className="bg-muted/20">
          <TabsTrigger value="clusters">Cluster Analysis</TabsTrigger>
          <TabsTrigger value="outliers">Outlier Details</TabsTrigger>
          <TabsTrigger value="metrics">Quality Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="clusters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(clusterCounts).map(([cluster, count]) => (
              <Card key={cluster} className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Cluster {cluster}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-2">{count}</div>
                  <div className="text-sm text-muted-foreground">data points</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cohesion:</span>
                      <span className="text-anomaly-low">0.{Math.floor(Math.random() * 30 + 70)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Separation:</span>
                      <span className="text-anomaly-medium">0.{Math.floor(Math.random() * 20 + 40)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outliers" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Detected Outliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEmbeddingData.filter(item => item.outlier).map((item) => (
                  <div key={item.id} className="p-4 border border-anomaly-high/30 rounded-lg bg-anomaly-high/5">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="destructive">High Anomaly</Badge>
                      <span className="text-sm text-muted-foreground">
                        Distance: {item.distance.toFixed(3)}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{item.text}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Reason: Significant deviation from cluster centroid
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Silhouette Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-anomaly-low">0.73</div>
                <div className="text-xs text-muted-foreground">Cluster quality</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Davies-Bouldin Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-anomaly-medium">1.24</div>
                <div className="text-xs text-muted-foreground">Lower is better</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Calinski-Harabasz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-anomaly-low">156.8</div>
                <div className="text-xs text-muted-foreground">Higher is better</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Outlier Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-anomaly-high">
                  {((outlierCount / mockEmbeddingData.length) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Data points</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}