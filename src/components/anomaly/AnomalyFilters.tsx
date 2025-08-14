import { useState } from 'react';
import { 
  Filter, 
  Search, 
  X, 
  Save, 
  RefreshCw, 
  Calendar,
  Tag,
  Bookmark,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAnomalyStore } from '@/stores/anomalyStore';
import { useAnomalyFilters } from '@/hooks/anomaly/useAnomalyFilters';
import { format } from 'date-fns';

export function AnomalyFilters() {
  const { currentFilter, filterPresets, setFilter, resetFilter, saveFilterPreset, loadFilterPreset, deleteFilterPreset } = useAnomalyStore();
  const { filterStats, availableFilters } = useAnomalyFilters();
  const [isExpanded, setIsExpanded] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [showPresetDialog, setShowPresetDialog] = useState(false);

  const handleSeverityChange = (severity: string, checked: boolean) => {
    const newSeverities = checked
      ? [...currentFilter.severity, severity]
      : currentFilter.severity.filter(s => s !== severity);
    setFilter({ severity: newSeverities });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...currentFilter.type, type]
      : currentFilter.type.filter(t => t !== type);
    setFilter({ type: newTypes });
  };

  const handleModelChange = (model: string, checked: boolean) => {
    const newModels = checked
      ? [...currentFilter.model, model]
      : currentFilter.model.filter(m => m !== model);
    setFilter({ model: newModels });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...currentFilter.status, status]
      : currentFilter.status.filter(s => s !== status);
    setFilter({ status: newStatuses });
  };

  const handleTagAdd = (tag: string) => {
    if (!currentFilter.tags.includes(tag)) {
      setFilter({ tags: [...currentFilter.tags, tag] });
    }
  };

  const handleTagRemove = (tag: string) => {
    setFilter({ tags: currentFilter.tags.filter(t => t !== tag) });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      saveFilterPreset(presetName.trim(), presetDescription.trim());
      setPresetName('');
      setPresetDescription('');
      setShowPresetDialog(false);
    }
  };

  const hasActiveFilters = 
    currentFilter.search ||
    currentFilter.severity.length > 0 ||
    currentFilter.type.length > 0 ||
    currentFilter.model.length > 0 ||
    currentFilter.status.length > 0 ||
    currentFilter.tags.length > 0 ||
    currentFilter.dateRange.start ||
    currentFilter.dateRange.end ||
    currentFilter.entropyRange.min > 0 ||
    currentFilter.entropyRange.max < 10 ||
    currentFilter.confidenceRange.min > 0 ||
    currentFilter.confidenceRange.max < 1;

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filterStats.filtered} of {filterStats.total}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilter}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
            <Dialog open={showPresetDialog} onOpenChange={setShowPresetDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!hasActiveFilters}>
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Filter Preset</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="preset-name">Preset Name</Label>
                    <Input
                      id="preset-name"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="Enter preset name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preset-description">Description (optional)</Label>
                    <Textarea
                      id="preset-description"
                      value={presetDescription}
                      onChange={(e) => setPresetDescription(e.target.value)}
                      placeholder="Describe this filter configuration"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowPresetDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
                      Save Preset
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search anomalies by ID, description, or content..."
            value={currentFilter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="pl-10 bg-muted/20 border-border/50"
          />
        </div>

        {/* Filter Presets */}
        {filterPresets.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Saved Presets</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {filterPresets.map((preset) => (
                <div key={preset.id} className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadFilterPreset(preset.id)}
                    className="text-xs"
                  >
                    <Bookmark className="w-3 h-3 mr-1" />
                    {preset.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFilterPreset(preset.id)}
                    className="text-xs px-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isExpanded && (
          <>
            <Separator />

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {currentFilter.dateRange.start ? (
                        format(currentFilter.dateRange.start, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={currentFilter.dateRange.start || undefined}
                      onSelect={(date) => setFilter({ 
                        dateRange: { ...currentFilter.dateRange, start: date || null }
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-sm font-medium">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {currentFilter.dateRange.end ? (
                        format(currentFilter.dateRange.end, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={currentFilter.dateRange.end || undefined}
                      onSelect={(date) => setFilter({ 
                        dateRange: { ...currentFilter.dateRange, end: date || null }
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Severity */}
            <div>
              <Label className="text-sm font-medium">Severity</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableFilters.severities.map((severity) => (
                  <div key={severity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`severity-${severity}`}
                      checked={currentFilter.severity.includes(severity)}
                      onCheckedChange={(checked) => handleSeverityChange(severity, !!checked)}
                    />
                    <Label htmlFor={`severity-${severity}`} className="text-sm capitalize">
                      {severity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <Label className="text-sm font-medium">Anomaly Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableFilters.types.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={currentFilter.type.includes(type)}
                      onCheckedChange={(checked) => handleTypeChange(type, !!checked)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">
                      {type.replace(/_/g, ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Model */}
            <div>
              <Label className="text-sm font-medium">Model</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableFilters.models.map((model) => (
                  <div key={model} className="flex items-center space-x-2">
                    <Checkbox
                      id={`model-${model}`}
                      checked={currentFilter.model.includes(model)}
                      onCheckedChange={(checked) => handleModelChange(model, !!checked)}
                    />
                    <Label htmlFor={`model-${model}`} className="text-sm">
                      {model}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableFilters.statuses.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={currentFilter.status.includes(status)}
                      onCheckedChange={(checked) => handleStatusChange(status, !!checked)}
                    />
                    <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Entropy Range */}
            <div>
              <Label className="text-sm font-medium">
                Entropy Range: {currentFilter.entropyRange.min.toFixed(1)} - {currentFilter.entropyRange.max.toFixed(1)}
              </Label>
              <div className="px-2 mt-2">
                <Slider
                  value={[currentFilter.entropyRange.min, currentFilter.entropyRange.max]}
                  onValueChange={([min, max]) => setFilter({ 
                    entropyRange: { min, max }
                  })}
                  max={10}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Confidence Range */}
            <div>
              <Label className="text-sm font-medium">
                Confidence Range: {(currentFilter.confidenceRange.min * 100).toFixed(0)}% - {(currentFilter.confidenceRange.max * 100).toFixed(0)}%
              </Label>
              <div className="px-2 mt-2">
                <Slider
                  value={[currentFilter.confidenceRange.min, currentFilter.confidenceRange.max]}
                  onValueChange={([min, max]) => setFilter({ 
                    confidenceRange: { min, max }
                  })}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="space-y-2 mt-2">
                <Select onValueChange={handleTagAdd}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add tag filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFilters.tags
                      .filter(tag => !currentFilter.tags.includes(tag))
                      .map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                {currentFilter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {currentFilter.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-1 h-auto p-0 text-xs"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Showing {filterStats.filtered} of {filterStats.total} anomalies
              {filterStats.percentage < 100 && (
                <span className="ml-1">
                  ({filterStats.percentage}% visible, {filterStats.hidden} hidden)
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}