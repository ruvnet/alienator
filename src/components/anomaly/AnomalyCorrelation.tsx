import { useState, useMemo } from 'react';
import { 
  Network, 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  GitBranch,
  Filter,
  Eye,
  MoreHorizontal,
  AlertTriangle,
  Link
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAnomalyStore } from '@/stores/anomalyStore';
import { useAnomalyFilters } from '@/hooks/anomaly/useAnomalyFilters';
import { AnomalyRecord, AnomalyCorrelation } from '@/types/anomaly';
import { formatTimestamp, getSeverityColor } from '@/utils/anomalyUtils';

export function AnomalyCorrelation() {
  const { anomalies, correlations } = useAnomalyStore();
  const { filteredAnomalies } = useAnomalyFilters();
  const [correlationType, setCorrelationType] = useState<string>('all');
  const [minStrength, setMinStrength] = useState(0.5);
  const [selectedCorrelation, setSelectedCorrelation] = useState<string | null>(null);

  // Generate correlations based on filtered anomalies
  const generatedCorrelations = useMemo(() => {
    const correlations: AnomalyCorrelation[] = [];
    
    // Temporal correlations (anomalies within 1 hour)
    const timeGroups = new Map<string, AnomalyRecord[]>();
    filteredAnomalies.forEach(anomaly => {
      const hourKey = new Date(anomaly.timestamp).toISOString().slice(0, 13);
      if (!timeGroups.has(hourKey)) {
        timeGroups.set(hourKey, []);
      }
      timeGroups.get(hourKey)!.push(anomaly);
    });

    timeGroups.forEach((group, hourKey) => {
      if (group.length >= 2) {
        correlations.push({
          id: `temporal-${hourKey}`,
          anomaly_ids: group.map(a => a.id),
          correlation_type: 'temporal',
          correlation_strength: Math.min(0.9, 0.5 + (group.length * 0.1)),
          description: `${group.length} anomalies detected within the same hour`,
          discovered_at: new Date(),
          patterns: ['temporal_clustering']
        });
      }
    });

    // Pattern correlations (same type)
    const typeGroups = new Map<string, AnomalyRecord[]>();
    filteredAnomalies.forEach(anomaly => {
      if (!typeGroups.has(anomaly.type)) {
        typeGroups.set(anomaly.type, []);
      }
      typeGroups.get(anomaly.type)!.push(anomaly);
    });

    typeGroups.forEach((group, type) => {
      if (group.length >= 3) {
        correlations.push({
          id: `pattern-${type}`,
          anomaly_ids: group.map(a => a.id),
          correlation_type: 'pattern',
          correlation_strength: Math.min(0.95, 0.6 + (group.length * 0.05)),
          description: `Multiple ${type.replace(/_/g, ' ')} anomalies detected`,
          discovered_at: new Date(),
          patterns: [type, 'repeated_pattern']
        });
      }
    });

    // Model correlations (same model with high severity)
    const modelGroups = new Map<string, AnomalyRecord[]>();
    filteredAnomalies
      .filter(a => ['critical', 'high'].includes(a.severity))
      .forEach(anomaly => {
        if (!modelGroups.has(anomaly.model)) {
          modelGroups.set(anomaly.model, []);
        }
        modelGroups.get(anomaly.model)!.push(anomaly);
      });

    modelGroups.forEach((group, model) => {
      if (group.length >= 2) {
        correlations.push({
          id: `model-${model.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          anomaly_ids: group.map(a => a.id),
          correlation_type: 'model',
          correlation_strength: Math.min(0.8, 0.4 + (group.length * 0.1)),
          description: `Multiple high-severity anomalies from ${model}`,
          discovered_at: new Date(),
          patterns: ['model_specific', 'high_severity']
        });
      }
    });

    // Source correlations (same IP or session)
    const sessionGroups = new Map<string, AnomalyRecord[]>();
    filteredAnomalies
      .filter(a => a.metadata.session_id)
      .forEach(anomaly => {
        const sessionId = anomaly.metadata.session_id!;
        if (!sessionGroups.has(sessionId)) {
          sessionGroups.set(sessionId, []);
        }
        sessionGroups.get(sessionId)!.push(anomaly);
      });

    sessionGroups.forEach((group, sessionId) => {
      if (group.length >= 2) {
        correlations.push({
          id: `source-${sessionId}`,
          anomaly_ids: group.map(a => a.id),
          correlation_type: 'source',
          correlation_strength: Math.min(0.85, 0.5 + (group.length * 0.15)),
          description: `Multiple anomalies from the same session`,
          discovered_at: new Date(),
          patterns: ['session_based', 'source_correlation']
        });
      }
    });

    return correlations.filter(c => c.correlation_strength >= minStrength);
  }, [filteredAnomalies, minStrength]);

  const filteredCorrelations = correlationType === 'all' 
    ? generatedCorrelations 
    : generatedCorrelations.filter(c => c.correlation_type === correlationType);

  const correlationStats = useMemo(() => {
    const total = generatedCorrelations.length;
    const byType = generatedCorrelations.reduce((acc, corr) => {
      acc[corr.correlation_type] = (acc[corr.correlation_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgStrength = generatedCorrelations.length > 0
      ? generatedCorrelations.reduce((sum, c) => sum + c.correlation_strength, 0) / generatedCorrelations.length
      : 0;

    return { total, byType, avgStrength };
  }, [generatedCorrelations]);

  const getCorrelationIcon = (type: string) => {
    switch (type) {
      case 'temporal': return <Clock className="w-4 h-4" />;
      case 'pattern': return <TrendingUp className="w-4 h-4" />;
      case 'model': return <GitBranch className="w-4 h-4" />;
      case 'source': return <Users className="w-4 h-4" />;
      default: return <Network className="w-4 h-4" />;
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return 'text-red-500';
    if (strength >= 0.6) return 'text-orange-500';
    if (strength >= 0.4) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Network className="w-5 h-5" />
            Anomaly Correlations
          </h2>
          <p className="text-sm text-muted-foreground">
            Discover patterns and relationships between anomalies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={correlationType} onValueChange={setCorrelationType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="temporal">Temporal</SelectItem>
              <SelectItem value="pattern">Pattern</SelectItem>
              <SelectItem value="model">Model</SelectItem>
              <SelectItem value="source">Source</SelectItem>
            </SelectContent>
          </Select>
          <Select value={minStrength.toString()} onValueChange={(v) => setMinStrength(parseFloat(v))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Min strength" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any Strength</SelectItem>
              <SelectItem value="0.3">Weak (0.3+)</SelectItem>
              <SelectItem value="0.5">Medium (0.5+)</SelectItem>
              <SelectItem value="0.7">Strong (0.7+)</SelectItem>
              <SelectItem value="0.9">Very Strong (0.9+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Total Correlations</div>
                <div className="text-2xl font-bold">{correlationStats.total}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Avg Strength</div>
                <div className="text-2xl font-bold">
                  {(correlationStats.avgStrength * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Temporal</div>
                <div className="text-2xl font-bold">{correlationStats.byType.temporal || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Pattern</div>
                <div className="text-2xl font-bold">{correlationStats.byType.pattern || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Correlation List</TabsTrigger>
          <TabsTrigger value="network">Network View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredCorrelations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Correlations Found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting the filters or check if there are enough anomalies to correlate.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCorrelations.map((correlation) => (
                <Card 
                  key={correlation.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/20 ${
                    selectedCorrelation === correlation.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedCorrelation(
                    selectedCorrelation === correlation.id ? null : correlation.id
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCorrelationIcon(correlation.correlation_type)}
                          <Badge variant="outline" className="capitalize">
                            {correlation.correlation_type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={getStrengthColor(correlation.correlation_strength)}
                          >
                            {(correlation.correlation_strength * 100).toFixed(0)}% strength
                          </Badge>
                          <Badge variant="outline">
                            {correlation.anomaly_ids.length} anomalies
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {correlation.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Discovered: {formatTimestamp(correlation.discovered_at)}</span>
                          <span>•</span>
                          <span>Patterns: {correlation.patterns.join(', ')}</span>
                        </div>

                        {/* Strength Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Correlation Strength</span>
                            <span>{(correlation.correlation_strength * 100).toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={correlation.correlation_strength * 100} 
                            className={`h-1 ${
                              correlation.correlation_strength >= 0.8 ? 'bg-red-100' : 
                              correlation.correlation_strength >= 0.6 ? 'bg-orange-100' : 
                              correlation.correlation_strength >= 0.4 ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedCorrelation === correlation.id && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Correlated Anomalies</h4>
                            <div className="grid gap-2">
                              {correlation.anomaly_ids.map((anomalyId) => {
                                const anomaly = anomalies.find(a => a.id === anomalyId);
                                if (!anomaly) return null;
                                
                                return (
                                  <div 
                                    key={anomalyId} 
                                    className="flex items-center justify-between p-2 bg-muted/20 rounded"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs">{anomalyId}</span>
                                      <Badge 
                                        variant="outline" 
                                        className={getSeverityColor(anomaly.severity)}
                                      >
                                        {anomaly.severity}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {anomaly.type.replace(/_/g, ' ')}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-muted-foreground">
                                        {formatTimestamp(anomaly.timestamp)}
                                      </span>
                                      <Button variant="ghost" size="sm">
                                        <Link className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Analysis Insights</h4>
                            <div className="text-xs text-muted-foreground space-y-1">
                              {correlation.correlation_type === 'temporal' && (
                                <p>• These anomalies occurred within a short time window, suggesting a possible common trigger or cascade effect.</p>
                              )}
                              {correlation.correlation_type === 'pattern' && (
                                <p>• Repeated occurrence of the same anomaly type may indicate a systematic issue or recurring attack pattern.</p>
                              )}
                              {correlation.correlation_type === 'model' && (
                                <p>• Multiple anomalies from the same model could indicate model-specific vulnerabilities or input manipulation.</p>
                              )}
                              {correlation.correlation_type === 'source' && (
                                <p>• Anomalies from the same source suggest targeted activity or compromised session.</p>
                              )}
                              {correlation.correlation_strength >= 0.8 && (
                                <p>• <strong>High correlation strength</strong> indicates this pattern warrants immediate investigation.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Network Visualization</h3>
              <p className="text-sm text-muted-foreground">
                Interactive network graph showing relationships between anomalies would be rendered here.
                This would use a graph library like D3.js or vis.js.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Correlation Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Timeline view showing when correlations were discovered and their evolution over time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}