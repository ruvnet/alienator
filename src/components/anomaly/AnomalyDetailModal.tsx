import { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Tag, 
  Hash, 
  Zap, 
  FileText, 
  Settings, 
  Eye,
  Copy,
  ExternalLink,
  Edit,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { AnomalyRecord } from '@/types/anomaly';
import { useAnomalyStore } from '@/stores/anomalyStore';
import { formatTimestamp, getSeverityColor, getStatusColor, calculateAnomalyScore } from '@/utils/anomalyUtils';

interface AnomalyDetailModalProps {
  anomaly: AnomalyRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnomalyDetailModal({ anomaly, open, onOpenChange }: AnomalyDetailModalProps) {
  const { updateAnomaly } = useAnomalyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  if (!anomaly) return null;

  const anomalyScore = calculateAnomalyScore(anomaly);

  const handleStatusChange = () => {
    if (editedStatus && editedStatus !== anomaly.status) {
      updateAnomaly(anomaly.id, { 
        status: editedStatus as any,
        resolution_notes: resolutionNotes.trim() || undefined,
      });
      setIsEditing(false);
      setEditedStatus('');
      setResolutionNotes('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'investigating':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'dismissed':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'escalated':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Anomaly Details: {anomaly.id}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                {anomaly.severity}
              </Badge>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 p-1">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Detected</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(anomaly.timestamp)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Entropy</div>
                      <div className="text-xs text-muted-foreground">
                        {anomaly.entropy.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Confidence</div>
                      <div className="text-xs text-muted-foreground">
                        {(anomaly.metadata.confidence_score * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Risk Score</div>
                      <div className="text-xs text-muted-foreground">
                        {anomalyScore}/100
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Score Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Overall Risk Score</Label>
                    <span className="text-sm text-muted-foreground">{anomalyScore}/100</span>
                  </div>
                  <Progress 
                    value={anomalyScore} 
                    className={`h-2 ${
                      anomalyScore >= 80 ? 'bg-red-100' : 
                      anomalyScore >= 60 ? 'bg-yellow-100' : 'bg-green-100'
                    }`}
                  />
                  <div className="text-xs text-muted-foreground">
                    Based on severity, entropy, confidence, recency, and status
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                        <div className="text-sm mt-1">
                          {anomaly.type.replace(/_/g, ' ')}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                        <div className="text-sm mt-1">{anomaly.model}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(anomaly.status)}
                          <Badge variant="outline" className={getStatusColor(anomaly.status)}>
                            {anomaly.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Processing Time</Label>
                        <div className="text-sm mt-1">
                          {anomaly.metadata.processing_time_ms}ms
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                      <div className="text-sm mt-1">{anomaly.description}</div>
                    </div>

                    {anomaly.tags.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {anomaly.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Metrics */}
                {Object.keys(anomaly.metrics).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(anomaly.metrics).map(([key, value]) => (
                          value !== undefined && (
                            <div key={key}>
                              <Label className="text-sm font-medium text-muted-foreground">
                                {key.replace(/_/g, ' ')}
                              </Label>
                              <div className="text-sm mt-1">
                                {typeof value === 'number' ? value.toFixed(3) : value}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Content Analysis
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(anomaly.text_preview)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Text Preview</Label>
                      <div className="mt-2 p-3 bg-muted/20 rounded-md border text-sm font-mono">
                        {anomaly.text_preview}
                      </div>
                    </div>

                    {anomaly.full_text && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Full Text</Label>
                        <ScrollArea className="h-48 mt-2">
                          <div className="p-3 bg-muted/20 rounded-md border text-sm font-mono whitespace-pre-wrap">
                            {anomaly.full_text}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Character Count</Label>
                        <div className="text-sm mt-1">{anomaly.text_preview.length}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Word Count</Label>
                        <div className="text-sm mt-1">
                          {anomaly.text_preview.split(/\s+/).filter(Boolean).length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistical Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Shannon Entropy</Label>
                        <div className="text-sm mt-1">{anomaly.entropy.toFixed(4)}</div>
                        <Progress value={(anomaly.entropy / 10) * 100} className="mt-1 h-1" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Confidence Score</Label>
                        <div className="text-sm mt-1">
                          {(anomaly.metadata.confidence_score * 100).toFixed(2)}%
                        </div>
                        <Progress value={anomaly.metadata.confidence_score * 100} className="mt-1 h-1" />
                      </div>
                    </div>

                    {anomaly.metrics.compression_ratio && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Compression Analysis
                        </Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Compression Ratio:</span>
                            <span>{anomaly.metrics.compression_ratio.toFixed(3)}</span>
                          </div>
                          <Progress 
                            value={anomaly.metrics.compression_ratio * 100} 
                            className="h-1" 
                          />
                        </div>
                      </div>
                    )}

                    {anomaly.metrics.pattern_strength && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Pattern Strength
                        </Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Strength:</span>
                            <span>{(anomaly.metrics.pattern_strength * 100).toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={anomaly.metrics.pattern_strength * 100} 
                            className="h-1" 
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {anomaly.related_anomalies && anomaly.related_anomalies.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Related Anomalies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {anomaly.related_anomalies.map((relatedId) => (
                          <div key={relatedId} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                            <span className="font-mono text-sm">{relatedId}</span>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Analysis Version</Label>
                        <div className="text-sm mt-1">{anomaly.metadata.analysis_version}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Processing Time</Label>
                        <div className="text-sm mt-1">{anomaly.metadata.processing_time_ms}ms</div>
                      </div>
                      {anomaly.metadata.source_ip && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Source IP</Label>
                          <div className="text-sm mt-1 font-mono">{anomaly.metadata.source_ip}</div>
                        </div>
                      )}
                      {anomaly.metadata.session_id && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Session ID</Label>
                          <div className="text-sm mt-1 font-mono">{anomaly.metadata.session_id}</div>
                        </div>
                      )}
                      {anomaly.metadata.request_id && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Request ID</Label>
                          <div className="text-sm mt-1 font-mono">{anomaly.metadata.request_id}</div>
                        </div>
                      )}
                      {anomaly.metadata.user_agent && (
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-muted-foreground">User Agent</Label>
                          <div className="text-sm mt-1 font-mono break-all">
                            {anomaly.metadata.user_agent}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isEditing ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(anomaly.status)}
                          <span className="text-sm">Current Status: </span>
                          <Badge variant="outline" className={getStatusColor(anomaly.status)}>
                            {anomaly.status}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(true);
                            setEditedStatus(anomaly.status);
                            setResolutionNotes(anomaly.resolution_notes || '');
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Change Status
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="status-select">New Status</Label>
                          <Select value={editedStatus} onValueChange={setEditedStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="investigating">Investigating</SelectItem>
                              <SelectItem value="acknowledged">Acknowledged</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="dismissed">Dismissed</SelectItem>
                              <SelectItem value="escalated">Escalated</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="resolution-notes">Resolution Notes</Label>
                          <Textarea
                            id="resolution-notes"
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Add notes about the resolution or action taken..."
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleStatusChange} disabled={!editedStatus}>
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              setEditedStatus('');
                              setResolutionNotes('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {anomaly.resolution_notes && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Previous Resolution Notes
                        </Label>
                        <div className="mt-1 p-3 bg-muted/20 rounded-md border text-sm">
                          {anomaly.resolution_notes}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy ID
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Raw Data
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Mark as Reviewed
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure Alerts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}