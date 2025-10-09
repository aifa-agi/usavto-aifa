// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/(_hooks)/use-step5-stream.ts
/**
 * Step 5 - Streaming hook
 * Wraps ai-sdk/react useCompletion to stream content structure for step 5.
 * 
 * IMPORTANT PERFORMANCE NOTES:
 * - This hook does NOT process completion in useEffect to avoid overheating
 * - Completion updates hundreds of times during streaming - let useCompletion handle it
 * - Processing happens in consumer components ONLY after streaming completes
 * - Use onFinish callback for post-completion validation, not useEffect
 * 
 * Provides:
 * - startStreaming(system, prompt, sectionIndex) - initiates stream
 * - cancel() - stops stream
 * - streamText - real-time completion text (do NOT process in useEffect!)
 * - isStreaming - loading state
 */

import * as React from "react";
import { useCompletion } from "ai/react";
import { toast } from "sonner"; 

export type StartStreamingInput = {
  system: string;
  prompt: string;
  model?: string;
  sectionIndex?: number;
  totalSections?: number;
};

export function useStep5Stream() {
  const [lastError, setLastError] = React.useState<string | null>(null);

  // useCompletion manages internal POST to API route
  // completion updates automatically during streaming - DO NOT process it in useEffect!
  const { 
    completion, 
    isLoading, 
    complete, 
    stop: stopStreaming, 
    error 
  } = useCompletion({
    api: "/api/step5/generate-structure",
    onFinish: (prompt, completion) => {
      // Safe place to check completion after streaming ends
      const completionLength = completion?.trim().length ?? 0;
      
      console.log("[Client] Stream finished, completion length:", completionLength);
      
      if (completionLength === 0) {
        console.error("[Client] Empty completion received!");
        setLastError("AI model returned empty response");
        toast.error("Generation failed", {
          id: "step5-stream-error",
          description: "AI model returned empty response. Check system instruction.",
        });
      } else {
        console.log("[Client] First 200 chars:", completion?.substring(0, 200));
      }
    },
    onError: (error) => {
      console.error("[Client] Stream error:", error);
      setLastError(error.message);
    },
  });

  const startStreaming = React.useCallback(
    async ({ system, prompt, model, sectionIndex, totalSections }: StartStreamingInput) => {
      setLastError(null);
      
      // Validate before sending to prevent unnecessary API calls
      if (!system || system.trim().length < 10) {
        const error = "System instruction is too short or empty";
        setLastError(error);
        toast.error("Cannot start generation", { 
          description: error,
        });
        console.error("[Client] Validation failed:", error);
        return;
      }

      const sectionInfo = 
        sectionIndex !== undefined && totalSections !== undefined
          ? ` (Section ${sectionIndex + 1} of ${totalSections})`
          : "";
      
      console.log(`[Client] Starting stream${sectionInfo}`);
      console.log("[Client] System instruction length:", system.length, "characters");
      console.log("[Client] System preview:", system.substring(0, 200) + "...");
      
      toast.loading(`Structure generation started${sectionInfo}`, {
        id: "step5-stream-start",
        description: "Generating content structure in real time...",
      });

      try {
        // complete() returns a promise that resolves when streaming finishes
        await complete("", {
          body: { system, prompt, model, sectionIndex },
        });
        
        // Success toast only if no error was set in onFinish
        if (!lastError) {
          toast.success(`Structure generation completed${sectionInfo}`, {
            id: "step5-stream-success", 
            description: "Content structure is ready for review and saving.",
          });
        }
      } catch (e: any) {
        const msg = e?.message ?? "Streaming failed";
        setLastError(String(msg));
        
        console.error("[Client] Streaming exception:", msg);
        
        toast.error("Structure generation failed", {
          id: "step5-stream-error",
          description: msg,
        });
      } finally {
        toast.dismiss("step5-stream-start");
      }
    },
    [complete, lastError]
  );

  const cancel = React.useCallback(() => {
    try {
      stopStreaming();
      console.log("[Client] Stream canceled by user");
      toast.info("Generation canceled", {
        id: "step5-stream-canceled",
        description: "Content structure generation was canceled.",
      });
    } catch (err) {
      console.error("[Client] Cancel failed:", err);
    }
  }, [stopStreaming]);

  return {
    // Real-time text being streamed from the model
    // IMPORTANT: Consumer components should NOT create useEffect with streamText dependency
    // that updates state - this causes hundreds of re-renders during streaming!
    streamText: completion,
    isStreaming: isLoading,
    lastError: lastError ?? (error ? String(error) : null),
    // Controls
    startStreaming,
    cancel,
  };
}
