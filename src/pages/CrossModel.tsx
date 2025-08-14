import { useState } from "react";
import { GitBranch, RefreshCw, Download, Target, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const availableModels = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", status: "active" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", status: "active" },
  { id: "claude-3", name: "Claude-3", provider: "Anthropic", status: "active" },
  { id: "cohere", name: "Cohere", provider: "Cohere", status: "active" },
  { id: "llama-2", name: "Llama-2", provider: "Meta", status: "inactive" },
];

const mockComparisonData = [
  {
    model: "GPT-4",
    response: "The quantum entanglement phenomenon demonstrates...",
    entropy: 7.2,
    similarity: 0.85,
    outlier: false,
    responseTime: 1200,
  },
  {
    model: "Claude-3",
    response: "Quantum entanglement represents a fundamental...",
    entropy: 6.8,
    similarity: 0.78,
    outlier: false,
    responseTime: 950,
  },
  {
    model: "Cohere",
    response: "In the realm of quantum mechanics, entanglement...",
    entropy: 8.9,
    similarity: 0.45,
    outlier: true,
    responseTime: 1450,
  },
  {
    model: "GPT-3.5",
    response: "Quantum entanglement is a physical phenomenon...",
    entropy: 6.5,
    similarity: 0.92,
    outlier: false,
    responseTime: 800,
  },
];

export default function CrossModel() {
  const [selectedModels, setSelectedModels] = useState(["gpt-4", "claude-3", "cohere"]);
  const [inputText, setInputText] = useState("Explain quantum entanglement in simple terms.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [consensusScore, setConsensusScore] = useState(0.73);

  const handleModelToggle = (modelId: string, checked: boolean) => {
    if (checked) {
      setSelectedModels([...selectedModels, modelId]);
    } else {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setConsensusScore(Math.random() * 0.5 + 0.5);
    }, 3000);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate">Cross-Model Analysis</h1>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base">Compare responses across multiple AI models</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-anomaly-low border-anomaly-low/30">
            {selectedModels.length} Models Selected
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Model Selection & Input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 w-full">
        {/* Model Selection */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Model Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableModels.map((model) => (
              <div key={model.id} className="flex items-center space-x-3">
                <Checkbox
                  id={model.id}
                  checked={selectedModels.includes(model.id)}
                  onCheckedChange={(checked) => handleModelToggle(model.id, checked as boolean)}
                  disabled={model.status === "inactive"}
                />
                <div className="flex-1">
                  <label htmlFor={model.id} className="text-sm font-medium cursor-pointer">
                    {model.name}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{model.provider}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        model.status === "active" 
                          ? "border-anomaly-low/30 text-anomaly-low" 
                          : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      {model.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Input Text */}
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Input Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your prompt for cross-model analysis..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-32 bg-muted/20 border-border/50"
            />
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleAnalyze} 
                disabled={selectedModels.length === 0 || !inputText.trim() || isAnalyzing}
                className="flex-1 sm:flex-none"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Analyze Across Models
                  </>
                )}
              </Button>
              <div className="text-sm text-muted-foreground">
                {inputText.length} characters
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consensus Indicator */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Model Consensus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Agreement</span>
              <span className="text-sm font-bold">{(consensusScore * 100).toFixed(1)}%</span>
            </div>
            <Progress value={consensusScore * 100} className="h-3" />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm w-full">
              <div className="text-center">
                <div className="text-lg font-bold text-anomaly-low">92%</div>
                <div className="text-muted-foreground">Semantic Similarity</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-anomaly-medium">68%</div>
                <div className="text-muted-foreground">Structural Consistency</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-anomaly-high">15%</div>
                <div className="text-muted-foreground">Outlier Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">1.2s</div>
                <div className="text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Model Comparison Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Response Preview</TableHead>
                  <TableHead>Entropy</TableHead>
                  <TableHead>Similarity</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockComparisonData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.model}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{row.response}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          row.entropy > 7.5 
                            ? "border-anomaly-high/30 text-anomaly-high"
                            : row.entropy > 6.5
                            ? "border-anomaly-medium/30 text-anomaly-medium"
                            : "border-anomaly-low/30 text-anomaly-low"
                        }
                      >
                        {row.entropy.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{(row.similarity * 100).toFixed(0)}%</TableCell>
                    <TableCell>{row.responseTime}ms</TableCell>
                    <TableCell>
                      {row.outlier ? (
                        <Badge variant="destructive">Outlier</Badge>
                      ) : (
                        <Badge variant="outline" className="border-anomaly-low/30 text-anomaly-low">Normal</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}