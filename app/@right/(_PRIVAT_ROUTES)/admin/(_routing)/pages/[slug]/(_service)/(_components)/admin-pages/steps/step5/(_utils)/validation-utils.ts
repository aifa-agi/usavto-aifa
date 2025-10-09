// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/(_utils)/validation-utils.ts

import type { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

const CODE_FENCE_JSON = String.fromCharCode(96, 96, 96) + "json";
const CODE_FENCE = String.fromCharCode(96, 96, 96);

/**
 * Validates and parses AI-generated JSON structure
 * Handles markdown code fence cleanup and structure validation
 * 
 * PERFORMANCE: This function runs ONCE after streaming completes
 * No heavy operations - just string manipulation and JSON.parse
 */
export function validateAndParseSection(text: string): {
  success: boolean;
  data: RootContentStructure | null;
  error: string | null;
} {
  try {
    console.log("[Validation] Starting validation...");
    console.log("[Validation] Input text length:", text?.length ?? 0);

    if (!text || text.trim().length < 10) {
      const error = "Response is too short or empty";
      console.error("[Validation] Failed:", error);
      return {
        success: false,
        data: null,
        error,
      };
    }

    let cleaned = text.trim();
    
    // Remove markdown code fences if present
    const hadJsonFence = cleaned.startsWith(CODE_FENCE_JSON);
    const hadCodeFence = cleaned.startsWith(CODE_FENCE);
    
    if (hadJsonFence) {
      cleaned = cleaned.substring(CODE_FENCE_JSON.length);
      if (cleaned.endsWith(CODE_FENCE)) {
        cleaned = cleaned.substring(0, cleaned.length - CODE_FENCE.length);
      }
      cleaned = cleaned.trim();
      
    } else if (hadCodeFence) {
      cleaned = cleaned.substring(CODE_FENCE.length);
      if (cleaned.endsWith(CODE_FENCE)) {
        cleaned = cleaned.substring(0, cleaned.length - CODE_FENCE.length);
      }
      cleaned = cleaned.trim();
      console.log("[Validation] Removed ``` fence");
    }

    console.log("[Validation] Cleaned text length:", cleaned.length);
    console.log("[Validation] First 200 chars:", cleaned.substring(0, 200));

    // Parse JSON
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
      console.log("[Validation] JSON parsed successfully");
    } catch (parseError: any) {
      const error = `JSON parse error: ${parseError.message}`;
      console.error("[Validation] Parse failed:", error);
      console.error("[Validation] Attempted to parse:", cleaned.substring(0, 500));
      return {
        success: false,
        data: null,
        error,
      };
    }

    // Extract section (handle both object and array responses)
    let section: any;
    if (Array.isArray(parsed)) {
      console.log("[Validation] Response is array, length:", parsed.length);
      if (parsed.length === 0) {
        const error = "Received empty array";
        console.error("[Validation] Failed:", error);
        return {
          success: false,
          data: null,
          error,
        };
      }
      section = parsed[0];
      console.log("[Validation] Extracted first element from array");
    } else {
      section = parsed;
      console.log("[Validation] Response is single object");
    }

    // Validate structure
    if (!section || typeof section !== "object") {
      const error = "Invalid structure format - not an object";
      console.error("[Validation] Failed:", error);
      return {
        success: false,
        data: null,
        error,
      };
    }

    if (!section.id || typeof section.id !== "string") {
      const error = "Missing or invalid 'id' field";
      console.error("[Validation] Failed:", error);
      console.error("[Validation] Section structure:", Object.keys(section));
      return {
        success: false,
        data: null,
        error,
      };
    }

    if (!section.tag || typeof section.tag !== "string") {
      const error = "Missing or invalid 'tag' field";
      console.error("[Validation] Failed:", error);
      console.error("[Validation] Section structure:", Object.keys(section));
      return {
        success: false,
        data: null,
        error,
      };
    }

    console.log("[Validation] Success! Section ID:", section.id, "Tag:", section.tag);
    console.log("[Validation] Section keys:", Object.keys(section).join(", "));

    return {
      success: true,
      data: section as RootContentStructure,
      error: null,
    };

  } catch (e: any) {
    const error = `Parsing error: ${e.message || "Unknown error"}`;
    console.error("[Validation] Unexpected error:", error);
    console.error("[Validation] Stack:", e.stack);
    return {
      success: false,
      data: null,
      error,
    };
  }
}

/**
 * Validates full structure array
 * Used for legacy full-structure generation
 */
export function validateAndParseFullStructure(text: string): {
  success: boolean;
  data: RootContentStructure[] | null;
  error: string | null;
} {
  try {
    console.log("[Validation] Starting full structure validation...");
    console.log("[Validation] Input text length:", text?.length ?? 0);

    if (!text || text.trim().length < 10) {
      const error = "Response is too short or empty";
      console.error("[Validation] Failed:", error);
      return {
        success: false,
        data: null,
        error,
      };
    }

    let cleaned = text.trim();
    
    // Remove markdown code fences
    if (cleaned.startsWith(CODE_FENCE_JSON)) {
      cleaned = cleaned.substring(CODE_FENCE_JSON.length);
      if (cleaned.endsWith(CODE_FENCE)) {
        cleaned = cleaned.substring(0, cleaned.length - CODE_FENCE.length);
      }
      cleaned = cleaned.trim();
      
    } else if (cleaned.startsWith(CODE_FENCE)) {
      cleaned = cleaned.substring(CODE_FENCE.length);
      if (cleaned.endsWith(CODE_FENCE)) {
        cleaned = cleaned.substring(0, cleaned.length - CODE_FENCE.length);
      }
      cleaned = cleaned.trim();
      console.log("[Validation] Removed ``` fence");
    }

    console.log("[Validation] Cleaned text length:", cleaned.length);

    // Parse JSON
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
      console.log("[Validation] JSON parsed successfully");
    } catch (parseError: any) {
      const error = `JSON parse error: ${parseError.message}`;
      console.error("[Validation] Parse failed:", error);
      return {
        success: false,
        data: null,
        error,
      };
    }

    // Must be array
    if (!Array.isArray(parsed)) {
      const error = "Expected array of sections";
      console.error("[Validation] Failed:", error);
      return {
        success: false,
        data: null,
        error,
      };
    }

    console.log("[Validation] Array length:", parsed.length);

    if (parsed.length === 0) {
      const error = "Received empty array";
      console.error("[Validation] Failed:", error);
      return {
        success: false,
        data: null,
        error,
      };
    }

    // Validate each section
    for (let i = 0; i < parsed.length; i++) {
      const section = parsed[i];
      if (!section || typeof section !== "object") {
        const error = `Section ${i + 1} is not a valid object`;
        console.error("[Validation] Failed:", error);
        return {
          success: false,
          data: null,
          error,
        };
      }
      if (!section.id || !section.tag) {
        const error = `Section ${i + 1} missing required fields (id or tag)`;
        console.error("[Validation] Failed:", error);
        console.error("[Validation] Section structure:", Object.keys(section));
        return {
          success: false,
          data: null,
          error,
        };
      }
      console.log(`[Validation] Section ${i + 1} valid: ID=${section.id}, Tag=${section.tag}`);
    }

    console.log("[Validation] Success! All sections validated");

    return {
      success: true,
      data: parsed as RootContentStructure[],
      error: null,
    };

  } catch (e: any) {
    const error = `Parsing error: ${e.message || "Unknown error"}`;
    console.error("[Validation] Unexpected error:", error);
    console.error("[Validation] Stack:", e.stack);
    return {
      success: false,
      data: null,
      error,
    };
  }
}
