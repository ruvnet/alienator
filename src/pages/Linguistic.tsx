import { useState, useEffect, useMemo } from "react";
import { Languages, BookOpen, MessageSquare, TrendingUp, Search, Download, Brain, Zap, Target, Network, FileText, BarChart3, Users, Eye, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Chart } from "@/components/ui/chart";

const mockLinguisticMetrics = [
  { metric: "Lexical Diversity", value: 0.73, threshold: 0.5, status: "high" },
  { metric: "Syntactic Complexity", value: 0.42, threshold: 0.6, status: "normal" },
  { metric: "Semantic Coherence", value: 0.89, threshold: 0.7, status: "high" },
  { metric: "Readability Score", value: 0.67, threshold: 0.5, status: "high" },
  { metric: "Sentiment Polarity", value: 0.23, threshold: 0.8, status: "normal" },
  { metric: "Formality Index", value: 0.55, threshold: 0.4, status: "high" },
];

const mockStyleAnalysis = [
  { feature: "Average Sentence Length", value: "18.5 words", anomaly: false, expected: "15-20 words", details: "Within normal range for technical writing" },
  { feature: "Passive Voice Usage", value: "12%", anomaly: false, expected: "10-15%", details: "Appropriate for academic discourse" },
  { feature: "Modal Verb Frequency", value: "8%", anomaly: true, expected: "2-4%", details: "Unusually high, indicates uncertainty or speculation" },
  { feature: "Adverb Density", value: "5.2%", anomaly: false, expected: "4-6%", details: "Normal descriptive language usage" },
  { feature: "Punctuation Patterns", value: "Standard", anomaly: false, expected: "Standard", details: "Consistent with style guides" },
  { feature: "Vocabulary Level", value: "Advanced", anomaly: true, expected: "Intermediate", details: "Complex terminology may indicate AI generation" },
  { feature: "Sentence Complexity", value: "3.2 clauses/sentence", anomaly: true, expected: "2-2.5", details: "High complexity, nested structures" },
  { feature: "Discourse Markers", value: "23 per 1000 words", anomaly: false, expected: "20-25", details: "Good logical flow indicators" },
];

const mockSemanticFeatures = [
  { feature: "Topic Coherence", score: 0.87, threshold: 0.7, status: "high", description: "Strong thematic consistency" },
  { feature: "Semantic Density", score: 0.73, threshold: 0.6, status: "high", description: "Rich conceptual content" },
  { feature: "Lexical Cohesion", score: 0.65, threshold: 0.5, status: "high", description: "Good word relationship patterns" },
  { feature: "Conceptual Drift", score: 0.12, threshold: 0.3, status: "normal", description: "Minimal topic deviation" },
  { feature: "Abstractness Level", score: 0.78, threshold: 0.6, status: "high", description: "High abstract concept usage" },
  { feature: "Semantic Novelty", score: 0.34, threshold: 0.4, status: "normal", description: "Standard concept combinations" },
];

const mockSyntaxAnomalies = [
  { 
    anomaly: "Unusual prepositional phrase placement", 
    frequency: 7, 
    severity: "medium", 
    examples: ["In the context of AI, the system generates...", "For the purpose of analysis, we examine..."],
    explanation: "Non-standard phrase positioning may indicate AI text generation patterns"
  },
  { 
    anomaly: "Repetitive sentence structures", 
    frequency: 12, 
    severity: "high", 
    examples: ["The model performs X. The system executes Y. The algorithm implements Z."],
    explanation: "Consistent parallel structure suggests template-based generation"
  },
  { 
    anomaly: "Subordinate clause overuse", 
    frequency: 15, 
    severity: "medium", 
    examples: ["Text that contains clauses which demonstrate patterns that indicate..."],
    explanation: "Excessive embedding creates unnatural complexity"
  },
  { 
    anomaly: "Modal hedge clustering", 
    frequency: 9, 
    severity: "low", 
    examples: ["It might possibly suggest that there could potentially be..."],
    explanation: "Multiple uncertainty markers in close proximity"
  },
];

const mockModelComparison = [
  {
    model: "GPT-4",
    similarity: 0.73,
    confidence: 0.89,
    characteristics: ["Complex syntax", "Technical vocabulary", "Formal register"],
    anomalyRate: 15.2,
    typicalPatterns: ["Explanatory phrases", "Qualifying statements", "Structured arguments"]
  },
  {
    model: "Claude-3",
    similarity: 0.81,
    confidence: 0.92,
    characteristics: ["Balanced complexity", "Natural flow", "Contextual awareness"],
    anomalyRate: 12.7,
    typicalPatterns: ["Nuanced expressions", "Conversational elements", "Thoughtful transitions"]
  },
  {
    model: "Cohere",
    similarity: 0.45,
    confidence: 0.67,
    characteristics: ["Concise style", "Direct statements", "Factual focus"],
    anomalyRate: 8.9,
    typicalPatterns: ["Short sentences", "Clear structure", "Minimal hedging"]
  },
  {
    model: "Human (Academic)",
    similarity: 0.56,
    confidence: 0.78,
    characteristics: ["Variable complexity", "Personal markers", "Discourse flow"],
    anomalyRate: 22.1,
    typicalPatterns: ["Informal interjections", "Self-corrections", "Emotional undertones"]
  },
];

const mockPatterns = [
  {
    pattern: "Repetitive phrase structures",
    frequency: 23,
    confidence: 0.87,
    examples: ["The AI model generates...", "The system produces...", "The algorithm creates..."],
    anomalous: true,
  },
  {
    pattern: "Unusual word combinations",
    frequency: 7,
    confidence: 0.73,
    examples: ["quantum semantics", "digital consciousness", "algorithmic intuition"],
    anomalous: true,
  },
  {
    pattern: "Inconsistent register shifts",
    frequency: 12,
    confidence: 0.65,
    examples: ["Formal academic → colloquial", "Technical → conversational"],
    anomalous: false,
  },
];

export default function Linguistic() {
  const [inputText, setInputText] = useState("The linguistic analysis system employs advanced natural language processing techniques to identify anomalous patterns in AI-generated text. This comprehensive approach examines syntactic structures, semantic relationships, and stylistic features to detect deviations from expected human language patterns.");
  const [analysisLanguage, setAnalysisLanguage] = useState("en");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [sensitivityLevel, setSensitivityLevel] = useState([75]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [activeVisualization, setActiveVisualization] = useState("network");
  const [comparisonMode, setComparisonMode] = useState("similarity");

  const filteredMetrics = selectedMetric === "all" 
    ? mockLinguisticMetrics 
    : mockLinguisticMetrics.filter(m => m.status === selectedMetric);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResults({
        wordCount: inputText.split(/\s+/).length,
        sentenceCount: inputText.split(/[.!?]+/).length - 1,
        avgWordLength: inputText.replace(/\s+/g, '').length / inputText.split(/\s+/).length,
        vocabularyRichness: new Set(inputText.toLowerCase().split(/\s+/)).size / inputText.split(/\s+/).length,
        timestamp: Date.now(),
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const textStatistics = useMemo(() => {
    const words = inputText.split(/\s+/).filter(w => w.length > 0);
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const characters = inputText.replace(/\s/g, '');
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      charCount: characters.length,
      avgWordsPerSentence: words.length / Math.max(sentences.length, 1),
      avgCharsPerWord: characters.length / Math.max(words.length, 1),
      uniqueWords: new Set(words.map(w => w.toLowerCase())).size,
      vocabularyRichness: new Set(words.map(w => w.toLowerCase())).size / Math.max(words.length, 1),
    };
  }, [inputText]);

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate">Linguistic Analysis</h1>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base">Natural language pattern detection and style analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-anomaly-medium border-anomaly-medium/30">
            {mockPatterns.filter(p => p.anomalous).length} Anomalous Patterns
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Text Input and Quick Analysis */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Text Analysis Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 space-y-4">
              <Textarea
                placeholder="Enter text for linguistic analysis..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-32 bg-muted/20 border-border/50"
              />
              <div className="flex items-center gap-4">
                <Select value={analysisLanguage} onValueChange={setAnalysisLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sensitivity:</span>
                  <Slider
                    value={sensitivityLevel}
                    onValueChange={setSensitivityLevel}
                    max={100}
                    min={25}
                    step={5}
                    className="w-24"
                  />
                  <span className="text-sm font-mono">{sensitivityLevel[0]}%</span>
                </div>
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-3 border border-border/30 rounded-lg bg-muted/10">
                <h3 className="font-medium mb-2">Text Statistics</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Words:</span>
                    <span className="font-mono">{textStatistics.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sentences:</span>
                    <span className="font-mono">{textStatistics.sentenceCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Word Length:</span>
                    <span className="font-mono">{textStatistics.avgCharsPerWord.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unique Words:</span>
                    <span className="font-mono">{textStatistics.uniqueWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vocabulary Richness:</span>
                    <span className="font-mono">{(textStatistics.vocabularyRichness * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Sentence Length:</span>
                    <span className="font-mono">{textStatistics.avgWordsPerSentence.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              {analysisResults && (
                <div className="p-3 border border-border/30 rounded-lg bg-muted/10">
                  <h3 className="font-medium mb-2">Analysis Complete</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant="outline" className="text-anomaly-low border-anomaly-low/30">
                        Complete
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Processed:</span>
                      <span className="font-mono text-xs">
                        {new Date(analysisResults.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Anomalies:</span>
                      <span className="font-mono text-anomaly-medium">4</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linguistic Metrics Overview */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Linguistic Metrics
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="high">High Anomaly</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full">
            {filteredMetrics.map((metric, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  metric.status === "high"
                    ? "border-anomaly-high/30 bg-anomaly-high/5"
                    : "border-border/30 bg-muted/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{metric.metric}</h3>
                  <Badge
                    variant={metric.status === "high" ? "destructive" : "outline"}
                    className={metric.status === "normal" ? "border-anomaly-low/30 text-anomaly-low" : ""}
                  >
                    {metric.status === "high" ? "High" : "Normal"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold">{(metric.value * 100).toFixed(1)}%</div>
                  <Progress value={metric.value * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Threshold: {(metric.threshold * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList className="bg-muted/20 grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="syntax">Syntax</TabsTrigger>
          <TabsTrigger value="semantic">Semantic</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Detected Linguistic Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPatterns.map((pattern, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-foreground/20 ${
                          pattern.anomalous
                            ? "border-anomaly-high/30 bg-anomaly-high/5"
                            : "border-border/30 bg-muted/10"
                        }`}
                        onClick={() => setSelectedAnomaly(selectedAnomaly === index ? null : index)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{pattern.pattern}</h3>
                            <p className="text-sm text-muted-foreground">
                              Found {pattern.frequency} occurrences • {(pattern.confidence * 100).toFixed(0)}% confidence
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={pattern.anomalous ? "destructive" : "outline"}
                              className={!pattern.anomalous ? "border-anomaly-low/30 text-anomaly-low" : ""}
                            >
                              {pattern.anomalous ? "Anomalous" : "Normal"}
                            </Badge>
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Examples:</h4>
                          <div className="space-y-1">
                            {pattern.examples.slice(0, selectedAnomaly === index ? pattern.examples.length : 2).map((example, i) => (
                              <div key={i} className="text-sm bg-muted/20 p-2 rounded font-mono">
                                {example}
                              </div>
                            ))}
                          </div>
                          {selectedAnomaly === index && pattern.examples.length > 2 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Showing all {pattern.examples.length} examples
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Pattern Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total patterns:</span>
                      <span className="font-mono">{mockPatterns.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Anomalous:</span>
                      <span className="font-mono text-anomaly-high">
                        {mockPatterns.filter(p => p.anomalous).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>High confidence:</span>
                      <span className="font-mono text-anomaly-medium">
                        {mockPatterns.filter(p => p.confidence > 0.8).length}
                      </span>
                    </div>
                    <Progress 
                      value={(mockPatterns.filter(p => p.anomalous).length / mockPatterns.length) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {((mockPatterns.filter(p => p.anomalous).length / mockPatterns.length) * 100).toFixed(1)}% anomalous patterns
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>AI Probability:</span>
                      <span className="font-mono text-anomaly-high">78%</span>
                    </div>
                    <Progress value={78} className="h-2 [&>div]:bg-anomaly-high" />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Key indicators:</p>
                      <ul className="space-y-0.5 ml-2">
                        <li>• Repetitive structures</li>
                        <li>• Formal register consistency</li>
                        <li>• Low vocabulary variation</li>
                        <li>• Technical term clustering</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Stylistic Feature Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 w-full">
                {mockStyleAnalysis.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all hover:border-foreground/20 ${
                      feature.anomaly
                        ? "border-anomaly-medium/30 bg-anomaly-medium/5"
                        : "border-border/30 bg-muted/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{feature.feature}</h3>
                      {feature.anomaly ? (
                        <Badge variant="outline" className="border-anomaly-medium/30 text-anomaly-medium text-xs">
                          Unusual
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-anomaly-low/30 text-anomaly-low text-xs">
                          Normal
                        </Badge>
                      )}
                    </div>
                    <div className="text-lg font-bold text-foreground mb-2">{feature.value}</div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Expected: {feature.expected}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {feature.details}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="syntax" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Syntax Anomaly Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSyntaxAnomalies.map((anomaly, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      anomaly.severity === "high" ? "border-anomaly-high/30 bg-anomaly-high/5" :
                      anomaly.severity === "medium" ? "border-anomaly-medium/30 bg-anomaly-medium/5" :
                      "border-anomaly-low/30 bg-anomaly-low/5"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{anomaly.anomaly}</h3>
                        <p className="text-sm text-muted-foreground">
                          Found {anomaly.frequency} occurrences
                        </p>
                      </div>
                      <Badge
                        variant={anomaly.severity === "high" ? "destructive" : "outline"}
                        className={anomaly.severity === "low" ? "border-anomaly-low/30 text-anomaly-low" : 
                                  anomaly.severity === "medium" ? "border-anomaly-medium/30 text-anomaly-medium" : ""}
                      >
                        {anomaly.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Examples:</h4>
                        <div className="space-y-1">
                          {anomaly.examples.map((example, i) => (
                            <div key={i} className="text-sm bg-muted/20 p-2 rounded font-mono">
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/10 rounded border border-border/20">
                        <h4 className="text-sm font-medium mb-1">Analysis:</h4>
                        <p className="text-sm text-muted-foreground">{anomaly.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Semantic Feature Analysis
                    </div>
                    <Select value={activeVisualization} onValueChange={setActiveVisualization}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="network">Network</SelectItem>
                        <SelectItem value="heatmap">Heatmap</SelectItem>
                        <SelectItem value="flow">Concept Flow</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {activeVisualization === "network" && (
                      <div className="h-full flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                        <div className="relative w-full h-full p-4">
                          {/* Concept network visualization */}
                          <svg className="w-full h-full">
                            {/* Central concepts */}
                            <circle cx="50%" cy="50%" r="20" fill="hsl(var(--anomaly-low))" opacity="0.3" />
                            <text x="50%" y="50%" textAnchor="middle" dy="0.3em" className="text-xs fill-current">
                              AI Analysis
                            </text>
                            
                            {/* Connected concepts */}
                            {[
                              { x: "25%", y: "25%", label: "NLP" },
                              { x: "75%", y: "25%", label: "Patterns" },
                              { x: "25%", y: "75%", label: "Detection" },
                              { x: "75%", y: "75%", label: "Linguistic" },
                            ].map((concept, i) => (
                              <g key={i}>
                                <line
                                  x1="50%" y1="50%"
                                  x2={concept.x} y2={concept.y}
                                  stroke="hsl(var(--border))"
                                  strokeWidth="1"
                                  opacity="0.3"
                                />
                                <circle 
                                  cx={concept.x} 
                                  cy={concept.y} 
                                  r="12" 
                                  fill="hsl(var(--anomaly-medium))" 
                                  opacity="0.3" 
                                />
                                <text 
                                  x={concept.x} 
                                  y={concept.y} 
                                  textAnchor="middle" 
                                  dy="0.3em" 
                                  className="text-xs fill-current"
                                >
                                  {concept.label}
                                </text>
                              </g>
                            ))}
                          </svg>
                          <p className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                            Semantic concept relationships
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {activeVisualization === "heatmap" && (
                      <div className="h-full flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                        <div className="text-center space-y-4">
                          <div className="grid grid-cols-10 gap-1 w-40 h-32 mx-auto">
                            {Array.from({ length: 100 }, (_, i) => (
                              <div
                                key={i}
                                className="w-3 h-3 rounded-sm"
                                style={{
                                  backgroundColor: `hsl(${240 - (i / 100) * 120}, 70%, ${50 + Math.random() * 30}%)`,
                                  opacity: 0.4 + Math.random() * 0.6,
                                }}
                                title={`Semantic intensity: ${Math.floor(Math.random() * 100)}%`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Semantic density heatmap • Hover for details
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {activeVisualization === "flow" && (
                      <div className="h-full flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                        <div className="space-y-4 w-full p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                                <MessageSquare className="w-6 h-6" />
                              </div>
                              <p className="text-xs">Input Text</p>
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="h-px bg-border/30 relative">
                                <div className="absolute -top-2 right-0 w-4 h-4 border-r border-t border-border/30 rotate-45"></div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                                <Brain className="w-6 h-6" />
                              </div>
                              <p className="text-xs">Concepts</p>
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="h-px bg-border/30 relative">
                                <div className="absolute -top-2 right-0 w-4 h-4 border-r border-t border-border/30 rotate-45"></div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                                <Target className="w-6 h-6" />
                              </div>
                              <p className="text-xs">Analysis</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            Semantic processing pipeline
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Semantic Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSemanticFeatures.map((feature, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{feature.feature}:</span>
                          <span className={`font-mono ${
                            feature.status === "high" ? "text-anomaly-high" : "text-anomaly-low"
                          }`}>
                            {(feature.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress 
                          value={feature.score * 100} 
                          className={`h-1 ${
                            feature.status === "high" ? "[&>div]:bg-anomaly-high" : "[&>div]:bg-anomaly-low"
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Cross-Model Linguistic Comparison
                </div>
                <Select value={comparisonMode} onValueChange={setComparisonMode}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="similarity">Similarity</SelectItem>
                    <SelectItem value="anomaly">Anomaly Rate</SelectItem>
                    <SelectItem value="confidence">Confidence</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
                  {mockModelComparison.map((model, index) => (
                    <div 
                      key={model.model} 
                      className={`p-4 border rounded-lg transition-all hover:border-foreground/20 ${
                        model.similarity > 0.7 ? "border-anomaly-high/30 bg-anomaly-high/5" :
                        model.similarity > 0.5 ? "border-anomaly-medium/30 bg-anomaly-medium/5" :
                        "border-border/30 bg-muted/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{model.model}</h3>
                        <Badge 
                          variant={model.similarity > 0.7 ? "destructive" : "outline"}
                          className={model.similarity <= 0.5 ? "border-anomaly-low/30 text-anomaly-low" : ""}
                        >
                          {model.similarity > 0.7 ? "High Match" : model.similarity > 0.5 ? "Medium" : "Low"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Similarity:</span>
                          <span className={`font-mono ${
                            model.similarity > 0.7 ? "text-anomaly-high" :
                            model.similarity > 0.5 ? "text-anomaly-medium" : "text-anomaly-low"
                          }`}>
                            {(model.similarity * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={model.similarity * 100} 
                          className={`h-2 ${
                            model.similarity > 0.7 ? "[&>div]:bg-anomaly-high" :
                            model.similarity > 0.5 ? "[&>div]:bg-anomaly-medium" : "[&>div]:bg-anomaly-low"
                          }`}
                        />
                        
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <span className="font-mono">{(model.confidence * 100).toFixed(1)}%</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Anomaly Rate:</span>
                          <span className="font-mono text-anomaly-medium">
                            {model.anomalyRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <h4 className="text-xs font-medium mb-2">Characteristics:</h4>
                        <div className="space-y-1">
                          {model.characteristics.map((char, i) => (
                            <Badge key={i} variant="outline" className="text-xs mr-1 mb-1">
                              {char}
                            </Badge>
                          ))}
                        </div>
                        
                        <h4 className="text-xs font-medium mb-2 mt-3">Typical Patterns:</h4>
                        <div className="space-y-1">
                          {model.typicalPatterns.slice(0, 2).map((pattern, i) => (
                            <div key={i} className="text-xs bg-muted/20 p-1 rounded">
                              {pattern}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="bg-card/30 border-border/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Detection Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Most likely source:</span>
                          <span className="font-mono text-anomaly-high">
                            {mockModelComparison.reduce((prev, curr) => 
                              prev.similarity > curr.similarity ? prev : curr
                            ).model}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Confidence level:</span>
                          <span className="font-mono">
                            {(mockModelComparison.reduce((prev, curr) => 
                              prev.similarity > curr.similarity ? prev : curr
                            ).confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Human likelihood:</span>
                          <span className="font-mono text-anomaly-low">
                            {(100 - Math.max(...mockModelComparison.map(m => m.similarity * 100))).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/30 border-border/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Export Comparison
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Search className="w-4 h-4 mr-2" />
                          Detailed Analysis
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Historical Compare
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}