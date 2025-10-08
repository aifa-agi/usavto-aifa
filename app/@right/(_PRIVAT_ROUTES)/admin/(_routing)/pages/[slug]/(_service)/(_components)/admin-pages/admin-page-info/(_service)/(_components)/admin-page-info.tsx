// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_components)/admin-page-info.tsx

"use client";

import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  FileText,
  Globe,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  Hash,
  Target,
  Database,
} from "lucide-react";
import { UserType } from "@prisma/client";

import { PageNotFound } from "../../../../page-not-found";
import { AdminPageInfoProps } from "../(_types)/admin-page-types";
import { useSystemFields } from "../(_hooks)/use-system-fields";
import { useKeywordsField } from "../(_hooks)/use-keywords-field";
import { useFieldStreamGeneration } from "../(_hooks)/use-field-stream-generation";
import {
  EDITABLE_SYSTEM_FIELDS,
  SYSTEM_FIELDS_CONFIG,
  KEYWORDS_FIELD_CONFIG,
  FIELD_GROUPS,
} from "../(_constants)/system-fields-config";
import { EditableSystemFields } from "./editable-system-fields";
import { EditableKeywordsField } from "./editable-keywords-field";
import { InternalKnowledgeBaseDisplay } from "./internal-knowledge-base-display";
import { KnowledgeBaseDisplay } from "./knowledge-base-display";
import { PageImagesSection } from "./page-images-section";
import { useAdminPageData } from "../../../../../(_hooks)/use-admin-page-data";
import type { FieldGenerationType } from "@/config/knowledge-base-prompts";

/**
 * Helper function to format category display name
 * Returns "-" for "home" category, otherwise returns the original title
 */
const formatCategoryDisplay = (categoryTitle: string): string => {
  return categoryTitle.toLowerCase() === "home" ? "-" : categoryTitle;
};

/**
 * Helper function to format URL display
 * Removes "/root/" prefix for "root" category URLs
 */
const formatUrlDisplay = (
  url: string | null,
  categoryTitle: string
): string => {
  if (!url) return "N/A";

  if (categoryTitle.toLowerCase() === "root" && url.startsWith("/root/")) {
    return url.replace("/root/", "/");
  }

  return url;
};

/**
 * Fields that support AI generation
 */
const AI_GENERATION_SUPPORTED_FIELDS = new Set<string>([
  "title",
  "description",
  "intent",
  "taxonomy",
  "attention",
  "audiences",
]);

/**
 * Main AdminPageInfo component that displays comprehensive page information
 * with inline editing capabilities for all editable fields including title, description, and keywords
 *
 * Updated to support:
 * - Editable title and description fields
 * - Keywords management with add/remove functionality (with Cyrillic support)
 * - Organized field groups for better UX
 * - Enhanced system instructions editing
 * - Full-width keywords container
 * - Internal and External Knowledge Base display
 * - AI-powered field generation with streaming
 * - Modular images section (extracted to separate component)
 */
export function AdminPageInfo({ slug }: AdminPageInfoProps) {
  // Get page data using centralized hook
  const { page, category, loading, initialized, error, userRole } =
    useAdminPageData(slug);

  // ALWAYS call hooks in the same order - pass potentially null values safely
  const systemFieldsHook = useSystemFields({
    page: page || null,
    categoryTitle: category?.title || "",
    slug,
  });

  // Initialize keywords field hook for keywords management
  const keywordsFieldHook = useKeywordsField({
    page: page || null,
    categoryTitle: category?.title || "",
    slug,
  });

  // Initialize AI field generation hook
  const aiGenerationHook = useFieldStreamGeneration();

  /**
   * Handle AI generation trigger
   * Starts streaming generation and updates the editing value in real-time
   */
  const handleGenerateAi = async (fieldType: FieldGenerationType) => {
    if (!page) return;

    try {
      await aiGenerationHook.startFieldGeneration({
        fieldType,
        currentValue: systemFieldsHook.editingValue,
        externalKnowledgeBase: page.externallKnowledgeBase,
        context: {
          pageTitle: page.title,
          keywords: page.keywords || [],
        },
      });
    } catch (error) {
      console.error("AI generation error:", error);
    }
  };

  /**
   * Update editing value when AI stream produces new content
   */
  useEffect(() => {
    if (aiGenerationHook.streamedText && aiGenerationHook.isGenerating) {
      systemFieldsHook.updateValue(aiGenerationHook.streamedText);
    }
  }, [aiGenerationHook.streamedText, aiGenerationHook.isGenerating]);

  // Show loading state with theme-aware colors
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading page data...</span>
      </div>
    );
  }

  // Show error state if page not found or error occurred
  if (error || !page || !category) {
    console.error("AdminPageInfo error:", {
      error,
      hasPage: !!page,
      hasCategory: !!category,
    });
    return <PageNotFound slug={slug} />;
  }

  // Format category and URL for special cases
  const displayCategory = formatCategoryDisplay(category.title);
  const displayUrl = formatUrlDisplay(page.href || "", category.title);

  console.log("AdminPageInfo rendering:", {
    pageId: page.id,
    categoryTitle: category.title,
    userRole,
    systemFieldsCanEdit: systemFieldsHook.canEdit,
    keywordsFieldCanEdit: keywordsFieldHook.canEdit,
    hasInternalKB: !!page.internalKnowledgeBase,
    hasExternalKB: !!page.externallKnowledgeBase,
    imagesCount: page.images?.length || 0,
  });

  return (
    <div className="space-y-6">
      {/* Admin Access Indicator */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="size-6 text-primary shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground">
              Administrative Access
            </h3>
            <p className="text-xs text-muted-foreground">
              Current role:{" "}
              <span className="font-mono text-foreground bg-muted px-2 py-1 rounded">
                {userRole}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Page Header - Shows current title with edit capabilities */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl font-bold text-foreground truncate">
              {page.title || ""}
            </h1>
            {page.hasBadge && page.badgeName && (
              <Badge variant="secondary" className="shrink-0">
                {page.badgeName}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Category:{" "}
              <span className="font-medium text-foreground">
                {displayCategory}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              URL:{" "}
              <code className="bg-muted text-foreground px-2 py-1 rounded text-xs">
                {displayUrl}
              </code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {page.isPublished ? (
            <Badge variant="default" className="flex items-center gap-1">
              <Eye className="size-3" />
              Published
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <EyeOff className="size-3" />
              Draft
            </Badge>
          )}
        </div>
      </div>

      {/* Basic Information - Now with editable fields */}
      {page && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="size-5" />
            <h2 className="text-lg font-semibold text-foreground">
              {FIELD_GROUPS.BASIC_INFO.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {FIELD_GROUPS.BASIC_INFO.description}
            </p>
            {!systemFieldsHook.canEdit && (
              <Badge variant="outline" className="text-xs">
                <AlertCircle className="size-3 mr-1" />
                Read Only
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Render editable basic information fields */}
            {FIELD_GROUPS.BASIC_INFO.fields.map((fieldKey) => {
              const config = SYSTEM_FIELDS_CONFIG[fieldKey];
              const currentValue = page[
                fieldKey as keyof typeof page
              ] as string;
              const supportsAiGeneration =
                AI_GENERATION_SUPPORTED_FIELDS.has(fieldKey);

              return (
                <EditableSystemFields
                  key={fieldKey}
                  config={config}
                  currentValue={currentValue}
                  isEditing={systemFieldsHook.editingField === fieldKey}
                  editingValue={systemFieldsHook.editingValue}
                  isUpdating={systemFieldsHook.isUpdating}
                  canEdit={systemFieldsHook.canEdit}
                  onStartEdit={systemFieldsHook.startEditing}
                  onCancel={systemFieldsHook.cancelEditing}
                  onSave={systemFieldsHook.saveField}
                  onValueChange={systemFieldsHook.updateValue}
                  supportsAiGeneration={supportsAiGeneration}
                  externalKnowledgeBase={page.externallKnowledgeBase}
                  pageContext={{
                    pageTitle: page.title,
                    keywords: page.keywords || [],
                  }}
                  onGenerateAi={handleGenerateAi}
                  isGenerating={
                    aiGenerationHook.isGenerating &&
                    aiGenerationHook.currentFieldType === fieldKey
                  }
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Keywords Section - Editable - FIXED: Full width container */}
      {page && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="size-5" />
            <h2 className="text-lg font-semibold text-foreground">
              {FIELD_GROUPS.METADATA.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {FIELD_GROUPS.METADATA.description}
            </p>
            {!keywordsFieldHook.canEdit && (
              <Badge variant="outline" className="text-xs">
                <AlertCircle className="size-3 mr-1" />
                Read Only
              </Badge>
            )}
          </div>

          {/* FIXED: Removed max-w-2xl to allow full width usage */}
          <div className="w-full">
            <EditableKeywordsField
              config={KEYWORDS_FIELD_CONFIG.keywords}
              currentKeywords={page.keywords || []}
              keywordsHook={keywordsFieldHook}
            />
          </div>
        </div>
      )}

      {/* System Instructions - Only AI guidance fields */}
      {page && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="size-5" />
            <h2 className="text-lg font-semibold text-foreground">
              {FIELD_GROUPS.SYSTEM_INSTRUCTIONS.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {FIELD_GROUPS.SYSTEM_INSTRUCTIONS.description}
            </p>
            {!systemFieldsHook.canEdit && (
              <Badge variant="outline" className="text-xs">
                <AlertCircle className="size-3 mr-1" />
                Read Only
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Render system instruction fields (excluding title/description) */}
            {FIELD_GROUPS.SYSTEM_INSTRUCTIONS.fields.map((fieldKey) => {
              const config = SYSTEM_FIELDS_CONFIG[fieldKey];
              const currentValue = page[
                fieldKey as keyof typeof page
              ] as string;
              const supportsAiGeneration =
                AI_GENERATION_SUPPORTED_FIELDS.has(fieldKey);

              return (
                <EditableSystemFields
                  key={fieldKey}
                  config={config}
                  currentValue={currentValue}
                  isEditing={systemFieldsHook.editingField === fieldKey}
                  editingValue={systemFieldsHook.editingValue}
                  isUpdating={systemFieldsHook.isUpdating}
                  canEdit={systemFieldsHook.canEdit}
                  onStartEdit={systemFieldsHook.startEditing}
                  onCancel={systemFieldsHook.cancelEditing}
                  onSave={systemFieldsHook.saveField}
                  onValueChange={systemFieldsHook.updateValue}
                  supportsAiGeneration={supportsAiGeneration}
                  externalKnowledgeBase={page.externallKnowledgeBase}
                  pageContext={{
                    pageTitle: page.title,
                    keywords: page.keywords || [],
                  }}
                  onGenerateAi={handleGenerateAi}
                  isGenerating={
                    aiGenerationHook.isGenerating &&
                    aiGenerationHook.currentFieldType === fieldKey
                  }
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Knowledge Base Section - Display Internal and External KB */}
      {page && (page.internalKnowledgeBase || page.externallKnowledgeBase) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Database className="size-5" />
            <h2 className="text-lg font-semibold text-foreground">
              Knowledge Base
            </h2>
            <p className="text-sm text-muted-foreground">
              Internal and external knowledge used for AI generation
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Internal Knowledge Base */}
            <InternalKnowledgeBaseDisplay
              internalKnowledgeBase={page.internalKnowledgeBase}
            />

            {/* External Knowledge Base */}
            <KnowledgeBaseDisplay
              externalKnowledgeBase={page.externallKnowledgeBase}
            />
          </div>
        </div>
      )}

      {/* Images Section - Extracted to separate component */}
      <PageImagesSection
        images={page.images}
        canEdit={systemFieldsHook.canEdit}
      />
    </div>
  );
}
