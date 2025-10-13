// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/step5.tsx

"use client";

/**
 * Step 5 - Content Structure Generation System with Internal AI
 * ✅ FIX: Removed conditional early returns after hooks to comply with React Rules of Hooks
 * ✅ NEW: Added Switch toggle to enable/disable predefined knowledge base mixing instruction
 * ✅ FIX: Replaced Checkbox with Switch to avoid MenuItem context conflicts
 * 
 * Functionality:
 * - Generate content structure using built-in AI model
 * - Personalization: writing style and content format
 * - Streaming output of generation results in real-time
 * - Save generated structure to draftContentStructure
 * - Toggle predefined instruction for mixing internal/external knowledge bases
 */

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Palette,
  MessageSquare,
  Edit3,
  Network,
  Target,
  Zap,
  Info,
} from "lucide-react";

import { PageNotFound } from "../../../page-not-found";
import { ContentStructureStreamCard } from "./components/content-structure-stream-card";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { useSystemInstructionGenerator } from "./(_hooks)/system-instruction-generator";
import { getPageTitleSafe } from "./(_utils)/step5-utils";
import { DEFAULT_KNOWLEDGE_BASE_MIXING_INSTRUCTION } from "@/config/knowledge-base-prompts";

interface AdminPageInfoProps {
  slug: string;
}

// Writing Style Options for Content Generation
const WRITING_STYLES = [
  { value: "narrative", label: "Narrative", description: "Story-driven, engaging storytelling approach" },
  { value: "artistic", label: "Artistic", description: "Creative, expressive, and imaginative tone" },
  { value: "humorous", label: "Humorous", description: "Light-hearted, entertaining, with wit and humor" },
  { value: "academic", label: "Academic", description: "Scholarly, research-based, formal approach" },
  { value: "conversational", label: "Conversational", description: "Friendly, informal, like talking to a friend" },
  { value: "inspirational", label: "Inspirational", description: "Motivating, uplifting, encouraging tone" },
  { value: "technical", label: "Technical", description: "Precise, detailed, expert-level information" },
  { value: "minimalist", label: "Minimalist", description: "Clean, concise, essential information only" },
  { value: "dramatic", label: "Dramatic", description: "Emotionally engaging, powerful storytelling" },
  { value: "educational", label: "Educational", description: "Teaching-focused, step-by-step learning approach" },
];

// Content Format Options for Delivery Style
const CONTENT_FORMATS = [
  { value: "simple", label: "Simple", description: "Easy to understand, basic language" },
  { value: "professional", label: "Professional", description: "Business-appropriate, formal tone" },
  { value: "first-person", label: "First Person", description: "Personal perspective, 'I' and 'my' approach" },
  { value: "expert", label: "Expert", description: "Authority-based, industry expertise" },
  { value: "beginner-friendly", label: "Beginner Friendly", description: "Accessible to newcomers, explained simply" },
  { value: "data-driven", label: "Data Driven", description: "Statistics, facts, and research-focused" },
  { value: "case-study", label: "Case Study", description: "Real examples and practical applications" },
  { value: "how-to", label: "How-To Guide", description: "Step-by-step instructional format" },
  { value: "comparison", label: "Comparison", description: "Pros/cons, before/after analysis" },
  { value: "listicle", label: "Listicle", description: "Organized in numbered or bulleted lists" },
];

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 ${props.className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AdminPageStep5({ slug }: AdminPageInfoProps) {
  const { categories, loading, initialized } = useNavigationMenu();

  // ✅ FIX: All hooks BEFORE any conditional returns
  // Personalization state
  const [writingStyle, setWritingStyle] = useState<string>("conversational");
  const [contentFormat, setContentFormat] = useState<string>("professional");
  const [customRequirements, setCustomRequirements] = useState<string>("");

  // ✅ NEW: State for Knowledge Base Mixing switch
  const [useKnowledgeBaseMixing, setUseKnowledgeBaseMixing] = useState<boolean>(false);

  // Find page data
  const pageData = useMemo(() => findPageBySlug(categories, slug), [categories, slug]);
  const page = pageData?.page;

  // ✅ FIX: useMemo for pageTitleText BEFORE any returns
  const pageTitleText = useMemo(
    () => getPageTitleSafe(page),
    [page?.title, page?.metadata?.title]
  );

  // ✅ NEW: Effect to sync switch state with textarea content
  // When switch is enabled, populate textarea with predefined instruction
  // When switch is disabled, clear textarea if it contains the predefined instruction
  useEffect(() => {
    if (useKnowledgeBaseMixing) {
      // Only set if textarea is empty or contains different content
      if (!customRequirements.trim() || customRequirements !== DEFAULT_KNOWLEDGE_BASE_MIXING_INSTRUCTION) {
        setCustomRequirements(DEFAULT_KNOWLEDGE_BASE_MIXING_INSTRUCTION);
      }
    } else {
      // Only clear if textarea contains exactly the predefined instruction
      if (customRequirements === DEFAULT_KNOWLEDGE_BASE_MIXING_INSTRUCTION) {
        setCustomRequirements("");
      }
    }
  }, [useKnowledgeBaseMixing]);

  // ✅ NEW: Handler for switch change
  const handleKnowledgeBaseMixingChange = (checked: boolean) => {
    setUseKnowledgeBaseMixing(checked);
  };

  // ✅ NEW: Handler for textarea manual changes
  // If user manually edits the textarea, disable the switch if content no longer matches
  const handleCustomRequirementsChange = (value: string) => {
    setCustomRequirements(value);

    // If user manually clears or changes content, disable the switch
    if (useKnowledgeBaseMixing && value !== DEFAULT_KNOWLEDGE_BASE_MIXING_INSTRUCTION) {
      setUseKnowledgeBaseMixing(false);
    }

    // If user manually pastes the exact predefined instruction, enable the switch
    if (!useKnowledgeBaseMixing && value === DEFAULT_KNOWLEDGE_BASE_MIXING_INSTRUCTION) {
      setUseKnowledgeBaseMixing(true);
    }
  };

  // Generate system instruction for AI model
  const systemInstruction = useSystemInstructionGenerator({
    pageData,
    slug,
    writingStyle,
    contentFormat,
    customRequirements,
    writingStyles: WRITING_STYLES,
    contentFormats: CONTENT_FORMATS,
  });

  // ✅ FIX: Conditional rendering via JSX (NO early returns after hooks)
  // Loading state
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading content structure system...</span>
      </div>
    );
  }

  // Page not found state
  if (!pageData) {
    return <PageNotFound slug={slug} />;
  }

  // ✅ Main UI (all hooks already called above)
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-violet-400">
                <PencilIcon />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground">
                    Content Structure Generation
                  </h2>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground line-clamp-2">
                    {pageTitleText}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  AI generates project structure using internal knowledge base, external
                  sources, and custom settings to create foundation for content generation.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personalization Controls */}
      <Card className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="size-5 text-primary" />
            <CardTitle className="text-lg truncate">Content Personalization</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            Configure writing style and content format for AI structure generation
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Writing Style Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <Label htmlFor="writing-style" className="text-sm font-medium truncate">
                  Writing Style
                </Label>
              </div>
              <Select value={writingStyle} onValueChange={setWritingStyle}>
                <SelectTrigger className="truncate">
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent>
                  {WRITING_STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value} className="truncate">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-left truncate">{style.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground truncate">
                {WRITING_STYLES.find((s) => s.value === writingStyle)?.description}
              </p>
            </div>

            {/* Content Format Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <Label htmlFor="content-format" className="text-sm font-medium truncate">
                  Content Format
                </Label>
              </div>
              <Select value={contentFormat} onValueChange={setContentFormat}>
                <SelectTrigger className="truncate">
                  <SelectValue placeholder="Select content format" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value} className="truncate">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-left truncate">{format.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground truncate">
                {CONTENT_FORMATS.find((f) => f.value === contentFormat)?.description}
              </p>
            </div>
          </div>

          {/* Custom Requirements Section */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <Edit3 className="size-4 text-primary" />
              <Label htmlFor="custom-requirements" className="text-sm font-medium truncate">
                Custom Requirements & Specifications
              </Label>
              <Badge variant="outline" className="text-xs">Optional</Badge>
            </div>

            {/* ✅ NEW: Knowledge Base Mixing Switch */}
            <div className="flex items-start justify-between space-x-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50 p-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="knowledge-base-mixing"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Use Knowledge Base Mixing Instruction
                  </Label>
                  <Info className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Activate this switch to enable the standard predefined instruction for mixing internal and external knowledge bases to generate original content. The instruction will automatically populate the text area below and will be removed if you disable this option.
                </p>
              </div>
              <Switch
                id="knowledge-base-mixing"
                checked={useKnowledgeBaseMixing}
                onCheckedChange={handleKnowledgeBaseMixingChange}
                className="mt-0.5"
              />
            </div>

            <Textarea
              id="custom-requirements"
              placeholder="Add specific requirements for content structure generation..."
              value={customRequirements}
              onChange={(e) => handleCustomRequirementsChange(e.target.value)}
              className="min-h-[200px] resize-y font-mono text-xs"
              disabled={useKnowledgeBaseMixing}
            />

            {useKnowledgeBaseMixing && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Info className="size-3" />
                <span>
                  Predefined instruction is active. Disable the switch above to edit manually.
                </span>
              </p>
            )}
          </div>

          {/* Configuration Summary */}
          <div className="mt-6 p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
            <h4 className="font-medium mb-3 text-foreground truncate">
              Generation Configuration
            </h4>
            <div className="text-sm text-foreground/80 space-y-1">
              <p className="truncate">
                <span className="font-medium">Style:</span> {WRITING_STYLES.find((s) => s.value === writingStyle)?.label} - {WRITING_STYLES.find((s) => s.value === writingStyle)?.description}
              </p>
              <p className="truncate">
                <span className="font-medium">Format:</span> {CONTENT_FORMATS.find((f) => f.value === contentFormat)?.label} - {CONTENT_FORMATS.find((f) => f.value === contentFormat)?.description}
              </p>
              <p className="truncate">
                <span className="font-medium">Current Structure:</span> {page?.aiRecommendContentStructure?.length || 0} existing elements
              </p>
              <p className="truncate">
                <span className="font-medium">Knowledge Base Mixing:</span> {useKnowledgeBaseMixing ? "Enabled (Predefined)" : "Disabled"}
              </p>
              {customRequirements.trim() && !useKnowledgeBaseMixing && (
                <p className="truncate">
                  <span className="font-medium">Custom Requirements:</span> {customRequirements.trim().length} characters specified
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Generation Card */}
      <Card className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Target className="size-6 text-primary shrink-0" />
              <CardTitle className="text-xl truncate">
                AI Content Structure Generation
              </CardTitle>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-muted-foreground border-border bg-background/60 dark:bg-background/30">
              <Network className="size-3" />
              <span className="truncate">Internal Model</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed truncate">
            Stream content structure using the internal AI model; the output area below will display results in real time during generation
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Page Info Summary */}
          <div className="rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium mb-3 text-foreground truncate">
              Page Data for Structure Generation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="truncate">
                <span className="text-muted-foreground">Title:</span>
                <span className="ml-2 font-medium">{page?.title || ""}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Slug:</span>
                <span className="ml-2 font-mono bg-background px-2 py-1 rounded">{slug}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">{page?.type}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Keywords:</span>
                <span className="ml-2">{page?.keywords?.length ? `${page.keywords.length} keywords` : "None"}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Images:</span>
                <span className="ml-2">{page?.images?.length || 0} images</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Current Structure:</span>
                <span className="ml-2">{page?.aiRecommendContentStructure?.length || 0} elements</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Intent:</span>
                <span className="ml-2">{page?.intent}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Taxonomy:</span>
                <span className="ml-2">{page?.taxonomy}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Audiences:</span>
                <span className="ml-2">{page?.audiences}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Writing Style:</span>
                <span className="ml-2">{WRITING_STYLES.find((s) => s.value === writingStyle)?.label}</span>
              </div>
              <div className="truncate">
                <span className="text-muted-foreground">Content Format:</span>
                <span className="ml-2">{CONTENT_FORMATS.find((f) => f.value === contentFormat)?.label}</span>
              </div>
            </div>
          </div>

          {/* Generation Area - Streaming Component */}
          <div className="space-y-3">
            <Label className="text-sm font-medium truncate">
              AI Structure Generation Output
            </Label>

            <ContentStructureStreamCard
              pageData={pageData}
              slug={slug}
              writingStyle={writingStyle}
              contentFormat={contentFormat}
              customRequirements={customRequirements}
              writingStyles={WRITING_STYLES}
              contentFormats={CONTENT_FORMATS}
              onStreamCompleted={(structure) => {
                console.log("Stream completed with structure:", structure);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
