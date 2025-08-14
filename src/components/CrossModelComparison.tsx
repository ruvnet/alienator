/**
 * Cross-Model Comparison Component
 * Compares AI outputs across different models with metrics and analysis
 */

import React, { useState, useCallback, useMemo } from 'react';
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
  Textarea 
} from '../components/ui/textarea';
import { 
  Progress 
} from '../components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { 
  Checkbox 
} from '../components/ui/checkbox';
import { 
  Separator 
} from '../components/ui/separator';
import { 
  Alert, 
  AlertDescription 
} from '../components/ui/alert';
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
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '../components/ui/chart';

import { 
  Play, 
  Settings, 
  BarChart3, 
  Grid3X3, 
  Clock, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Eye, 
  Download, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  Filter
} from 'lucide-react';

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter 
} from 'recharts';

import { useAIModels, useCrossModelComparison } from '../hooks/useAIModels';
import { AIModel, ModelResponse, ComparisonResult } from '../types/ai-models';

export interface CrossModelComparisonProps {
  className?: string;
  onComparisonComplete?: (result: ComparisonResult) => void;
  defaultPrompt?: string;
  preselectedModels?: string[];
}

const CrossModelComparison: React.FC<CrossModelComparisonProps> = ({
  className = '',
  onComparisonComplete,
  defaultPrompt = '',
  preselectedModels = []
}) => {
  const { models, enabledModels, modelsByProvider } = useAIModels();
  const {
    selectedModels,
    currentPrompt,
    isLoading,
    activeComparison,
    comparisonHistory,
    viewMode,
    filters,
    runComparison,
    selectModel,
    clearSelection,
    setPrompt,
    setViewMode,
    updateFilters,
    filteredHistory,
    comparisonStats
  } = useCrossModelComparison();

  // Initialize with preselected models
  React.useEffect(() => {
    if (preselectedModels.length > 0) {
      preselectedModels.forEach(modelId => selectModel(modelId));
    }
  }, [preselectedModels, selectModel]);

  // Initialize with default prompt
  React.useEffect(() => {
    if (defaultPrompt) {
      setPrompt(defaultPrompt);
    }
  }, [defaultPrompt, setPrompt]);

  const handleRunComparison = useCallback(async () => {
    if (!currentPrompt.trim() || selectedModels.length === 0) {
      return;
    }

    try {
      const result = await runComparison(currentPrompt, selectedModels);
      onComparisonComplete?.(result);
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  }, [currentPrompt, selectedModels, runComparison, onComparisonComplete]);

  const selectedModelObjects = useMemo(() => 
    models.filter(model => selectedModels.includes(model.id)),
    [models, selectedModels]
  );

  const estimatedCost = useMemo(() => {
    const promptTokens = Math.ceil(currentPrompt.length / 4); // Rough estimation
    return selectedModelObjects.reduce((total, model) => {
      return total + (promptTokens * model.costPerToken);
    }, 0);
  }, [selectedModelObjects, currentPrompt]);

  const comparisonData = useMemo(() => {
    if (!activeComparison) return null;

    return {
      responses: activeComparison.responses,
      metrics: activeComparison.metrics,
      analysis: activeComparison.analysis,
      chartData: activeComparison.responses.map(response => {
        const model = models.find(m => m.id === response.modelId);
        return {
          model: model?.name || response.modelId,
          responseTime: response.duration,
          cost: response.cost,
          tokens: response.tokenCount,
          quality: activeComparison.analysis.quality[response.modelId]?.overall || 0,
          sentiment: activeComparison.analysis.sentiment[response.modelId]?.positive || 0
        };
      })
    };
  }, [activeComparison, models]);

  const ModelSelector = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5" />
          Select Models
        </CardTitle>
        <CardDescription>
          Choose AI models to compare. Selected: {selectedModels.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(modelsByProvider).map(([provider, providerModels]) => (
            providerModels.length > 0 && (
              <div key={provider} className="space-y-2">
                <h4 className="font-medium capitalize flex items-center gap-2">
                  {provider}
                  <Badge variant="secondary">{providerModels.length}</Badge>
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {providerModels.map(model => (
                    <div key={model.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={model.id}
                        checked={selectedModels.includes(model.id)}
                        disabled={!model.enabled}
                        onCheckedChange={() => selectModel(model.id)}
                      />
                      <label 
                        htmlFor={model.id} 
                        className="flex-1 text-sm cursor-pointer flex items-center justify-between"
                      >
                        <span className={!model.enabled ? 'text-muted-foreground' : ''}>
                          {model.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {model.version}
                          </Badge>
                          {!model.enabled && (
                            <Badge variant="destructive" className="text-xs">
                              Disabled
                            </Badge>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearSelection}
            disabled={selectedModels.length === 0}
          >
            Clear All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              enabledModels.forEach(model => {
                if (!selectedModels.includes(model.id)) {
                  selectModel(model.id);
                }
              });
            }}
            disabled={selectedModels.length === enabledModels.length}
          >
            Select All
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PromptInput = () => (
    <Card>
      <CardHeader>
        <CardTitle>Prompt</CardTitle>
        <CardDescription>
          Enter the prompt you want to test across selected models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter your prompt here..."
          value={currentPrompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px]"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Characters: {currentPrompt.length}</span>
            <span>Est. tokens: {Math.ceil(currentPrompt.length / 4)}</span>
            <span>Est. cost: ${estimatedCost.toFixed(6)}</span>
          </div>
          <Button 
            onClick={handleRunComparison}
            disabled={!currentPrompt.trim() || selectedModels.length === 0 || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isLoading ? 'Running...' : 'Run Comparison'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ResponseCard = ({ response }: { response: ModelResponse }) => {
    const model = models.find(m => m.id === response.modelId);
    const quality = activeComparison?.analysis.quality[response.modelId];
    const sentiment = activeComparison?.analysis.sentiment[response.modelId];

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {model?.name || response.modelId}
              <Badge variant="outline">{model?.provider}</Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy response</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <CardDescription>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {response.duration.toFixed(0)}ms
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                ${response.cost.toFixed(6)}
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {response.tokenCount} tokens
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] mb-4">
            <p className="text-sm whitespace-pre-wrap">{response.response}</p>
          </ScrollArea>
          
          {quality && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Quality Metrics</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Clarity:</span>
                  <Progress value={quality.clarity * 100} className="h-1 mt-1" />
                </div>
                <div>
                  <span className="text-muted-foreground">Relevance:</span>
                  <Progress value={quality.relevance * 100} className="h-1 mt-1" />
                </div>
                <div>
                  <span className="text-muted-foreground">Completeness:</span>
                  <Progress value={quality.completeness * 100} className="h-1 mt-1" />
                </div>
                <div>
                  <span className="text-muted-foreground">Overall:</span>
                  <Progress value={quality.overall * 100} className="h-1 mt-1" />
                </div>
              </div>
            </div>
          )}

          {sentiment && (
            <div className="mt-4 space-y-2">
              <h5 className="text-sm font-medium">Sentiment Analysis</h5>
              <div className="flex gap-2 text-xs">
                <Badge variant="outline" className="text-green-600">
                  Positive: {(sentiment.positive * 100).toFixed(1)}%
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  Negative: {(sentiment.negative * 100).toFixed(1)}%
                </Badge>
                <Badge variant="outline" className="text-gray-600">
                  Neutral: {(sentiment.neutral * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const MetricsView = () => {
    if (!comparisonData) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-semibold">
                    {activeComparison.metrics.averageResponseTime.toFixed(0)}ms
                  </p>
                </div>
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-semibold">
                    ${activeComparison.metrics.totalCost.toFixed(6)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tokens</p>
                  <p className="text-2xl font-semibold">
                    {activeComparison.metrics.totalTokens.toLocaleString()}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-semibold">
                    {(activeComparison.metrics.successRate * 100).toFixed(1)}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  responseTime: { label: 'Response Time (ms)', color: '#8884d8' },
                  cost: { label: 'Cost ($)', color: '#82ca9d' }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="responseTime" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="cost" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quality Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  quality: { label: 'Quality Score', color: '#8884d8' }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={comparisonData.chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="model" />
                    <PolarRadiusAxis angle={90} domain={[0, 1]} />
                    <Radar 
                      name="Quality" 
                      dataKey="quality" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const ComparisonView = () => {
    if (!activeComparison) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Comparison Results</h3>
            <p className="text-muted-foreground mb-4">
              Run a comparison to see results here
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeComparison.responses.map(response => (
            <ResponseCard key={response.id} response={response} />
          ))}
        </div>
      </div>
    );
  };

  const HistoryView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Comparison History</h3>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter History</SheetTitle>
                <SheetDescription>
                  Filter comparisons by various criteria
                </SheetDescription>
              </SheetHeader>
              {/* Filter controls would go here */}
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold">{comparisonStats.total}</p>
            <p className="text-sm text-muted-foreground">Total Comparisons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold">${comparisonStats.avgCost.toFixed(6)}</p>
            <p className="text-sm text-muted-foreground">Avg Cost</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold">{comparisonStats.avgTime.toFixed(0)}ms</p>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredHistory.map(comparison => (
          <Card key={comparison.requestId} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">
                  {comparison.responses[0]?.prompt.substring(0, 100)}...
                </h4>
                <Badge variant="outline">
                  {comparison.responses.length} models
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{new Date(comparison.responses[0]?.timestamp).toLocaleString()}</span>
                <span>${comparison.metrics.totalCost.toFixed(6)}</span>
                <span>{comparison.metrics.averageResponseTime.toFixed(0)}ms</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cross-Model Comparison</h2>
          <p className="text-muted-foreground">
            Compare AI model outputs across different providers and analyze performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="comparison">Comparison</SelectItem>
              <SelectItem value="metrics">Metrics</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <ModelSelector />
          <PromptInput />
        </div>
        
        <div className="lg:col-span-2">
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Responses
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="comparison">
                <ComparisonView />
              </TabsContent>
              
              <TabsContent value="metrics">
                <MetricsView />
              </TabsContent>
              
              <TabsContent value="grid">
                <HistoryView />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CrossModelComparison;