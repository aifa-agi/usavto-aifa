// @/types/system-prompt-types.ts


/**
 * Section Summary Interface
 * Represents a single section within a page with its own summary and anchor link
 * Enables precise navigation to specific content sections
 */
export interface SectionSummary {
  /** Original section ID from page sections array (e.g., "h2-1", "h2-2") */
  sectionId: string;
  
  /** 
   * Humanized anchor path (URL-safe slug)
   * Generated from H2 title using transliteration and slugification
   * Example: "kak-pravilno-delat-putevye-listy-v-2025"
   */
  humanizedPath: string;
  
  /** 
   * H2 heading text extracted from section content
   * Used as section title in knowledge base
   */
  h2Title: string;
  
  /** 
   * AI-generated summary for this specific section
   * Includes auto-appended reference link at the end
   */
  content: string;
  
  /** 
   * Token count for this section's summary
   * Used for granular token budget management
   */
  tokenCount: number;
  
  /** 
   * Absolute URL with anchor to this section
   * Format: https://domain.com/page-path#humanized-path
   * Auto-appended to summary content as "More information: {url}"
   */
  absoluteUrl: string;
}


/**
 * System Instruction Entry Interface
 * Represents a single knowledge base entry extracted from a page
 * Now supports section-level granularity for precise chatbot navigation
 */
export interface SystemPromptEntry {
  /** Unique identifier from the source page */
  id: string;
  
  /** Page title - used as the main topic heading */
  title: string;
  
  /** Brief description of the page content */
  description: string;
  
  /** SEO and context keywords for semantic search */
  keywords: string[];
  
  /** Page URL (href) for absolute URL generation */
  href: string;
  
  /** 
   * Array of section summaries
   * Each section has its own AI-generated summary and anchor link
   * Replaces the previous single "content" field
   */
  sections: SectionSummary[];
  
  /**
   * Total token count across all sections
   * Sum of all section tokenCounts
   * Used for ordering and optimization of final BUSINESS_KNOWLEDGE_BASE
   */
  totalTokenCount: number;
}


/**
 * Array of system prompt entries
 * This represents the raw data structure before string generation
 */
export type SystemPromptCollection = SystemPromptEntry[];


/**
 * Custom Base Instruction
 * This is the highest priority instruction that defines AI role and behavior
 * MANUALLY editable by user and NEVER overwritten by automation
 */
export interface CustomBaseInstruction {
  /**
   * The main instruction text
   * Defines AI role, tone, and base behavior rules
   */
  content: string;
  
  /**
   * Token count for custom instruction
   * Used for total token budget calculation
   */
  tokenCount: number;
  
  /**
   * Last manual update timestamp
   * ISO 8601 format
   */
  lastUpdated: string;
}


/**
 * Complete System Prompt Configuration
 * Combines custom base instruction with dynamic knowledge base
 */
export interface SystemPromptConfig {
  /** Custom base instruction (highest priority, manually editable) */
  customInstruction: CustomBaseInstruction;
  
  /** Dynamic knowledge base entries (auto-generated from pages) */
  knowledgeBase: SystemPromptCollection;
  
  /** Total token count (custom + all entries) */
  totalTokenCount: number;
}


/**
 * Page metadata for system prompt generation
 * Extracted from PageData and sent to API
 */
export interface PageMetadataForPrompt {
  /** Unique page identifier */
  id: string;
  
  /** Page title */
  title: string;
  
  /** Page description */
  description: string;
  
  /** Page keywords for semantic search */
  keywords: string[];
  
  /** Page URL (href) */
  href: string;
}


/**
 * API Request payload for adding/removing system prompt entry
 * Updated to include page metadata
 */
export interface AddToSystemPromptRequest {
  /** Action to perform */
  action: "add" | "remove";
  
  /** Page metadata (required for "add" action) */
  pageMetadata?: PageMetadataForPrompt;
}


/**
 * Token usage information
 * Used for tracking and displaying current token usage
 */
export interface TokenUsageInfo {
  /** Current total token usage */
  currentTokens: number;
  
  /** Maximum allowed tokens */
  maxTokens: number;
  
  /** Remaining tokens available */
  remainingTokens: number;
  
  /** Usage percentage (0-100) */
  usagePercentage: number;
  
  /** Whether warning threshold is reached */
  isApproachingLimit: boolean;
}


/**
 * Error code for token limit exceeded
 */
export const TOKEN_LIMIT_EXCEEDED = "TOKEN_LIMIT_EXCEEDED" as const;


/**
 * Token limit error details
 * Included in API error response when limit is exceeded
 */
export interface TokenLimitErrorDetails {
  /** Current token usage before attempted addition */
  current: number;
  
  /** Tokens that were attempted to be added */
  attempted: number;
  
  /** Projected total if addition succeeded */
  projected: number;
  
  /** Maximum token limit */
  limit: number;
  
  /** Error code for identification */
  code: typeof TOKEN_LIMIT_EXCEEDED;
}


/**
 * Extended API response for token limit errors
 */
export interface TokenLimitExceededResponse {
  success: false;
  message: string;
  error: typeof TOKEN_LIMIT_EXCEEDED;
  tokenUsage: TokenLimitErrorDetails;
  environment: "development" | "production";
}
