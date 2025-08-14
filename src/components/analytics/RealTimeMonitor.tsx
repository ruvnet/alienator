import { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AnomalyEvent } from '@/types/analytics';
import { formatDistanceToNow } from 'date-fns';

interface RealTimeMonitorProps {
  events: AnomalyEvent[];
  isConnected: boolean;
  onToggleMonitoring: (enabled: boolean) => void;
  onResolveEvent: (eventId: string) => void;
}

export function RealTimeMonitor({ 
  events, 
  isConnected, 
  onToggleMonitoring,
  onResolveEvent 
}: RealTimeMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (isConnected && isMonitoring) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected, isMonitoring]);

  const handleToggleMonitoring = (enabled: boolean) => {
    setIsMonitoring(enabled);
    onToggleMonitoring(enabled);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertCircle className="w-3 h-3" />;
      case 'medium':
        return <Activity className="w-3 h-3" />;
      default:
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  const getConnectionStatus = () => {
    if (!isConnected) return 'Disconnected';
    if (!isMonitoring) return 'Paused';
    return 'Active';
  };

  const getConnectionColor = () => {
    if (!isConnected) return 'text-red-600';
    if (!isMonitoring) return 'text-yellow-600';
    return 'text-green-600';
  };

  const unresolvedEvents = events.filter(event => !event.resolved);
  const recentEvents = events.slice(0, 10);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-Time Monitoring
            <div className={`w-2 h-2 rounded-full ${
              isConnected && isMonitoring ? 'bg-green-500 animate-pulse' : 
              isConnected ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </CardTitle>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Status: </span>
              <span className={getConnectionColor()}>
                {getConnectionStatus()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="monitoring-toggle"
                checked={isMonitoring}
                onCheckedChange={handleToggleMonitoring}
                disabled={!isConnected}
              />
              <Label htmlFor="monitoring-toggle" className="text-sm">
                Live Monitoring
              </Label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {unresolvedEvents.length} unresolved events
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last update: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/10 text-center">
            <div className="text-lg font-semibold text-green-600">
              {events.filter(e => e.resolved).length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/10 text-center">
            <div className="text-lg font-semibold text-red-600">
              {events.filter(e => e.severity === 'critical' && !e.resolved).length}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/10 text-center">
            <div className="text-lg font-semibold text-orange-600">
              {events.filter(e => e.severity === 'high' && !e.resolved).length}
            </div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/10 text-center">
            <div className="text-lg font-semibold">
              {isConnected && isMonitoring ? 
                <Zap className="w-5 h-5 mx-auto animate-pulse text-blue-500" /> :
                <span className="text-muted-foreground">--</span>
              }
            </div>
            <div className="text-xs text-muted-foreground">Live Data</div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Recent Events</h4>
            <Badge variant="outline" className="text-xs">
              {recentEvents.length} events
            </Badge>
          </div>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent events</p>
                <p className="text-xs">System monitoring normally</p>
              </div>
            ) : (
              recentEvents.map(event => (
                <div 
                  key={event.id}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    event.resolved 
                      ? 'bg-muted/20 border-border/30 opacity-60' 
                      : 'bg-muted/10 border-border/50 hover:border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`${getSeverityColor(event.severity)} text-xs`}
                        >
                          {getSeverityIcon(event.severity)}
                          {event.severity}
                        </Badge>
                        <span className="text-sm font-medium truncate">
                          {event.type}
                        </span>
                        {event.resolved && (
                          <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                      
                      {Object.keys(event.metrics).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {Object.entries(event.metrics).map(([key, value]) => (
                            <span 
                              key={key}
                              className="text-xs bg-muted/30 px-2 py-1 rounded"
                            >
                              {key}: {typeof value === 'number' ? value.toFixed(2) : value}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                    
                    {!event.resolved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onResolveEvent(event.id)}
                        className="ml-3"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className={`p-3 rounded-lg border-2 border-dashed ${
          isConnected ? 
            isMonitoring ? 'border-green-500/30 bg-green-500/10' : 'border-yellow-500/30 bg-yellow-500/10'
            : 'border-red-500/30 bg-red-500/10'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              isConnected && isMonitoring ? 'bg-green-500 animate-pulse' : 
              isConnected ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="font-medium">
              {isConnected ? 
                isMonitoring ? 'Actively monitoring system events' : 'Monitoring paused'
                : 'Connection lost - attempting to reconnect...'
              }
            </span>
          </div>
          
          {isConnected && isMonitoring && (
            <div className="text-xs text-muted-foreground mt-1">
              Real-time data streaming • Next update in {60 - lastUpdate.getSeconds()}s
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}