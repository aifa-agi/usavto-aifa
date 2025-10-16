// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_hooks)/use-field-stream-generation.ts

/**
 * Field Stream Generation Hook
 * Manages AI-powered streaming generation for SEO/system fields (Title, Description, Intent, etc.)
 * 
 * Comments:
 * - Wraps ai-sdk/react useCompletion to stream field content generation
 * - Provides startFieldGeneration(fieldType, currentValue, externalKB, context) and cancel
 * - Integrates Sonner toasts for start/success/error/cancel feedback
 * - Consumers read streamedText in real time and persist via save handler
 */

import * as React from "react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import {
  type FieldGenerationType,
  getFieldGenerationSystemInstruction,
  buildFieldGenerationPrompt,
} from "@/config/prompts/knowledge-base-prompts";

/**
 * Input parameters for starting field generation
 */
export type StartFieldGenerationInput = {
  /** Type of field to generate (title, description, intent, etc.) */
  fieldType: FieldGenerationType;
  /** Current field value (used as draft/idea) */
  currentValue?: string;
  /** External knowledge base content (competitor analysis) */
  externalKnowledgeBase?: string;
  /** Page context for better generation */
  context?: {
    pageTitle?: string;
    keywords?: string[];
  };
  /** Optional model override (default: gpt-4o-mini) */
  model?: string;
};

/**
 * Field display names for user feedback
 */
const FIELD_DISPLAY_NAMES: Record<FieldGenerationType, string> = {
  title: "Title",
  description: "Description",
  intent: "Intent",
  taxonomy: "Taxonomy",
  attention: "Attention",
  audiences: "Audience",
};

/**
 * Hook for managing AI-powered field generation with streaming
 */
export function useFieldStreamGeneration() {
  // useCompletion manages internal POST to API route
  const {
    completion,
    isLoading,
    complete,
    stop: stopStreaming,
    error,
  } = useCompletion({
    api: "/api/info/generate-fields-suggestions",
  });

  const [lastError, setLastError] = React.useState<string | null>(null);
  const [currentFieldType, setCurrentFieldType] = React.useState<FieldGenerationType | null>(null);

  /**
   * Start streaming generation for a specific field
   */
  const startFieldGeneration = React.useCallback(
    async ({
      fieldType,
      currentValue,
      externalKnowledgeBase,
      context,
      model,
    }: StartFieldGenerationInput) => {
      setLastError(null);
      setCurrentFieldType(fieldType);

      const fieldName = FIELD_DISPLAY_NAMES[fieldType];

      // Show loading toast
      toast.loading(`Generating ${fieldName}`, {
        id: `field-generation-start-${fieldType}`,
        description: "AI is generating optimized content based on knowledge base...",
      });

      try {
        // Get system instruction for this field type
        const systemInstruction = getFieldGenerationSystemInstruction(fieldType);

        // Build user prompt with context
        const userPrompt = buildFieldGenerationPrompt(
          currentValue,
          externalKnowledgeBase,
          context?.pageTitle,
          context?.keywords
        );

        // Validate that we have enough context
        if (!userPrompt || userPrompt.trim().length < 10) {
          throw new Error(
            "Insufficient context for generation. Please provide at least page title or external knowledge base."
          );
        }

        // Start streaming
        await complete("", {
          body: {
            system: systemInstruction,
            prompt: userPrompt,
            model: model || "gpt-4o-mini",
            fieldType,
          },
        });

        // Success feedback
        toast.success(`${fieldName} generated successfully`, {
          id: `field-generation-success-${fieldType}`,
          description: "Review the generated content and save when ready.",
        });
      } catch (e: any) {
        const msg = e?.message ?? "Generation failed";
        setLastError(String(msg));

        toast.error(`${fieldName} generation failed`, {
          id: `field-generation-error-${fieldType}`,
          description: msg,
        });
      } finally {
        // Dismiss loading toast
        toast.dismiss(`field-generation-start-${fieldType}`);
        setCurrentFieldType(null);
      }
    },
    [complete]
  );

  /**
   * Cancel ongoing generation
   */
  const cancel = React.useCallback(() => {
    try {
      stopStreaming();

      const fieldName = currentFieldType
        ? FIELD_DISPLAY_NAMES[currentFieldType]
        : "Field";

      toast.info(`${fieldName} generation canceled`, {
        id: `field-generation-canceled-${currentFieldType}`,
        description: "Generation was stopped by user.",
      });
    } catch {
      // Silent error handling
    } finally {
      setCurrentFieldType(null);
    }
  }, [stopStreaming, currentFieldType]);

  return {
    /** Real-time streamed text from AI model */
    streamedText: completion,
    /** Whether generation is currently in progress */
    isGenerating: isLoading,
    /** Last error message (if any) */
    lastError: lastError ?? (error ? String(error) : null),
    /** Currently generating field type (null if idle) */
    currentFieldType,
    /** Start generation for a specific field */
    startFieldGeneration,
    /** Cancel ongoing generation */
    cancel,
  };
}
