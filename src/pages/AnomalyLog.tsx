import { useState } from "react";
import { History, Filter, Search, Download, AlertTriangle, Clock, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockAnomalyLogs = [
  {
    id: "ANO-2024-001",
    timestamp: new Date("2024-01-15T14:30:22Z"),
    severity: "critical",
    type: "entropy_spike",
    model: "GPT-4",
    description: "Shannon entropy exceeded 8.5 threshold",
    entropy: 9.2,
    text_preview: "The quantum entanglement phenomenon demonstrates...",
    status: "investigating",
    tags: ["entropy", "quantum", "physics"],
  },
  {
    id: "ANO-2024-002", 
    timestamp: new Date("2024-01-15T13:45:11Z"),
    severity: "high",
    type: "cross_model_divergence",
    model: "Multiple",
    description: "High divergence between model responses",
    entropy: 7.8,
    text_preview: "Artificial intelligence systems require...",
    status: "resolved",
    tags: ["divergence", "ai", "systems"],
  },
  {
    id: "ANO-2024-003",
    timestamp: new Date("2024-01-15T12:20:55Z"),
    severity: "medium",
    type: "compression_anomaly",
    model: "Claude-3",
    description: "Compression ratio below expected threshold",
    entropy: 6.3,
    text_preview: "Machine learning algorithms optimize...",
    status: "acknowledged",
    tags: ["compression", "ml", "optimization"],
  },
  {
    id: "ANO-2024-004",
    timestamp: new Date("2024-01-15T11:15:33Z"),
    severity: "low",
    type: "linguistic_pattern",
    model: "Cohere",
    description: "Unusual repetitive phrase structure detected",
    entropy: 5.1,
    text_preview: "The system generates responses that...",
    status: "resolved",
    tags: ["linguistic", "pattern", "repetition"],
  },
  {
    id: "ANO-2024-005",
    timestamp: new Date("2024-01-15T10:30:17Z"),
    severity: "critical",
    type: "cryptographic_pattern",
    model: "GPT-3.5",
    description: "Potential hash collision pattern identified",
    entropy: 8.9,
    text_preview: "Digital signatures provide authentication...",
    status: "investigating",
    tags: ["crypto", "hash", "security"],
  },
];

const severityColors = {
  critical: "border-anomaly-high/30 text-anomaly-high bg-anomaly-high/5",
  high: "border-anomaly-medium/30 text-anomaly-medium bg-anomaly-medium/5",
  medium: "border-anomaly-medium/30 text-anomaly-medium bg-anomaly-medium/5",
  low: "border-anomaly-low/30 text-anomaly-low bg-anomaly-low/5",
};

const statusColors = {
  investigating: "border-anomaly-high/30 text-anomaly-high",
  acknowledged: "border-anomaly-medium/30 text-anomaly-medium", 
  resolved: "border-anomaly-low/30 text-anomaly-low",
};

export default function AnomalyLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("24h");

  const filteredLogs = mockAnomalyLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.text_preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });

  const getTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  const summaryStats = {
    total: mockAnomalyLogs.length,
    critical: mockAnomalyLogs.filter(l => l.severity === "critical").length,
    investigating: mockAnomalyLogs.filter(l => l.status === "investigating").length,
    resolved: mockAnomalyLogs.filter(l => l.status === "resolved").length,
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate">Anomaly Log</h1>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base">Historical anomaly detection records</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-anomaly-high border-anomaly-high/30">
            {summaryStats.critical} Critical
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summaryStats.total}</div>
            <div className="text-xs text-muted-foreground">Last 24 hours</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-anomaly-high">{summaryStats.critical}</div>
            <div className="text-xs text-muted-foreground">Requires attention</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Investigating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-anomaly-medium">{summaryStats.investigating}</div>
            <div className="text-xs text-muted-foreground">In progress</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-anomaly-low">{summaryStats.resolved}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 w-full">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search anomalies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/20 border-border/50"
                />
              </div>
            </div>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Log Table */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList className="bg-muted/20">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Anomaly Records ({filteredLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Entropy</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="cursor-pointer hover:bg-muted/20">
                        <TableCell className="font-mono text-sm">{log.id}</TableCell>
                        <TableCell className="text-sm">{getTimestamp(log.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${
                            log.severity === "critical" ? "border-anomaly-high/30 text-anomaly-high" :
                            log.severity === "high" ? "border-anomaly-medium/30 text-anomaly-medium" :
                            log.severity === "medium" ? "border-anomaly-medium/30 text-anomaly-medium" :
                            "border-anomaly-low/30 text-anomaly-low"
                          }`}>
                            {log.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.type.replace(/_/g, ' ')}</TableCell>
                        <TableCell className="text-sm">{log.model}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate text-sm">{log.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {log.entropy.toFixed(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${statusColors[log.status as keyof typeof statusColors]}`}>
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs.map((log, index) => (
                  <div key={log.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        log.severity === "critical" ? "bg-anomaly-high" :
                        log.severity === "high" ? "bg-anomaly-medium" :
                        log.severity === "medium" ? "bg-anomaly-medium" :
                        "bg-anomaly-low"
                      }`} />
                      {index < filteredLogs.length - 1 && (
                        <div className="w-px h-16 bg-border/30 mt-2" />
                      )}
                    </div>
                    <div className={`flex-1 p-4 rounded-lg border ${severityColors[log.severity as keyof typeof severityColors]}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{log.id}</h3>
                          <p className="text-sm text-muted-foreground">{getTimestamp(log.timestamp)}</p>
                        </div>
                        <Badge variant="outline" className={statusColors[log.status as keyof typeof statusColors]}>
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{log.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Model: {log.model}</span>
                        <span>•</span>
                        <span>Entropy: {log.entropy.toFixed(1)}</span>
                        <span>•</span>
                        <span>Type: {log.type.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6 w-full">
            {filteredLogs.slice(0, 4).map((log) => (
              <Card key={log.id} className={`border ${severityColors[log.severity as keyof typeof severityColors]}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {log.id}
                    </div>
                    <Badge variant="outline" className={statusColors[log.status as keyof typeof statusColors]}>
                      {log.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{log.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Text Preview</h4>
                    <div className="p-2 bg-muted/20 rounded text-sm font-mono">
                      {log.text_preview}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <div className="font-medium">{log.model}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Entropy:</span>
                      <div className="font-medium">{log.entropy.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <div className="font-medium">{log.type.replace(/_/g, ' ')}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <div className="font-medium">{getTimestamp(log.timestamp)}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {log.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}