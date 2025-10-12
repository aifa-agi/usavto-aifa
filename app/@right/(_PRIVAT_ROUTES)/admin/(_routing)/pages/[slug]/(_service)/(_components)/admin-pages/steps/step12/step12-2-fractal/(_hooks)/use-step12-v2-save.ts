// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_hooks)/use-step12-v2-save.ts
/**
 * Step12 V2 Save Hook - Updated for PageUploadPayload  
 * AUTONOMOUS VERSION - no imports from step12-1-fractal
 * Creates own upload service and error handling with new payload structure
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { toPageUploadPayload, validatePageUploadPayload } from "../(_adapters)/sections-v2-mapper";
import { STEP12_V2_IDS } from "../(_constants)/step12-v2-ids";
import { STEP12_V2_TEXTS } from "../(_constants)/step12-v2-texts";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import type { PageUploadPayload } from "@/app/@right/(_service)/(_types)/section-types";

// ==================== AUTONOMOUS V2 UPLOAD SERVICE ====================

interface SectionUploadV2Response {
  success: boolean;
  message: string;
  filePath?: string;
  environment?: "development" | "production";
  error?: string;
  errorCode?: string;
  details?: string;
}

enum UploadErrorV2Type {
  VALIDATION_ERROR = "validation-error",
  NETWORK_ERROR = "network-error", 
  SERVER_ERROR = "server-error",
  FILESYSTEM_ERROR = "filesystem-error",
  GITHUB_ERROR = "github-error",
  UNKNOWN_ERROR = "unknown-error",
}

class SectionUploadV2Error extends Error {
  public readonly type: UploadErrorV2Type;
  public readonly statusCode?: number;
  public readonly details?: string;

  constructor(
    message: string,
    type: UploadErrorV2Type = UploadErrorV2Type.UNKNOWN_ERROR,
    statusCode?: number,
    details?: string
  ) {
    super(message);
    this.name = "SectionUploadV2Error";
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function uploadSectionsV2(payload: PageUploadPayload): Promise<SectionUploadV2Response> {
  try {
    const validationErrors = validatePageUploadPayload(payload);
    if (validationErrors.length > 0) {
      throw new SectionUploadV2Error(
        `Validation failed: ${validationErrors.join(", ")}`,
        UploadErrorV2Type.VALIDATION_ERROR
      );
    }

    const response = await fetch("/api/sections/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    if (responseText.startsWith("<!DOCTYPE") || responseText.startsWith("<html")) {
      throw new SectionUploadV2Error(
        "Server returned HTML instead of JSON. Check server configuration.",
        UploadErrorV2Type.SERVER_ERROR,
        response.status
      );
    }

    let result: SectionUploadV2Response;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new SectionUploadV2Error(
        `Invalid JSON response: ${responseText.substring(0, 100)}...`,
        UploadErrorV2Type.SERVER_ERROR,
        response.status
      );
    }

    if (!response.ok) {
      const errorType = getV2ErrorTypeFromStatus(response.status);
      throw new SectionUploadV2Error(
        result.message || `HTTP ${response.status}: ${response.statusText}`,
        errorType,
        response.status,
        result.details
      );
    }

    if (!result.success) {
      const errorType = getV2ErrorTypeFromCode(result.errorCode);
      throw new SectionUploadV2Error(
        result.message || "Upload failed",
        errorType,
        response.status,
        result.details
      );
    }

    return result;
  } catch (error) {
    if (error instanceof SectionUploadV2Error) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new SectionUploadV2Error(
        "Network error: Unable to connect to server",
        UploadErrorV2Type.NETWORK_ERROR
      );
    }

    throw new SectionUploadV2Error(
      error instanceof Error ? error.message : "Unknown upload error",
      UploadErrorV2Type.UNKNOWN_ERROR
    );
  }
}

function getV2ErrorTypeFromStatus(status: number): UploadErrorV2Type {
  if (status >= 400 && status < 500) return UploadErrorV2Type.VALIDATION_ERROR;
  if (status >= 500) return UploadErrorV2Type.SERVER_ERROR;
  return UploadErrorV2Type.UNKNOWN_ERROR;
}

function getV2ErrorTypeFromCode(errorCode?: string): UploadErrorV2Type {
  if (!errorCode) return UploadErrorV2Type.UNKNOWN_ERROR;
  
  switch (errorCode) {
    case "validation_error":
    case "invalid_data_format":
      return UploadErrorV2Type.VALIDATION_ERROR;
    case "github_token_invalid":
    case "github_api_unavailable":
      return UploadErrorV2Type.GITHUB_ERROR;
    case "file_write_failed":
    case "directory_creation_failed":
      return UploadErrorV2Type.FILESYSTEM_ERROR;
    case "network_error":
      return UploadErrorV2Type.NETWORK_ERROR;
    default:
      return UploadErrorV2Type.UNKNOWN_ERROR;
  }
}

// ==================== V2 SAVE HOOK ====================

interface UseStep12V2SaveReturn {
  save: (page?: PageData) => Promise<boolean>;
  saving: boolean;
}

export function useStep12V2Save(
  sections: import("../(_types)/step12-v2-types").SectionStateV2[],
  isAllReady: () => boolean,
  resetAllFlags: () => void,
  setSaving: (saving: boolean) => void,
  page?: PageData
): UseStep12V2SaveReturn {
  const [localSaving, setLocalSaving] = useState(false);
  const { setCategories } = useNavigationMenu();

  const save = useCallback(async (targetPage?: PageData): Promise<boolean> => {
    const pageToSave = targetPage || page;
    
    console.log("🚀 [V2Save] Save started", {
      pageId: pageToSave?.id,
      href: pageToSave?.href,
      currentIsPreviewComplited: pageToSave?.isPreviewComplited
    });

    if (!pageToSave) {
      console.error("❌ [V2Save] No page to save");
      toast.error(STEP12_V2_TEXTS.errors.missingHref, {
        id: STEP12_V2_IDS.toasts.saveError
      });
      return false;
    }

    if (!pageToSave.href) {
      console.error("❌ [V2Save] Page missing href");
      toast.error(STEP12_V2_TEXTS.errors.missingHref, {
        id: STEP12_V2_IDS.toasts.saveError
      });
      return false;
    }

    if (!isAllReady()) {
      console.warn("⚠️ [V2Save] Sections not ready");
      toast.error(STEP12_V2_TEXTS.save.notReadyDescription, {
        id: STEP12_V2_IDS.toasts.saveNotReady
      });
      return false;
    }

    setLocalSaving(true);
    setSaving(true);
    
    toast.loading("Saving page with all sections...", {
      id: STEP12_V2_IDS.toasts.saveStart
    });

    try {
      const payload: PageUploadPayload = toPageUploadPayload(sections, pageToSave);
      
      console.log("📦 [V2Save] Payload created", {
        sectionsCount: payload.sections.length,
        pageTitle: payload.pageMetadata.title
      });

      if (payload.sections.length === 0) {
        throw new Error(STEP12_V2_TEXTS.errors.noSections);
      }

      const response = await uploadSectionsV2(payload);
      
      console.log("✅ [V2Save] Upload successful");

      resetAllFlags();

      console.log("🔄 [V2Save] Starting categories update");
      console.log("🔍 [V2Save] Looking for page with href:", pageToSave.href);

      // Force update with detailed logging
      setCategories(prevCategories => {
        console.log("📝 [V2Save] Previous categories count:", prevCategories.length);
        
        let foundPage = false;
        let updatedCount = 0;

        const newCategories = prevCategories.map(category => {
          console.log(`🔍 [V2Save] Checking category: "${category.title}" (${category.pages.length} pages)`);
          
          const newPages = category.pages.map(p => {
            if (p.href === pageToSave.href) {
              foundPage = true;
              updatedCount++;
              
              const oldTimestamp = p.updatedAt;
              const newTimestamp = new Date().toISOString();
              
              console.log("✨ [V2Save] FOUND & UPDATING PAGE!", {
                categoryTitle: category.title,
                pageId: p.id,
                pageHref: p.href,
                oldIsPreviewComplited: p.isPreviewComplited,
                newIsPreviewComplited: true,
                oldTimestamp,
                newTimestamp,
                timestampChanged: oldTimestamp !== newTimestamp
              });

              return { 
                ...p, 
                isPreviewComplited: true, 
                updatedAt: newTimestamp,
                title: payload.pageMetadata.title || p.title,
                description: payload.pageMetadata.description || p.description,
              };
            }
            return p;
          });

          return {
            ...category,
            pages: newPages
          };
        });

        console.log("📊 [V2Save] Update summary:", {
          foundPage,
          updatedCount,
          searchedHref: pageToSave.href
        });

        if (!foundPage) {
          console.error("❌ [V2Save] PAGE NOT FOUND IN ANY CATEGORY!");
          console.log("🔍 [V2Save] All hrefs in categories:", 
            prevCategories.flatMap(c => c.pages.map(p => ({ 
              category: c.title, 
              href: p.href, 
            })))
          );
        }

        return newCategories;
      });

      console.log("✅ [V2Save] Categories update completed");

      toast.success(
        `Successfully saved page "${payload.pageMetadata.title || 'Untitled'}" with ${payload.sections.length} sections${
          response.filePath ? ` to ${response.filePath}` : ""
        }`,
        {
          id: STEP12_V2_IDS.toasts.saveSuccess,
          duration: 4000
        }
      );

      console.log("🎉 [V2Save] Save process finished successfully");
      return true;

    } catch (error) {
      console.error("❌ [V2Save] Save failed:", error);

      if (error instanceof SectionUploadV2Error) {
        let errorMessage = error.message;
        
        switch (error.type) {
          case UploadErrorV2Type.VALIDATION_ERROR:
            errorMessage = `${STEP12_V2_TEXTS.errors.validationError}: ${error.message}`;
            break;
          case UploadErrorV2Type.NETWORK_ERROR:
            errorMessage = STEP12_V2_TEXTS.errors.networkError;
            break;
          case UploadErrorV2Type.GITHUB_ERROR:
            errorMessage = `GitHub integration error: ${error.message}`;
            break;
          case UploadErrorV2Type.FILESYSTEM_ERROR:
            errorMessage = "File system error: Unable to save page";
            break;
          case UploadErrorV2Type.SERVER_ERROR:
            errorMessage = `${STEP12_V2_TEXTS.errors.serverError}: ${error.message}`;
            break;
          default:
            errorMessage = `Upload failed: ${error.message}`;
        }

        toast.error(errorMessage, {
          id: STEP12_V2_IDS.toasts.saveError,
          duration: 6000
        });
      } else {
        const message = error instanceof Error 
          ? error.message 
          : STEP12_V2_TEXTS.errors.unknownError;
          
        toast.error(`Save failed: ${message}`, {
          id: STEP12_V2_IDS.toasts.saveError,
          duration: 6000
        });
      }

      console.log("🔄 [V2Save] Rolling back to false");
      
      setCategories(prevCategories =>
        prevCategories.map(category => ({
          ...category,
          pages: category.pages.map(p =>
            p.href === pageToSave.href
              ? { ...p, isPreviewComplited: false }
              : p
          ),
        }))
      );

      return false;

    } finally {
      setLocalSaving(false);
      setSaving(false);
      toast.dismiss(STEP12_V2_IDS.toasts.saveStart);
      console.log("🏁 [V2Save] Finally block executed");
    }
  }, [sections, isAllReady, resetAllFlags, setSaving, page, setCategories]);

  return {
    save,
    saving: localSaving
  };
}

// ==================== LEGACY SUPPORT ====================

export function useStep12V2SaveLegacy(
  sections: import("../(_types)/step12-v2-types").SectionStateV2[],
  isAllReady: () => boolean,
  resetAllFlags: () => void,
  setSaving: (saving: boolean) => void,
  page?: PageData
): UseStep12V2SaveReturn {
  console.warn("useStep12V2SaveLegacy is deprecated. Use useStep12V2Save instead.");
  return useStep12V2Save(sections, isAllReady, resetAllFlags, setSaving, page);
}
