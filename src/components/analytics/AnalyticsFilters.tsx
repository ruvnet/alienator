import { useState } from 'react';
import { CalendarDays, Download, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AnalyticsFilter, TimeRangeFilter } from '@/types/analytics';
import { format } from 'date-fns';

interface AnalyticsFiltersProps {
  filters: AnalyticsFilter;
  onFiltersChange: (filters: AnalyticsFilter) => void;
  onExport: (format: 'csv' | 'json' | 'pdf') => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const TIME_RANGES: TimeRangeFilter[] = [
  { value: '1h', label: 'Last Hour', hours: 1 },
  { value: '6h', label: 'Last 6 Hours', hours: 6 },
  { value: '24h', label: 'Last 24 Hours', hours: 24 },
  { value: '7d', label: 'Last 7 Days', hours: 168 },
  { value: '30d', label: 'Last 30 Days', hours: 720 },
  { value: 'custom', label: 'Custom Range', hours: 0 }
];

const AVAILABLE_METRICS = [
  { id: 'entropy', label: 'Entropy' },
  { id: 'compression', label: 'Compression Ratio' },
  { id: 'anomalyScore', label: 'Anomaly Score' },
  { id: 'patternComplexity', label: 'Pattern Complexity' },
  { id: 'modelConfidence', label: 'Model Confidence' },
  { id: 'detectionAccuracy', label: 'Detection Accuracy' },
  { id: 'processingTime', label: 'Processing Time' },
  { id: 'memoryUsage', label: 'Memory Usage' },
  { id: 'cpuUsage', label: 'CPU Usage' }
];

const AVAILABLE_MODELS = [
  { id: 'gpt-4', label: 'GPT-4' },
  { id: 'claude-3', label: 'Claude-3' },
  { id: 'cohere', label: 'Cohere Command' },
  { id: 'all', label: 'All Models' }
];

const SEVERITY_LEVELS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'critical', label: 'Critical' }
];

const PATTERN_TYPES = [
  { id: 'linguistic', label: 'Linguistic' },
  { id: 'cryptographic', label: 'Cryptographic' },
  { id: 'compression', label: 'Compression' },
  { id: 'entropy', label: 'Entropy' }
];

export function AnalyticsFilters({ 
  filters, 
  onFiltersChange, 
  onExport, 
  onRefresh, 
  isLoading = false 
}: AnalyticsFiltersProps) {
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const handleTimeRangeChange = (value: string) => {
    const timeRange = TIME_RANGES.find(tr => tr.value === value);
    if (timeRange) {
      onFiltersChange({
        ...filters,
        timeRange
      });
    }
  };

  const handleMetricToggle = (metricId: string) => {
    const currentMetrics = filters.metrics;
    const newMetrics = currentMetrics.includes(metricId)
      ? currentMetrics.filter(m => m !== metricId)
      : [...currentMetrics, metricId];
    
    onFiltersChange({
      ...filters,
      metrics: newMetrics
    });
  };

  const handleModelToggle = (modelId: string) => {
    const currentModels = filters.models;
    const newModels = currentModels.includes(modelId)
      ? currentModels.filter(m => m !== modelId)
      : [...currentModels, modelId];
    
    onFiltersChange({
      ...filters,
      models: newModels
    });
  };

  const handleSeverityToggle = (severityId: string) => {
    const currentLevels = filters.severityLevels;
    const newLevels = currentLevels.includes(severityId)
      ? currentLevels.filter(s => s !== severityId)
      : [...currentLevels, severityId];
    
    onFiltersChange({
      ...filters,
      severityLevels: newLevels
    });
  };

  const handlePatternTypeToggle = (typeId: string) => {
    const currentTypes = filters.patternTypes;
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(t => t !== typeId)
      : [...currentTypes, typeId];
    
    onFiltersChange({
      ...filters,
      patternTypes: newTypes
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      timeRange: TIME_RANGES[2], // Default to 24h
      metrics: ['entropy', 'compression', 'anomalyScore'],
      models: ['all'],
      severityLevels: ['low', 'medium', 'high', 'critical'],
      patternTypes: ['linguistic', 'cryptographic', 'compression', 'entropy']
    });
  };

  const getActiveFiltersCount = () => {
    return filters.metrics.length + 
           (filters.models.includes('all') ? 0 : filters.models.length) +
           filters.severityLevels.length +
           filters.patternTypes.length;
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Analytics Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Time Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Time Range</Label>
            <Select value={filters.timeRange.value} onValueChange={handleTimeRangeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {filters.timeRange.value === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarDays className="w-4 h-4 mr-2" />
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
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={customDateRange.from}
                    selected={customDateRange}
                    onSelect={setCustomDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Export Data</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('csv')}
                className="flex-1"
              >
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('json')}
                className="flex-1"
              >
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('pdf')}
                className="flex-1"
              >
                PDF
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Metrics */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Metrics ({filters.metrics.length} selected)
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {AVAILABLE_METRICS.map(metric => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`metric-${metric.id}`}
                    checked={filters.metrics.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle(metric.id)}
                  />
                  <Label
                    htmlFor={`metric-${metric.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {metric.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Models */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Models ({filters.models.includes('all') ? 'All' : filters.models.length} selected)
            </Label>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map(model => (
                <div key={model.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`model-${model.id}`}
                    checked={filters.models.includes(model.id)}
                    onCheckedChange={() => handleModelToggle(model.id)}
                  />
                  <Label
                    htmlFor={`model-${model.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {model.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Levels */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Severity ({filters.severityLevels.length} selected)
            </Label>
            <div className="space-y-2">
              {SEVERITY_LEVELS.map(level => (
                <div key={level.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`severity-${level.id}`}
                    checked={filters.severityLevels.includes(level.id)}
                    onCheckedChange={() => handleSeverityToggle(level.id)}
                  />
                  <Label
                    htmlFor={`severity-${level.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Pattern Types ({filters.patternTypes.length} selected)
            </Label>
            <div className="space-y-2">
              {PATTERN_TYPES.map(type => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pattern-${type.id}`}
                    checked={filters.patternTypes.includes(type.id)}
                    onCheckedChange={() => handlePatternTypeToggle(type.id)}
                  />
                  <Label
                    htmlFor={`pattern-${type.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}