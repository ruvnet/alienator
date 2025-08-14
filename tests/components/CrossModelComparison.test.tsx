/**
 * Cross-Model Comparison Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

import CrossModelComparison from '../../src/components/CrossModelComparison';
import { aiModelsService } from '../../src/services/ai-models';
import { AIModel, ComparisonResult, ModelResponse } from '../../src/types/ai-models';

// Mock the services and hooks
vi.mock('../../src/services/ai-models');
vi.mock('../../src/hooks/useAIModels');
vi.mock('../../src/hooks/useEmbeddings');

// Mock data
const mockModels: AIModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    type: 'chat',
    version: '2024-04-09',
    maxTokens: 4096,
    costPerToken: 0.00001,
    enabled: true,
    capabilities: ['text-generation', 'reasoning', 'analysis']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    type: 'chat',
    version: '20240229',
    maxTokens: 4096,
    costPerToken: 0.000015,
    enabled: true,
    capabilities: ['text-generation', 'reasoning', 'analysis', 'coding']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    type: 'chat',
    version: '1.0',
    maxTokens: 2048,
    costPerToken: 0.000001,
    enabled: false,
    capabilities: ['text-generation', 'multimodal']
  }
];

const mockResponses: ModelResponse[] = [
  {
    id: 'response-1',
    modelId: 'gpt-4-turbo',
    prompt: 'What is artificial intelligence?',
    response: 'Artificial intelligence is a field of computer science...',
    timestamp: new Date(),
    duration: 1500,
    tokenCount: 150,
    cost: 0.0015,
    metadata: {}
  },
  {
    id: 'response-2',
    modelId: 'claude-3-opus',
    prompt: 'What is artificial intelligence?',
    response: 'AI is the simulation of human intelligence...',
    timestamp: new Date(),
    duration: 1200,
    tokenCount: 140,
    cost: 0.0021,
    metadata: {}
  }
];

const mockComparisonResult: ComparisonResult = {
  requestId: 'comparison-1',
  responses: mockResponses,
  metrics: {
    averageResponseTime: 1350,
    totalCost: 0.0036,
    totalTokens: 290,
    successRate: 1,
    similarityScores: {
      'gpt-4-turbo': { 'claude-3-opus': 0.85 },
      'claude-3-opus': { 'gpt-4-turbo': 0.85 }
    }
  },
  analysis: {
    sentiment: {
      'gpt-4-turbo': { positive: 0.7, negative: 0.1, neutral: 0.2, confidence: 0.9 },
      'claude-3-opus': { positive: 0.8, negative: 0.05, neutral: 0.15, confidence: 0.85 }
    },
    quality: {
      'gpt-4-turbo': { clarity: 0.9, relevance: 0.95, completeness: 0.85, overall: 0.9 },
      'claude-3-opus': { clarity: 0.95, relevance: 0.9, completeness: 0.9, overall: 0.92 }
    },
    coherence: {
      'gpt-4-turbo': { logicalFlow: 0.9, consistency: 0.85, structure: 0.9 },
      'claude-3-opus': { logicalFlow: 0.95, consistency: 0.9, structure: 0.85 }
    },
    creativity: {
      'gpt-4-turbo': { originality: 0.7, diversity: 0.8, innovation: 0.75 },
      'claude-3-opus': { originality: 0.8, diversity: 0.75, innovation: 0.8 }
    }
  }
};

// Mock hook implementations
const mockUseAIModels = {
  models: mockModels,
  enabledModels: mockModels.filter(m => m.enabled),
  modelsByProvider: {
    openai: [mockModels[0]],
    anthropic: [mockModels[1]],
    google: [mockModels[2]]
  },
  loading: false,
  error: null,
  updateModel: vi.fn(),
  toggleModel: vi.fn(),
  setApiKey: vi.fn()
};

const mockUseCrossModelComparison = {
  selectedModels: [],
  currentPrompt: '',
  isLoading: false,
  activeComparison: null,
  comparisonHistory: [],
  viewMode: 'grid' as const,
  filters: {
    providers: [],
    responseTimeRange: [0, 10000] as [number, number],
    costRange: [0, 1] as [number, number],
    qualityThreshold: 0.5,
    dateRange: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()] as [Date, Date]
  },
  runComparison: vi.fn(),
  selectModel: vi.fn(),
  clearSelection: vi.fn(),
  setPrompt: vi.fn(),
  setViewMode: vi.fn(),
  updateFilters: vi.fn(),
  filteredHistory: [],
  comparisonStats: { total: 0, avgCost: 0, avgTime: 0 }
};

describe('CrossModelComparison', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the hooks
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => mockUseCrossModelComparison
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders the component with initial state', () => {
    render(<CrossModelComparison />);
    
    expect(screen.getByText('Cross-Model Comparison')).toBeInTheDocument();
    expect(screen.getByText('Compare AI model outputs across different providers and analyze performance')).toBeInTheDocument();
    expect(screen.getByText('Select Models')).toBeInTheDocument();
    expect(screen.getByText('Prompt')).toBeInTheDocument();
  });

  it('displays available models grouped by provider', () => {
    render(<CrossModelComparison />);
    
    expect(screen.getByText('openai')).toBeInTheDocument();
    expect(screen.getByText('anthropic')).toBeInTheDocument();
    expect(screen.getByText('google')).toBeInTheDocument();
    
    expect(screen.getByText('GPT-4 Turbo')).toBeInTheDocument();
    expect(screen.getByText('Claude 3 Opus')).toBeInTheDocument();
    expect(screen.getByText('Gemini Pro')).toBeInTheDocument();
  });

  it('allows model selection', async () => {
    const user = userEvent.setup();
    render(<CrossModelComparison />);
    
    const gptCheckbox = screen.getByLabelText(/GPT-4 Turbo/);
    await user.click(gptCheckbox);
    
    expect(mockUseCrossModelComparison.selectModel).toHaveBeenCalledWith('gpt-4-turbo');
  });

  it('disables selection for disabled models', () => {
    render(<CrossModelComparison />);
    
    const geminiCheckbox = screen.getByLabelText(/Gemini Pro/);
    expect(geminiCheckbox).toBeDisabled();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('handles prompt input', async () => {
    const user = userEvent.setup();
    render(<CrossModelComparison />);
    
    const promptTextarea = screen.getByPlaceholderText('Enter your prompt here...');
    await user.type(promptTextarea, 'What is machine learning?');
    
    expect(mockUseCrossModelComparison.setPrompt).toHaveBeenCalledWith('What is machine learning?');
  });

  it('calculates estimated cost correctly', () => {
    const updatedMock = {
      ...mockUseCrossModelComparison,
      selectedModels: ['gpt-4-turbo', 'claude-3-opus'],
      currentPrompt: 'Test prompt with twenty characters'
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => updatedMock
    }));
    
    render(<CrossModelComparison />);
    
    // Should show estimated cost based on prompt length and selected models
    expect(screen.getByText(/Est\. cost:/)).toBeInTheDocument();
  });

  it('runs comparison when button is clicked', async () => {
    const user = userEvent.setup();
    const updatedMock = {
      ...mockUseCrossModelComparison,
      selectedModels: ['gpt-4-turbo'],
      currentPrompt: 'Test prompt'
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => updatedMock
    }));
    
    render(<CrossModelComparison />);
    
    const runButton = screen.getByText('Run Comparison');
    await user.click(runButton);
    
    expect(mockUseCrossModelComparison.runComparison).toHaveBeenCalledWith('Test prompt', ['gpt-4-turbo']);
  });

  it('disables run button when no models selected or no prompt', () => {
    render(<CrossModelComparison />);
    
    const runButton = screen.getByText('Run Comparison');
    expect(runButton).toBeDisabled();
  });

  it('shows loading state during comparison', () => {
    const loadingMock = {
      ...mockUseCrossModelComparison,
      isLoading: true,
      selectedModels: ['gpt-4-turbo'],
      currentPrompt: 'Test prompt'
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => loadingMock
    }));
    
    render(<CrossModelComparison />);
    
    expect(screen.getByText('Running...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Running.../ })).toBeDisabled();
  });

  it('displays comparison results', () => {
    const resultsMock = {
      ...mockUseCrossModelComparison,
      activeComparison: mockComparisonResult,
      viewMode: 'comparison' as const
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => resultsModal
    }));
    
    render(<CrossModelComparison />);
    
    // Should display model responses
    expect(screen.getByText('GPT-4 Turbo')).toBeInTheDocument();
    expect(screen.getByText('Claude 3 Opus')).toBeInTheDocument();
    
    // Should display response content
    expect(screen.getByText(/Artificial intelligence is a field of computer science/)).toBeInTheDocument();
    expect(screen.getByText(/AI is the simulation of human intelligence/)).toBeInTheDocument();
  });

  it('displays metrics in metrics view', () => {
    const metricsModal = {
      ...mockUseCrossModelComparison,
      activeComparison: mockComparisonResult,
      viewMode: 'metrics' as const
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => metricsModal
    }));
    
    render(<CrossModelComparison />);
    
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    expect(screen.getByText('1350ms')).toBeInTheDocument();
    expect(screen.getByText('Total Cost')).toBeInTheDocument();
    expect(screen.getByText('$0.003600')).toBeInTheDocument();
  });

  it('switches between view modes', async () => {
    const user = userEvent.setup();
    render(<CrossModelComparison />);
    
    const metricsTab = screen.getByRole('tab', { name: /Metrics/ });
    await user.click(metricsTab);
    
    expect(mockUseCrossModelComparison.setViewMode).toHaveBeenCalledWith('metrics');
  });

  it('clears model selection', async () => {
    const user = userEvent.setup();
    const selectedMock = {
      ...mockUseCrossModelComparison,
      selectedModels: ['gpt-4-turbo', 'claude-3-opus']
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => selectedMock
    }));
    
    render(<CrossModelComparison />);
    
    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);
    
    expect(mockUseCrossModelComparison.clearSelection).toHaveBeenCalled();
  });

  it('selects all enabled models', async () => {
    const user = userEvent.setup();
    render(<CrossModelComparison />);
    
    const selectAllButton = screen.getByText('Select All');
    await user.click(selectAllButton);
    
    // Should call selectModel for each enabled model
    expect(mockUseCrossModelComparison.selectModel).toHaveBeenCalledTimes(2); // Only enabled models
  });

  it('handles preselected models', () => {
    const preselectedModels = ['gpt-4-turbo', 'claude-3-opus'];
    render(<CrossModelComparison preselectedModels={preselectedModels} />);
    
    // Should call selectModel for each preselected model
    expect(mockUseCrossModelComparison.selectModel).toHaveBeenCalledWith('gpt-4-turbo');
    expect(mockUseCrossModelComparison.selectModel).toHaveBeenCalledWith('claude-3-opus');
  });

  it('handles default prompt', () => {
    const defaultPrompt = 'What is AI?';
    render(<CrossModelComparison defaultPrompt={defaultPrompt} />);
    
    expect(mockUseCrossModelComparison.setPrompt).toHaveBeenCalledWith(defaultPrompt);
  });

  it('calls onComparisonComplete callback', async () => {
    const onComparisonComplete = vi.fn();
    const user = userEvent.setup();
    
    mockUseCrossModelComparison.runComparison.mockResolvedValue(mockComparisonResult);
    
    const completeMock = {
      ...mockUseCrossModelComparison,
      selectedModels: ['gpt-4-turbo'],
      currentPrompt: 'Test prompt'
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => completeMock
    }));
    
    render(<CrossModelComparison onComparisonComplete={onComparisonComplete} />);
    
    const runButton = screen.getByText('Run Comparison');
    await user.click(runButton);
    
    await waitFor(() => {
      expect(onComparisonComplete).toHaveBeenCalledWith(mockComparisonResult);
    });
  });

  it('displays quality metrics for responses', () => {
    const qualityMock = {
      ...mockUseCrossModelComparison,
      activeComparison: mockComparisonResult,
      viewMode: 'comparison' as const
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => qualityMock
    }));
    
    render(<CrossModelComparison />);
    
    expect(screen.getByText('Quality Metrics')).toBeInTheDocument();
    expect(screen.getByText('Clarity:')).toBeInTheDocument();
    expect(screen.getByText('Relevance:')).toBeInTheDocument();
    expect(screen.getByText('Completeness:')).toBeInTheDocument();
    expect(screen.getByText('Overall:')).toBeInTheDocument();
  });

  it('displays sentiment analysis', () => {
    const sentimentMock = {
      ...mockUseCrossModelComparison,
      activeComparison: mockComparisonResult,
      viewMode: 'comparison' as const
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => sentimentMock
    }));
    
    render(<CrossModelComparison />);
    
    expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument();
    expect(screen.getByText(/Positive:/)).toBeInTheDocument();
    expect(screen.getByText(/Negative:/)).toBeInTheDocument();
    expect(screen.getByText(/Neutral:/)).toBeInTheDocument();
  });

  it('handles error states gracefully', async () => {
    const errorMock = {
      ...mockUseCrossModelComparison,
      selectedModels: ['gpt-4-turbo'],
      currentPrompt: 'Test prompt'
    };
    
    errorMock.runComparison.mockRejectedValue(new Error('API Error'));
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => errorMock
    }));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    
    render(<CrossModelComparison />);
    
    const runButton = screen.getByText('Run Comparison');
    await user.click(runButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Comparison failed:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  it('shows empty state when no comparison results', () => {
    const emptyMock = {
      ...mockUseCrossModelComparison,
      activeComparison: null,
      viewMode: 'comparison' as const
    };
    
    vi.doMock('../../src/hooks/useAIModels', () => ({
      useAIModels: () => mockUseAIModels,
      useCrossModelComparison: () => emptyMock
    }));
    
    render(<CrossModelComparison />);
    
    expect(screen.getByText('No Comparison Results')).toBeInTheDocument();
    expect(screen.getByText('Run a comparison to see results here')).toBeInTheDocument();
  });
});