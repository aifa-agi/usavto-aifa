// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_server)/api/generate/route.ts
/**
 * Streaming endpoint for Step 8 section generation (AI SDK v4).
 * Returns a Data Stream response that the v4 client hooks can consume incrementally.
 *
 * Body: { system: string, prompt: string, model?: string }
 */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { requirePrivilegedUser } from "@/app/@right/(_service)/(_utils)/auth-helpers";

// Optional: extend streaming time on Vercel
export const maxDuration = 300;

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  console.log(`\n${"=".repeat(70)}`);
  console.log(`[${requestId}] 🚀 NEW REQUEST: Step8 Section Generation API`);
  console.log(`${"=".repeat(70)}`);

  // 🔐 AUTHORIZATION CHECK: Only privileged users can generate Step 8 sections
  const authResult = await requirePrivilegedUser(
    requestId,
    "Only administrators, architects, and editors can generate Step 8 sections"
  );

  if (!authResult.success) {
    console.log(`${"=".repeat(70)}\n`);
    return authResult.response;
  }

  const { session, userRole, isPrivileged } = authResult;

  console.log(`[${requestId}] ✅ User authorized: ${session?.user?.email || "unknown"}`);
  console.log(`[${requestId}] ✅ User role: ${userRole}`);
  console.log(`[${requestId}] ✅ Proceeding with Step 8 section generation...`);

  try {
    const { system, prompt, model } = (await req.json()) as {
      system: string;
      prompt: string;
      model?: string;
    };

    console.log(`[${requestId}] 📝 Request data received`);
    console.log(`[${requestId}] 📝 System instruction length: ${system?.length ?? 0} characters`);
    console.log(`[${requestId}] 📝 Prompt length: ${prompt?.length ?? 0} characters`);
    console.log(`[${requestId}] 📝 Model: ${model ?? "gpt-4.1-mini"}`);

    // Validation
    if (!system || typeof system !== "string") {
      console.error(`[${requestId}] ❌ Invalid system instruction`);
      console.log(`${"=".repeat(70)}\n`);

      return new Response(
        JSON.stringify({
          error: "System instruction is required and must be a string",
          received: { system: typeof system, length: system?.length },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!prompt || typeof prompt !== "string") {
      console.error(`[${requestId}] ❌ Invalid prompt`);
      console.log(`${"=".repeat(70)}\n`);

      return new Response(
        JSON.stringify({
          error: "Prompt is required and must be a string",
          received: { prompt: typeof prompt, length: prompt?.length },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[${requestId}] ✅ Validation passed`);
    console.log(`[${requestId}] 🤖 Initializing AI streaming...`);
    console.log(`[${requestId}] 🤖 Temperature: 0.5`);
    console.log(`[${requestId}] 🤖 Max tokens: 30000`);

    const result = streamText({
      model: openai(model ?? "gpt-4.1-mini"),
      system,
      prompt,
      temperature: 0.5,
      maxTokens: 30000,
    });

    console.log(`[${requestId}] 🌊 Streaming response initiated`);
    console.log(`${"=".repeat(70)}\n`);

    // AI SDK v4: use Data Stream helper
    return result.toDataStreamResponse();

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

    console.error(`[${requestId}] 💥 Step8 Generation API Error:`, errorMessage);
    console.error(`[${requestId}] 💥 Error details:`, errorDetails);
    console.log(`${"=".repeat(70)}\n`);

    return new Response(
      JSON.stringify({
        error: "Step8 generation API failed",
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
