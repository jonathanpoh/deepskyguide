/**
 * Represents the structure of a message in the chat completion request/response.
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Represents a single choice in the AI's response.
 */
export interface Choice {
  index: number;
  message: ChatMessage;
  finish_reason: string;
}

/**
 * Represents the token usage statistics for the API call.
 */
export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * Represents the overall structure of the chat completion response from OpenRouter.
 */
export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
}