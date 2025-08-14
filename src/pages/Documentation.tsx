
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
  Database,
  Github,
  ExternalLink
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
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            👽 Alienator
          </h1>
          <a 
            href="https://github.com/ruvnet/alienator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Github className="w-6 h-6 text-primary" />
          </a>
        </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced Detection System for Non-Human Intelligence in AI Outputs
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="outline" className="bg-anomaly-high/10 text-anomaly-high border-anomaly-high/30">
            Go 1.21+
          </Badge>
          <Badge variant="outline" className="bg-anomaly-medium/10 text-anomaly-medium border-anomaly-medium/30">
            MIT License
          </Badge>
          <Badge variant="outline" className="bg-anomaly-low/10 text-anomaly-low border-anomaly-low/30">
            Docker Ready
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Experimental
          </Badge>
        </div>
        <blockquote className="text-sm italic text-muted-foreground mt-4 border-l-2 border-primary/30 pl-4">
          "The greatest discovery would be to find that we are not alone, and that contact has already begun—hidden in plain sight within the very systems we've created."
        </blockquote>
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
                Advanced Detection System for Non-Human Intelligence in AI Outputs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10 mb-4">
                <p className="text-sm text-muted-foreground italic">
                  As artificial intelligence systems become increasingly sophisticated, the idea of hidden or non-human signals in AI-generated text has moved from science fiction to a speculative topic of discussion. Alienator approaches this question seriously by framing it as a problem of anomaly detection and signal processing.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Core Capabilities</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-accent" />
                      Real-time anomaly detection (10,000+ msgs/sec)
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-accent" />
                      Multi-layer analysis framework
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-accent" />
                      Byzantine fault-tolerant consensus
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      Distributed architecture with NATS
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Detection Methods</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-accent" />
                      Information-theoretic entropy analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-accent" />
                      Neural network pattern recognition
                    </li>
                    <li className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-accent" />
                      Human language universals validation
                    </li>
                    <li className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-accent" />
                      Temporal correlation across models
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Frontend Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-3">Core Technologies</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
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
                  <div className="grid grid-cols-2 gap-3 text-sm">
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
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Backend Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-3">./alienator_pkg/</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-4 h-4 text-accent" />
                        <span className="font-medium">cmd/</span>
                        <span className="text-muted-foreground">Main Applications</span>
                      </div>
                      <div className="ml-6 space-y-1 text-xs text-muted-foreground">
                        <div>• api/ - HTTP REST API server</div>
                        <div>• cli/ - Command-line interface</div>
                        <div>• worker/ - Background processing</div>
                        <div>• simple-api/ - Lightweight API</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-accent" />
                        <span className="font-medium">internal/</span>
                        <span className="text-muted-foreground">Core Logic</span>
                      </div>
                      <div className="ml-6 space-y-1 text-xs text-muted-foreground">
                        <div>• analyzers/ - Detection algorithms</div>
                        <div>• api/ - HTTP handlers & GraphQL</div>
                        <div>• core/ - Central coordination</div>
                        <div>• consensus/ - Byzantine fault tolerance</div>
                        <div>• services/ - Business logic</div>
                        <div>• grpc/ - gRPC services</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-accent" />
                        <span className="font-medium">pkg/</span>
                        <span className="text-muted-foreground">Public APIs</span>
                      </div>
                      <div className="ml-6 space-y-1 text-xs text-muted-foreground">
                        <div>• detector/ - Core detection engine</div>
                        <div>• crypto/ - Cryptographic utilities</div>
                        <div>• metrics/ - System metrics</div>
                        <div>• utils/ - Shared utilities</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Analysis Engine Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-3">Entropy Analysis</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Shannon entropy calculation</div>
                    <div>• Information density metrics</div>
                    <div>• Compression ratio analysis</div>
                    <div>• Randomness detection</div>
                  </div>
                  <div className="mt-2 text-xs">
                    <code className="bg-primary/10 px-2 py-1 rounded">internal/analyzers/entropy/</code>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-3">ML Detection</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Neural network models</div>
                    <div>• Pattern recognition</div>
                    <div>• Embedding analysis</div>
                    <div>• Clustering algorithms</div>
                  </div>
                  <div className="mt-2 text-xs">
                    <code className="bg-primary/10 px-2 py-1 rounded">internal/analyzers/ml/</code>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-3">Linguistic Analysis</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Grammar pattern analysis</div>
                    <div>• Semantic coherence</div>
                    <div>• Language universals</div>
                    <div>• Style consistency</div>
                  </div>
                  <div className="mt-2 text-xs">
                    <code className="bg-primary/10 px-2 py-1 rounded">internal/analyzers/linguistic/</code>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-3">Cryptographic</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Statistical randomness tests</div>
                    <div>• NIST test suite implementation</div>
                    <div>• Frequency analysis</div>
                    <div>• Chi-square testing</div>
                  </div>
                  <div className="mt-2 text-xs">
                    <code className="bg-primary/10 px-2 py-1 rounded">internal/analyzers/cryptographic/</code>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-3">Cross-Model</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Multi-model consensus</div>
                    <div>• Response correlation</div>
                    <div>• Deviation scoring</div>
                    <div>• Temporal analysis</div>
                  </div>
                  <div className="mt-2 text-xs">
                    <code className="bg-primary/10 px-2 py-1 rounded">internal/analyzers/pattern/</code>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-3">Consensus</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Byzantine fault tolerance</div>
                    <div>• Raft consensus protocol</div>
                    <div>• CRDT synchronization</div>
                    <div>• Gossip protocols</div>
                  </div>
                  <div className="mt-2 text-xs">
                    <code className="bg-primary/10 px-2 py-1 rounded">internal/consensus/</code>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Deployment & Infrastructure</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium mb-2">Docker</div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>• Multi-stage builds</div>
                      <div>• Development containers</div>
                      <div>• Docker Compose orchestration</div>
                    </div>
                    <div className="mt-2 text-xs">
                      <code className="bg-primary/10 px-2 py-1 rounded">deployments/docker/</code>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium mb-2">Kubernetes</div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>• Helm charts</div>
                      <div>• Environment configs</div>
                      <div>• Auto-scaling policies</div>
                    </div>
                    <div className="mt-2 text-xs">
                      <code className="bg-primary/10 px-2 py-1 rounded">deployments/k8s/</code>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Terraform</div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>• Infrastructure as Code</div>
                      <div>• Multi-environment support</div>
                      <div>• VPC & networking</div>
                    </div>
                    <div className="mt-2 text-xs">
                      <code className="bg-primary/10 px-2 py-1 rounded">deployments/terraform/</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Data Flow Architecture</h4>
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
                    <GitBranch className="w-4 h-4 text-accent" />
                    <span>gRPC → High-performance service communication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span>NATS → Message queuing and event streaming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent" />
                    <span>Byzantine consensus → Fault-tolerant decision making</span>
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
