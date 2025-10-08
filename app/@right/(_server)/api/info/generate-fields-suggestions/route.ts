// @/app/@right/(_server)/api/info/generate-fields-suggestions/route.ts

/**
 * Streaming endpoint for SEO/System Fields generation - AI SDK v4
 * Returns a Data Stream response that v4 client hooks can consume incrementally
 * 
 * Purpose:
 * - Generate optimized content for Title, Description, Intent, Taxonomy, Attention, Audience
 * - Uses external knowledge base (competitor analysis) as primary context
 * - Streams response in real-time for better UX
 * 
 * Body: {
 *   system: string,      // System instruction for specific field type
 *   prompt: string,      // User prompt with context (current value + external KB + page context)
 *   model?: string,      // Optional model override (default: gpt-4o-mini)
 *   fieldType: string    // Field type for logging/debugging
 * }
 */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Extend streaming time for longer generations
export const maxDuration = 300;

/**
 * Request body type
 */
type GenerateFieldRequestBody = {
  system: string;
  prompt: string;
  model?: string;
  fieldType?: string;
};

/**
 * POST handler for field generation streaming
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json() as GenerateFieldRequestBody;
    const { system, prompt, model, fieldType } = body;

    // ========================================
    // VALIDATION
    // ========================================

    // Validate system instruction
    if (!system || typeof system !== "string") {
      return new Response(
        JSON.stringify({
          error: "System instruction is required and must be a string",
          received: {
            system: typeof system,
            length: system?.length,
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (system.length < 50) {
      return new Response(
        JSON.stringify({
          error: "System instruction is too short (minimum 50 characters)",
          length: system.length,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate user prompt
    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({
          error: "Prompt is required and must be a string",
          received: {
            prompt: typeof prompt,
            length: prompt?.length,
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (prompt.length < 10) {
      return new Response(
        JSON.stringify({
          error: "Prompt is too short (minimum 10 characters)",
          length: prompt.length,
          hint: "Provide at least page title or external knowledge base content",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate model (if provided)
    if (model && typeof model !== "string") {
      return new Response(
        JSON.stringify({
          error: "Model must be a string",
          received: typeof model,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ========================================
    // STREAM FIELD GENERATION
    // ========================================

    // Select model (default to gpt-4o-mini for cost efficiency)
    const selectedModel = model || "gpt-4.1";

    // Log generation start (optional, for debugging)
    console.log(`[Field Generation] Starting generation for field: ${fieldType || "unknown"}`);
    console.log(`[Field Generation] Model: ${selectedModel}`);
    console.log(`[Field Generation] System length: ${system.length} chars`);
    console.log(`[Field Generation] Prompt length: ${prompt.length} chars`);

    // Stream text generation
    const result = streamText({
      model: openai(selectedModel),
      system,
      prompt,
      temperature: 0.7, // Balanced creativity for SEO content
      maxTokens: 500,   // Sufficient for all field types (title ~60 chars, description ~160 chars, others ~200-300)
    });

    // Return Data Stream response (AI SDK v4 format)
    return result.toDataStreamResponse();

  } catch (error: unknown) {
    // ========================================
    // ERROR HANDLING
    // ========================================

    let errorMessage = "Unknown server error";
    let errorDetails = "No additional details available";
    let errorStack = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.toString();
      errorStack = error.stack || "";
    } else if (typeof error === "string") {
      errorMessage = error;
      errorDetails = error;
    } else if (error && typeof error === "object") {
      const errorObj = error as Record<string, unknown>;
      errorMessage = String(errorObj.message) || "Object error";
      errorDetails = JSON.stringify(error);
    }

    // Log error for debugging
    console.error("[Field Generation API] Error:", {
      message: errorMessage,
      details: errorDetails,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    });

    // Return error response
    return new Response(
      JSON.stringify({
        error: "Field generation API failed",
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
