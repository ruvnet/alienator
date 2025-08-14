import { useState } from "react";
import { Settings, Save, RotateCcw, Bell, Shield, Sliders, Database, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Configuration() {
  const [settings, setSettings] = useState({
    // Thresholds
    entropyThreshold: [7.0],
    compressionThreshold: [0.9],
    anomalyThreshold: [0.75],
    
    // Models
    enabledModels: ["gpt-4", "claude-3", "cohere"],
    
    // Notifications
    desktopNotifications: true,
    emailNotifications: false,
    webhookUrl: "",
    
    // Analysis
    realtimeAnalysis: true,
    batchSize: 100,
    analysisInterval: 5000,
    
    // Data retention
    logRetentionDays: 30,
    autoArchive: true,
    
    // API settings
    apiTimeout: 30000,
    rateLimitPerMinute: 60,
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleArraySettingChange = (key: string, value: string[]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // Simulate saving
    console.log("Saving settings:", settings);
    setUnsavedChanges(false);
  };

  const handleReset = () => {
    // Reset to defaults
    setUnsavedChanges(false);
  };

  const availableModels = [
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
    { id: "claude-3", name: "Claude-3", provider: "Anthropic" },
    { id: "cohere", name: "Cohere", provider: "Cohere" },
    { id: "llama-2", name: "Llama-2", provider: "Meta" },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-fade-in w-full max-w-full overflow-hidden px-1 sm:px-0">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate">Configuration</h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">System settings and preferences</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {unsavedChanges && (
            <Badge variant="outline" className="text-anomaly-medium border-anomaly-medium/30 text-center">
              Unsaved Changes
            </Badge>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="flex-1 sm:flex-none">
              <RotateCcw className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Reset</span>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!unsavedChanges} className="flex-1 sm:flex-none">
              <Save className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Save</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="thresholds" className="space-y-4">
        <TabsList className="bg-muted/20 w-full overflow-x-auto">
          <div className="flex min-w-max">
            <TabsTrigger value="thresholds" className="text-xs sm:text-sm">Thresholds</TabsTrigger>
            <TabsTrigger value="models" className="text-xs sm:text-sm">Models</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs sm:text-sm">Analysis</TabsTrigger>
            <TabsTrigger value="data" className="text-xs sm:text-sm">Data & Storage</TabsTrigger>
            <TabsTrigger value="api" className="text-xs sm:text-sm">API Settings</TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="thresholds" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                Anomaly Detection Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
              <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium break-words">
                      Shannon Entropy Threshold: {settings.entropyThreshold[0].toFixed(1)}
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Trigger alerts when entropy exceeds this value
                    </p>
                    <Slider
                      value={settings.entropyThreshold}
                      onValueChange={(value) => handleSettingChange("entropyThreshold", value)}
                      max={10}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0.0</span>
                      <span>10.0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Compression Threshold: {settings.compressionThreshold[0].toFixed(2)}
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Trigger alerts when compression ratio drops below this value
                    </p>
                    <Slider
                      value={settings.compressionThreshold}
                      onValueChange={(value) => handleSettingChange("compressionThreshold", value)}
                      max={1}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0.00</span>
                      <span>1.00</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Overall Anomaly Threshold: {settings.anomalyThreshold[0].toFixed(2)}
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Combined anomaly score threshold for alerts
                    </p>
                    <Slider
                      value={settings.anomalyThreshold}
                      onValueChange={(value) => handleSettingChange("anomalyThreshold", value)}
                      max={1}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0.00</span>
                      <span>1.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/10 rounded-lg border border-border/30">
                <h3 className="font-medium mb-2">Threshold Guidelines</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm w-full">
                  <div>
                    <strong>Conservative (High Sensitivity):</strong>
                    <div className="text-muted-foreground">
                      Entropy: 6.0, Compression: 0.95, Anomaly: 0.6
                    </div>
                  </div>
                  <div>
                    <strong>Balanced (Recommended):</strong>
                    <div className="text-muted-foreground">
                      Entropy: 7.0, Compression: 0.9, Anomaly: 0.75
                    </div>
                  </div>
                  <div>
                    <strong>Aggressive (Low Sensitivity):</strong>
                    <div className="text-muted-foreground">
                      Entropy: 8.0, Compression: 0.8, Anomaly: 0.9
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                AI Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-3 sm:p-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Enabled Models for Analysis</Label>
                <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 md:gap-4">
                  {availableModels.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-3 border border-border/30 rounded-lg bg-muted/10">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">{model.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{model.provider}</p>
                      </div>
                      <Switch
                        checked={settings.enabledModels.includes(model.id)}
                        onCheckedChange={(checked) => {
                          const newModels = checked
                            ? [...settings.enabledModels, model.id]
                            : settings.enabledModels.filter(id => id !== model.id);
                          handleArraySettingChange("enabledModels", newModels);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Default Analysis Model</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.enabledModels.map((modelId) => {
                        const model = availableModels.find(m => m.id === modelId);
                        return (
                          <SelectItem key={modelId} value={modelId}>
                            {model?.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cross-Model Analysis</Label>
                  <Select defaultValue="automatic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border/30 rounded-lg bg-muted/10">
                  <div>
                    <h3 className="font-medium">Desktop Notifications</h3>
                    <p className="text-sm text-muted-foreground">Show browser notifications for critical alerts</p>
                  </div>
                  <Switch
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) => handleSettingChange("desktopNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border/30 rounded-lg bg-muted/10">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Send email alerts for anomalies</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Webhook URL (Optional)</Label>
                <Input
                  placeholder="https://your-webhook-endpoint.com/alerts"
                  value={settings.webhookUrl}
                  onChange={(e) => handleSettingChange("webhookUrl", e.target.value)}
                  className="bg-muted/20 border-border/50"
                />
                <p className="text-xs text-muted-foreground">
                  Send POST requests to this URL when anomalies are detected
                </p>
              </div>

              <div className="p-4 bg-muted/10 rounded-lg border border-border/30">
                <h3 className="font-medium mb-2">Notification Rules</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">Critical</Badge>
                    <span>Immediate notification via all enabled channels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-anomaly-medium/30 text-anomaly-medium">High</Badge>
                    <span>Notification within 5 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-anomaly-medium/30 text-anomaly-medium">Medium</Badge>
                    <span>Batch notification every 15 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-anomaly-low/30 text-anomaly-low">Low</Badge>
                    <span>Daily summary only</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Analysis Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 border border-border/30 rounded-lg bg-muted/10">
                <div>
                  <h3 className="font-medium">Real-time Analysis</h3>
                  <p className="text-sm text-muted-foreground">Process text as it's received</p>
                </div>
                <Switch
                  checked={settings.realtimeAnalysis}
                  onCheckedChange={(checked) => handleSettingChange("realtimeAnalysis", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Batch Size</Label>
                  <Input
                    type="number"
                    value={settings.batchSize}
                    onChange={(e) => handleSettingChange("batchSize", parseInt(e.target.value))}
                    className="bg-muted/20 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of texts to process together
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Analysis Interval (ms)</Label>
                  <Input
                    type="number"
                    value={settings.analysisInterval}
                    onChange={(e) => handleSettingChange("analysisInterval", parseInt(e.target.value))}
                    className="bg-muted/20 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Time between analysis runs
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Analysis Pipeline Configuration</Label>
                <Textarea
                  placeholder="Advanced pipeline settings (JSON format)..."
                  className="min-h-24 bg-muted/20 border-border/50 font-mono text-sm"
                  defaultValue={`{
  "preprocessing": {
    "tokenization": "advanced",
    "normalization": true
  },
  "features": ["entropy", "compression", "linguistic", "semantic"],
  "parallel_processing": true
}`}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data & Storage Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Log Retention (Days)</Label>
                  <Input
                    type="number"
                    value={settings.logRetentionDays}
                    onChange={(e) => handleSettingChange("logRetentionDays", parseInt(e.target.value))}
                    className="bg-muted/20 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    How long to keep analysis logs
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 border border-border/30 rounded-lg bg-muted/10">
                  <div>
                    <h3 className="font-medium">Auto Archive</h3>
                    <p className="text-sm text-muted-foreground">Automatically archive old data</p>
                  </div>
                  <Switch
                    checked={settings.autoArchive}
                    onCheckedChange={(checked) => handleSettingChange("autoArchive", checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Storage Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border border-border/30 rounded-lg bg-muted/10">
                    <div className="text-lg font-bold">1.2 GB</div>
                    <div className="text-sm text-muted-foreground">Total Storage Used</div>
                  </div>
                  <div className="p-3 border border-border/30 rounded-lg bg-muted/10">
                    <div className="text-lg font-bold">45,230</div>
                    <div className="text-sm text-muted-foreground">Analysis Records</div>
                  </div>
                  <div className="p-3 border border-border/30 rounded-lg bg-muted/10">
                    <div className="text-lg font-bold">2,341</div>
                    <div className="text-sm text-muted-foreground">Anomaly Logs</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Data Management Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Export All Data</Button>
                  <Button variant="outline" size="sm">Archive Old Logs</Button>
                  <Button variant="outline" size="sm" className="text-anomaly-high border-anomaly-high/30">
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                API & Connection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">API Timeout (ms)</Label>
                  <Input
                    type="number"
                    value={settings.apiTimeout}
                    onChange={(e) => handleSettingChange("apiTimeout", parseInt(e.target.value))}
                    className="bg-muted/20 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Request timeout for API calls
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rate Limit (Per Minute)</Label>
                  <Input
                    type="number"
                    value={settings.rateLimitPerMinute}
                    onChange={(e) => handleSettingChange("rateLimitPerMinute", parseInt(e.target.value))}
                    className="bg-muted/20 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum API requests per minute
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Connection Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border border-anomaly-low/30 rounded-lg bg-anomaly-low/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-anomaly-low rounded-full"></div>
                      <span className="font-medium">WebSocket</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Connected • 99.8% uptime</div>
                  </div>
                  <div className="p-3 border border-anomaly-low/30 rounded-lg bg-anomaly-low/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-anomaly-low rounded-full"></div>
                      <span className="font-medium">REST API</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Healthy • 234ms avg latency</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/10 rounded-lg border border-border/30">
                <h3 className="font-medium mb-2">API Security</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-anomaly-low" />
                    <span>HTTPS encryption enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-anomaly-low" />
                    <span>API key authentication active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-anomaly-low" />
                    <span>Rate limiting configured</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}