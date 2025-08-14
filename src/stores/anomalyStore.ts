import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnomalyRecord, AnomalyFilter, AnomalyStats, FilterPreset, AnomalyCorrelation } from '@/types/anomaly';

interface AnomalyStore {
  // Data
  anomalies: AnomalyRecord[];
  stats: AnomalyStats | null;
  correlations: AnomalyCorrelation[];
  filterPresets: FilterPreset[];
  
  // UI State
  currentFilter: AnomalyFilter;
  selectedAnomalies: string[];
  viewMode: 'table' | 'timeline' | 'detailed' | 'correlation';
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setAnomalies: (anomalies: AnomalyRecord[]) => void;
  addAnomaly: (anomaly: AnomalyRecord) => void;
  updateAnomaly: (id: string, updates: Partial<AnomalyRecord>) => void;
  deleteAnomaly: (id: string) => void;
  setStats: (stats: AnomalyStats) => void;
  setCorrelations: (correlations: AnomalyCorrelation[]) => void;
  
  // Filter actions
  setFilter: (filter: Partial<AnomalyFilter>) => void;
  resetFilter: () => void;
  saveFilterPreset: (name: string, description: string) => void;
  loadFilterPreset: (presetId: string) => void;
  deleteFilterPreset: (presetId: string) => void;
  
  // Selection actions
  selectAnomaly: (id: string) => void;
  deselectAnomaly: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  
  // UI actions
  setViewMode: (mode: 'table' | 'timeline' | 'detailed' | 'correlation') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Data fetching
  fetchAnomalies: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchCorrelations: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const defaultFilter: AnomalyFilter = {
  search: '',
  severity: [],
  type: [],
  model: [],
  status: [],
  dateRange: {
    start: null,
    end: null,
  },
  entropyRange: {
    min: 0,
    max: 10,
  },
  tags: [],
  confidenceRange: {
    min: 0,
    max: 1,
  },
};

export const useAnomalyStore = create<AnomalyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      anomalies: [],
      stats: null,
      correlations: [],
      filterPresets: [],
      currentFilter: defaultFilter,
      selectedAnomalies: [],
      viewMode: 'table',
      isLoading: false,
      error: null,

      // Data actions
      setAnomalies: (anomalies) => set({ anomalies }),
      
      addAnomaly: (anomaly) => 
        set((state) => ({ 
          anomalies: [anomaly, ...state.anomalies] 
        })),
      
      updateAnomaly: (id, updates) =>
        set((state) => ({
          anomalies: state.anomalies.map((anomaly) =>
            anomaly.id === id ? { ...anomaly, ...updates } : anomaly
          ),
        })),
      
      deleteAnomaly: (id) =>
        set((state) => ({
          anomalies: state.anomalies.filter((anomaly) => anomaly.id !== id),
          selectedAnomalies: state.selectedAnomalies.filter((selectedId) => selectedId !== id),
        })),
      
      setStats: (stats) => set({ stats }),
      setCorrelations: (correlations) => set({ correlations }),

      // Filter actions
      setFilter: (filter) =>
        set((state) => ({
          currentFilter: { ...state.currentFilter, ...filter },
        })),
      
      resetFilter: () => set({ currentFilter: defaultFilter }),
      
      saveFilterPreset: (name, description) => {
        const preset: FilterPreset = {
          id: crypto.randomUUID(),
          name,
          description,
          filter: get().currentFilter,
          created_at: new Date(),
          is_public: false,
          usage_count: 0,
        };
        
        set((state) => ({
          filterPresets: [...state.filterPresets, preset],
        }));
      },
      
      loadFilterPreset: (presetId) => {
        const preset = get().filterPresets.find((p) => p.id === presetId);
        if (preset) {
          set({ currentFilter: { ...defaultFilter, ...preset.filter } });
          // Update usage count
          set((state) => ({
            filterPresets: state.filterPresets.map((p) =>
              p.id === presetId ? { ...p, usage_count: p.usage_count + 1 } : p
            ),
          }));
        }
      },
      
      deleteFilterPreset: (presetId) =>
        set((state) => ({
          filterPresets: state.filterPresets.filter((p) => p.id !== presetId),
        })),

      // Selection actions
      selectAnomaly: (id) =>
        set((state) => ({
          selectedAnomalies: state.selectedAnomalies.includes(id)
            ? state.selectedAnomalies
            : [...state.selectedAnomalies, id],
        })),
      
      deselectAnomaly: (id) =>
        set((state) => ({
          selectedAnomalies: state.selectedAnomalies.filter((selectedId) => selectedId !== id),
        })),
      
      selectAll: () =>
        set((state) => ({
          selectedAnomalies: state.anomalies.map((a) => a.id),
        })),
      
      clearSelection: () => set({ selectedAnomalies: [] }),

      // UI actions
      setViewMode: (mode) => set({ viewMode: mode }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Data fetching (mock implementations)
      fetchAnomalies: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll use mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Mock data would be loaded here
        } catch (error) {
          set({ error: 'Failed to fetch anomalies' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      fetchStats: async () => {
        try {
          // Mock stats calculation
          const anomalies = get().anomalies;
          const stats: AnomalyStats = {
            total: anomalies.length,
            critical: anomalies.filter(a => a.severity === 'critical').length,
            high: anomalies.filter(a => a.severity === 'high').length,
            medium: anomalies.filter(a => a.severity === 'medium').length,
            low: anomalies.filter(a => a.severity === 'low').length,
            investigating: anomalies.filter(a => a.status === 'investigating').length,
            acknowledged: anomalies.filter(a => a.status === 'acknowledged').length,
            resolved: anomalies.filter(a => a.status === 'resolved').length,
            dismissed: anomalies.filter(a => a.status === 'dismissed').length,
            escalated: anomalies.filter(a => a.status === 'escalated').length,
            byType: {},
            byModel: {},
            byHour: [],
            averageEntropy: anomalies.reduce((sum, a) => sum + a.entropy, 0) / anomalies.length || 0,
            averageConfidence: anomalies.reduce((sum, a) => sum + a.metadata.confidence_score, 0) / anomalies.length || 0,
            topTags: [],
          };
          set({ stats });
        } catch (error) {
          set({ error: 'Failed to calculate stats' });
        }
      },
      
      fetchCorrelations: async () => {
        set({ isLoading: true });
        try {
          // Mock correlation data
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ correlations: [] });
        } catch (error) {
          set({ error: 'Failed to fetch correlations' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      refreshData: async () => {
        const { fetchAnomalies, fetchStats, fetchCorrelations } = get();
        await Promise.all([
          fetchAnomalies(),
          fetchStats(),
          fetchCorrelations(),
        ]);
      },
    }),
    {
      name: 'anomaly-store',
      partialize: (state) => ({
        filterPresets: state.filterPresets,
        viewMode: state.viewMode,
      }),
    }
  )
);