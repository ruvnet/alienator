# Cross-Model Comparison Usage Guide

## Overview

The Cross-Model Comparison interface allows you to compare AI outputs across different models (GPT, Claude, Gemini, etc.) with comprehensive metrics and analysis. This guide demonstrates how to use the component effectively.

## Basic Usage

### Simple Implementation

```tsx
import React from 'react';
import CrossModelComparison from '../components/CrossModelComparison';

function App() {
  return (
    <div>
      <CrossModelComparison />
    </div>
  );
}
```

### With Props

```tsx
import React from 'react';
import CrossModelComparison from '../components/CrossModelComparison';

function ComparisonPage() {
  const handleComparisonComplete = (result) => {
    console.log('Comparison completed:', result);
    // Process results or update state
  };

  return (
    <CrossModelComparison
      defaultPrompt="Explain quantum computing in simple terms"
      preselectedModels={['gpt-4-turbo', 'claude-3-opus']}
      onComparisonComplete={handleComparisonComplete}
    />
  );
}
```

## Configuration

### Setting Up API Keys

Before using the component, you need to configure API keys for the model providers:

```tsx
import { useAIModels } from '../hooks/useAIModels';

function Setup() {
  const { setApiKey } = useAIModels();

  React.useEffect(() => {
    // Set API keys (store securely in environment variables)
    setApiKey('openai', process.env.REACT_APP_OPENAI_API_KEY);
    setApiKey('anthropic', process.env.REACT_APP_ANTHROPIC_API_KEY);
    setApiKey('google', process.env.REACT_APP_GOOGLE_API_KEY);
  }, [setApiKey]);

  return null;
}
```

### Custom Model Configuration

```tsx
import { useAIModels } from '../hooks/useAIModels';

function CustomModels() {
  const { addModel } = useAIModels();

  React.useEffect(() => {
    // Add a custom model
    addModel({
      id: 'custom-model-1',
      name: 'Custom GPT',
      provider: 'custom',
      type: 'chat',
      version: '1.0',
      maxTokens: 4096,
      costPerToken: 0.001,
      enabled: true,
      apiEndpoint: 'https://api.custom-provider.com/v1/chat',
      capabilities: ['text-generation', 'reasoning']
    });
  }, [addModel]);

  return <CrossModelComparison />;
}
```

## Advanced Features

### Using Hooks Directly

#### Cross-Model Comparison Hook

```tsx
import { useCrossModelComparison } from '../hooks/useAIModels';

function CustomComparisonInterface() {
  const {
    selectedModels,
    currentPrompt,
    isLoading,
    activeComparison,
    runComparison,
    selectModel,
    setPrompt
  } = useCrossModelComparison();

  const handleRunComparison = async () => {
    try {
      const result = await runComparison(currentPrompt, selectedModels);
      console.log('Comparison result:', result);
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  };

  return (
    <div>
      <input 
        value={currentPrompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      
      <button 
        onClick={() => selectModel('gpt-4-turbo')}
        disabled={isLoading}
      >
        Toggle GPT-4 Turbo
      </button>
      
      <button 
        onClick={handleRunComparison}
        disabled={!currentPrompt || selectedModels.length === 0 || isLoading}
      >
        {isLoading ? 'Running...' : 'Run Comparison'}
      </button>
      
      {activeComparison && (
        <div>
          <h3>Results:</h3>
          {activeComparison.responses.map(response => (
            <div key={response.id}>
              <h4>{response.modelId}</h4>
              <p>{response.response}</p>
              <small>
                {response.duration}ms | {response.tokenCount} tokens | ${response.cost.toFixed(6)}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Model Performance Tracking

```tsx
import { useModelPerformance } from '../hooks/useAIModels';

function PerformanceTracker() {
  const { metrics, trackResponse, getModelMetrics } = useModelPerformance();

  // Track a response
  const handleTrackResponse = (response) => {
    trackResponse(response);
  };

  // Get metrics for a specific model
  const gptMetrics = getModelMetrics('gpt-4-turbo');

  return (
    <div>
      <h3>Performance Metrics</h3>
      {gptMetrics && (
        <div>
          <p>Total Calls: {gptMetrics.totalCalls}</p>
          <p>Total Cost: ${gptMetrics.totalCost.toFixed(6)}</p>
          <p>Average Response Time: {gptMetrics.averageResponseTime.toFixed(0)}ms</p>
          <p>Total Tokens: {gptMetrics.totalTokens.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
```

### Batch Operations

```tsx
import { useBatchModelOperations } from '../hooks/useAIModels';

function BatchComparison() {
  const { callModels, operations, loading, errors } = useBatchModelOperations();

  const handleBatchCall = async () => {
    const modelIds = ['gpt-4-turbo', 'claude-3-opus', 'gemini-pro'];
    const prompt = 'Explain the concept of consciousness';
    
    const results = await callModels(modelIds, prompt, {
      temperature: 0.7,
      maxTokens: 500
    });
    
    console.log('Batch results:', results);
  };

  return (
    <div>
      <button onClick={handleBatchCall}>
        Run Batch Comparison
      </button>
      
      {operations.map(({ id, response }) => (
        <div key={id}>
          <h4>{id}</h4>
          {loading.includes(id) ? (
            <p>Loading...</p>
          ) : response ? (
            <p>{response.response}</p>
          ) : errors.find(e => e.id === id) ? (
            <p>Error: {errors.find(e => e.id === id)?.error}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
```

## Comparison Analysis

### Understanding Metrics

The comparison results include several types of analysis:

#### Quality Metrics
- **Clarity**: How clear and understandable the response is
- **Relevance**: How well the response addresses the prompt
- **Completeness**: How comprehensive the response is
- **Overall**: Combined quality score

#### Sentiment Analysis
- **Positive**: Positive sentiment percentage
- **Negative**: Negative sentiment percentage
- **Neutral**: Neutral sentiment percentage
- **Confidence**: Confidence in sentiment analysis

#### Coherence Metrics
- **Logical Flow**: How logically structured the response is
- **Consistency**: Internal consistency of the response
- **Structure**: Overall structural quality

#### Creativity Metrics
- **Originality**: How original or unique the response is
- **Diversity**: Diversity of ideas presented
- **Innovation**: Innovative thinking demonstrated

### Custom Analysis

```tsx
// Custom analysis function
const analyzeComparison = (comparisonResult) => {
  const { responses, metrics, analysis } = comparisonResult;
  
  // Find best performing model by overall quality
  const bestModel = responses.reduce((best, current) => {
    const currentQuality = analysis.quality[current.modelId]?.overall || 0;
    const bestQuality = analysis.quality[best.modelId]?.overall || 0;
    return currentQuality > bestQuality ? current : best;
  });
  
  // Calculate cost efficiency (quality per dollar)
  const costEfficiency = responses.map(response => ({
    modelId: response.modelId,
    efficiency: (analysis.quality[response.modelId]?.overall || 0) / response.cost
  }));
  
  // Find fastest model
  const fastestModel = responses.reduce((fastest, current) => 
    current.duration < fastest.duration ? current : fastest
  );
  
  return {
    bestModel: bestModel.modelId,
    fastestModel: fastestModel.modelId,
    costEfficiency: costEfficiency.sort((a, b) => b.efficiency - a.efficiency),
    averageQuality: Object.values(analysis.quality).reduce((sum, q) => sum + (q.overall || 0), 0) / responses.length
  };
};
```

## Integration Examples

### With Routing

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CrossModelComparison from '../components/CrossModelComparison';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/comparison" element={<CrossModelComparison />} />
        <Route path="/comparison/:promptId" element={<ComparisonWithPrompt />} />
      </Routes>
    </Router>
  );
}

function ComparisonWithPrompt() {
  const { promptId } = useParams();
  // Load prompt from database or context
  const prompt = loadPromptById(promptId);
  
  return (
    <CrossModelComparison 
      defaultPrompt={prompt}
      preselectedModels={['gpt-4-turbo', 'claude-3-opus']}
    />
  );
}
```

### With State Management

```tsx
// Redux slice for comparison state
const comparisonSlice = createSlice({
  name: 'comparison',
  initialState: {
    history: [],
    favorites: [],
    settings: {
      defaultModels: ['gpt-4-turbo', 'claude-3-opus'],
      autoSave: true
    }
  },
  reducers: {
    addToHistory: (state, action) => {
      state.history.unshift(action.payload);
      if (state.history.length > 100) {
        state.history = state.history.slice(0, 100);
      }
    },
    toggleFavorite: (state, action) => {
      const index = state.favorites.findIndex(f => f.id === action.payload.id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    }
  }
});

// Component with Redux integration
function ConnectedComparison() {
  const dispatch = useDispatch();
  const { history, settings } = useSelector(state => state.comparison);

  const handleComparisonComplete = (result) => {
    if (settings.autoSave) {
      dispatch(comparisonSlice.actions.addToHistory(result));
    }
  };

  return (
    <CrossModelComparison
      preselectedModels={settings.defaultModels}
      onComparisonComplete={handleComparisonComplete}
    />
  );
}
```

## Best Practices

### Performance Optimization

1. **Debounce Prompt Changes**: Avoid excessive API calls while typing
2. **Cache Results**: Store comparison results for repeated prompts
3. **Lazy Loading**: Load models only when needed
4. **Batch Requests**: Group multiple comparisons when possible

```tsx
import { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

function OptimizedComparison() {
  const [prompt, setPrompt] = useState('');
  const [debouncedPrompt, setDebouncedPrompt] = useState('');

  // Debounce prompt updates
  const debouncedSetPrompt = useCallback(
    debounce((value) => setDebouncedPrompt(value), 500),
    []
  );

  useEffect(() => {
    debouncedSetPrompt(prompt);
  }, [prompt, debouncedSetPrompt]);

  // Memoize expensive calculations
  const estimatedCost = useMemo(() => {
    // Calculate estimated cost based on prompt and selected models
    return calculateEstimatedCost(debouncedPrompt, selectedModels);
  }, [debouncedPrompt, selectedModels]);

  return (
    <CrossModelComparison 
      defaultPrompt={debouncedPrompt}
    />
  );
}
```

### Error Handling

```tsx
function RobustComparison() {
  const [error, setError] = useState(null);

  const handleComparisonComplete = (result) => {
    setError(null);
    // Process successful result
  };

  const handleError = (error) => {
    setError(error.message);
    console.error('Comparison error:', error);
  };

  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <CrossModelComparison 
        onComparisonComplete={handleComparisonComplete}
        onError={handleError}
      />
    </div>
  );
}
```

### Security Considerations

1. **API Key Management**: Store API keys securely
2. **Input Sanitization**: Validate and sanitize prompts
3. **Rate Limiting**: Implement client-side rate limiting
4. **Cost Monitoring**: Monitor and limit API costs

```tsx
// Secure API key management
const getApiKey = (provider) => {
  const key = process.env[`REACT_APP_${provider.toUpperCase()}_API_KEY`];
  if (!key) {
    throw new Error(`API key not configured for ${provider}`);
  }
  return key;
};

// Input validation
const validatePrompt = (prompt) => {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt');
  }
  if (prompt.length > 10000) {
    throw new Error('Prompt too long');
  }
  return prompt.trim();
};
```

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all API keys are properly configured
2. **Rate Limiting**: Implement retry logic with exponential backoff
3. **Model Availability**: Handle cases where models are temporarily unavailable
4. **Cost Overruns**: Monitor and limit API costs

### Debug Mode

```tsx
function DebugComparison() {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={debugMode}
          onChange={(e) => setDebugMode(e.target.checked)}
        />
        Debug Mode
      </label>
      
      <CrossModelComparison 
        debug={debugMode}
        onComparisonComplete={(result) => {
          if (debugMode) {
            console.log('Debug - Comparison Result:', result);
          }
        }}
      />
    </div>
  );
}
```

This guide provides comprehensive examples for using the Cross-Model Comparison component effectively. Adapt these examples to your specific use case and requirements.