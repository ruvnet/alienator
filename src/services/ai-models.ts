/**
 * AI Models Service
 * Handles API calls to different AI model providers
 */

import { 
  AIModel, 
  ModelResponse, 
  ComparisonRequest, 
  ComparisonResult,
  EmbeddingVector,
  EmbeddingModel,
  ModelProvider,
  APIError 
} from '../types/ai-models';

export class AIModelsService {
  private apiKeys: Map<ModelProvider, string> = new Map();
  private models: Map<string, AIModel> = new Map();

  constructor() {
    this.initializeModels();
  }

  /**
   * Initialize default model configurations
   */
  private initializeModels(): void {
    const defaultModels: AIModel[] = [
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
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        type: 'chat',
        version: '0125',
        maxTokens: 4096,
        costPerToken: 0.0000005,
        enabled: true,
        capabilities: ['text-generation', 'conversation']
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
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        type: 'chat',
        version: '20240229',
        maxTokens: 4096,
        costPerToken: 0.000003,
        enabled: true,
        capabilities: ['text-generation', 'reasoning', 'analysis']
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'google',
        type: 'chat',
        version: '1.0',
        maxTokens: 2048,
        costPerToken: 0.000001,
        enabled: true,
        capabilities: ['text-generation', 'multimodal']
      }
    ];

    defaultModels.forEach(model => {
      this.models.set(model.id, model);
    });
  }

  /**
   * Set API key for a provider
   */
  setApiKey(provider: ModelProvider, apiKey: string): void {
    this.apiKeys.set(provider, apiKey);
  }

  /**
   * Get all available models
   */
  getModels(): AIModel[] {
    return Array.from(this.models.values());
  }

  /**
   * Get enabled models
   */
  getEnabledModels(): AIModel[] {
    return this.getModels().filter(model => model.enabled);
  }

  /**
   * Get model by ID
   */
  getModel(modelId: string): AIModel | undefined {
    return this.models.get(modelId);
  }

  /**
   * Add or update a model
   */
  addModel(model: AIModel): void {
    this.models.set(model.id, model);
  }

  /**
   * Remove a model
   */
  removeModel(modelId: string): boolean {
    return this.models.delete(modelId);
  }

  /**
   * Call a model with a prompt
   */
  async callModel(modelId: string, prompt: string, parameters: Record<string, any> = {}): Promise<ModelResponse> {
    const model = this.getModel(modelId);
    if (!model) {
      throw new APIError('Model not found', 'MODEL_NOT_FOUND', 404);
    }

    if (!model.enabled) {
      throw new APIError('Model is disabled', 'MODEL_DISABLED', 400);
    }

    const startTime = performance.now();

    try {
      const response = await this.makeAPICall(model, prompt, parameters);
      const endTime = performance.now();

      return {
        id: this.generateId(),
        modelId,
        prompt,
        response: response.text,
        timestamp: new Date(),
        duration: endTime - startTime,
        tokenCount: response.usage.totalTokens,
        cost: response.usage.totalTokens * model.costPerToken,
        metadata: {
          ...response.metadata,
          parameters
        }
      };
    } catch (error) {
      throw new APIError(
        `Failed to call model ${modelId}: ${error.message}`,
        'MODEL_CALL_FAILED',
        500,
        { modelId, prompt, error: error.message }
      );
    }
  }

  /**
   * Run comparison across multiple models
   */
  async runComparison(request: ComparisonRequest): Promise<ComparisonResult> {
    const responses: ModelResponse[] = [];
    const errors: string[] = [];

    // Call all models in parallel
    const promises = request.models.map(async (modelId) => {
      try {
        return await this.callModel(modelId, request.prompt, request.parameters);
      } catch (error) {
        errors.push(`${modelId}: ${error.message}`);
        return null;
      }
    });

    const results = await Promise.allSettled(promises);
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        responses.push(result.value);
      }
    });

    if (responses.length === 0) {
      throw new APIError('All model calls failed', 'ALL_MODELS_FAILED', 500, { errors });
    }

    // Calculate metrics and analysis
    const metrics = this.calculateMetrics(responses);
    const analysis = await this.analyzeResponses(responses);

    return {
      requestId: request.id,
      responses,
      metrics,
      analysis
    };
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbeddings(text: string, modelId: string = 'text-embedding-3-small'): Promise<EmbeddingVector> {
    const model = this.getEmbeddingModel(modelId);
    if (!model) {
      throw new APIError('Embedding model not found', 'EMBEDDING_MODEL_NOT_FOUND', 404);
    }

    try {
      const response = await this.makeEmbeddingAPICall(model, text);
      
      return {
        id: this.generateId(),
        text,
        vector: response.embedding,
        dimensions: response.embedding.length,
        model: modelId,
        timestamp: new Date(),
        metadata: {
          usage: response.usage
        }
      };
    } catch (error) {
      throw new APIError(
        `Failed to generate embeddings: ${error.message}`,
        'EMBEDDING_GENERATION_FAILED',
        500,
        { modelId, text: text.substring(0, 100) + '...' }
      );
    }
  }

  /**
   * Batch generate embeddings
   */
  async batchGenerateEmbeddings(texts: string[], modelId: string = 'text-embedding-3-small'): Promise<EmbeddingVector[]> {
    const embeddings: EmbeddingVector[] = [];
    const batchSize = 20; // Adjust based on API limits

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const promises = batch.map(text => this.generateEmbeddings(text, modelId));
      const results = await Promise.allSettled(promises);
      
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          embeddings.push(result.value);
        }
      });
    }

    return embeddings;
  }

  /**
   * Private method to make actual API calls
   */
  private async makeAPICall(model: AIModel, prompt: string, parameters: Record<string, any>): Promise<any> {
    const apiKey = this.apiKeys.get(model.provider);
    if (!apiKey) {
      throw new Error(`API key not found for provider: ${model.provider}`);
    }

    switch (model.provider) {
      case 'openai':
        return this.callOpenAI(model, prompt, parameters, apiKey);
      case 'anthropic':
        return this.callAnthropic(model, prompt, parameters, apiKey);
      case 'google':
        return this.callGoogle(model, prompt, parameters, apiKey);
      default:
        throw new Error(`Unsupported provider: ${model.provider}`);
    }
  }

  /**
   * OpenAI API call
   */
  private async callOpenAI(model: AIModel, prompt: string, parameters: Record<string, any>, apiKey: string): Promise<any> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model.id,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: parameters.maxTokens || model.maxTokens,
        temperature: parameters.temperature || 0.7,
        ...parameters
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      usage: data.usage,
      metadata: {
        model: data.model,
        finishReason: data.choices[0].finish_reason
      }
    };
  }

  /**
   * Anthropic API call
   */
  private async callAnthropic(model: AIModel, prompt: string, parameters: Record<string, any>, apiKey: string): Promise<any> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model.id,
        max_tokens: parameters.maxTokens || model.maxTokens,
        messages: [{ role: 'user', content: prompt }],
        temperature: parameters.temperature || 0.7,
        ...parameters
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.content[0].text,
      usage: {
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens
      },
      metadata: {
        model: data.model,
        stopReason: data.stop_reason
      }
    };
  }

  /**
   * Google API call (simplified)
   */
  private async callGoogle(model: AIModel, prompt: string, parameters: Record<string, any>, apiKey: string): Promise<any> {
    // Simplified implementation - actual Google API call would go here
    return {
      text: `Mock response from ${model.name}`,
      usage: { totalTokens: 100, promptTokens: 50, completionTokens: 50 },
      metadata: { model: model.id }
    };
  }

  /**
   * Make embedding API call
   */
  private async makeEmbeddingAPICall(model: EmbeddingModel, text: string): Promise<any> {
    const apiKey = this.apiKeys.get(model.provider);
    if (!apiKey) {
      throw new Error(`API key not found for provider: ${model.provider}`);
    }

    if (model.provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model.id,
          input: text
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI Embeddings API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        embedding: data.data[0].embedding,
        usage: data.usage
      };
    }

    throw new Error(`Embedding not supported for provider: ${model.provider}`);
  }

  /**
   * Get embedding models
   */
  private getEmbeddingModel(modelId: string): EmbeddingModel | undefined {
    const embeddingModels: Record<string, EmbeddingModel> = {
      'text-embedding-3-small': {
        id: 'text-embedding-3-small',
        name: 'Text Embedding 3 Small',
        provider: 'openai',
        dimensions: 1536,
        maxInputLength: 8191,
        costPerToken: 0.00000002,
        enabled: true
      },
      'text-embedding-3-large': {
        id: 'text-embedding-3-large',
        name: 'Text Embedding 3 Large',
        provider: 'openai',
        dimensions: 3072,
        maxInputLength: 8191,
        costPerToken: 0.00000013,
        enabled: true
      }
    };

    return embeddingModels[modelId];
  }

  /**
   * Calculate comparison metrics
   */
  private calculateMetrics(responses: ModelResponse[]): any {
    const averageResponseTime = responses.reduce((sum, r) => sum + r.duration, 0) / responses.length;
    const totalCost = responses.reduce((sum, r) => sum + r.cost, 0);
    const totalTokens = responses.reduce((sum, r) => sum + r.tokenCount, 0);
    const successRate = responses.length > 0 ? 1 : 0;

    // Calculate similarity matrix (simplified)
    const similarityScores: Record<string, Record<string, number>> = {};
    responses.forEach(r1 => {
      similarityScores[r1.modelId] = {};
      responses.forEach(r2 => {
        if (r1.modelId !== r2.modelId) {
          // Simplified similarity calculation
          const similarity = this.calculateTextSimilarity(r1.response, r2.response);
          similarityScores[r1.modelId][r2.modelId] = similarity;
        }
      });
    });

    return {
      averageResponseTime,
      totalCost,
      totalTokens,
      successRate,
      similarityScores
    };
  }

  /**
   * Analyze responses for quality metrics
   */
  private async analyzeResponses(responses: ModelResponse[]): Promise<any> {
    // Simplified analysis - in production, this would use more sophisticated NLP
    const analysis: any = {
      sentiment: {},
      quality: {},
      coherence: {},
      creativity: {}
    };

    responses.forEach(response => {
      // Mock sentiment analysis
      analysis.sentiment[response.modelId] = {
        positive: Math.random() * 0.4 + 0.3,
        negative: Math.random() * 0.3 + 0.1,
        neutral: Math.random() * 0.4 + 0.3,
        confidence: Math.random() * 0.3 + 0.7
      };

      // Mock quality metrics
      analysis.quality[response.modelId] = {
        clarity: Math.random() * 0.3 + 0.7,
        relevance: Math.random() * 0.2 + 0.8,
        completeness: Math.random() * 0.4 + 0.6,
        overall: Math.random() * 0.2 + 0.8
      };

      // Mock coherence metrics
      analysis.coherence[response.modelId] = {
        logicalFlow: Math.random() * 0.3 + 0.7,
        consistency: Math.random() * 0.2 + 0.8,
        structure: Math.random() * 0.3 + 0.7
      };

      // Mock creativity metrics
      analysis.creativity[response.modelId] = {
        originality: Math.random() * 0.5 + 0.5,
        diversity: Math.random() * 0.4 + 0.6,
        innovation: Math.random() * 0.6 + 0.4
      };
    });

    return analysis;
  }

  /**
   * Calculate text similarity (simplified)
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simplified Jaccard similarity
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export default instance
export const aiModelsService = new AIModelsService();

// Custom API Error class
class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export { APIError };