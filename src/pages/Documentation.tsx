
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Terminal, 
  GitBranch, 
  Zap, 
  Shield, 
  Brain, 
  Eye, 
  Lock,
  Activity,
  BarChart3,
  Sparkles,
  Languages,
  History,
  Settings,
  Binary,
  Code,
  BookOpen,
  Cpu,
  Database
} from "lucide-react";

const Documentation = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-8 rounded-lg border border-primary/20">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Binary className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            VibeCast Anomaly Detector
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced AI anomaly detection system for multi-model language analysis with real-time monitoring and cryptographic pattern recognition.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="outline" className="bg-anomaly-high/10 text-anomaly-high border-anomaly-high/30">
            Real-time Analysis
          </Badge>
          <Badge variant="outline" className="bg-anomaly-medium/10 text-anomaly-medium border-anomaly-medium/30">
            Multi-Model Support
          </Badge>
          <Badge variant="outline" className="bg-anomaly-low/10 text-anomaly-low border-anomaly-low/30">
            Cryptographic Security
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                System Overview
              </CardTitle>
              <CardDescription>
                Advanced anomaly detection for AI-generated content analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Core Capabilities</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-accent" />
                      Real-time anomaly scoring and detection
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-accent" />
                      Multi-model AI response analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-accent" />
                      Cryptographic pattern recognition
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      WebSocket real-time streaming
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Detection Methods</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-accent" />
                      Entropy analysis and compression ratios
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-accent" />
                      Embedding vector clustering
                    </li>
                    <li className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-accent" />
                      Linguistic pattern analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-accent" />
                      Cross-model comparative analysis
                    </li>
                  </ul>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-2">Anomaly Score Interpretation</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-anomaly-low rounded-full"></div>
                    <span><strong>0.0 - 0.3:</strong> Normal behavior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-anomaly-medium rounded-full"></div>
                    <span><strong>0.3 - 0.7:</strong> Suspicious patterns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-anomaly-high rounded-full"></div>
                    <span><strong>0.7 - 1.0:</strong> Critical anomalies</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Real-time Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Live anomaly detection dashboard with real-time scoring and alert system.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Live anomaly gauge with visual indicators</li>
                  <li>• Real-time alert streaming</li>
                  <li>• WebSocket connection status</li>
                  <li>• Current analysis metrics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive analytics with time-series data and trend analysis.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Historical anomaly trends</li>
                  <li>• Statistical summaries</li>
                  <li>• Performance metrics</li>
                  <li>• Exportable reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" />
                  Cross-Model Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Compare responses across multiple AI models for anomaly detection.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Multi-model response comparison</li>
                  <li>• Correlation analysis</li>
                  <li>• Deviation scoring</li>
                  <li>• Model reliability metrics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Embedding Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Vector space analysis and clustering for semantic anomaly detection.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• 3D embedding visualization</li>
                  <li>• Cluster analysis</li>
                  <li>• Semantic similarity scoring</li>
                  <li>• Vector space mapping</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Cryptographic Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Advanced cryptographic pattern detection and security analysis.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Entropy calculations</li>
                  <li>• Compression ratio analysis</li>
                  <li>• Pattern frequency detection</li>
                  <li>• Randomness testing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary" />
                  Linguistic Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Natural language processing for linguistic anomaly detection.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Sentiment analysis</li>
                  <li>• Readability scoring</li>
                  <li>• Linguistic complexity metrics</li>
                  <li>• Style consistency analysis</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                System Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Frontend Stack</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>React 18</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>TypeScript</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span>Tailwind CSS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Vite</span>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Key Libraries</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>TanStack Query</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Zustand</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Recharts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Three.js</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>Framer Motion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Socket.IO</span>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Data Flow</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-accent" />
                    <span>WebSocket → Real-time data streaming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-accent" />
                    <span>REST API → Historical data and configuration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span>Zustand → Global state management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-accent" />
                    <span>React Query → Server state caching</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Getting Started</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to the Real-time Monitor to view live anomaly scores</li>
                  <li>Configure thresholds in Settings to customize alert sensitivity</li>
                  <li>Monitor alerts and patterns in the dashboard</li>
                  <li>Use Analytics for historical trend analysis</li>
                  <li>Explore specific analysis types in dedicated sections</li>
                </ol>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Navigation Routes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <code className="bg-muted px-1 rounded">/</code>
                    <span>Real-time Monitor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-accent" />
                    <code className="bg-muted px-1 rounded">/analytics</code>
                    <span>Analytics Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-accent" />
                    <code className="bg-muted px-1 rounded">/cross-model</code>
                    <span>Cross-Model Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <code className="bg-muted px-1 rounded">/embeddings</code>
                    <span>Embedding Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent" />
                    <code className="bg-muted px-1 rounded">/crypto</code>
                    <span>Cryptographic Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-accent" />
                    <code className="bg-muted px-1 rounded">/linguistic</code>
                    <span>Linguistic Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-accent" />
                    <code className="bg-muted px-1 rounded">/logs</code>
                    <span>Anomaly Log</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-accent" />
                    <code className="bg-muted px-1 rounded">/settings</code>
                    <span>Configuration</span>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Best Practices</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                    <span>Set appropriate thresholds based on your use case and tolerance for false positives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                    <span>Monitor multiple analysis types for comprehensive anomaly detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                    <span>Use cross-model analysis to validate suspicious patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                    <span>Regularly review historical data to identify emerging trends</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                API Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">WebSocket Events</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-accent">anomaly_update</code>
                    <p className="text-muted-foreground mt-1">Real-time anomaly score updates</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-accent">new_analysis</code>
                    <p className="text-muted-foreground mt-1">New analysis results</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-accent">alert</code>
                    <p className="text-muted-foreground mt-1">Critical anomaly alerts</p>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">REST Endpoints</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-green-400">GET /api/v1/analyses</code>
                    <p className="text-muted-foreground mt-1">Retrieve historical analysis data</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-blue-400">POST /api/v1/analyze</code>
                    <p className="text-muted-foreground mt-1">Submit text for analysis</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-green-400">GET /api/v1/config</code>
                    <p className="text-muted-foreground mt-1">Get system configuration</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-yellow-400">PUT /api/v1/config</code>
                    <p className="text-muted-foreground mt-1">Update system configuration</p>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Environment Variables</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">VITE_API_URL</code>
                    <span className="text-muted-foreground ml-2">Backend API base URL</span>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded">VITE_WS_URL</code>
                    <span className="text-muted-foreground ml-2">WebSocket connection URL</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Deployment Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Development Setup</h4>
                <div className="space-y-2 text-sm">
                  <code className="block bg-muted p-2 rounded text-green-400">npm install</code>
                  <code className="block bg-muted p-2 rounded text-green-400">npm run dev</code>
                  <p className="text-muted-foreground">Starts development server on http://localhost:3000</p>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Production Build</h4>
                <div className="space-y-2 text-sm">
                  <code className="block bg-muted p-2 rounded text-blue-400">npm run build</code>
                  <code className="block bg-muted p-2 rounded text-blue-400">npm run preview</code>
                  <p className="text-muted-foreground">Builds and previews production bundle</p>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Docker Deployment</h4>
                <div className="space-y-2 text-sm">
                  <code className="block bg-muted p-2 rounded text-purple-400">docker build -t vibecast-frontend .</code>
                  <code className="block bg-muted p-2 rounded text-purple-400">docker run -p 80:80 vibecast-frontend</code>
                  <p className="text-muted-foreground">Containerized deployment with Nginx</p>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Performance Optimizations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    <span>Code splitting with lazy loading</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    <span>Bundle size monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    <span>Image optimization with WebP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    <span>Service worker caching</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
