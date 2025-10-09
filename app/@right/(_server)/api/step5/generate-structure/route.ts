// File: /api/step5/generate-structure/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 300;

export async function POST(req: Request) {
  let sectionIndex: number | undefined;
  
  try {
    const { system, prompt, model, sectionIndex: reqSectionIndex } = await req.json() as {
      system: string;
      prompt: string;
      model?: string;
      sectionIndex?: number;
    };

    sectionIndex = reqSectionIndex;

    if (typeof sectionIndex === "number") {
      console.log(`[Step5] Starting generation for section ${sectionIndex + 1}...`);
    } else {
      console.log(`[Step5] Starting generation (full structure mode)...`);
    }

    console.log(`[Step5] System instruction length: ${system?.length ?? 0} characters`);
    console.log(`[Step5] Prompt length: ${prompt?.length ?? 0} characters`);
    console.log(`[Step5] Model: ${model ?? "gpt-4.1-mini"}`);
    console.log(`[Step5] System instruction preview:`, system?.substring(0, 200) + "...");

    // Validation
    if (!system || typeof system !== "string") {
      console.error(`[Step5] Invalid system instruction:`, { system: typeof system, length: system?.length });
      return new Response(JSON.stringify({
        error: "System instruction is required and must be a string",
        received: { system: typeof system, length: system?.length },
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!prompt || typeof prompt !== "string") {
      console.error(`[Step5] Invalid prompt:`, { prompt: typeof prompt, length: prompt?.length });
      return new Response(JSON.stringify({
        error: "Prompt is required and must be a string", 
        received: { prompt: typeof prompt, length: prompt?.length },
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (system.length < 10) {
      console.error(`[Step5] System instruction too short:`, system.length, "characters");
      return new Response(JSON.stringify({
        error: "System instruction is too short (minimum 10 characters)",
        length: system.length,
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stream with correct model: gpt-4.1-mini
    try {
      const result = streamText({
        model: openai(model ?? "gpt-4.1"), // ✅ CORRECT MODEL
        system,
        prompt,
        temperature: 0.2,
        maxTokens: 16000,
        onFinish: async (completion) => {
          const textLength = completion.text?.length ?? 0;
          const sectionLabel = typeof sectionIndex === "number" 
            ? `section ${sectionIndex + 1}` 
            : "full structure";
          
          console.log(`[Step5] Generation finished for ${sectionLabel}`);
          console.log(`[Step5] Generated text length: ${textLength} characters`);
          console.log(`[Step5] Token usage:`, {
            prompt: completion.usage?.promptTokens ?? 0,
            completion: completion.usage?.completionTokens ?? 0,
            total: completion.usage?.totalTokens ?? 0,
          });
          
          if (textLength === 0) {
            console.error(`[Step5] WARNING: Empty response generated for ${sectionLabel}!`);
          } else {
            console.log(`[Step5] First 300 characters:`, completion.text?.substring(0, 300) + "...");
          }
        },
        onError: (error) => {
          const sectionLabel = typeof sectionIndex === "number" 
            ? `section ${sectionIndex + 1}` 
            : "full structure";
          console.error(`[Step5] Streaming error for ${sectionLabel}:`, error);
          console.error(`[Step5] Error message:`, error.error);
          console.error(`[Step5] Error stack:`, error);
        },
      });

      return result.toDataStreamResponse();
      
    } catch (streamError: any) {
      const sectionLabel = typeof sectionIndex === "number" 
        ? `section ${sectionIndex + 1}` 
        : "full structure";
      
      console.error(`[Step5] streamText error for ${sectionLabel}:`, streamError);
      console.error(`[Step5] Error message:`, streamError.message);
      console.error(`[Step5] Error stack:`, streamError.stack);
      
      return new Response(JSON.stringify({
        error: "Failed to initialize streaming",
        message: streamError.message,
        details: streamError.stack || streamError.toString(),
        timestamp: new Date().toISOString(),
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    
  } catch (error: unknown) {
    let errorMessage = "Unknown server error";
    let errorDetails = "No additional details available";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.toString();
    } else if (typeof error === "string") {
      errorMessage = error;
      errorDetails = error;
    } else if (error && typeof error === "object") {
      const errorObj = error as Record<string, unknown>;
      errorMessage = String(errorObj.message) || "Object error";
      errorDetails = JSON.stringify(error);
    }

    const sectionLabel = typeof sectionIndex === "number" 
      ? `section ${sectionIndex + 1}` 
      : "full structure";

    console.error(`[Step5] API Error for ${sectionLabel}:`, errorMessage);
    console.error(`[Step5] Error details:`, errorDetails);

    return new Response(JSON.stringify({
      error: "Step5 API failed",
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
