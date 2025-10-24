// @/lib/token-utils.ts

import { 
  SystemPromptConfig, 
  TokenUsageInfo 
} from "@/types/system-prompt-types";
import { 
  SYSTEM_PROMPT_MAX_TOKENS, 
  SYSTEM_PROMPT_WARNING_THRESHOLD 
} from "@/config/prompts/base-system-prompt";

// ✅ НОВОЕ: Безопасный импорт токенов internal KB
let INTERNAL_COMPANY_KB_TOKENS = 0;

try {
  const internalKB = require("@/config/prompts/internal-company-knowledge-base");
  INTERNAL_COMPANY_KB_TOKENS = internalKB.INTERNAL_COMPANY_KNOWLEDGE_BASE_TOKENS || 0;
  console.log(`[Token Utils] ✅ Loaded internal KB tokens: ${INTERNAL_COMPANY_KB_TOKENS}`);
} catch (error) {
  console.warn("[Token Utils] ⚠️  internal-company-knowledge-base.ts not found. Continuing with 0 tokens.");
}

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
 * ✅ Calculate current token usage from system prompt configuration
 * 
 * ВАЖНО: config.totalTokenCount НЕ включает INTERNAL_COMPANY_KB_TOKENS
 * Эта функция добавляет internal KB токены автоматически
 * 
 * @param config - System prompt configuration (totalTokenCount без internal KB)
 * @returns Detailed token usage information (currentTokens включает internal KB)
 */
export function calculateTokenUsage(config: SystemPromptConfig): TokenUsageInfo {
  // ✅ config.totalTokenCount = customInstruction + dynamicPages (БЕЗ internal KB)
  // Добавляем internal KB токены один раз здесь
  const currentTokens = config.totalTokenCount + INTERNAL_COMPANY_KB_TOKENS;
  const maxTokens = SYSTEM_PROMPT_MAX_TOKENS;
  const remainingTokens = Math.max(0, maxTokens - currentTokens);
  const usagePercentage = (currentTokens / maxTokens) * 100;
  const isApproachingLimit = currentTokens >= SYSTEM_PROMPT_WARNING_THRESHOLD;
  
  console.log(`[Token Utils] Token breakdown:`);
  console.log(`  - Config total: ${config.totalTokenCount}`);
  console.log(`  - Internal KB: ${INTERNAL_COMPANY_KB_TOKENS}`);
  console.log(`  - Combined total: ${currentTokens}`);
  console.log(`  - Max allowed: ${maxTokens}`);
  console.log(`  - Remaining: ${remainingTokens}`);
  
  return {
    currentTokens, // ← УЖЕ включает internal KB!
    maxTokens,
    remainingTokens,
    usagePercentage,
    isApproachingLimit,
  };
}

/**
 * ✅ Check if adding new tokens would exceed the limit
 * 
 * ВАЖНО: currentTokens должен быть результатом calculateTokenUsage().currentTokens
 * Он УЖЕ включает internal KB, поэтому НЕ добавляем его здесь повторно
 * 
 * @param currentTokens - Current token usage (УЖЕ включает internal KB из calculateTokenUsage)
 * @param additionalTokens - Tokens to be added
 * @returns True if limit would be exceeded
 */
export function wouldExceedLimit(
  currentTokens: number, 
  additionalTokens: number
): boolean {
  // ✅ currentTokens УЖЕ включает internal KB, не добавляем повторно
  const projectedTotal = currentTokens + additionalTokens;
  
  console.log(`[Token Utils] Limit check:`);
  console.log(`  - Current (with internal KB): ${currentTokens}`);
  console.log(`  - Additional: ${additionalTokens}`);
  console.log(`  - Projected: ${projectedTotal}`);
  console.log(`  - Limit: ${SYSTEM_PROMPT_MAX_TOKENS}`);
  console.log(`  - Would exceed: ${projectedTotal > SYSTEM_PROMPT_MAX_TOKENS}`);
  
  return projectedTotal > SYSTEM_PROMPT_MAX_TOKENS;
}

/**
 * ✅ Get remaining tokens available
 * 
 * ВАЖНО: currentTokens должен быть результатом calculateTokenUsage().currentTokens
 * Он УЖЕ включает internal KB
 * 
 * @param currentTokens - Current token usage (УЖЕ включает internal KB)
 * @returns Number of tokens still available
 */
export function getRemainingTokens(currentTokens: number): number {
  // ✅ currentTokens УЖЕ включает internal KB
  return Math.max(0, SYSTEM_PROMPT_MAX_TOKENS - currentTokens);
}

/**
 * ✅ Calculate usage percentage
 * 
 * ВАЖНО: currentTokens должен быть результатом calculateTokenUsage().currentTokens
 * Он УЖЕ включает internal KB
 * 
 * @param currentTokens - Current token usage (УЖЕ включает internal KB)
 * @returns Percentage of limit used (0-100)
 */
export function getUsagePercentage(currentTokens: number): number {
  // ✅ currentTokens УЖЕ включает internal KB
  return (currentTokens / SYSTEM_PROMPT_MAX_TOKENS) * 100;
}

/**
 * ✅ Check if usage is approaching the warning threshold
 * 
 * ВАЖНО: currentTokens должен быть результатом calculateTokenUsage().currentTokens
 * Он УЖЕ включает internal KB
 * 
 * @param currentTokens - Current token usage (УЖЕ включает internal KB)
 * @returns True if warning threshold is reached
 */
export function isApproachingLimit(currentTokens: number): boolean {
  // ✅ currentTokens УЖЕ включает internal KB
  return currentTokens >= SYSTEM_PROMPT_WARNING_THRESHOLD;
}

/**
 * ✅ Format token usage for display
 * 
 * ВАЖНО: Для числового форматирования принимает просто число (не обязательно с internal KB)
 * Но если передан результат calculateTokenUsage().currentTokens, то покажет полное значение
 * 
 * @param tokenCount - Token count to format
 * @returns Formatted string like "19,483"
 */
export function formatTokenUsage(tokenCount: number): string {
  // ✅ Простое форматирование числа с разделителями тысяч
  return tokenCount.toLocaleString();
}

/**
 * ✅ Format detailed token usage for display
 * 
 * ВАЖНО: currentTokens должен быть результатом calculateTokenUsage().currentTokens
 * Он УЖЕ включает internal KB
 * 
 * @param currentTokens - Current token usage (УЖЕ включает internal KB)
 * @returns Formatted string like "19,483 / 35,000 tokens (55.7%)"
 */
export function formatDetailedTokenUsage(currentTokens: number): string {
  // ✅ currentTokens УЖЕ включает internal KB
  const percentage = getUsagePercentage(currentTokens).toFixed(1);
  const formattedCurrent = currentTokens.toLocaleString();
  const formattedMax = SYSTEM_PROMPT_MAX_TOKENS.toLocaleString();
  
  return `${formattedCurrent} / ${formattedMax} tokens (${percentage}%)`;
}

/**
 * ✅ Validate token addition and return detailed error if exceeds limit
 * 
 * ВАЖНО: currentTokens должен быть результатом calculateTokenUsage().currentTokens
 * Он УЖЕ включает internal KB
 * 
 * @param currentTokens - Current token usage (УЖЕ включает internal KB)
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
  // ✅ currentTokens УЖЕ включает internal KB
  const projected = currentTokens + additionalTokens;
  const isValid = projected <= SYSTEM_PROMPT_MAX_TOKENS;
  
  if (!isValid) {
    const error = `Token limit exceeded: ${projected.toLocaleString()} / ${SYSTEM_PROMPT_MAX_TOKENS.toLocaleString()} tokens. Cannot add ${additionalTokens.toLocaleString()} tokens. (Current usage already includes ${INTERNAL_COMPANY_KB_TOKENS.toLocaleString()} tokens from internal KB)`;
    return { isValid: false, projected, error };
  }
  
  return { isValid: true, projected };
}

/**
 * ✅ Get warning message if approaching limit
 * 
 * ВАЖНО: currentTokens должен быть результатом calculateTokenUsage().currentTokens
 * Он УЖЕ включает internal KB
 * 
 * @param currentTokens - Current token usage (УЖЕ включает internal KB)
 * @returns Warning message or null if not approaching limit
 */
export function getWarningMessage(currentTokens: number): string | null {
  if (!isApproachingLimit(currentTokens)) return null;
  
  const remaining = getRemainingTokens(currentTokens);
  const percentage = getUsagePercentage(currentTokens).toFixed(1);
  
  return `Warning: You are approaching the token limit (${percentage}% used). Only ${remaining.toLocaleString()} tokens remaining. (Current usage includes ${INTERNAL_COMPANY_KB_TOKENS.toLocaleString()} tokens from internal KB)`;
}
