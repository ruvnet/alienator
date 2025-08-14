import { useState } from 'react';
import { Search, Filter, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatternData } from '@/types/analytics';
import { formatDistanceToNow } from 'date-fns';

interface PatternRecognitionPanelProps {
  patterns: PatternData[];
}

export function PatternRecognitionPanel({ patterns }: PatternRecognitionPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredPatterns = patterns.filter(pattern => {
    const matchesSearch = pattern.pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pattern.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || pattern.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || pattern.severity === selectedSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'linguistic': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'cryptographic': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      case 'compression': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'entropy': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-3 h-3" />;
      case 'medium':
        return <TrendingUp className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const patternTypes = [...new Set(patterns.map(p => p.type))];
  const severityLevels = ['low', 'medium', 'high', 'critical'];

  const getPatternStats = () => {
    const total = patterns.length;
    const bySeverity = severityLevels.reduce((acc, severity) => {
      acc[severity] = patterns.filter(p => p.severity === severity).length;
      return acc;
    }, {} as Record<string, number>);
    const byType = patternTypes.reduce((acc, type) => {
      acc[type] = patterns.filter(p => p.type === type).length;
      return acc;
    }, {} as Record<string, number>);

    return { total, bySeverity, byType };
  };

  const stats = getPatternStats();

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Pattern Recognition Analysis
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Detected patterns and anomaly signatures
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patterns" className="space-y-4">
          <TabsList className="bg-muted/20">
            <TabsTrigger value="patterns">Detected Patterns</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search patterns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {patternTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {severityLevels.map(severity => (
                    <SelectItem key={severity} value={severity}>
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Patterns List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPatterns.map(pattern => (
                <div 
                  key={pattern.id}
                  className="p-4 border border-border/30 rounded-lg bg-muted/10 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{pattern.pattern}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getTypeColor(pattern.type)}>
                          {pattern.type}
                        </Badge>
                        <Badge variant="outline" className={getSeverityColor(pattern.severity)}>
                          {getSeverityIcon(pattern.severity)}
                          {pattern.severity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{pattern.frequency}x</div>
                      <div className="text-muted-foreground text-xs">frequency</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Confidence</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted/30 rounded-full h-2">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${pattern.confidence * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs">{(pattern.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Last Seen</div>
                      <div className="text-xs">
                        {formatDistanceToNow(new Date(pattern.lastSeen), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredPatterns.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No patterns found matching your criteria</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Severity Distribution */}
              <div className="p-4 border border-border/30 rounded-lg bg-muted/10">
                <h4 className="font-medium mb-3">By Severity</h4>
                <div className="space-y-2">
                  {severityLevels.map(severity => (
                    <div key={severity} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${getSeverityColor(severity)} text-xs`}
                        >
                          {getSeverityIcon(severity)}
                          {severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted/30 rounded-full h-2">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${(stats.bySeverity[severity] / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono w-8 text-right">
                          {stats.bySeverity[severity]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Type Distribution */}
              <div className="p-4 border border-border/30 rounded-lg bg-muted/10">
                <h4 className="font-medium mb-3">By Type</h4>
                <div className="space-y-2">
                  {patternTypes.map(type => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${getTypeColor(type)} text-xs`}
                        >
                          {type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted/30 rounded-full h-2">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${(stats.byType[type] / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono w-8 text-right">
                          {stats.byType[type]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border border-border/30 rounded-lg bg-muted/10">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Patterns</div>
              </div>
              <div className="text-center p-3 border border-border/30 rounded-lg bg-muted/10">
                <div className="text-2xl font-bold">{stats.bySeverity.critical || 0}</div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </div>
              <div className="text-center p-3 border border-border/30 rounded-lg bg-muted/10">
                <div className="text-2xl font-bold">
                  {(patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
              <div className="text-center p-3 border border-border/30 rounded-lg bg-muted/10">
                <div className="text-2xl font-bold">
                  {patterns.reduce((sum, p) => sum + p.frequency, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Occurrences</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Pattern trend analysis coming soon</p>
              <p className="text-xs">Will show pattern evolution over time</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}