import { useState } from 'react';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  File,
  Calendar,
  Filter,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAnomalyFilters } from '@/hooks/anomaly/useAnomalyFilters';
import { exportAnomalyData, generateAnomalyReport } from '@/utils/anomalyUtils';
import { format } from 'date-fns';

interface ExportConfig {
  format: 'csv' | 'json' | 'xlsx' | 'pdf';
  includeFields: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  includeMetadata: boolean;
  includeFullText: boolean;
  filterBySeverity: string[];
  includeAnalysis: boolean;
  generateReport: boolean;
}

export function AnomalyExport() {
  const { filteredAnomalies, currentFilter, filterStats } = useAnomalyFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'preparing' | 'exporting' | 'complete' | 'error'>('idle');
  const [lastExport, setLastExport] = useState<{ filename: string; count: number; timestamp: Date } | null>(null);

  const [config, setConfig] = useState<ExportConfig>({
    format: 'csv',
    includeFields: ['id', 'timestamp', 'severity', 'type', 'model', 'description', 'entropy', 'status'],
    dateRange: {
      start: null,
      end: null,
    },
    includeMetadata: true,
    includeFullText: false,
    filterBySeverity: [],
    includeAnalysis: false,
    generateReport: true,
  });

  const availableFields = [
    { id: 'id', label: 'Anomaly ID', required: true },
    { id: 'timestamp', label: 'Timestamp', required: true },
    { id: 'severity', label: 'Severity', required: false },
    { id: 'type', label: 'Type', required: false },
    { id: 'model', label: 'Model', required: false },
    { id: 'description', label: 'Description', required: false },
    { id: 'entropy', label: 'Entropy Value', required: false },
    { id: 'status', label: 'Status', required: false },
    { id: 'tags', label: 'Tags', required: false },
    { id: 'confidence', label: 'Confidence Score', required: false },
    { id: 'text_preview', label: 'Text Preview', required: false },
    { id: 'processing_time', label: 'Processing Time', required: false },
  ];

  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    const field = availableFields.find(f => f.id === fieldId);
    if (field?.required) return; // Don't allow toggling required fields

    setConfig(prev => ({
      ...prev,
      includeFields: checked 
        ? [...prev.includeFields, fieldId]
        : prev.includeFields.filter(f => f !== fieldId),
    }));
  };

  const handleSeverityToggle = (severity: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      filterBySeverity: checked
        ? [...prev.filterBySeverity, severity]
        : prev.filterBySeverity.filter(s => s !== severity),
    }));
  };

  const getFilteredData = () => {
    let data = [...filteredAnomalies];

    // Apply date range filter
    if (config.dateRange.start) {
      data = data.filter(item => item.timestamp >= config.dateRange.start!);
    }
    if (config.dateRange.end) {
      data = data.filter(item => item.timestamp <= config.dateRange.end!);
    }

    // Apply severity filter
    if (config.filterBySeverity.length > 0) {
      data = data.filter(item => config.filterBySeverity.includes(item.severity));
    }

    return data;
  };

  const simulateExport = async () => {
    setIsExporting(true);
    setExportStatus('preparing');
    setExportProgress(0);

    // Simulate preparation
    await new Promise(resolve => setTimeout(resolve, 500));
    setExportProgress(20);

    setExportStatus('exporting');
    
    // Simulate data processing
    for (let i = 20; i <= 90; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setExportProgress(i);
    }

    // Simulate file generation
    await new Promise(resolve => setTimeout(resolve, 800));
    setExportProgress(100);
    setExportStatus('complete');

    const data = getFilteredData();
    const timestamp = new Date();
    const filename = `anomaly_export_${format(timestamp, 'yyyy-MM-dd_HH-mm-ss')}.${config.format}`;
    
    setLastExport({
      filename,
      count: data.length,
      timestamp,
    });

    // In a real implementation, this would trigger the actual download
    console.log('Export completed:', { filename, count: data.length, config });

    setTimeout(() => {
      setIsExporting(false);
      setExportStatus('idle');
      setExportProgress(0);
    }, 2000);
  };

  const handleExport = async () => {
    try {
      await simulateExport();
      
      // In a real implementation:
      const data = getFilteredData();
      
      if (config.generateReport) {
        const report = generateAnomalyReport(data, {
          start: config.dateRange.start || new Date(Date.now() - 24 * 60 * 60 * 1000),
          end: config.dateRange.end || new Date(),
        });
        console.log('Generated report:', report);
      }

      const exportedData = exportAnomalyData(data, config.format);
      
      // Create and trigger download
      const blob = new Blob([exportedData], { 
        type: config.format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = lastExport?.filename || `anomaly_export.${config.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      setExportStatus('error');
      console.error('Export failed:', error);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return <FileSpreadsheet className="w-4 h-4" />;
      case 'json': return <FileText className="w-4 h-4" />;
      case 'xlsx': return <FileSpreadsheet className="w-4 h-4" />;
      case 'pdf': return <File className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getStatusIcon = () => {
    switch (exportStatus) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'preparing': 
      case 'exporting': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Anomaly Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          {/* Export Status */}
          {exportStatus !== 'idle' && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon()}
                      <span className="text-sm font-medium capitalize">
                        {exportStatus === 'preparing' && 'Preparing export...'}
                        {exportStatus === 'exporting' && 'Exporting data...'}
                        {exportStatus === 'complete' && 'Export completed successfully'}
                        {exportStatus === 'error' && 'Export failed'}
                      </span>
                    </div>
                    {exportStatus !== 'idle' && exportStatus !== 'complete' && exportStatus !== 'error' && (
                      <span className="text-xs text-muted-foreground">{exportProgress}%</span>
                    )}
                  </div>
                  
                  {(exportStatus === 'preparing' || exportStatus === 'exporting') && (
                    <Progress value={exportProgress} className="h-2" />
                  )}
                  
                  {exportStatus === 'complete' && lastExport && (
                    <div className="text-xs text-muted-foreground">
                      Exported {lastExport.count} records to {lastExport.filename}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Filter Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Current Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Records:</span>
                  <div className="font-medium">{filterStats.filtered}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Time Range:</span>
                  <div className="font-medium">
                    {currentFilter.dateRange.start && currentFilter.dateRange.end 
                      ? `${format(currentFilter.dateRange.start, 'MMM dd')} - ${format(currentFilter.dateRange.end, 'MMM dd')}`
                      : 'All time'
                    }
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Severity Filter:</span>
                  <div className="font-medium">
                    {currentFilter.severity.length > 0 ? currentFilter.severity.join(', ') : 'All'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Search:</span>
                  <div className="font-medium">
                    {currentFilter.search || 'None'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Format */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {['csv', 'json', 'xlsx', 'pdf'].map((format) => (
                  <Button
                    key={format}
                    variant={config.format === format ? 'default' : 'outline'}
                    onClick={() => setConfig(prev => ({ ...prev, format: format as any }))}
                    className="flex items-center justify-start gap-2 h-auto p-3"
                  >
                    {getFormatIcon(format)}
                    <div className="text-left">
                      <div className="font-medium">{format.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">
                        {format === 'csv' && 'Comma-separated values'}
                        {format === 'json' && 'JavaScript Object Notation'}
                        {format === 'xlsx' && 'Excel spreadsheet'}
                        {format === 'pdf' && 'Portable Document Format'}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Field Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Include Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={config.includeFields.includes(field.id)}
                      onCheckedChange={(checked) => handleFieldToggle(field.id, !!checked)}
                      disabled={field.required}
                    />
                    <Label htmlFor={field.id} className="text-sm">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Additional Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Severity Filter */}
              <div>
                <Label className="text-sm font-medium">Filter by Severity</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['critical', 'high', 'medium', 'low'].map((severity) => (
                    <div key={severity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`export-severity-${severity}`}
                        checked={config.filterBySeverity.includes(severity)}
                        onCheckedChange={(checked) => handleSeverityToggle(severity, !!checked)}
                      />
                      <Label htmlFor={`export-severity-${severity}`} className="text-sm capitalize">
                        {severity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range Override */}
              <div>
                <Label className="text-sm font-medium">Custom Date Range (optional)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    type="date"
                    value={config.dateRange.start ? format(config.dateRange.start, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value ? new Date(e.target.value) : null }
                    }))}
                  />
                  <Input
                    type="date"
                    value={config.dateRange.end ? format(config.dateRange.end, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value ? new Date(e.target.value) : null }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Include metadata</Label>
                <Checkbox
                  checked={config.includeMetadata}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeMetadata: !!checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Include full text content</Label>
                <Checkbox
                  checked={config.includeFullText}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeFullText: !!checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Include analysis data</Label>
                <Checkbox
                  checked={config.includeAnalysis}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeAnalysis: !!checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Generate summary report</Label>
                <Checkbox
                  checked={config.generateReport}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, generateReport: !!checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Records to export:</span>
                  <span className="font-medium">{getFilteredData().length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{config.format.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fields:</span>
                  <span className="font-medium">{config.includeFields.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated size:</span>
                  <span className="font-medium">
                    {((getFilteredData().length * config.includeFields.length * 50) / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || getFilteredData().length === 0}
            className="flex items-center gap-2"
          >
            {getStatusIcon()}
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}