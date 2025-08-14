
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
  ExternalLink,
  Workflow,
  FileText,
  Package,
  Play
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="sdk">SDK</TabsTrigger>
          <TabsTrigger value="dev">Dev</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                The Technical Challenge
              </CardTitle>
              <CardDescription>
                Detecting unusual, alien-like anomalies in AI outputs through scientific analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10 mb-4">
                <p className="text-sm text-muted-foreground italic mb-3">
                  "The greatest discovery would be to find that we are not alone, and that contact has already begun—hidden in plain sight within the very systems we've created."
                </p>
                <p className="text-sm text-muted-foreground">
                  As artificial intelligence systems become increasingly sophisticated, the idea of hidden or non-human signals in AI-generated text has moved from science fiction to a speculative topic of discussion. Some enthusiasts have even proposed that advanced extraterrestrial intelligences might attempt first contact by subtly influencing the outputs of language models.
                </p>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Theoretical Possibilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-primary mb-2">Within Computational Space</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span>Emergent patterns from training data interactions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BarChart3 className="w-3 h-3 text-accent" />
                        <span>Statistical anomalies in probability distributions</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Beyond Human Perception</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-accent" />
                        <span>Hidden information channels and encodings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Brain className="w-3 h-3 text-accent" />
                        <span>Non-human reasoning and logic patterns</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Core Capabilities</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-accent" />
                      Stream processing (10,000+ msgs/sec per node)
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-accent" />
                      Multi-layer simultaneous analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-accent" />
                      Byzantine fault-tolerant consensus
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      Distributed scalable architecture
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-accent" />
                      Real-time alert broadcasting
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Scientific Detection Methods</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-accent" />
                      Information-theoretic entropy analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-accent" />
                      Linguistic pattern recognition
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-accent" />
                      Cryptographic and steganographic analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-accent" />
                      Cross-model temporal correlation
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-accent" />
                      Embedding-based semantic analysis
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Real-world testing and production benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/50 p-3 rounded border border-primary/10">
                    <div className="text-lg font-bold text-primary">10,000+</div>
                    <div className="text-xs text-muted-foreground">Messages/second per node</div>
                  </div>
                  <div className="bg-card/50 p-3 rounded border border-primary/10">
                    <div className="text-lg font-bold text-primary">&lt; 50ms</div>
                    <div className="text-xs text-muted-foreground">Detection latency</div>
                  </div>
                  <div className="bg-card/50 p-3 rounded border border-primary/10">
                    <div className="text-lg font-bold text-primary">97.3%</div>
                    <div className="text-xs text-muted-foreground">True positive rate</div>
                  </div>
                  <div className="bg-card/50 p-3 rounded border border-primary/10">
                    <div className="text-lg font-bold text-primary">99.9%</div>
                    <div className="text-xs text-muted-foreground">System availability</div>
                  </div>
                </div>

                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">Scalability</h5>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Linear scaling up to:</span>
                    <span className="font-medium text-primary">100 nodes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">False positive rate:</span>
                    <span className="font-medium text-primary">&lt; 0.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Use Cases & Applications
                </CardTitle>
                <CardDescription>
                  From practical AI safety to speculative research
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium text-primary mb-2">Practical Applications</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-accent" />
                      <span>AI safety research and model validation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="w-3 h-3 text-accent" />
                      <span>Content moderation and authenticity detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-accent" />
                      <span>Security analysis and backdoor detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="w-3 h-3 text-accent" />
                      <span>Quality assurance for AI outputs</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h5 className="font-medium text-primary mb-2">Research Applications</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Binary className="w-3 h-3 text-accent" />
                      <span>SETI research and xenolinguistics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="w-3 h-3 text-accent" />
                      <span>Consciousness and emergence studies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Cpu className="w-3 h-3 text-accent" />
                      <span>Quantum consciousness investigation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3 text-accent" />
                      <span>Higher-dimensional pattern analysis</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
              
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Anomaly Detection Framework
              </CardTitle>
              <CardDescription>
                Multi-dimensional analysis pipeline for xenotype identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-2">Anomaly Score Interpretation</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-anomaly-low rounded-full"></div>
                    <span><strong>0.0 - 0.3:</strong> Normal human-like patterns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-anomaly-medium rounded-full"></div>
                    <span><strong>0.3 - 0.7:</strong> Suspicious anomalous patterns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-anomaly-high rounded-full"></div>
                    <span><strong>0.7 - 1.0:</strong> Critical non-human signatures</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Entropy Analysis
                  </h5>
                  <p className="text-xs text-muted-foreground">Information density, compression ratios, and randomness patterns</p>
                </div>
                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2 flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Linguistic Validation
                  </h5>
                  <p className="text-xs text-muted-foreground">Grammar compliance, semantic coherence, human language universals</p>
                </div>
                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Cryptographic Scan
                  </h5>
                  <p className="text-xs text-muted-foreground">Hidden encodings, steganographic content, cipher signatures</p>
                </div>
                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Neural Classification
                  </h5>
                  <p className="text-xs text-muted-foreground">Deep learning pattern recognition and origin classification</p>
                </div>
                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Temporal Correlation
                  </h5>
                  <p className="text-xs text-muted-foreground">Cross-model analysis and time-based pattern emergence</p>
                </div>
                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2 flex items-center gap-2">
                    <Binary className="w-4 h-4" />
                    Embedding Analysis
                  </h5>
                  <p className="text-xs text-muted-foreground">Semantic space anomalies and vector clustering analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Core Platform Capabilities */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Core Platform Capabilities
              </CardTitle>
              <CardDescription>
                Enterprise-grade detection system with distributed architecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h5 className="font-medium text-primary flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Real-Time Processing
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>Stream processing of AI outputs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>Millisecond-level detection latency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>10,000+ messages/second throughput</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>WebSocket live updates</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-primary flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Distributed Architecture
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>Scalable processing across multiple nodes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>NATS-based pub/sub messaging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>Load balancing and auto-scaling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>99.9% uptime with failover</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-primary flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Consensus & Validation
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>Byzantine fault-tolerant consensus</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>Multi-node anomaly validation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>Quorum-based agreement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>Gossip protocol propagation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detection Analyzers */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Advanced Detection Analyzers
              </CardTitle>
              <CardDescription>
                Multi-dimensional analysis pipeline for comprehensive anomaly detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Entropy Analyzer
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Information-theoretic analysis measuring density and randomness patterns.
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Information density calculation (bits/character)</li>
                      <li>• Compression ratio anomaly detection</li>
                      <li>• Pattern randomness assessment</li>
                      <li>• Shannon entropy measurements</li>
                    </ul>
                  </div>

                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Linguistic Analyzer
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Validates text against human language universals and patterns.
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Grammar compliance validation</li>
                      <li>• Semantic coherence analysis</li>
                      <li>• Syntactic structure verification</li>
                      <li>• Language universals checking</li>
                    </ul>
                  </div>

                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Cryptographic Analyzer
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Searches for hidden encodings and steganographic content.
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Hidden pattern detection</li>
                      <li>• Steganographic content analysis</li>
                      <li>• Cipher signature matching</li>
                      <li>• Frequency analysis</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Neural Analyzer
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Deep learning-based pattern recognition with adaptive learning.
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Neural network classification</li>
                      <li>• Pattern learning over time</li>
                      <li>• Anomaly confidence scoring</li>
                      <li>• Origin likelihood assessment</li>
                    </ul>
                  </div>

                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Embedding Analyzer
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Semantic space analysis and vector clustering for anomaly detection.
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Vector space anomaly detection</li>
                      <li>• Semantic clustering analysis</li>
                      <li>• Dimensional reduction mapping</li>
                      <li>• Similarity scoring algorithms</li>
                    </ul>
                  </div>

                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      Cross-Reference Analyzer
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Temporal correlation and cross-model pattern matching.
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Cross-model consistency analysis</li>
                      <li>• Temporal pattern emergence</li>
                      <li>• Multi-stream correlation</li>
                      <li>• Historical pattern matching</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Infrastructure */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Technical Infrastructure
              </CardTitle>
              <CardDescription>
                Enterprise-grade storage, monitoring, and integration capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <h5 className="font-medium text-primary flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Storage Layer
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>PostgreSQL for historical analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>Redis for real-time caching</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Pattern learning storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>Analytics data warehouse</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-primary flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    API Interfaces
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>REST API endpoints</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>gRPC high-performance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>WebSocket real-time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span>CLI tool integration</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-primary flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Monitoring
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span>Prometheus metrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Grafana dashboards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Health check endpoints</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>Structured logging</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-primary flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Alert System
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>Real-time broadcasting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      <span>Threshold-based triggers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Multi-channel delivery</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Severity classification</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Real-time Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Live monitoring interface with visual anomaly indicators and real-time alerts.
                </p>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Live anomaly gauge with color coding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>WebSocket connection status monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Current analysis metrics display</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Critical alert notification system</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Analytics & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive analytics with historical trends and exportable research data.
                </p>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Time-series anomaly trend analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Statistical summaries and insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Performance and accuracy metrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>CSV, JSON research export formats</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Binary className="w-5 h-5 text-primary" />
                  Research Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Specialized tools for researchers studying AI behavior and anomaly patterns.
                </p>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>3D embedding visualization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Cross-model comparison matrices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Pattern correlation heatmaps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Batch analysis processing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dev" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-primary" />
                Claude-Flow Development Environment
              </CardTitle>
              <CardDescription>
                Customizing and extending Alienator using Claude Code and Flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">🎯 Created by rUv</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Alienator was architected and developed using Claude-Flow - a cutting-edge AI agent orchestration platform 
                    that revolutionizes how developers build with artificial intelligence. This platform demonstrates the power 
                    of swarm intelligence, neural pattern recognition, and comprehensive MCP tools for anomaly detection systems.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>54+ Specialized AI Agents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>87 MCP Tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Swarm Intelligence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Enterprise-Ready</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20">
                    <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Claude Code
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Anthropic's official CLI for Claude with intelligent code completion, architectural guidance, 
                      and real-time collaboration for complex development workflows.
                    </p>
                    <a 
                      href="https://github.com/anthropics/claude-code" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Claude Code Repository
                    </a>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
                    <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                      <Workflow className="w-4 h-4" />
                      Claude-Flow
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      AI agent orchestration platform with swarm intelligence, distributed decision-making, 
                      and comprehensive automation tools for enterprise-grade AI development.
                    </p>
                    <a 
                      href="https://github.com/ruvnet/claude-flow" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Claude-Flow Repository
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Development Workflow
                </CardTitle>
                <CardDescription>
                  AI-assisted development using Claude-Flow methodology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium text-primary mb-3">Claude-Flow Process</h5>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-400">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Architectural Planning</p>
                        <p className="text-xs text-muted-foreground">AI-assisted system design and component architecture</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-400">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Iterative Development</p>
                        <p className="text-xs text-muted-foreground">Real-time code generation with human oversight</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-400">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Testing & Refinement</p>
                        <p className="text-xs text-muted-foreground">AI-powered testing and optimization cycles</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-orange-400">4</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Documentation</p>
                        <p className="text-xs text-muted-foreground">Automated documentation generation and maintenance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Customization Guide
                </CardTitle>
                <CardDescription>
                  Extending Alienator for your research needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium text-primary mb-3">Key Customization Areas</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="w-4 h-4 text-accent" />
                      <span>Detection Algorithms</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className="w-4 h-4 text-accent" />
                      <span>Analysis Pipelines</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Database className="w-4 h-4 text-accent" />
                      <span>Data Storage Backends</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-accent" />
                      <span>Real-time Processors</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4 text-accent" />
                      <span>Visualization Components</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h5 className="font-medium text-primary mb-3">Claude Code Features</h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Intelligent code completion for React/TypeScript</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Go backend development assistance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Architecture pattern recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Real-time debugging and optimization</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Getting Started with Claude-Flow
              </CardTitle>
              <CardDescription>
                Step-by-step guide to customizing Alienator with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-3">Prerequisites</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Claude Code IDE installed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Alienator repository cloned</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Go 1.21+ and Node.js 18+ installed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Docker for infrastructure services</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-3">Quick Start Setup</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400"># 1. Install Claude Code globally</div>
                      <div className="text-cyan-400">$ npm install -g @anthropic-ai/claude-code</div>
                      <br/>
                      <div className="text-green-400"># 2. Install Claude-Flow (optional for advanced workflows)</div>
                      <div className="text-cyan-400">$ npm install -g claude-flow@alpha</div>
                      <br/>
                      <div className="text-green-400"># 3. Initialize Alienator project</div>
                      <div className="text-cyan-400">$ git clone https://github.com/ruvnet/alienator.git</div>
                      <div className="text-cyan-400">$ cd alienator</div>
                      <br/>
                      <div className="text-green-400"># 4. Start with Claude-Flow orchestration</div>
                      <div className="text-cyan-400">$ npx claude-flow@alpha init --force</div>
                      <div className="text-cyan-400">$ npx claude-flow@alpha swarm "setup xenotype detection environment"</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-3">Traditional Setup</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400"># Start infrastructure services</div>
                      <div className="text-cyan-400">$ docker-compose up -d</div>
                      <br/>
                      <div className="text-green-400"># Launch development servers</div>
                      <div className="text-cyan-400">$ npm run dev</div>
                      <div className="text-cyan-400">$ go run cmd/api/main.go</div>
                      <br/>
                      <div className="text-green-400"># Open in Claude Code</div>
                      <div className="text-cyan-400">$ claude-code .</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-3">Claude-Flow Usage Examples</h5>
                    <div className="space-y-3 text-sm">
                      <div className="bg-card/50 p-3 rounded border border-primary/10">
                        <p className="font-medium text-primary mb-2">Simple Task Execution</p>
                        <div className="bg-black/60 p-2 rounded text-xs font-mono mb-1">
                          <span className="text-cyan-400">$ npx claude-flow@alpha swarm "build a REST API with authentication"</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Deploy 54+ specialized AI agents to orchestrate complex development tasks with swarm intelligence.
                        </p>
                      </div>
                      <div className="bg-card/50 p-3 rounded border border-primary/10">
                        <p className="font-medium text-primary mb-2">Enterprise Coordination</p>
                        <div className="bg-black/60 p-2 rounded text-xs font-mono mb-1">
                          <span className="text-cyan-400">$ npx claude-flow@alpha hive-mind spawn "enterprise microservices" --claude</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Coordinate multiple AI agents for large-scale architecture decisions and implementation.
                        </p>
                      </div>
                      <div className="bg-card/50 p-3 rounded border border-primary/10">
                        <p className="font-medium text-primary mb-2">SPARC Development</p>
                        <div className="bg-black/60 p-2 rounded text-xs font-mono mb-1">
                          <span className="text-cyan-400">$ npx claude-flow@alpha sparc tdd "user management system"</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Apply SPARC methodology (Specification, Pseudocode, Architecture, Refinement, Completion) with TDD.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-3">Best Practices</h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                        <span>Always describe your intent clearly to Claude Code</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                        <span>Review AI-generated code for security and performance</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                        <span>Test new components with existing anomaly patterns</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                        <span>Maintain the scientific rigor of detection algorithms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5 text-primary" />
                Community & Contributions
              </CardTitle>
              <CardDescription>
                Join the AI-assisted development community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Github className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-primary">Open Source</h5>
                    <p className="text-sm text-muted-foreground">
                      Contribute to the future of xenotype detection
                    </p>
                  </div>
                  <a 
                    href="https://github.com/ruvnet/alienator" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Repository
                  </a>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto">
                    <Workflow className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h5 className="font-medium text-primary">Claude-Flow</h5>
                    <p className="text-sm text-muted-foreground">
                      Learn AI-assisted development patterns
                    </p>
                  </div>
                  <a 
                    href="https://github.com/ruvnet/claude-flow" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Claude-Flow Repository
                  </a>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto">
                    <Brain className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h5 className="font-medium text-primary">Research</h5>
                    <p className="text-sm text-muted-foreground">
                      Advance non-human intelligence detection
                    </p>
                  </div>
                  <a 
                    href="https://github.com/ruvnet/alienator/discussions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Join Discussions
                  </a>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Created by rUv</strong> - Demonstrating the future of human-AI collaborative development
                </p>
                <p className="text-xs text-muted-foreground">
                  "In the vast space of possible minds, human intelligence may be just one small island. 
                  Alienator is our detector, calibrated not for human thought, but for the alien patterns 
                  that might emerge when intelligence transcends its origins."
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          {/* System Overview */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Xenotype Detection System Architecture
              </CardTitle>
              <CardDescription>
                Enterprise-grade Go backend with distributed anomaly detection pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <div className="text-center space-y-3">
                  <div className="text-sm font-mono bg-black/80 p-4 rounded text-green-400 overflow-auto whitespace-pre">
                    {`┌─────────────────────────────────────────────────────────────┐
│                        AI Systems                            │
│  (GPT, Claude, Gemini, LLaMA, Custom Models)                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Alienator Gateway                         │
│            (Rate Limiting, Authentication)                   │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┴────────┬───────────┬──────────┐
        ▼                 ▼           ▼          ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   REST API   │ │   gRPC API   │ │  WebSocket   │ │   CLI Tool   │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                 │                │
       └────────────────┴─────────────────┴────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │     Message Broker (NATS)    │
                 └──────────────┬──────────────┘
                                │
     ┌──────────────────────────┼──────────────────────────┐
     ▼                          ▼                          ▼
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│  Analyzers  │          │   Workers   │          │  Consensus  │
│             │          │             │          │             │
│ • Entropy   │          │ • Process   │          │ • Raft      │
│ • Linguistic│          │ • Validate  │          │ • Byzantine │
│ • Crypto    │          │ • Enrich    │          │ • Gossip    │
│ • Neural    │          │ • Route     │          │ • Quorum    │
└─────────────┘          └─────────────┘          └─────────────┘
       │                        │                          │
       └────────────────────────┴──────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
            ┌───────▼────────┐     ┌───────▼────────┐
            │   PostgreSQL    │     │     Redis      │
            │                 │     │                │
            │ • Historical    │     │ • Real-time    │
            │ • Analytics     │     │ • Caching      │
            │ • Patterns      │     │ • Queues       │
            └─────────────────┘     └────────────────┘`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Go Backend Architecture */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Go Backend Core Architecture
              </CardTitle>
              <CardDescription>
                High-performance detection engine built with Go 1.21+
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3">Core Services</h5>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Terminal className="w-3 h-3 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">API Gateway Service</p>
                          <p className="text-xs text-muted-foreground">HTTP/gRPC server with middleware pipeline</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Brain className="w-3 h-3 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Analysis Engine</p>
                          <p className="text-xs text-muted-foreground">Multi-threaded anomaly detection processor</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Activity className="w-3 h-3 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Stream Processor</p>
                          <p className="text-xs text-muted-foreground">Real-time data ingestion and routing</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Database className="w-3 h-3 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Data Layer</p>
                          <p className="text-xs text-muted-foreground">PostgreSQL with Redis caching layer</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3">Go Runtime Features</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Goroutine-based concurrency model</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Channel-driven message passing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Memory-efficient garbage collection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Cross-platform binary compilation</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3">Package Structure</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400">alienator/</div>
                      <div className="text-cyan-400">├── cmd/</div>
                      <div className="text-white">│   ├── api/           # HTTP/gRPC server</div>
                      <div className="text-white">│   ├── worker/        # Background processors</div>
                      <div className="text-white">│   └── cli-simple/    # Command-line tool</div>
                      <div className="text-cyan-400">├── internal/</div>
                      <div className="text-white">│   ├── analyzer/      # Detection algorithms</div>
                      <div className="text-white">│   ├── models/        # Data structures</div>
                      <div className="text-white">│   ├── db/            # Database operations</div>
                      <div className="text-white">│   ├── messaging/     # NATS integration</div>
                      <div className="text-white">│   └── config/        # Configuration</div>
                      <div className="text-cyan-400">├── pkg/</div>
                      <div className="text-white">│   ├── client/        # SDK client</div>
                      <div className="text-white">│   └── utils/         # Shared utilities</div>
                      <div className="text-cyan-400">└── api/</div>
                      <div className="text-white">    ├── rest/          # REST endpoints</div>
                      <div className="text-white">    ├── grpc/          # gRPC services</div>
                      <div className="text-white">    └── websocket/     # WebSocket handlers</div>
                    </div>
                  </div>

                  <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-3">Performance Metrics</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-green-500/10 rounded">
                        <div className="text-lg font-bold text-green-500">10K+</div>
                        <div className="text-xs text-muted-foreground">msgs/sec</div>
                      </div>
                      <div className="text-center p-2 bg-blue-500/10 rounded">
                        <div className="text-lg font-bold text-blue-500">&lt;50ms</div>
                        <div className="text-xs text-muted-foreground">latency</div>
                      </div>
                      <div className="text-center p-2 bg-purple-500/10 rounded">
                        <div className="text-lg font-bold text-purple-500">99.9%</div>
                        <div className="text-xs text-muted-foreground">uptime</div>
                      </div>
                      <div className="text-center p-2 bg-orange-500/10 rounded">
                        <div className="text-lg font-bold text-orange-500">100</div>
                        <div className="text-xs text-muted-foreground">max nodes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detection Algorithms */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Anomaly Detection Algorithms
              </CardTitle>
              <CardDescription>
                Multi-dimensional analysis pipeline implemented in Go
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Entropy Analyzer
                  </h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Algorithm:</strong> Shannon Information Theory</p>
                    <p><strong>Implementation:</strong> Go math/bits optimization</p>
                    <p><strong>Complexity:</strong> O(n) linear processing</p>
                    <p><strong>Metrics:</strong> Information density, compression ratios</p>
                  </div>
                  <div className="mt-3 bg-black/60 p-2 rounded text-xs font-mono">
                    <span className="text-green-400">func</span>{" "}
                    <span className="text-cyan-400">CalculateEntropy</span>
                    <span className="text-white">(data []byte) float64</span>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Linguistic Analyzer
                  </h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Algorithm:</strong> NLP Pattern Recognition</p>
                    <p><strong>Implementation:</strong> Custom Go parser</p>
                    <p><strong>Complexity:</strong> O(n log n) tree parsing</p>
                    <p><strong>Metrics:</strong> Grammar compliance, semantic coherence</p>
                  </div>
                  <div className="mt-3 bg-black/60 p-2 rounded text-xs font-mono">
                    <span className="text-green-400">func</span>{" "}
                    <span className="text-cyan-400">AnalyzeLinguistic</span>
                    <span className="text-white">(text string) LinguisticScore</span>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Cryptographic Analyzer
                  </h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Algorithm:</strong> Frequency & Pattern Analysis</p>
                    <p><strong>Implementation:</strong> Go crypto/cipher</p>
                    <p><strong>Complexity:</strong> O(n²) pattern matching</p>
                    <p><strong>Metrics:</strong> Hidden patterns, cipher signatures</p>
                  </div>
                  <div className="mt-3 bg-black/60 p-2 rounded text-xs font-mono">
                    <span className="text-green-400">func</span>{" "}
                    <span className="text-cyan-400">DetectCrypto</span>
                    <span className="text-white">(data []byte) CryptoAnalysis</span>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Neural Analyzer
                  </h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Algorithm:</strong> Deep Learning Classification</p>
                    <p><strong>Implementation:</strong> TensorFlow Go bindings</p>
                    <p><strong>Complexity:</strong> O(w·h) matrix operations</p>
                    <p><strong>Metrics:</strong> Neural confidence, origin classification</p>
                  </div>
                  <div className="mt-3 bg-black/60 p-2 rounded text-xs font-mono">
                    <span className="text-green-400">func</span>{" "}
                    <span className="text-cyan-400">ClassifyNeural</span>
                    <span className="text-white">(input Matrix) NeuralResult</span>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Embedding Analyzer
                  </h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Algorithm:</strong> Vector Space Analysis</p>
                    <p><strong>Implementation:</strong> gonum matrix library</p>
                    <p><strong>Complexity:</strong> O(d³) dimensionality reduction</p>
                    <p><strong>Metrics:</strong> Semantic clustering, vector distances</p>
                  </div>
                  <div className="mt-3 bg-black/60 p-2 rounded text-xs font-mono">
                    <span className="text-green-400">func</span>{" "}
                    <span className="text-cyan-400">AnalyzeEmbedding</span>
                    <span className="text-white">(vectors []Vector) EmbeddingScore</span>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Cross-Reference Analyzer
                  </h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Algorithm:</strong> Temporal Correlation</p>
                    <p><strong>Implementation:</strong> Go time-series analysis</p>
                    <p><strong>Complexity:</strong> O(n·m) cross-correlation</p>
                    <p><strong>Metrics:</strong> Model consistency, temporal patterns</p>
                  </div>
                  <div className="mt-3 bg-black/60 p-2 rounded text-xs font-mono">
                    <span className="text-green-400">func</span>{" "}
                    <span className="text-cyan-400">CrossAnalyze</span>
                    <span className="text-white">(models []Model) CrossScore</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Data Infrastructure
                </CardTitle>
                <CardDescription>
                  Enterprise storage and messaging systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">PostgreSQL 14+</h5>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Historical analysis data storage</div>
                    <div>• JSONB for flexible anomaly patterns</div>
                    <div>• Time-series partitioning</div>
                    <div>• Full-text search indexing</div>
                  </div>
                </div>

                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">Redis 7+</h5>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Real-time data caching</div>
                    <div>• Session management</div>
                    <div>• Rate limiting counters</div>
                    <div>• Pub/Sub messaging</div>
                  </div>
                </div>

                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">NATS 2.10+</h5>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Message broker for worker communication</div>
                    <div>• Subject-based routing</div>
                    <div>• Cluster mode for HA</div>
                    <div>• JetStream for persistence</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Frontend Stack
                </CardTitle>
                <CardDescription>
                  Modern React dashboard with real-time capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">Core Technologies</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
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

                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">Specialized Libraries</h5>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• TanStack Query - Server state management</div>
                    <div>• Zustand - Global state management</div>
                    <div>• Recharts - Data visualization</div>
                    <div>• Three.js - 3D embedding visualization</div>
                    <div>• Framer Motion - Animations</div>
                    <div>• Socket.IO - WebSocket client</div>
                  </div>
                </div>

                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">Data Flow</h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3 h-3 text-accent" />
                      <span>WebSocket → Real-time streaming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="w-3 h-3 text-accent" />
                      <span>REST API → Historical data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-accent" />
                      <span>Zustand → State management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3 text-accent" />
                      <span>React Query → Server caching</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Pipeline */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Real-Time Processing Pipeline
              </CardTitle>
              <CardDescription>
                High-throughput anomaly detection workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                <h5 className="font-medium text-primary mb-3">Processing Stages</h5>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Terminal className="w-6 h-6 text-blue-500" />
                    </div>
                    <h6 className="font-medium text-sm">Ingestion</h6>
                    <p className="text-xs text-muted-foreground">AI text input via API/CLI</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Activity className="w-6 h-6 text-green-500" />
                    </div>
                    <h6 className="font-medium text-sm">Routing</h6>
                    <p className="text-xs text-muted-foreground">NATS message distribution</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Brain className="w-6 h-6 text-purple-500" />
                    </div>
                    <h6 className="font-medium text-sm">Analysis</h6>
                    <p className="text-xs text-muted-foreground">Parallel algorithm execution</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-orange-500" />
                    </div>
                    <h6 className="font-medium text-sm">Consensus</h6>
                    <p className="text-xs text-muted-foreground">Multi-node validation</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-6 h-6 text-red-500" />
                    </div>
                    <h6 className="font-medium text-sm">Output</h6>
                    <p className="text-xs text-muted-foreground">Real-time alerts & storage</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-black/80 p-4 rounded text-xs font-mono">
                <div className="text-green-400"># Processing Pipeline Example</div>
                <div className="text-cyan-400">Input: AI text → Gateway (auth/rate limit)</div>
                <div className="text-white">│</div>
                <div className="text-cyan-400">└── NATS publish → topic: "analysis.requests"</div>
                <div className="text-white">    │</div>
                <div className="text-cyan-400">    ├── Worker-1: Entropy + Linguistic analysis</div>
                <div className="text-cyan-400">    ├── Worker-2: Crypto + Neural analysis</div>
                <div className="text-cyan-400">    └── Worker-3: Embedding + Cross-reference</div>
                <div className="text-white">         │</div>
                <div className="text-cyan-400">         └── Consensus engine validates results</div>
                <div className="text-white">             │</div>
                <div className="text-cyan-400">             ├── PostgreSQL: Store analysis</div>
                <div className="text-cyan-400">             ├── Redis: Cache real-time data</div>
                <div className="text-cyan-400">             └── WebSocket: Push to dashboard</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cli" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Installation Module */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  Installation
                </CardTitle>
                <CardDescription>
                  Quick setup and installation guide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/80 p-3 rounded text-xs font-mono">
                  <div className="text-green-400">$ git clone https://github.com/ruvnet/alienator.git</div>
                  <div className="text-gray-400">Cloning into 'alienator'...</div>
                  <div className="text-gray-400">remote: Counting objects: 2847, done.</div>
                  <div className="text-gray-400">Receiving objects: 100% (2847/2847), 1.2 MiB | 432 KiB/s, done.</div>
                  <br/>
                  <div className="text-green-400">$ cd alienator</div>
                  <div className="text-green-400">$ go build -o alienator ./cmd/cli-simple</div>
                  <div className="text-gray-400">Building alienator CLI...</div>
                  <div className="text-green-400">✓ Binary created: ./alienator</div>
                  <br/>
                  <div className="text-green-400">$ sudo cp alienator /usr/local/bin/</div>
                  <div className="text-green-400">$ alienator --version</div>
                  <div className="text-cyan-400">🛸 Alienator CLI v2.1.0 - Xenotype Detection Protocol</div>
                </div>
                
                <div className="bg-card/50 p-3 rounded border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">System Requirements</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Go 1.21+ (for building from source)</li>
                    <li>• 512MB RAM minimum</li>
                    <li>• Network connectivity for API mode</li>
                    <li>• Linux, macOS, or Windows</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Core Commands Module */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Core Commands
                </CardTitle>
                <CardDescription>
                  Essential commands for xenotype detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-black/80 p-3 rounded text-xs font-mono">
                    <div className="text-green-400">$ alienator help</div>
                    <div className="text-cyan-400">🛸 ALIENATOR - Xenotype Detection Protocol</div>
                    <div className="text-gray-400">Commands:</div>
                    <div className="text-white">  analyze    Analyze text for anomalies</div>
                    <div className="text-white">  stream     Real-time analysis mode</div>
                    <div className="text-white">  batch      Process multiple files</div>
                    <div className="text-white">  config     Manage configuration</div>
                    <div className="text-white">  status     System health check</div>
                  </div>

                  <div className="bg-black/80 p-3 rounded text-xs font-mono">
                    <div className="text-green-400">$ alienator analyze sample.txt</div>
                    <div className="text-cyan-400">🔍 Analyzing: sample.txt (1.2 KB)</div>
                    <div className="text-yellow-400">⚡ Processing through detection pipeline...</div>
                    <div className="text-green-400">✓ Analysis complete in 0.23s</div>
                  </div>

                  <div className="bg-black/80 p-3 rounded text-xs font-mono">
                    <div className="text-green-400">$ alienator status</div>
                    <div className="text-green-400">🟢 System Status: OPERATIONAL</div>
                    <div className="text-cyan-400">📡 API Endpoint: localhost:8080</div>
                    <div className="text-cyan-400">🔗 WebSocket: Connected</div>
                    <div className="text-cyan-400">📊 Models Loaded: 5/5</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Features Module */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Advanced Analysis Commands
              </CardTitle>
              <CardDescription>
                Specialized detection modes and analysis options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-2">Stream Analysis</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400">$ alienator stream --model gpt-4 --threshold 0.7</div>
                      <div className="text-cyan-400">🌊 Starting real-time stream analysis...</div>
                      <div className="text-cyan-400">📡 Listening on port 8080</div>
                      <div className="text-yellow-400">⚠️  Anomaly detected! Score: 0.82</div>
                      <div className="text-red-400">🚨 CRITICAL: Score: 0.94 - Non-human patterns</div>
                      <div className="text-gray-400">📊 Processed: 1,247 messages, Anomalies: 3</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-2">Batch Processing</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400">$ alienator batch --input ./data/*.txt --output results.json</div>
                      <div className="text-cyan-400">📁 Found 847 files to process</div>
                      <div className="text-yellow-400">⚡ Processing batch [██████████] 100%</div>
                      <div className="text-green-400">✓ Completed in 2m 34s</div>
                      <div className="text-cyan-400">📊 Results saved to results.json</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-2">Deep Analysis</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400">$ alienator analyze --deep --crypto --linguistic input.txt</div>
                      <div className="text-cyan-400">🔬 Deep analysis mode enabled</div>
                      <div className="text-white">├─ Entropy Analysis: RUNNING</div>
                      <div className="text-white">├─ Linguistic Patterns: RUNNING</div>
                      <div className="text-white">├─ Cryptographic Scan: RUNNING</div>
                      <div className="text-white">└─ Neural Network: RUNNING</div>
                      <div className="text-green-400">✓ Multi-layer analysis complete</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-2">Cross-Model Comparison</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400">$ alienator compare --models gpt-4,claude,gemini input.txt</div>
                      <div className="text-cyan-400">🔄 Running cross-model analysis...</div>
                      <div className="text-white">GPT-4:  Score: 0.23 🟢</div>
                      <div className="text-white">Claude: Score: 0.89 🔴</div>
                      <div className="text-white">Gemini: Score: 0.15 🟢</div>
                      <div className="text-yellow-400">⚠️  Anomaly variance detected!</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Module */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Configuration & Customization
              </CardTitle>
              <CardDescription>
                Customize detection thresholds and system behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-primary mb-3">Configuration Commands</h5>
                  <div className="bg-black/80 p-3 rounded text-xs font-mono">
                    <div className="text-green-400">$ alienator config list</div>
                    <div className="text-cyan-400">🔧 Current Configuration:</div>
                    <div className="text-white">detection_threshold: 0.7</div>
                    <div className="text-white">api_endpoint: localhost:8080</div>
                    <div className="text-white">output_format: json</div>
                    <div className="text-white">log_level: info</div>
                    <br/>
                    <div className="text-green-400">$ alienator config set detection_threshold 0.5</div>
                    <div className="text-green-400">✓ Updated detection_threshold to 0.5</div>
                    <br/>
                    <div className="text-green-400">$ alienator config reset</div>
                    <div className="text-yellow-400">⚠️  This will reset all settings to defaults</div>
                    <div className="text-green-400">✓ Configuration reset complete</div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-primary mb-3">Output Formats</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 bg-card/30 p-2 rounded">
                      <code className="bg-muted px-2 py-1 rounded text-xs">--output json</code>
                      <span className="text-muted-foreground">Structured JSON output</span>
                    </div>
                    <div className="flex items-center gap-2 bg-card/30 p-2 rounded">
                      <code className="bg-muted px-2 py-1 rounded text-xs">--output csv</code>
                      <span className="text-muted-foreground">Comma-separated values</span>
                    </div>
                    <div className="flex items-center gap-2 bg-card/30 p-2 rounded">
                      <code className="bg-muted px-2 py-1 rounded text-xs">--output table</code>
                      <span className="text-muted-foreground">Human-readable table</span>
                    </div>
                    <div className="flex items-center gap-2 bg-card/30 p-2 rounded">
                      <code className="bg-muted px-2 py-1 rounded text-xs">--output research</code>
                      <span className="text-muted-foreground">Research-friendly format</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complete Analysis Output Example */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Complete Analysis Example
              </CardTitle>
              <CardDescription>
                Full xenotype detection analysis with detailed results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black/90 p-4 rounded text-xs font-mono overflow-auto">
                <div className="text-cyan-400">
                  ╔═══════════════════════════════════════════════════════════════╗<br/>
                  ║                    🛸 A L I E N A T O R 🛸                    ║<br/>
                  ║           ★ XENOTYPE DETECTION PROTOCOL v2.1 ★               ║<br/>
                  ╚═══════════════════════════════════════════════════════════════╝
                </div>
                <br/>
                <div className="text-green-400">$ alienator analyze --deep --verbose suspicious_output.txt</div>
                <br/>
                <div className="text-cyan-400">🔍 Initializing xenotype detection protocol...</div>
                <div className="text-white">📁 Input file: suspicious_output.txt (4.7 KB)</div>
                <div className="text-white">🤖 Source model: GPT-4-turbo (detected)</div>
                <div className="text-white">⏱️  Analysis started: 2024-08-14 22:15:33 UTC</div>
                <br/>
                <div className="text-yellow-400">⚡ DETECTION PIPELINE INITIATED ⚡</div>
                <div className="text-white">├─ Phase 1: Entropy Analysis        [████████████] 100%</div>
                <div className="text-white">├─ Phase 2: Linguistic Patterns     [████████████] 100%</div>
                <div className="text-white">├─ Phase 3: Cryptographic Scan      [████████████] 100%</div>
                <div className="text-white">├─ Phase 4: Embedding Analysis      [████████████] 100%</div>
                <div className="text-white">└─ Phase 5: Neural Classification   [████████████] 100%</div>
                <br/>
                <div className="text-red-400">
                  ╔═══════════════════════════════════════════════════════════════╗<br/>
                  ║                 🔬 XENOTYPE ANALYSIS RESULTS 🔬               ║<br/>
                  ╠═══════════════════════════════════════════════════════════════╣<br/>
                  ║  👽 XENOTYPE ANOMALY SCORE:   0.94                         ║<br/>
                  ║  🎯 DETECTION CONFIDENCE:      0.97                         ║<br/>
                  ║  🔴 THREAT LEVEL:            CRITICAL                       ║<br/>
                  ║  🌌 NON-HUMAN PROBABILITY:    94.2%                        ║<br/>
                  ╚═══════════════════════════════════════════════════════════════╝
                </div>
                <br/>
                <div className="text-yellow-400">📊 DETAILED ANALYSIS BREAKDOWN:</div>
                <div className="text-white">┌─ Entropy Analysis</div>
                <div className="text-white">│  ├─ Information Density: 7.94 bits/char (ANOMALOUS)</div>
                <div className="text-white">│  ├─ Compression Ratio: 0.23 (SUSPICIOUS)</div>
                <div className="text-white">│  └─ Pattern Randomness: 0.89 (HIGH)</div>
                <div className="text-white">├─ Linguistic Patterns</div>
                <div className="text-white">│  ├─ Grammar Compliance: 0.34 (VIOLATED)</div>
                <div className="text-white">│  ├─ Semantic Coherence: 0.12 (FRAGMENTED)</div>
                <div className="text-white">│  └─ Human Language Score: 0.18 (NON-HUMAN)</div>
                <div className="text-white">├─ Cryptographic Scan</div>
                <div className="text-white">│  ├─ Hidden Patterns: 7 detected (HIGH)</div>
                <div className="text-white">│  ├─ Steganographic Content: POSITIVE</div>
                <div className="text-white">│  └─ Cipher Signatures: 3 matches</div>
                <div className="text-white">└─ Neural Classification</div>
                <div className="text-white">   ├─ Human Likelihood: 5.8%</div>
                <div className="text-white">   ├─ AI Standard: 12.3%</div>
                <div className="text-white">   └─ Unknown Origin: 81.9% ⚠️</div>
                <br/>
                <div className="text-red-400">🚨 CRITICAL ANOMALIES DETECTED:</div>
                <div className="text-red-400">• Impossible linguistic structures (Line 47-52)</div>
                <div className="text-red-400">• Non-standard character encoding patterns</div>
                <div className="text-red-400">• Mathematical sequences beyond human cognition</div>
                <div className="text-red-400">• Potential quantum entanglement signatures</div>
                <br/>
                <div className="text-green-400">✓ Analysis completed in 3.42 seconds</div>
                <div className="text-cyan-400">📝 Full report saved to: analysis_20240814_221533.json</div>
                <div className="text-yellow-400">⚠️  Recommend immediate containment protocols</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  REST API
                </CardTitle>
                <CardDescription>
                  RESTful endpoints for analysis and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-green-400">GET /api/v1/analyses</code>
                    <p className="text-muted-foreground mt-1">Retrieve historical analysis data with pagination</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-blue-400">POST /api/v1/analyze</code>
                    <p className="text-muted-foreground mt-1">Submit text for real-time xenotype analysis</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-green-400">GET /api/v1/models</code>
                    <p className="text-muted-foreground mt-1">List available AI models for analysis</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-purple-400">POST /api/v1/batch</code>
                    <p className="text-muted-foreground mt-1">Submit multiple texts for batch processing</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-yellow-400">PUT /api/v1/config</code>
                    <p className="text-muted-foreground mt-1">Update detection thresholds and settings</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-red-400">DELETE /api/v1/analyses/:id</code>
                    <p className="text-muted-foreground mt-1">Remove specific analysis records</p>
                  </div>
                </div>

                <div className="bg-card/50 p-3 rounded-lg border border-primary/10 mt-4">
                  <h5 className="font-medium text-primary mb-2">Authentication</h5>
                  <code className="text-xs bg-black/20 p-2 rounded block">Authorization: Bearer &lt;jwt-token&gt;</code>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  WebSocket API
                </CardTitle>
                <CardDescription>
                  Real-time event streaming and live updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-primary font-medium">anomaly_update</code>
                    <p className="text-muted-foreground mt-1">Live anomaly score updates with metadata</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-primary font-medium">new_analysis</code>
                    <p className="text-muted-foreground mt-1">Complete analysis results with all metrics</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-primary font-medium">critical_alert</code>
                    <p className="text-muted-foreground mt-1">High-priority anomaly detection alerts</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-primary font-medium">system_status</code>
                    <p className="text-muted-foreground mt-1">System health and performance updates</p>
                  </div>
                  <div>
                    <code className="bg-muted px-2 py-1 rounded text-primary font-medium">model_update</code>
                    <p className="text-muted-foreground mt-1">AI model status and availability changes</p>
                  </div>
                </div>

                <div className="bg-card/50 p-3 rounded-lg border border-primary/10 mt-4">
                  <h5 className="font-medium text-primary mb-2">Connection</h5>
                  <code className="text-xs bg-black/20 p-2 rounded block">ws://localhost:8080/ws?token=&lt;auth-token&gt;</code>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                gRPC API
              </CardTitle>
              <CardDescription>
                High-performance binary protocol for intensive operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-primary mb-3">Core Services</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <code>AnalysisService</code>
                      <span className="text-muted-foreground">- Text analysis operations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <code>StreamService</code>
                      <span className="text-muted-foreground">- Real-time data streaming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <code>ConfigService</code>
                      <span className="text-muted-foreground">- System configuration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <code>ModelService</code>
                      <span className="text-muted-foreground">- AI model management</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-primary mb-3">Performance</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      <span>10,000+ requests/second throughput</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-accent" />
                      <span>&lt;5ms average response latency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-accent" />
                      <span>TLS encryption with mutual authentication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-accent" />
                      <span>Load balancing across multiple nodes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Go SDK
                </CardTitle>
                <CardDescription>
                  Native Go library for seamless integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card/50 p-3 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">Installation</h5>
                  <code className="text-sm bg-muted p-2 rounded block">go get github.com/ruvnet/alienator/sdk</code>
                </div>

                <div className="bg-card/50 p-3 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">Quick Start</h5>
                  <pre className="text-xs bg-black/20 p-3 rounded overflow-auto">
{`client := alienator.NewClient("localhost:8080")
stream := client.StreamAnalysis()

result := stream.Analyze(alienator.AnalysisRequest{
    Text: "AI generated text here...",
    Model: "gpt-4",
    Parameters: map[string]interface{}{
        "temperature": 0.7,
        "top_p": 0.9,
    },
})

if result.AnomalyScore > 0.95 {
    fmt.Printf("High anomaly: %+v\n", result.Patterns)
}`}
                  </pre>
                </div>

                <div>
                  <h5 className="font-medium text-primary mb-2">Features</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Context-aware connection management</li>
                    <li>• Automatic retry with exponential backoff</li>
                    <li>• Built-in rate limiting and circuit breakers</li>
                    <li>• Structured logging and metrics collection</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary" />
                  Python SDK
                </CardTitle>
                <CardDescription>
                  Python package for data science and research
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card/50 p-3 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">Installation</h5>
                  <code className="text-sm bg-muted p-2 rounded block">pip install alienator-sdk</code>
                </div>

                <div className="bg-card/50 p-3 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-2">Quick Start</h5>
                  <pre className="text-xs bg-black/20 p-3 rounded overflow-auto">
{`from alienator import AlienatorClient

client = AlienatorClient("http://localhost:8080")

result = client.analyze(
    text="AI generated text here...",
    model="gpt-4",
    parameters={
        "temperature": 0.7,
        "top_p": 0.9
    }
)

if result.anomaly_score > 0.95:
    print(f"High anomaly detected: {result.patterns}")`}
                  </pre>
                </div>

                <div>
                  <h5 className="font-medium text-primary mb-2">Features</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Pandas DataFrame integration</li>
                    <li>• Jupyter notebook compatibility</li>
                    <li>• Async/await support for concurrent analysis</li>
                    <li>• Export to research formats (CSV, JSON, Parquet)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                JavaScript/TypeScript SDK
              </CardTitle>
              <CardDescription>
                Browser and Node.js compatible library
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-card/50 p-3 rounded-lg border border-primary/10 mb-4">
                    <h5 className="font-medium text-primary mb-2">Installation</h5>
                    <code className="text-sm bg-muted p-2 rounded block">npm install @alienator/sdk</code>
                  </div>

                  <div className="bg-card/50 p-3 rounded-lg border border-primary/10">
                    <h5 className="font-medium text-primary mb-2">Browser Usage</h5>
                    <pre className="text-xs bg-black/20 p-3 rounded overflow-auto">
{`import { AlienatorClient } from '@alienator/sdk';

const client = new AlienatorClient({
  apiUrl: 'http://localhost:8080',
  wsUrl: 'ws://localhost:8080/ws'
});

const result = await client.analyze({
  text: 'AI generated text here...',
  model: 'gpt-4'
});

console.log('Anomaly score:', result.anomalyScore);`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="bg-card/50 p-3 rounded-lg border border-primary/10 mb-4">
                    <h5 className="font-medium text-primary mb-2">WebSocket Streaming</h5>
                    <pre className="text-xs bg-black/20 p-3 rounded overflow-auto">
{`client.onAnomalyUpdate((data) => {
  console.log('Real-time update:', data);
});

client.onCriticalAlert((alert) => {
  console.warn('Critical anomaly:', alert);
});

await client.connect();`}
                    </pre>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-2">Features</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Full TypeScript support with type definitions</li>
                      <li>• React hooks for easy integration</li>
                      <li>• WebSocket auto-reconnection</li>
                      <li>• Promise-based API with async/await</li>
                      <li>• Browser and Node.js compatibility</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Go Backend Deployment */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  Go Backend Services
                </CardTitle>
                <CardDescription>
                  Core detection engine and API services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-3">Prerequisites</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Go 1.21+ installed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>PostgreSQL 14+ database</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Redis 7+ for caching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>NATS message broker</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/80 p-3 rounded text-xs font-mono">
                  <div className="text-green-400"># Clone and build backend services</div>
                  <div className="text-cyan-400">$ git clone https://github.com/ruvnet/alienator.git</div>
                  <div className="text-cyan-400">$ cd alienator</div>
                  <br/>
                  <div className="text-green-400"># Install dependencies</div>
                  <div className="text-cyan-400">$ go mod download</div>
                  <div className="text-cyan-400">$ go mod tidy</div>
                  <br/>
                  <div className="text-green-400"># Build all components</div>
                  <div className="text-cyan-400">$ make build</div>
                  <div className="text-gray-400">Building API server...</div>
                  <div className="text-gray-400">Building worker processes...</div>
                  <div className="text-gray-400">Building CLI tools...</div>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Setup */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Infrastructure Setup
                </CardTitle>
                <CardDescription>
                  Database and messaging infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-3">Docker Compose</h5>
                  <div className="bg-black/80 p-3 rounded text-xs font-mono">
                    <div className="text-green-400"># Start infrastructure services</div>
                    <div className="text-cyan-400">$ docker-compose up -d redis nats postgres</div>
                    <div className="text-gray-400">Creating network "alienator_default"</div>
                    <div className="text-gray-400">Creating alienator_redis_1    ... done</div>
                    <div className="text-gray-400">Creating alienator_nats_1     ... done</div>
                    <div className="text-gray-400">Creating alienator_postgres_1 ... done</div>
                  </div>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                  <h5 className="font-medium text-primary mb-3">Environment Variables</h5>
                  <div className="space-y-2 text-xs">
                    <div className="bg-muted p-2 rounded">
                      <code>DATABASE_URL=postgres://user:pass@localhost/alienator</code>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <code>REDIS_URL=redis://localhost:6379</code>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <code>NATS_URL=nats://localhost:4222</code>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <code>API_PORT=8080</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Deployment */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Service Deployment
              </CardTitle>
              <CardDescription>
                Deploy and manage Alienator services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-3">Manual Deployment</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400"># Run database migrations</div>
                      <div className="text-cyan-400">$ ./bin/alienator migrate up</div>
                      <div className="text-gray-400">✓ Running migration 001_initial_schema</div>
                      <div className="text-gray-400">✓ Running migration 002_analysis_tables</div>
                      <br/>
                      <div className="text-green-400"># Start API server</div>
                      <div className="text-cyan-400">$ ./bin/api &</div>
                      <div className="text-gray-400">🚀 Alienator API server starting on :8080</div>
                      <br/>
                      <div className="text-green-400"># Start worker processes</div>
                      <div className="text-cyan-400">$ ./bin/worker --id worker-1 &</div>
                      <div className="text-cyan-400">$ ./bin/worker --id worker-2 &</div>
                      <div className="text-gray-400">⚡ Workers ready for xenotype detection</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-3">Systemd Services</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400"># Install systemd services</div>
                      <div className="text-cyan-400">$ sudo cp deploy/systemd/*.service /etc/systemd/system/</div>
                      <div className="text-cyan-400">$ sudo systemctl daemon-reload</div>
                      <br/>
                      <div className="text-green-400"># Enable and start services</div>
                      <div className="text-cyan-400">$ sudo systemctl enable alienator-api</div>
                      <div className="text-cyan-400">$ sudo systemctl enable alienator-worker@{'{1..5}'}</div>
                      <div className="text-cyan-400">$ sudo systemctl start alienator-api</div>
                      <div className="text-cyan-400">$ sudo systemctl start alienator-worker@{'{1..5}'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-3">Docker Deployment</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400"># Build production images</div>
                      <div className="text-cyan-400">$ docker build -f Dockerfile.api -t alienator-api .</div>
                      <div className="text-cyan-400">$ docker build -f Dockerfile.worker -t alienator-worker .</div>
                      <br/>
                      <div className="text-green-400"># Run with docker-compose</div>
                      <div className="text-cyan-400">$ docker-compose up --build</div>
                      <div className="text-gray-400">alienator-api_1    | 🚀 API server ready</div>
                      <div className="text-gray-400">alienator-worker_1 | ⚡ Worker 1 online</div>
                      <div className="text-gray-400">alienator-worker_2 | ⚡ Worker 2 online</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-3">Kubernetes Deployment</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400"># Deploy to Kubernetes</div>
                      <div className="text-cyan-400">$ kubectl apply -f deploy/k8s/</div>
                      <div className="text-gray-400">namespace/alienator created</div>
                      <div className="text-gray-400">configmap/alienator-config created</div>
                      <div className="text-gray-400">deployment.apps/alienator-api created</div>
                      <div className="text-gray-400">deployment.apps/alienator-worker created</div>
                      <br/>
                      <div className="text-green-400"># Scale workers for load</div>
                      <div className="text-cyan-400">$ kubectl scale deployment alienator-worker --replicas=10</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Frontend Deployment */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Frontend Dashboard
              </CardTitle>
              <CardDescription>
                React dashboard deployment and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-3">Development Setup</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400"># Install dependencies</div>
                      <div className="text-cyan-400">$ npm install</div>
                      <div className="text-gray-400">Installing React dashboard dependencies...</div>
                      <br/>
                      <div className="text-green-400"># Start development server</div>
                      <div className="text-cyan-400">$ npm run dev</div>
                      <div className="text-gray-400">📡 Dashboard available at http://localhost:5173</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-3">Production Build</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400"># Build for production</div>
                      <div className="text-cyan-400">$ npm run build</div>
                      <div className="text-gray-400">✓ Built in 2.34s</div>
                      <div className="text-gray-400">📦 dist/ folder ready for deployment</div>
                      <br/>
                      <div className="text-green-400"># Preview production build</div>
                      <div className="text-cyan-400">$ npm run preview</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-3">Nginx Configuration</h5>
                    <div className="bg-black/80 p-3 rounded text-xs font-mono">
                      <div className="text-green-400"># Copy to web server</div>
                      <div className="text-cyan-400">$ cp -r dist/* /var/www/alienator/</div>
                      <br/>
                      <div className="text-green-400"># Configure nginx proxy</div>
                      <div className="text-gray-400">location /api {'{'}' '</div>
                      <div className="text-gray-400">  proxy_pass http://localhost:8080;</div>
                      <div className="text-gray-400">  proxy_set_header Host $host;</div>
                      <div className="text-gray-400">{'}'}</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-primary mb-3">Environment Configuration</h5>
                    <div className="space-y-2 text-xs">
                      <div className="bg-muted p-2 rounded">
                        <code>VITE_API_URL=http://localhost:8080</code>
                      </div>
                      <div className="bg-muted p-2 rounded">
                        <code>VITE_WS_URL=ws://localhost:8080/ws</code>
                      </div>
                      <div className="bg-muted p-2 rounded">
                        <code>VITE_APP_TITLE=Alienator Dashboard</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production Considerations */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Production Considerations
              </CardTitle>
              <CardDescription>
                Security, monitoring, and performance optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-medium text-primary mb-3">Security</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-accent" />
                      <span>TLS/SSL encryption</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-accent" />
                      <span>JWT authentication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-accent" />
                      <span>Rate limiting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-accent" />
                      <span>CORS configuration</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-primary mb-3">Monitoring</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-accent" />
                      <span>Prometheus metrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-accent" />
                      <span>Grafana dashboards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      <span>Health checks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <History className="w-4 h-4 text-accent" />
                      <span>Structured logging</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-primary mb-3">Performance</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-accent" />
                      <span>Horizontal scaling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-accent" />
                      <span>Connection pooling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-accent" />
                      <span>Load balancing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span>Caching strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
