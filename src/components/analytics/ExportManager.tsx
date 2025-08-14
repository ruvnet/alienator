import { useState } from 'react';
import { Download, FileText, Table, File, Calendar, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ExportConfig } from '@/types/analytics';
import { format } from 'date-fns';

interface ExportManagerProps {
  onExport: (config: ExportConfig) => Promise<void>;
  isExporting?: boolean;
  availableMetrics: string[];
}

const EXPORT_FORMATS = [
  { 
    id: 'csv', 
    label: 'CSV', 
    description: 'Comma-separated values for spreadsheet analysis',
    icon: Table 
  },
  { 
    id: 'json', 
    label: 'JSON', 
    description: 'JavaScript Object Notation for API integration',
    icon: FileText 
  },
  { 
    id: 'pdf', 
    label: 'PDF', 
    description: 'Portable Document Format with charts and tables',
    icon: File 
  }
];

export function ExportManager({ 
  onExport, 
  isExporting = false, 
  availableMetrics 
}: ExportManagerProps) {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'csv',
    dateRange: {
      start: format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    },
    metrics: ['entropy', 'compression', 'anomalyScore'],
    includeCharts: false
  });

  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(Date.now() - 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = async () => {
    await onExport(exportConfig);
    setIsDialogOpen(false);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setCustomDateRange(range);
    if (range.from && range.to) {
      setExportConfig({
        ...exportConfig,
        dateRange: {
          start: format(range.from, 'yyyy-MM-dd'),
          end: format(range.to, 'yyyy-MM-dd')
        }
      });
    }
  };

  const handleMetricToggle = (metricId: string) => {
    const currentMetrics = exportConfig.metrics;
    const newMetrics = currentMetrics.includes(metricId)
      ? currentMetrics.filter(m => m !== metricId)
      : [...currentMetrics, metricId];
    
    setExportConfig({
      ...exportConfig,
      metrics: newMetrics
    });
  };

  const getSelectedFormat = () => {
    return EXPORT_FORMATS.find(f => f.id === exportConfig.format);
  };

  const quickExportOptions = [
    {
      label: 'Last 24 Hours - CSV',
      config: {
        format: 'csv' as const,
        dateRange: {
          start: format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          end: format(new Date(), 'yyyy-MM-dd')
        },
        metrics: ['entropy', 'compression', 'anomalyScore'],
        includeCharts: false
      }
    },
    {
      label: 'Last 7 Days - JSON',
      config: {
        format: 'json' as const,
        dateRange: {
          start: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          end: format(new Date(), 'yyyy-MM-dd')
        },
        metrics: availableMetrics,
        includeCharts: false
      }
    },
    {
      label: 'Analytics Report - PDF',
      config: {
        format: 'pdf' as const,
        dateRange: {
          start: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          end: format(new Date(), 'yyyy-MM-dd')
        },
        metrics: availableMetrics,
        includeCharts: true
      }
    }
  ];

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Data Export
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Export analytics data in various formats
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Export Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Quick Export</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {quickExportOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 text-left justify-start"
                onClick={() => onExport(option.config)}
                disabled={isExporting}
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.config.metrics.length} metrics
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Custom Export */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Custom Export</h4>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Export Configuration</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Format Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Export Format</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {EXPORT_FORMATS.map(format => {
                        const Icon = format.icon;
                        return (
                          <Button
                            key={format.id}
                            variant={exportConfig.format === format.id ? "default" : "outline"}
                            className="h-auto p-4 flex-col items-start"
                            onClick={() => setExportConfig({ ...exportConfig, format: format.id as any })}
                          >
                            <Icon className="w-5 h-5 mb-2" />
                            <div className="text-left">
                              <div className="font-medium">{format.label}</div>
                              <div className="text-xs opacity-70">{format.description}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <Calendar className="w-4 h-4 mr-2" />
                          {customDateRange.from ? (
                            customDateRange.to ? (
                              <>
                                {format(customDateRange.from, "LLL dd, y")} -{" "}
                                {format(customDateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(customDateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={customDateRange.from}
                          selected={customDateRange}
                          onSelect={handleDateRangeChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Metrics Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Metrics to Include ({exportConfig.metrics.length} selected)
                    </Label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-border/30 rounded-lg">
                      {availableMetrics.map(metric => (
                        <div key={metric} className="flex items-center space-x-2">
                          <Checkbox
                            id={`export-metric-${metric}`}
                            checked={exportConfig.metrics.includes(metric)}
                            onCheckedChange={() => handleMetricToggle(metric)}
                          />
                          <Label
                            htmlFor={`export-metric-${metric}`}
                            className="text-sm cursor-pointer"
                          >
                            {metric.charAt(0).toUpperCase() + metric.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Options */}
                  {exportConfig.format === 'pdf' && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">PDF Options</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="include-charts"
                          checked={exportConfig.includeCharts}
                          onCheckedChange={(checked) => 
                            setExportConfig({ ...exportConfig, includeCharts: checked })
                          }
                        />
                        <Label htmlFor="include-charts" className="text-sm">
                          Include Charts and Visualizations
                        </Label>
                      </div>
                    </div>
                  )}

                  {/* Export Summary */}
                  <div className="p-4 bg-muted/10 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Export Summary</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Format: <Badge variant="outline">{getSelectedFormat()?.label}</Badge></div>
                      <div>
                        Date Range: {format(customDateRange.from || new Date(), 'MM/dd/yyyy')} - {format(customDateRange.to || new Date(), 'MM/dd/yyyy')}
                      </div>
                      <div>Metrics: {exportConfig.metrics.length} selected</div>
                      {exportConfig.format === 'pdf' && (
                        <div>Charts: {exportConfig.includeCharts ? 'Included' : 'Not included'}</div>
                      )}
                    </div>
                  </div>

                  {/* Export Button */}
                  <Button 
                    onClick={handleExport} 
                    disabled={isExporting || exportConfig.metrics.length === 0}
                    className="w-full"
                  >
                    {isExporting ? (
                      <>
                        <Download className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export {getSelectedFormat()?.label}
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-sm text-muted-foreground">
            Configure custom date ranges, metrics, and format options
          </div>
        </div>
      </CardContent>
    </Card>
  );
}