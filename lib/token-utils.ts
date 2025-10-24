// @/lib/token-utils.ts

import { 
  SystemPromptConfig, 
  TokenUsageInfo 
} from "@/types/system-prompt-types";
import { 
  SYSTEM_PROMPT_MAX_TOKENS, 
  SYSTEM_PROMPT_WARNING_THRESHOLD 
} from "@/config/prompts/base-system-prompt";

/**
 * Estimate token count from text
 * Uses rough approximation: 1 token ≈ 4 characters
 * 
 * TODO: Replace with actual tokenizer (e.g., tiktoken for GPT models)
 * 
 * @param text - Text to count tokens for
 * @returns Estimated token count
 */
export function estimateTokenCount(text: string): number {
  if (!text || text.length === 0) return 0;
  
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Calculate current token usage from system prompt configuration
 * 
 * @param config - System prompt configuration
 * @returns Detailed token usage information
 */
export function calculateTokenUsage(config: SystemPromptConfig): TokenUsageInfo {
  const currentTokens = config.totalTokenCount;
  const maxTokens = SYSTEM_PROMPT_MAX_TOKENS;
  const remainingTokens = Math.max(0, maxTokens - currentTokens);
  const usagePercentage = (currentTokens / maxTokens) * 100;
  const isApproachingLimit = currentTokens >= SYSTEM_PROMPT_WARNING_THRESHOLD;
  
  return {
    currentTokens,
    maxTokens,
    remainingTokens,
    usagePercentage,
    isApproachingLimit,
  };
}

/**
 * Check if adding new tokens would exceed the limit
 * 
 * @param currentTokens - Current token usage
 * @param additionalTokens - Tokens to be added
 * @returns True if limit would be exceeded
 */
export function wouldExceedLimit(
  currentTokens: number, 
  additionalTokens: number
): boolean {
  return (currentTokens + additionalTokens) > SYSTEM_PROMPT_MAX_TOKENS;
}

/**
 * Get remaining tokens available
 * 
 * @param currentTokens - Current token usage
 * @returns Number of tokens still available
 */
export function getRemainingTokens(currentTokens: number): number {
  return Math.max(0, SYSTEM_PROMPT_MAX_TOKENS - currentTokens);
}

/**
 * Calculate usage percentage
 * 
 * @param currentTokens - Current token usage
 * @returns Percentage of limit used (0-100)
 */
export function getUsagePercentage(currentTokens: number): number {
  return (currentTokens / SYSTEM_PROMPT_MAX_TOKENS) * 100;
}

/**
 * Check if usage is approaching the warning threshold
 * 
 * @param currentTokens - Current token usage
 * @returns True if warning threshold is reached
 */
export function isApproachingLimit(currentTokens: number): boolean {
  return currentTokens >= SYSTEM_PROMPT_WARNING_THRESHOLD;
}

/**
 * Format token usage for display
 * 
 * @param currentTokens - Current token usage
 * @returns Formatted string like "10,500 / 16,000 tokens (65.6%)"
 */
export function formatTokenUsage(currentTokens: number): string {
  const percentage = getUsagePercentage(currentTokens).toFixed(1);
  const formattedCurrent = currentTokens.toLocaleString();
  const formattedMax = SYSTEM_PROMPT_MAX_TOKENS.toLocaleString();
  
  return `${formattedCurrent} / ${formattedMax} tokens (${percentage}%)`;
}

/**
 * Validate token addition and return detailed error if exceeds limit
 * 
 * @param currentTokens - Current token usage
 * @param additionalTokens - Tokens to be added
 * @returns Object with isValid flag and error details if invalid
 */
export function validateTokenAddition(
  currentTokens: number,
  additionalTokens: number
): { 
  isValid: boolean; 
  projected: number;
  error?: string;
} {
  const projected = currentTokens + additionalTokens;
  const isValid = projected <= SYSTEM_PROMPT_MAX_TOKENS;
  
  if (!isValid) {
    const error = `Token limit exceeded: ${projected.toLocaleString()} / ${SYSTEM_PROMPT_MAX_TOKENS.toLocaleString()} tokens. Cannot add ${additionalTokens.toLocaleString()} tokens.`;
    return { isValid: false, projected, error };
  }
  
  return { isValid: true, projected };
}

/**
 * Get warning message if approaching limit
 * 
 * @param currentTokens - Current token usage
 * @returns Warning message or null if not approaching limit
 */
export function getWarningMessage(currentTokens: number): string | null {
  if (!isApproachingLimit(currentTokens)) return null;
  
  const remaining = getRemainingTokens(currentTokens);
  const percentage = getUsagePercentage(currentTokens).toFixed(1);
  
  return `Warning: You are approaching the token limit (${percentage}% used). Only ${remaining.toLocaleString()} tokens remaining.`;
}
