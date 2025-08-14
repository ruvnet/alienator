import { useState } from "react";
import { Languages, BookOpen, MessageSquare, TrendingUp, Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockLinguisticMetrics = [
  { metric: "Lexical Diversity", value: 0.73, threshold: 0.5, status: "high" },
  { metric: "Syntactic Complexity", value: 0.42, threshold: 0.6, status: "normal" },
  { metric: "Semantic Coherence", value: 0.89, threshold: 0.7, status: "high" },
  { metric: "Readability Score", value: 0.67, threshold: 0.5, status: "high" },
  { metric: "Sentiment Polarity", value: 0.23, threshold: 0.8, status: "normal" },
  { metric: "Formality Index", value: 0.55, threshold: 0.4, status: "high" },
];

const mockStyleAnalysis = [
  { feature: "Average Sentence Length", value: "18.5 words", anomaly: false },
  { feature: "Passive Voice Usage", value: "12%", anomaly: false },
  { feature: "Modal Verb Frequency", value: "8%", anomaly: true },
  { feature: "Adverb Density", value: "5.2%", anomaly: false },
  { feature: "Punctuation Patterns", value: "Standard", anomaly: false },
  { feature: "Vocabulary Level", value: "Advanced", anomaly: true },
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

  const filteredMetrics = selectedMetric === "all" 
    ? mockLinguisticMetrics 
    : mockLinguisticMetrics.filter(m => m.status === selectedMetric);

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
            <div className="lg:col-span-3">
              <Textarea
                placeholder="Enter text for linguistic analysis..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-32 bg-muted/20 border-border/50"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select value={analysisLanguage} onValueChange={setAnalysisLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 border border-border/30 rounded-lg bg-muted/10">
                <h3 className="font-medium mb-2">Quick Stats</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Words:</span>
                    <span className="font-mono">{inputText.split(/\s+/).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sentences:</span>
                    <span className="font-mono">{inputText.split(/[.!?]+/).length - 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Word Length:</span>
                    <span className="font-mono">5.2</span>
                  </div>
                </div>
              </div>
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
        <TabsList className="bg-muted/20">
          <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
          <TabsTrigger value="style">Style Analysis</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Features</TabsTrigger>
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
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
                    className={`p-4 rounded-lg border ${
                      pattern.anomalous
                        ? "border-anomaly-high/30 bg-anomaly-high/5"
                        : "border-border/30 bg-muted/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{pattern.pattern}</h3>
                        <p className="text-sm text-muted-foreground">
                          Found {pattern.frequency} occurrences • {(pattern.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                      <Badge
                        variant={pattern.anomalous ? "destructive" : "outline"}
                        className={!pattern.anomalous ? "border-anomaly-low/30 text-anomaly-low" : ""}
                      >
                        {pattern.anomalous ? "Anomalous" : "Normal"}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Examples:</h4>
                      <div className="space-y-1">
                        {pattern.examples.map((example, i) => (
                          <div key={i} className="text-sm bg-muted/20 p-2 rounded font-mono">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                    className={`p-4 rounded-lg border ${
                      feature.anomaly
                        ? "border-anomaly-medium/30 bg-anomaly-medium/5"
                        : "border-border/30 bg-muted/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{feature.feature}</h3>
                      {feature.anomaly && (
                        <Badge variant="outline" className="border-anomaly-medium/30 text-anomaly-medium text-xs">
                          Unusual
                        </Badge>
                      )}
                    </div>
                    <div className="text-lg font-bold text-foreground">{feature.value}</div>
                    {feature.anomaly && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Deviates from expected patterns
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Semantic Feature Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                <div className="text-center space-y-4">
                  <Languages className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground mb-4">Semantic analysis visualization</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Topic coherence: 87%</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Concept density: 73%</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Semantic drift: 12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Cross-Model Linguistic Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full">
                  {["GPT-4", "Claude-3", "Cohere"].map((model) => (
                    <div key={model} className="p-4 border border-border/30 rounded-lg bg-muted/10">
                      <h3 className="font-medium mb-3">{model}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Complexity Score:</span>
                          <span className="font-mono">{(Math.random() * 0.4 + 0.5).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Formality Index:</span>
                          <span className="font-mono">{(Math.random() * 0.4 + 0.4).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Creativity Score:</span>
                          <span className="font-mono">{(Math.random() * 0.5 + 0.3).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Anomaly Rate:</span>
                          <span className="font-mono text-anomaly-medium">
                            {(Math.random() * 20 + 5).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}