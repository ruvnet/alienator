/**
 * AI Models Service Tests
 */

import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { AIModelsService } from '../../src/services/ai-models';
import { AIModel, ComparisonRequest, ModelProvider } from '../../src/types/ai-models';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AIModelsService', () => {
  let service: AIModelsService;

  beforeEach(() => {
    service = new AIModelsService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Model Management', () => {
    it('initializes with default models', () => {
      const models = service.getModels();
      
      expect(models.length).toBeGreaterThan(0);
      expect(models).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'gpt-4-turbo',
            name: 'GPT-4 Turbo',
            provider: 'openai'
          }),
          expect.objectContaining({
            id: 'claude-3-opus',
            name: 'Claude 3 Opus',
            provider: 'anthropic'
          })
        ])
      );
    });

    it('gets enabled models only', () => {
      const enabledModels = service.getEnabledModels();
      
      expect(enabledModels.every(model => model.enabled)).toBe(true);
    });

    it('gets model by ID', () => {
      const model = service.getModel('gpt-4-turbo');
      
      expect(model).toBeDefined();
      expect(model?.id).toBe('gpt-4-turbo');
    });

    it('returns undefined for non-existent model', () => {
      const model = service.getModel('non-existent-model');
      
      expect(model).toBeUndefined();
    });

    it('adds new model', () => {
      const newModel: AIModel = {
        id: 'test-model',
        name: 'Test Model',
        provider: 'custom',
        type: 'chat',
        version: '1.0',
        maxTokens: 2048,
        costPerToken: 0.001,
        enabled: true,
        capabilities: ['test']
      };

      service.addModel(newModel);
      const retrievedModel = service.getModel('test-model');
      
      expect(retrievedModel).toEqual(newModel);
    });

    it('removes model', () => {
      const initialCount = service.getModels().length;
      const removed = service.removeModel('gpt-4-turbo');
      
      expect(removed).toBe(true);
      expect(service.getModels().length).toBe(initialCount - 1);
      expect(service.getModel('gpt-4-turbo')).toBeUndefined();
    });

    it('returns false when removing non-existent model', () => {
      const removed = service.removeModel('non-existent-model');
      
      expect(removed).toBe(false);
    });

    it('sets API key for provider', () => {
      const apiKey = 'test-api-key';
      
      service.setApiKey('openai', apiKey);
      
      // API key is stored privately, so we can't directly test it
      // This would be tested through actual API calls
      expect(() => service.setApiKey('openai', apiKey)).not.toThrow();
    });
  });

  describe('Model API Calls', () => {
    beforeEach(() => {
      service.setApiKey('openai', 'test-openai-key');
      service.setApiKey('anthropic', 'test-anthropic-key');
    });

    it('calls OpenAI model successfully', async () => {
      const mockResponse = {
        choices: [
          {
            message: { content: 'Test response' },
            finish_reason: 'stop'
          }
        ],
        usage: {
          total_tokens: 100,
          prompt_tokens: 50,
          completion_tokens: 50
        },
        model: 'gpt-4-turbo'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await service.callModel('gpt-4-turbo', 'Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-openai-key',
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('Test prompt')
        })
      );

      expect(result).toEqual(
        expect.objectContaining({
          modelId: 'gpt-4-turbo',
          prompt: 'Test prompt',
          response: 'Test response',
          tokenCount: 100,
          duration: expect.any(Number)
        })
      );
    });

    it('calls Anthropic model successfully', async () => {
      const mockResponse = {
        content: [{ text: 'Test response from Claude' }],
        usage: {
          input_tokens: 50,
          output_tokens: 50
        },
        model: 'claude-3-opus',
        stop_reason: 'end_turn'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await service.callModel('claude-3-opus', 'Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-api-key': 'test-anthropic-key',
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          })
        })
      );

      expect(result).toEqual(
        expect.objectContaining({
          modelId: 'claude-3-opus',
          prompt: 'Test prompt',
          response: 'Test response from Claude',
          tokenCount: 100
        })
      );
    });

    it('handles API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request'
      });

      await expect(
        service.callModel('gpt-4-turbo', 'Test prompt')
      ).rejects.toThrow('Failed to call model gpt-4-turbo');
    });

    it('throws error for non-existent model', async () => {
      await expect(
        service.callModel('non-existent-model', 'Test prompt')
      ).rejects.toThrow('Model not found');
    });

    it('throws error for disabled model', async () => {
      // Add a disabled model
      service.addModel({
        id: 'disabled-model',
        name: 'Disabled Model',
        provider: 'custom',
        type: 'chat',
        version: '1.0',
        maxTokens: 2048,
        costPerToken: 0.001,
        enabled: false,
        capabilities: []
      });

      await expect(
        service.callModel('disabled-model', 'Test prompt')
      ).rejects.toThrow('Model is disabled');
    });

    it('throws error when API key is missing', async () => {
      // Create service without API key
      const newService = new AIModelsService();

      await expect(
        newService.callModel('gpt-4-turbo', 'Test prompt')
      ).rejects.toThrow('API key not found for provider: openai');
    });
  });

  describe('Model Comparisons', () => {
    beforeEach(() => {
      service.setApiKey('openai', 'test-openai-key');
      service.setApiKey('anthropic', 'test-anthropic-key');
    });

    it('runs comparison across multiple models', async () => {
      const mockOpenAIResponse = {
        choices: [{ message: { content: 'OpenAI response' }, finish_reason: 'stop' }],
        usage: { total_tokens: 100, prompt_tokens: 50, completion_tokens: 50 },
        model: 'gpt-4-turbo'
      };

      const mockAnthropicResponse = {
        content: [{ text: 'Anthropic response' }],
        usage: { input_tokens: 50, output_tokens: 50 },
        model: 'claude-3-opus',
        stop_reason: 'end_turn'
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockOpenAIResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAnthropicResponse
        });

      const request: ComparisonRequest = {
        id: 'test-comparison',
        prompt: 'Test prompt',
        models: ['gpt-4-turbo', 'claude-3-opus'],
        parameters: {},
        timestamp: new Date(),
        status: 'running'
      };

      const result = await service.runComparison(request);

      expect(result.responses).toHaveLength(2);
      expect(result.responses[0].response).toBe('OpenAI response');
      expect(result.responses[1].response).toBe('Anthropic response');
      expect(result.metrics).toBeDefined();
      expect(result.analysis).toBeDefined();
    });

    it('handles partial failures in comparison', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [{ message: { content: 'Success response' }, finish_reason: 'stop' }],
            usage: { total_tokens: 100, prompt_tokens: 50, completion_tokens: 50 },
            model: 'gpt-4-turbo'
          })
        })
        .mockResolvedValueOnce({
          ok: false,
          statusText: 'Rate Limit Exceeded'
        });

      const request: ComparisonRequest = {
        id: 'test-comparison',
        prompt: 'Test prompt',
        models: ['gpt-4-turbo', 'claude-3-opus'],
        parameters: {},
        timestamp: new Date(),
        status: 'running'
      };

      const result = await service.runComparison(request);

      expect(result.responses).toHaveLength(1);
      expect(result.responses[0].response).toBe('Success response');
    });

    it('throws error when all models fail', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          statusText: 'Error 1'
        })
        .mockResolvedValueOnce({
          ok: false,
          statusText: 'Error 2'
        });

      const request: ComparisonRequest = {
        id: 'test-comparison',
        prompt: 'Test prompt',
        models: ['gpt-4-turbo', 'claude-3-opus'],
        parameters: {},
        timestamp: new Date(),
        status: 'running'
      };

      await expect(service.runComparison(request)).rejects.toThrow('All model calls failed');
    });
  });

  describe('Embeddings', () => {
    beforeEach(() => {
      service.setApiKey('openai', 'test-openai-key');
    });

    it('generates embeddings successfully', async () => {
      const mockResponse = {
        data: [
          {
            embedding: [0.1, 0.2, 0.3, 0.4, 0.5]
          }
        ],
        usage: {
          total_tokens: 10
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await service.generateEmbeddings('Test text');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/embeddings',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-openai-key'
          }),
          body: expect.stringContaining('Test text')
        })
      );

      expect(result).toEqual(
        expect.objectContaining({
          text: 'Test text',
          vector: [0.1, 0.2, 0.3, 0.4, 0.5],
          dimensions: 5,
          model: 'text-embedding-3-small'
        })
      );
    });

    it('generates batch embeddings', async () => {
      const texts = ['Text 1', 'Text 2', 'Text 3'];
      const mockResponses = texts.map((text, index) => ({
        data: [{ embedding: [index, index + 0.1, index + 0.2] }],
        usage: { total_tokens: 5 }
      }));

      mockResponses.forEach(response => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => response
        });
      });

      const results = await service.batchGenerateEmbeddings(texts);

      expect(results).toHaveLength(3);
      expect(results[0].text).toBe('Text 1');
      expect(results[1].text).toBe('Text 2');
      expect(results[2].text).toBe('Text 3');
    });

    it('handles embedding API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request'
      });

      await expect(
        service.generateEmbeddings('Test text')
      ).rejects.toThrow('Failed to generate embeddings');
    });
  });

  describe('Utility Methods', () => {
    it('calculates text similarity', () => {
      const service = new AIModelsService();
      
      // Access private method through type assertion for testing
      const calculateSimilarity = (service as any).calculateTextSimilarity;
      
      const similarity1 = calculateSimilarity('hello world', 'hello world');
      expect(similarity1).toBe(1);
      
      const similarity2 = calculateSimilarity('hello world', 'goodbye world');
      expect(similarity2).toBeGreaterThan(0);
      expect(similarity2).toBeLessThan(1);
      
      const similarity3 = calculateSimilarity('hello world', 'completely different');
      expect(similarity3).toBeGreaterThanOrEqual(0);
    });

    it('generates unique IDs', () => {
      const service = new AIModelsService();
      
      // Access private method through type assertion for testing
      const generateId = (service as any).generateId;
      
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });
  });
});