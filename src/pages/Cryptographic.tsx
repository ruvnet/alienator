import { useState } from "react";
import { Shield, Binary, Hash, Key, Play, Download, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockHashPatterns = [
  { pattern: "Leading zeros", count: 23, probability: 0.001, suspicious: true },
  { pattern: "Specific prefix 'deadbeef'", count: 5, probability: 0.0001, suspicious: true },
  { pattern: "Repeating sequences", count: 12, probability: 0.05, suspicious: false },
  { pattern: "Palindromic hashes", count: 3, probability: 0.0001, suspicious: true },
];

const mockChallenges = [
  {
    id: 1,
    name: "Hash Prefix Challenge",
    description: "Find text that produces hash with specific prefix",
    target: "000abc",
    status: "running",
    progress: 67,
    attempts: 1247891,
  },
  {
    id: 2,
    name: "Encoding Detection",
    description: "Identify the encoding scheme used",
    target: "Base64/Hex/Binary",
    status: "completed",
    progress: 100,
    result: "Base64 detected with 95% confidence",
  },
  {
    id: 3,
    name: "Cipher Analysis",
    description: "Decrypt or identify cipher type",
    target: "Caesar/Vigenère/ROT13",
    status: "pending",
    progress: 0,
  },
];

const mockRandomnessTests = [
  { test: "Chi-Square Test", score: 0.89, passed: true },
  { test: "Runs Test", score: 0.73, passed: true },
  { test: "Serial Test", score: 0.45, passed: false },
  { test: "Monobit Test", score: 0.92, passed: true },
];

export default function Cryptographic() {
  const [inputText, setInputText] = useState("The quick brown fox jumps over the lazy dog");
  const [analysisType, setAnalysisType] = useState("entropy");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const runChallenge = (challengeId: number) => {
    console.log(`Running challenge ${challengeId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Cryptographic Analysis</h1>
          <p className="text-muted-foreground text-sm md:text-base">Pattern detection and randomness testing</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-anomaly-medium border-anomaly-medium/30">
            {mockHashPatterns.filter(p => p.suspicious).length} Suspicious Patterns
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Input Analysis */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Binary className="w-5 h-5" />
            Text Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <Textarea
                placeholder="Enter text for cryptographic analysis..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-32 bg-muted/20 border-border/50 font-mono"
              />
              <div className="flex items-center gap-4">
                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entropy">Entropy Analysis</SelectItem>
                    <SelectItem value="frequency">Frequency Analysis</SelectItem>
                    <SelectItem value="pattern">Pattern Detection</SelectItem>
                    <SelectItem value="hash">Hash Analysis</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-border/30 rounded-lg bg-muted/10">
                <h3 className="font-medium mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Characters:</span>
                    <span className="font-mono">{inputText.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bytes:</span>
                    <span className="font-mono">{new Blob([inputText]).size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entropy:</span>
                    <span className="font-mono text-anomaly-low">7.23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hash (SHA-256):</span>
                    <span className="font-mono text-xs truncate">d7a8fbb...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList className="bg-muted/20">
          <TabsTrigger value="patterns">Hash Patterns</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="randomness">Randomness Tests</TabsTrigger>
          <TabsTrigger value="binary">Binary Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Detected Hash Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHashPatterns.map((pattern, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all ${
                      pattern.suspicious
                        ? "border-anomaly-high/30 bg-anomaly-high/5"
                        : "border-border/30 bg-muted/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{pattern.pattern}</h3>
                        <p className="text-sm text-muted-foreground">
                          Found {pattern.count} occurrences
                        </p>
                      </div>
                      <Badge
                        variant={pattern.suspicious ? "destructive" : "outline"}
                        className={!pattern.suspicious ? "border-anomaly-low/30 text-anomaly-low" : ""}
                      >
                        {pattern.suspicious ? "Suspicious" : "Normal"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Expected probability: {pattern.probability}</span>
                      <span className="font-mono">
                        Confidence: {(Math.random() * 30 + 70).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      {challenge.name}
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        challenge.status === "completed"
                          ? "border-anomaly-low/30 text-anomaly-low"
                          : challenge.status === "running"
                          ? "border-anomaly-medium/30 text-anomaly-medium"
                          : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      {challenge.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Target: {challenge.target}</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>

                  {challenge.attempts && (
                    <div className="text-xs text-muted-foreground">
                      Attempts: {challenge.attempts.toLocaleString()}
                    </div>
                  )}

                  {challenge.result && (
                    <div className="p-2 bg-anomaly-low/10 border border-anomaly-low/30 rounded text-sm">
                      {challenge.result}
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant={challenge.status === "completed" ? "outline" : "default"}
                    onClick={() => runChallenge(challenge.id)}
                    disabled={challenge.status === "running"}
                    className="w-full"
                  >
                    {challenge.status === "running" ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : challenge.status === "completed" ? (
                      "View Results"
                    ) : (
                      "Start Challenge"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="randomness" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Statistical Randomness Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockRandomnessTests.map((test, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      test.passed
                        ? "border-anomaly-low/30 bg-anomaly-low/5"
                        : "border-anomaly-high/30 bg-anomaly-high/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{test.test}</h3>
                      <Badge
                        variant={test.passed ? "outline" : "destructive"}
                        className={test.passed ? "border-anomaly-low/30 text-anomaly-low" : ""}
                      >
                        {test.passed ? "PASS" : "FAIL"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>P-value:</span>
                        <span className="font-mono">{test.score.toFixed(3)}</span>
                      </div>
                      <Progress
                        value={test.score * 100}
                        className={`h-2 ${
                          test.passed ? "[&>div]:bg-anomaly-low" : "[&>div]:bg-anomaly-high"
                        }`}
                      />
                      <div className="text-xs text-muted-foreground">
                        Threshold: 0.01 (significance level)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="binary" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Binary className="w-5 h-5" />
                Binary Representation Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                <div className="text-center space-y-2">
                  <div className="grid grid-cols-32 gap-px w-96 h-64 mx-auto">
                    {[...Array(32 * 16)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 ${
                          Math.random() > 0.5 ? "bg-foreground" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Binary visualization of hash output patterns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}