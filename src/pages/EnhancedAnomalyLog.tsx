import { useState, useEffect } from 'react';
import { 
  History, 
  Network, 
  Activity, 
  BarChart3,
  Settings,
  RefreshCw,
  Plus,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AnomalyFilters } from '@/components/anomaly/AnomalyFilters';
import { AnomalyDetailModal } from '@/components/anomaly/AnomalyDetailModal';
import { AnomalyCorrelation } from '@/components/anomaly/AnomalyCorrelation';
import { RealTimeMonitor } from '@/components/anomaly/RealTimeMonitor';
import { AnomalyExport } from '@/components/anomaly/AnomalyExport';
import { useAnomalyStore } from '@/stores/anomalyStore';
import { useAnomalyFilters } from '@/hooks/anomaly/useAnomalyFilters';
import { AnomalyRecord } from '@/types/anomaly';
import { formatTimestamp, getSeverityColor, getStatusColor, calculateAnomalyScore } from '@/utils/anomalyUtils';

// Enhanced table component with better performance
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for initial load
const generateMockAnomalies = (): AnomalyRecord[] => {
  const types = [
    'entropy_spike', 'cross_model_divergence', 'compression_anomaly', 
    'linguistic_pattern', 'cryptographic_pattern', 'embedding_anomaly',
    'threshold_breach', 'pattern_deviation', 'statistical_outlier'
  ];
  const models = ['GPT-4', 'Claude-3', 'Cohere', 'GPT-3.5', 'Gemini', 'PaLM-2'];
  const severities = ['critical', 'high', 'medium', 'low'] as const;
  const statuses = ['investigating', 'acknowledged', 'resolved', 'dismissed', 'escalated'] as const;

  return Array.from({ length: 50 }, (_, i) => {
    const entropy = Math.random() * 10;
    const severity = entropy > 8.5 ? 'critical' : 
                    entropy > 7 ? 'high' : 
                    entropy > 5 ? 'medium' : 'low';
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

    return {
      id: `ANO-2024-${String(i + 1).padStart(3, '0')}`,
      timestamp,
      severity,
      type: types[Math.floor(Math.random() * types.length)] as any,
      model: models[Math.floor(Math.random() * models.length)],
      description: `Detected ${severity} anomaly with ${entropy.toFixed(2)} entropy in ${types[Math.floor(Math.random() * types.length)].replace(/_/g, ' ')}`,
      entropy,
      text_preview: `Sample text with entropy ${entropy.toFixed(2)} demonstrating ${types[Math.floor(Math.random() * types.length)].replace(/_/g, ' ')} characteristics...`,
      full_text: `This is the full text content that would be analyzed. It contains various patterns and structures that the anomaly detection system flagged as unusual. Entropy: ${entropy.toFixed(4)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      tags: [
        'automated',
        severity === 'critical' ? 'urgent' : 'routine',
        types[Math.floor(Math.random() * types.length)].split('_')[0],
        models[Math.floor(Math.random() * models.length)].toLowerCase()
      ].slice(0, Math.floor(Math.random() * 4) + 1),
      metadata: {
        confidence_score: Math.random(),
        analysis_version: '2.1.0',
        processing_time_ms: Math.floor(Math.random() * 500) + 50,
        source_ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        user_agent: 'Mozilla/5.0 (compatible; AnomalyBot/1.0)',
        session_id: `session-${Math.random().toString(36).substr(2, 8)}`,
        request_id: `req-${Math.random().toString(36).substr(2, 12)}`,
      },
      metrics: {
        compression_ratio: Math.random(),
        divergence_score: Math.random(),
        pattern_strength: Math.random(),
        linguistic_complexity: Math.random(),
        cryptographic_entropy: Math.random(),
        embedding_distance: Math.random(),
      },
      related_anomalies: Math.random() > 0.7 ? [`ANO-2024-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`] : undefined,
      resolution_notes: Math.random() > 0.6 ? 'Automatically resolved through pattern matching' : undefined,
      assigned_to: Math.random() > 0.8 ? 'security-team' : undefined,
      escalation_level: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : undefined,
    };
  });
};

export default function EnhancedAnomalyLog() {
  const { 
    anomalies, 
    stats, 
    setAnomalies, 
    setStats, 
    viewMode, 
    setViewMode,
    isLoading,
    setLoading,
    refreshData 
  } = useAnomalyStore();
  
  const { filteredAnomalies, filterStats } = useAnomalyFilters();
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null);
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity' | 'entropy' | 'score'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize with mock data
  useEffect(() => {
    if (anomalies.length === 0) {
      setLoading(true);
      const mockData = generateMockAnomalies();
      setAnomalies(mockData);
      
      // Calculate stats
      const totalStats = {
        total: mockData.length,
        critical: mockData.filter(a => a.severity === 'critical').length,
        high: mockData.filter(a => a.severity === 'high').length,
        medium: mockData.filter(a => a.severity === 'medium').length,
        low: mockData.filter(a => a.severity === 'low').length,
        investigating: mockData.filter(a => a.status === 'investigating').length,
        acknowledged: mockData.filter(a => a.status === 'acknowledged').length,
        resolved: mockData.filter(a => a.status === 'resolved').length,
        dismissed: mockData.filter(a => a.status === 'dismissed').length,
        escalated: mockData.filter(a => a.status === 'escalated').length,
        byType: {},
        byModel: {},
        byHour: [],
        averageEntropy: mockData.reduce((sum, a) => sum + a.entropy, 0) / mockData.length,
        averageConfidence: mockData.reduce((sum, a) => sum + a.metadata.confidence_score, 0) / mockData.length,
        topTags: [],
      };
      
      setStats(totalStats);
      setLoading(false);
    }
  }, [anomalies.length, setAnomalies, setStats, setLoading]);

  // Sort and paginate anomalies
  const sortedAnomalies = [...filteredAnomalies].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'timestamp':
        comparison = a.timestamp.getTime() - b.timestamp.getTime();
        break;
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = severityOrder[a.severity as keyof typeof severityOrder] - 
                    severityOrder[b.severity as keyof typeof severityOrder];
        break;
      case 'entropy':
        comparison = a.entropy - b.entropy;
        break;
      case 'score':
        comparison = calculateAnomalyScore(a) - calculateAnomalyScore(b);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedAnomalies.length / pageSize);
  const paginatedAnomalies = sortedAnomalies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRefresh = async () => {
    setLoading(true);
    await refreshData();
    setLoading(false);
  };

  const handleAnomalyClick = (anomaly: AnomalyRecord) => {
    setSelectedAnomaly(anomaly);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading anomaly data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <History className="w-6 h-6" />
            Enhanced Anomaly Log
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Comprehensive anomaly detection and analysis system
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-anomaly-high border-anomaly-high/30">
            {stats?.critical || 0} Critical
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <AnomalyExport />
        </div>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{filterStats.filtered}</div>
              <div className="text-xs text-muted-foreground">
                {filterStats.filtered !== filterStats.total && `of ${filterStats.total}`}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Critical</div>
              <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
              <div className="text-xs text-muted-foreground">High priority</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Investigating</div>
              <div className="text-2xl font-bold text-orange-500">{stats.investigating}</div>
              <div className="text-xs text-muted-foreground">In progress</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Avg Entropy</div>
              <div className="text-2xl font-bold">{stats.averageEntropy.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">System average</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Confidence</div>
              <div className="text-2xl font-bold">{(stats.averageConfidence * 100).toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Detection accuracy</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Filters */}
      <AnomalyFilters />

      {/* Main Content Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            Correlation
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">Time</SelectItem>
                  <SelectItem value="severity">Severity</SelectItem>
                  <SelectItem value="entropy">Entropy</SelectItem>
                  <SelectItem value="score">Risk Score</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm">Show:</Label>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Entropy</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAnomalies.map((anomaly) => (
                      <TableRow 
                        key={anomaly.id} 
                        className="cursor-pointer hover:bg-muted/20"
                        onClick={() => handleAnomalyClick(anomaly)}
                      >
                        <TableCell className="font-mono text-sm">{anomaly.id}</TableCell>
                        <TableCell className="text-sm">{formatTimestamp(anomaly.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getSeverityColor(anomaly.severity)}`}>
                            {anomaly.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{anomaly.type.replace(/_/g, ' ')}</TableCell>
                        <TableCell className="text-sm">{anomaly.model}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate text-sm">{anomaly.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {anomaly.entropy.toFixed(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {calculateAnomalyScore(anomaly)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(anomaly.status)}`}>
                            {anomaly.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedAnomalies.length)} of {sortedAnomalies.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="correlation">
          <AnomalyCorrelation />
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Detailed statistical analysis, trend visualization, and predictive insights would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <RealTimeMonitor />
        </TabsContent>
      </Tabs>

      {/* Anomaly Detail Modal */}
      <AnomalyDetailModal
        anomaly={selectedAnomaly}
        open={!!selectedAnomaly}
        onOpenChange={(open) => !open && setSelectedAnomaly(null)}
      />
    </div>
  );
}