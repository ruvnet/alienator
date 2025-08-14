import { useState } from "react";
import { BarChart3, TrendingUp, Calendar, Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("24h");

  const mockTimeSeriesData = [
    { time: "00:00", entropy: 6.2, compression: 0.75, anomaly: 0.3 },
    { time: "04:00", entropy: 7.8, compression: 0.68, anomaly: 0.6 },
    { time: "08:00", entropy: 5.9, compression: 0.82, anomaly: 0.2 },
    { time: "12:00", entropy: 8.1, compression: 0.59, anomaly: 0.8 },
    { time: "16:00", entropy: 6.5, compression: 0.73, anomaly: 0.4 },
    { time: "20:00", entropy: 7.2, compression: 0.71, anomaly: 0.5 },
  ];

  const mockHeatmapData = [
    { model: "GPT-4", time: "Morning", value: 0.3 },
    { model: "GPT-4", time: "Afternoon", value: 0.7 },
    { model: "GPT-4", time: "Evening", value: 0.5 },
    { model: "Claude-3", time: "Morning", value: 0.2 },
    { model: "Claude-3", time: "Afternoon", value: 0.8 },
    { model: "Claude-3", time: "Evening", value: 0.4 },
    { model: "Cohere", time: "Morning", value: 0.6 },
    { model: "Cohere", time: "Afternoon", value: 0.3 },
    { model: "Cohere", time: "Evening", value: 0.9 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">Historical analysis and trend visualization</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12,847</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-anomaly-low" />
              <span className="text-anomaly-low">+12.5%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Anomalies Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,429</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-anomaly-medium" />
              <span className="text-anomaly-medium">+8.2%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">23</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-anomaly-high" />
              <span className="text-anomaly-high">+15.0%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="timeseries" className="space-y-4">
        <TabsList className="bg-muted/20">
          <TabsTrigger value="timeseries">Time Series</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
        </TabsList>

        <TabsContent value="timeseries" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Metric Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                <div className="text-center space-y-2">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Time series chart will be rendered here</p>
                  <p className="text-xs text-muted-foreground">
                    Showing entropy, compression ratio, and anomaly scores over {timeRange}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                {mockTimeSeriesData.map((point, i) => (
                  <div key={i} className="text-xs space-y-1">
                    <div className="font-medium">{point.time}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Entropy: {point.entropy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Compression: {point.compression}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Anomaly: {point.anomaly}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Model Performance Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                <div className="text-center space-y-2">
                  <div className="grid grid-cols-4 gap-2 w-64">
                    <div className="text-xs font-medium">Model</div>
                    <div className="text-xs font-medium">Morning</div>
                    <div className="text-xs font-medium">Afternoon</div>
                    <div className="text-xs font-medium">Evening</div>
                    {mockHeatmapData.map((cell, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded text-xs ${
                          cell.value > 0.6 
                            ? "bg-anomaly-high/20 text-anomaly-high" 
                            : cell.value > 0.3 
                            ? "bg-anomaly-medium/20 text-anomaly-medium"
                            : "bg-anomaly-low/20 text-anomaly-low"
                        }`}
                      >
                        {typeof cell.value === 'number' ? cell.value.toFixed(1) : cell.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Metric Distribution Plots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                <div className="text-center space-y-2">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Distribution plots will be rendered here</p>
                  <p className="text-xs text-muted-foreground">Violin, box, and histogram charts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Correlation Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border border-border/30 rounded-lg bg-muted/10">
                <div className="text-center space-y-2">
                  <div className="grid grid-cols-4 gap-1 w-48">
                    <div className="text-xs font-medium">Metric</div>
                    <div className="text-xs font-medium">Entropy</div>
                    <div className="text-xs font-medium">Compression</div>
                    <div className="text-xs font-medium">Anomaly</div>
                    {["Entropy", "Compression", "Anomaly"].map((metric) => (
                      [metric, "0.8", "-0.6", "0.9"].map((value, i) => (
                        <div key={`${metric}-${i}`} className="p-1 text-xs bg-muted/20 rounded">
                          {value}
                        </div>
                      ))
                    ))}
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