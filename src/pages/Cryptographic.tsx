import { useState, useEffect, useMemo } from "react";
import { Shield, Binary, Hash, Key, Play, Download, RefreshCw, Eye, Zap, Lock, Search, AlertTriangle, FileText, BarChart3, Fingerprint } from "lucide-react";
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

const mockHashPatterns = [
  { pattern: "Leading zeros", count: 23, probability: 0.001, suspicious: true, severity: "high", examples: ["000abc123...", "0001def456..."] },
  { pattern: "Specific prefix 'deadbeef'", count: 5, probability: 0.0001, suspicious: true, severity: "critical", examples: ["deadbeef123...", "deadbeefabc..."] },
  { pattern: "Repeating sequences", count: 12, probability: 0.05, suspicious: false, severity: "low", examples: ["abcabc123...", "123123def..."] },
  { pattern: "Palindromic hashes", count: 3, probability: 0.0001, suspicious: true, severity: "medium", examples: ["abccba...", "12321..."] },
  { pattern: "Weak entropy regions", count: 8, probability: 0.002, suspicious: true, severity: "high", examples: ["aaabbb...", "111222..."] },
  { pattern: "Sequential patterns", count: 15, probability: 0.01, suspicious: false, severity: "low", examples: ["123456...", "abcdef..."] },
];

const mockEncryptionAnalysis = [
  { algorithm: "AES-256", detected: true, confidence: 0.94, keyStrength: "Strong", vulnerabilities: [] },
  { algorithm: "RSA-2048", detected: false, confidence: 0.23, keyStrength: "N/A", vulnerabilities: [] },
  { algorithm: "DES", detected: false, confidence: 0.05, keyStrength: "N/A", vulnerabilities: ["Deprecated"] },
  { algorithm: "Blowfish", detected: true, confidence: 0.67, keyStrength: "Medium", vulnerabilities: ["Key size"] },
];

const mockSteganographyResults = [
  { technique: "LSB Steganography", detected: false, confidence: 0.12, hiddenData: null },
  { technique: "DCT Coefficient Hiding", detected: true, confidence: 0.89, hiddenData: "Possible text payload" },
  { technique: "Palette-based Hiding", detected: false, confidence: 0.03, hiddenData: null },
  { technique: "Frequency Domain", detected: true, confidence: 0.76, hiddenData: "Binary pattern detected" },
];

const mockFrequencyData = {
  characters: Array.from({ length: 26 }, (_, i) => ({
    char: String.fromCharCode(65 + i),
    frequency: Math.random() * 12 + 1,
    expected: 8.5 + Math.random() * 4,
  })),
  bytes: Array.from({ length: 256 }, (_, i) => ({
    byte: i,
    frequency: Math.random() * 1000,
    expected: 500 + Math.random() * 200,
  })),
};

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
  { test: "Chi-Square Test", score: 0.89, passed: true, description: "Tests uniform distribution of bits", criticalValue: 0.01 },
  { test: "Runs Test", score: 0.73, passed: true, description: "Analyzes runs of consecutive bits", criticalValue: 0.01 },
  { test: "Serial Test", score: 0.45, passed: false, description: "Tests correlation between bits", criticalValue: 0.01 },
  { test: "Monobit Test", score: 0.92, passed: true, description: "Checks balance of 0s and 1s", criticalValue: 0.01 },
  { test: "Poker Test", score: 0.34, passed: false, description: "Tests randomness of 4-bit patterns", criticalValue: 0.01 },
  { test: "Autocorrelation Test", score: 0.78, passed: true, description: "Measures self-correlation", criticalValue: 0.01 },
  { test: "Cumulative Sums Test", score: 0.85, passed: true, description: "Tests cumulative deviation", criticalValue: 0.01 },
  { test: "Approximate Entropy", score: 0.67, passed: true, description: "Measures pattern regularity", criticalValue: 0.01 },
];

export default function Cryptographic() {
  const [inputText, setInputText] = useState("The quick brown fox jumps over the lazy dog");
  const [analysisType, setAnalysisType] = useState("entropy");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [entropyThreshold, setEntropyThreshold] = useState([7.5]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState("heatmap");
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis with realistic delay
    setTimeout(() => {
      setAnalysisResults({
        entropy: calculateEntropy(inputText),
        compression: calculateCompressionRatio(inputText),
        patterns: detectPatterns(inputText),
        timestamp: Date.now(),
      });
      setIsAnalyzing(false);
    }, 2000 + Math.random() * 1000);
  };

  const calculateEntropy = (text) => {
    const freq = {};
    for (const char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }
    const len = text.length;
    return -Object.values(freq).reduce((sum, f) => {
      const p = f / len;
      return sum + p * Math.log2(p);
    }, 0);
  };

  const calculateCompressionRatio = (text) => {
    // Simplified compression estimation
    const unique = new Set(text).size;
    return unique / text.length;
  };

  const detectPatterns = (text) => {
    const patterns = [];
    // Simple pattern detection
    if (/(..).*\1/.test(text)) patterns.push("Repeated sequences");
    if (/[0-9]{4,}/.test(text)) patterns.push("Numeric sequences");
    if (/([a-zA-Z])\1{2,}/.test(text)) patterns.push("Character repetition");
    return patterns;
  };

  const binaryMatrix = useMemo(() => {
    const bytes = new TextEncoder().encode(inputText);
    const matrix = [];
    for (let i = 0; i < Math.min(bytes.length, 256); i++) {
      const byte = bytes[i];
      const bits = byte.toString(2).padStart(8, '0');
      matrix.push(bits.split('').map(bit => bit === '1'));
    }
    return matrix;
  }, [inputText]);

  const runChallenge = (challengeId: number) => {
    console.log(`Running challenge ${challengeId}`);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate">Cryptographic Analysis</h1>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base">Pattern detection and randomness testing</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 w-full">
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
                    <span className={`font-mono ${
                      analysisResults?.entropy > 7.5 ? "text-anomaly-high" : 
                      analysisResults?.entropy > 6.0 ? "text-anomaly-medium" : "text-anomaly-low"
                    }`}>
                      {analysisResults?.entropy ? analysisResults.entropy.toFixed(2) : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compression:</span>
                    <span className="font-mono">
                      {analysisResults?.compression ? (analysisResults.compression * 100).toFixed(1) + "%" : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unique chars:</span>
                    <span className="font-mono">{new Set(inputText).size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hash (SHA-256):</span>
                    <span className="font-mono text-xs truncate">d7a8fbb...</span>
                  </div>
                </div>
              </div>
              
              {analysisResults && (
                <div className="p-4 border border-border/30 rounded-lg bg-muted/10">
                  <h3 className="font-medium mb-3">Analysis Results</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant="outline" className="text-anomaly-low border-anomaly-low/30">
                        Complete
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Patterns found:</span>
                      <span className="font-mono">{analysisResults.patterns.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processed:</span>
                      <span className="font-mono text-xs">
                        {new Date(analysisResults.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList className="bg-muted/20 grid grid-cols-2 lg:grid-cols-6 w-full">
          <TabsTrigger value="patterns">Hash Patterns</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="steganography">Steganography</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
          <TabsTrigger value="randomness">Randomness</TabsTrigger>
          <TabsTrigger value="binary">Binary Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5" />
                      Detected Hash Patterns
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Threshold:</span>
                      <Slider
                        value={entropyThreshold}
                        onValueChange={setEntropyThreshold}
                        max={8}
                        min={1}
                        step={0.1}
                        className="w-20"
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockHashPatterns.map((pattern, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-foreground/20 ${
                          pattern.suspicious
                            ? "border-anomaly-high/30 bg-anomaly-high/5"
                            : "border-border/30 bg-muted/10"
                        } ${
                          selectedPattern === index ? "ring-2 ring-blue-500/20" : ""
                        }`}
                        onClick={() => setSelectedPattern(selectedPattern === index ? null : index)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{pattern.pattern}</h3>
                            <p className="text-sm text-muted-foreground">
                              Found {pattern.count} occurrences • Severity: {pattern.severity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={pattern.suspicious ? "destructive" : "outline"}
                              className={!pattern.suspicious ? "border-anomaly-low/30 text-anomaly-low" : ""}
                            >
                              {pattern.suspicious ? "Suspicious" : "Normal"}
                            </Badge>
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Expected probability: {pattern.probability}</span>
                          <span className="font-mono">
                            Confidence: {(Math.random() * 30 + 70).toFixed(1)}%
                          </span>
                        </div>
                        {selectedPattern === index && (
                          <div className="mt-3 pt-3 border-t border-border/30">
                            <h4 className="text-sm font-medium mb-2">Examples:</h4>
                            <div className="space-y-1">
                              {pattern.examples.map((example, i) => (
                                <div key={i} className="text-xs bg-muted/20 p-2 rounded font-mono">
                                  {example}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                    <BarChart3 className="w-4 h-4" />
                    Pattern Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total patterns:</span>
                      <span className="font-mono">{mockHashPatterns.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Suspicious:</span>
                      <span className="font-mono text-anomaly-high">
                        {mockHashPatterns.filter(p => p.suspicious).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>High severity:</span>
                      <span className="font-mono text-anomaly-medium">
                        {mockHashPatterns.filter(p => p.severity === "high" || p.severity === "critical").length}
                      </span>
                    </div>
                    <Progress 
                      value={(mockHashPatterns.filter(p => p.suspicious).length / mockHashPatterns.length) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {((mockHashPatterns.filter(p => p.suspicious).length / mockHashPatterns.length) * 100).toFixed(1)}% anomalous patterns detected
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" />
                    Hash Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Algorithm:</span>
                      <span className="font-mono">SHA-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hash length:</span>
                      <span className="font-mono">64 chars</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collision risk:</span>
                      <span className="font-mono text-anomaly-low">Minimal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Strength:</span>
                      <span className="font-mono text-anomaly-low">Strong</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="encryption" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Encryption Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockEncryptionAnalysis.map((alg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      alg.detected && alg.confidence > 0.7
                        ? "border-anomaly-high/30 bg-anomaly-high/5"
                        : alg.detected
                        ? "border-anomaly-medium/30 bg-anomaly-medium/5"
                        : "border-border/30 bg-muted/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{alg.algorithm}</h3>
                      <Badge
                        variant={alg.detected ? "destructive" : "outline"}
                        className={!alg.detected ? "border-muted-foreground/30 text-muted-foreground" : ""}
                      >
                        {alg.detected ? "Detected" : "Not Detected"}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-mono">{(alg.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={alg.confidence * 100} className="h-2" />
                      <div className="flex justify-between">
                        <span>Key strength:</span>
                        <span className={`font-mono ${
                          alg.keyStrength === "Strong" ? "text-anomaly-low" :
                          alg.keyStrength === "Medium" ? "text-anomaly-medium" : "text-muted-foreground"
                        }`}>
                          {alg.keyStrength}
                        </span>
                      </div>
                      {alg.vulnerabilities.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Vulnerabilities:</p>
                          {alg.vulnerabilities.map((vuln, i) => (
                            <Badge key={i} variant="outline" className="text-xs mr-1 border-anomaly-high/30 text-anomaly-high">
                              {vuln}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="steganography" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Steganographic Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSteganographyResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.detected
                        ? "border-anomaly-high/30 bg-anomaly-high/5"
                        : "border-border/30 bg-muted/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{result.technique}</h3>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {(result.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <Badge
                        variant={result.detected ? "destructive" : "outline"}
                        className={!result.detected ? "border-anomaly-low/30 text-anomaly-low" : ""}
                      >
                        {result.detected ? "Hidden Data" : "Clean"}
                      </Badge>
                    </div>
                    <Progress value={result.confidence * 100} className="h-2 mb-3" />
                    {result.hiddenData && (
                      <div className="mt-2 p-2 bg-muted/20 rounded text-sm">
                        <span className="font-medium">Potential payload: </span>
                        {result.hiddenData}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="frequency" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Frequency Analysis
                </div>
                <Select value={activeVisualization} onValueChange={setActiveVisualization}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heatmap">Heatmap</SelectItem>
                    <SelectItem value="chart">Chart</SelectItem>
                    <SelectItem value="bytes">Byte Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {activeVisualization === "heatmap" && (
                  <div className="h-full flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                    <div className="text-center space-y-4">
                      <div className="grid grid-cols-16 gap-1 w-64 h-32 mx-auto">
                        {Array.from({ length: 256 }, (_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-sm"
                            style={{
                              backgroundColor: `hsl(${(i / 256) * 240}, 70%, ${50 + Math.random() * 30}%)`,
                              opacity: 0.3 + Math.random() * 0.7,
                            }}
                            title={`Byte ${i}: ${Math.floor(Math.random() * 100)}%`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Character frequency heatmap • Hover for details
                      </p>
                    </div>
                  </div>
                )}
                
                {activeVisualization === "chart" && (
                  <div className="h-full flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                    <div className="text-center space-y-4">
                      <div className="flex items-end justify-center space-x-1 h-40">
                        {mockFrequencyData.characters.slice(0, 20).map((char, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div
                              className="w-3 bg-blue-500 opacity-70"
                              style={{ height: `${(char.frequency / 15) * 100}%` }}
                            />
                            <span className="text-xs mt-1">{char.char}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Character frequency distribution
                      </p>
                    </div>
                  </div>
                )}
                
                {activeVisualization === "bytes" && (
                  <div className="h-full p-4 border border-border/30 rounded-lg bg-muted/10 overflow-auto">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Byte Analysis Summary</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Most frequent:</span>
                          <div className="font-mono">0x20 (32%)</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Least frequent:</span>
                          <div className="font-mono">0xFF (0.1%)</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Entropy:</span>
                          <div className="font-mono text-anomaly-medium">6.8</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Compression:</span>
                          <div className="font-mono">73%</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Anomalous Byte Patterns</h5>
                        <div className="space-y-1">
                          <div className="text-xs bg-muted/20 p-2 rounded font-mono">0x00: Null bytes detected (12 occurrences)</div>
                          <div className="text-xs bg-muted/20 p-2 rounded font-mono">0xDE 0xAD: Potential magic bytes</div>
                          <div className="text-xs bg-muted/20 p-2 rounded font-mono">Sequential pattern: 0x30-0x39 (high frequency)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6 w-full">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Statistical Randomness Tests
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      NIST SP 800-22
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full">
                    {mockRandomnessTests.map((test, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all hover:border-foreground/20 ${
                          test.passed
                            ? "border-anomaly-low/30 bg-anomaly-low/5"
                            : "border-anomaly-high/30 bg-anomaly-high/5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm">{test.test}</h3>
                          <Badge
                            variant={test.passed ? "outline" : "destructive"}
                            className={test.passed ? "border-anomaly-low/30 text-anomaly-low" : ""}
                          >
                            {test.passed ? "PASS" : "FAIL"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{test.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>P-value:</span>
                            <span className={`font-mono ${
                              test.score > test.criticalValue ? "text-anomaly-low" : "text-anomaly-high"
                            }`}>
                              {test.score.toFixed(4)}
                            </span>
                          </div>
                          <Progress
                            value={test.score * 100}
                            className={`h-2 ${
                              test.passed ? "[&>div]:bg-anomaly-low" : "[&>div]:bg-anomaly-high"
                            }`}
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Critical: {test.criticalValue}</span>
                            <span>α = 0.01</span>
                          </div>
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
                    <AlertTriangle className="w-4 h-4" />
                    Test Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total tests:</span>
                      <span className="font-mono">{mockRandomnessTests.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Passed:</span>
                      <span className="font-mono text-anomaly-low">
                        {mockRandomnessTests.filter(t => t.passed).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Failed:</span>
                      <span className="font-mono text-anomaly-high">
                        {mockRandomnessTests.filter(t => !t.passed).length}
                      </span>
                    </div>
                    <Progress 
                      value={(mockRandomnessTests.filter(t => t.passed).length / mockRandomnessTests.length) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {((mockRandomnessTests.filter(t => t.passed).length / mockRandomnessTests.length) * 100).toFixed(1)}% pass rate
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Rerun Failed Tests
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Detailed Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="binary" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Binary className="w-5 h-5" />
                  Binary Representation Matrix
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? "Simple" : "Advanced"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-80 border border-border/30 rounded-lg bg-muted/10 p-4 overflow-auto">
                  {showAdvanced ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="text-sm font-medium mb-3">Bit Visualization Matrix</h4>
                        <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: 'repeat(32, 1fr)', maxWidth: '600px' }}>
                          {binaryMatrix.slice(0, 16).map((row, rowIndex) => 
                            row.map((bit, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-3 h-3 border border-border/20 ${
                                  bit ? "bg-foreground" : "bg-muted-foreground/20"
                                }`}
                                title={`Row ${rowIndex}, Col ${colIndex}: ${bit ? '1' : '0'}`}
                              />
                            ))
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Each square represents a bit • Hover for position
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Bit Statistics</h5>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>Total bits:</span>
                              <span className="font-mono">{binaryMatrix.flat().length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ones:</span>
                              <span className="font-mono">{binaryMatrix.flat().filter(b => b).length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Zeros:</span>
                              <span className="font-mono">{binaryMatrix.flat().filter(b => !b).length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Balance:</span>
                              <span className="font-mono">
                                {((binaryMatrix.flat().filter(b => b).length / binaryMatrix.flat().length) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Pattern Analysis</h5>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>Runs detected:</span>
                              <span className="font-mono">23</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max run length:</span>
                              <span className="font-mono">7</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Clustering:</span>
                              <span className="font-mono text-anomaly-medium">Moderate</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Entropy:</span>
                              <span className="font-mono">
                                {(binaryMatrix.flat().length > 0 ? -binaryMatrix.flat().reduce((acc, bit, _, arr) => {
                                  const p = arr.filter(b => b === bit).length / arr.length;
                                  return acc + (p > 0 ? p * Math.log2(p) : 0);
                                }, 0) : 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="grid grid-cols-32 gap-px w-96 h-64 mx-auto">
                        {[...Array(32 * 16)].map((_, i) => {
                          const byte = i < binaryMatrix.flat().length ? binaryMatrix.flat()[i] : Math.random() > 0.5;
                          return (
                            <div
                              key={i}
                              className={`w-2 h-2 ${
                                byte ? "bg-foreground" : "bg-muted-foreground/30"
                              }`}
                              title={`Bit ${i}: ${byte ? '1' : '0'}`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Binary visualization of text content • Switch to Advanced for detailed analysis
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}