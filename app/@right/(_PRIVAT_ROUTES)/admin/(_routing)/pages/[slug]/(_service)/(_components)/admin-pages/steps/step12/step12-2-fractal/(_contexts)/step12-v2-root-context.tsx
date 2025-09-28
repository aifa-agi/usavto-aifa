// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_contexts)/step12-v2-root-context.tsx
/**
 * Step12 V2 Root Context - Updated for PageUploadPayload
 * AUTONOMOUS VERSION - integrates with SectionProvider for file system data
 * Replaces step12-root-context.tsx functionality for V2 architecture
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import type { JSONContent } from "@tiptap/react";
import {
    SectionStateV2,
    SectionEditorStateV2,
    SectionEditorApiV2,
    SectionEditorContextValueV2
} from "../(_types)/step12-v2-types";
import {
    fromExtendedSections,
    updateSectionV2WithContent,
    areAllSectionsReady
} from "../(_adapters)/sections-v2-mapper";
import { mergeDocs, findSectionV2ById } from "../(_utils)/step12-v2-sections-utils";
import { STEP12_V2_TEXTS } from "../(_constants)/step12-v2-texts";

// Import buttons provider for V2
import { Step12V2ButtonsProvider } from "./step12-v2-buttons-context";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { usePageSections } from "../../../../../../(_context)/section-provider";

interface Step12V2ContextType extends SectionEditorContextValueV2 {
    // Additional V2-specific properties
    hasValidSections: boolean;
    totalSections: number;
    allRefresh: number;
    refreshAll: () => void;
    page?: PageData;
    getActiveSection: () => SectionStateV2 | null;
    getSection: (sectionId: string) => SectionStateV2 | null;
}

const Step12V2Context = createContext<Step12V2ContextType | undefined>(undefined);

interface Step12V2ProviderProps {
    children: React.ReactNode;
    page?: PageData | null;
}

export function Step12V2Provider({ children, page }: Step12V2ProviderProps) {
    // Get sections from file system via SectionProvider
    const {
        sections: fileSections,
        loading: sectionsLoading,
        error: sectionsError
    } = usePageSections(page?.href);

    // Local state management
    const [sections, setSections] = useState<SectionStateV2[]>([]);
    const [activeId, setActiveId] = useState<string>("all");
    const [saving, setSaving] = useState<boolean>(false);
    const [allRefresh, setAllRefresh] = useState<number>(0);

    // Initialize sections from file system data
    const hasValidSections = useMemo(() => {
        return Boolean(fileSections && Array.isArray(fileSections) && fileSections.length > 0);
    }, [fileSections]);

    // Update sections when file system data changes
    // Update sections when file system data changes
    useEffect(() => {
        if (fileSections) {
            console.log('🔍 RAW fileSections received:', fileSections.length);
            fileSections.forEach((section, idx) => {
                console.log(`📋 Raw Section ${idx}:`, {
                    id: section.id,
                    hasBodyContent: !!section.bodyContent,
                    contentLength: section.bodyContent?.content?.length || 0,
                    contentTypes: section.bodyContent?.content?.map((item: any) => item.type) || []
                });

                // Специально ищем таблицы
                const hasTable = section.bodyContent?.content?.some((item: any) => item.type === 'table');
                if (hasTable) {
                    console.log(`🔍 TABLE DETECTED in raw section ${section.id}!`);
                    // Дополнительная информация о таблице с правильной типизацией
                    const tableItems = section.bodyContent.content.filter((item: any) => item.type === 'table');
                    tableItems.forEach((table: any, tableIdx: number) => {
                        console.log(`   Table ${tableIdx} rows:`, table.content?.length || 0);
                    });
                }
            });

            const newSections = fromExtendedSections(fileSections);
            console.log('🔄 MAPPED sections count:', newSections.length);

            newSections.forEach((section, idx) => {
                console.log(`📋 Mapped Section ${idx}:`, {
                    id: section.id,
                    hasContent: !!section.content,
                    hasData: section.hasData
                });

                // Проверяем не потерялись ли таблицы после маппинга
                if (section.content?.content) {
                    const contentTypes = section.content.content.map((item: any) => item.type);
                    const hasTable = contentTypes.includes('table');
                    if (hasTable) {
                        console.log(`✅ TABLE PRESERVED in mapped section ${section.id}!`);
                    } else {
                        // Ищем таблицы в исходной секции
                        const originalSection = fileSections.find(s => s.id === section.id);
                        const originalHasTable = originalSection?.bodyContent?.content?.some((item: any) => item.type === 'table');
                        if (originalHasTable) {
                            console.error(`❌ TABLE LOST during mapping for section ${section.id}!`);
                        }
                    }
                }
            });

            setSections(newSections);
            setActiveId("all");
            setAllRefresh(v => v + 1);
        } else {
            // Reset to empty state if no sections
            setSections([{
                id: "all",
                label: "All Sections",
                content: null,
                hasData: false,
                isLoading: false,
            }]);
        }
    }, [fileSections]);


    // Load individual section data (lazy loading simulation)
    const loadSectionData = useCallback(async (sectionId: string): Promise<void> => {
        if (!hasValidSections || sectionId === "all") return;

        // Mark section as loading
        setSections(prev => prev.map(section =>
            section.id === sectionId
                ? { ...section, isLoading: true }
                : section
        ));

        try {
            // Simulate loading delay for UX consistency with V1
            await new Promise(resolve => setTimeout(resolve, 300));

            // In V2, data is already available from file system
            // So we just update loading state
            setSections(prev => prev.map(section =>
                section.id === sectionId
                    ? { ...section, isLoading: false }
                    : section
            ));

        } catch (error) {
            console.error("Step12V2: Failed to load section data", error);
            setSections(prev => prev.map(section =>
                section.id === sectionId
                    ? { ...section, isLoading: false }
                    : section
            ));
        }
    }, [hasValidSections]);

    // Update section content from editor
    const updateSectionContent = useCallback((sectionId: string, content: JSONContent): void => {
        setSections(prev => updateSectionV2WithContent(prev, sectionId, content));
    }, []);

    // Set active section
    const setActive = useCallback((sectionId: string): void => {
        if (!hasValidSections && sectionId !== "all") return;
        setActiveId(sectionId);
    }, [hasValidSections]);

    // Reset all confirmation flags (called after successful save)
    const resetAllFlags = useCallback((): void => {
        setSections(prev => prev.map(section => ({
            ...section,
            hasData: Boolean(section.content),
        })));
    }, []);

    // Check if all sections are ready for save using imported function
    const isAllReady = useCallback((): boolean => {
        return hasValidSections && areAllSectionsReady(sections);
    }, [sections, hasValidSections]);

    // Get merged document for "all" view
    const getMergedDoc = useCallback((): JSONContent => {
        if (!hasValidSections) {
            return {
                type: "doc",
                content: [{
                    type: "paragraph",
                    content: [{ type: "text", text: STEP12_V2_TEXTS.placeholders?.noSectionsDisplay || "No sections available" }]
                }]
            };
        }

        const realSections = sections.filter(s => s.id !== "all" && s.content);

        if (realSections.length === 0) {
            return {
                type: "doc",
                content: [{
                    type: "paragraph",
                    content: [{ type: "text", text: STEP12_V2_TEXTS.placeholders?.sectionEmpty || "No content available" }]
                }]
            };
        }

        return mergeDocs(sections);
    }, [sections, hasValidSections]);

    // Refresh all sections (force re-render)
    const refreshAll = useCallback((): void => {
        setAllRefresh(v => v + 1);
    }, []);

    // Get active section
    const getActiveSection = useCallback((): SectionStateV2 | null => {
        return findSectionV2ById(sections, activeId);
    }, [sections, activeId]);

    // Get section by ID
    const getSection = useCallback((sectionId: string): SectionStateV2 | null => {
        return findSectionV2ById(sections, sectionId);
    }, [sections]);

    // Debug information for development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Step12V2Provider:', {
                hasValidSections,
                sectionsCount: sections.length,
                activeId,
                isReady: isAllReady(),
                pageHref: page?.href
            });
        }
    }, [hasValidSections, sections.length, activeId, isAllReady, page?.href]);

    // Context value
    const contextValue: Step12V2ContextType = useMemo(() => ({
        // Section editor state
        sections,
        activeId,
        saving: saving || sectionsLoading,

        // Section editor API
        setActive,
        loadSectionData,
        updateSectionContent,
        isAllReady,
        resetAllFlags,
        setSaving,
        getMergedDoc,

        // V2 additional properties
        hasValidSections,
        totalSections: sections.filter(s => s.id !== "all").length,
        allRefresh,
        refreshAll,
        page: page || undefined,
        getActiveSection,
        getSection,
    }), [
        sections,
        activeId,
        saving,
        sectionsLoading,
        setActive,
        loadSectionData,
        updateSectionContent,
        isAllReady,
        resetAllFlags,
        setSaving,
        getMergedDoc,
        hasValidSections,
        allRefresh,
        refreshAll,
        page,
        getActiveSection,
        getSection,
    ]);

    // Error boundary для sections loading
    if (sectionsError) {
        console.error('Step12V2Provider: Error loading sections:', sectionsError);
        return (
            <Step12V2Context.Provider value={{
                ...contextValue,
                sections: [{
                    id: "all",
                    label: "Error Loading Sections",
                    content: null,
                    hasData: false,
                    isLoading: false,
                }],
                hasValidSections: false,
                saving: false,
            }}>
                <Step12V2ButtonsProvider>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                        <h3 className="text-red-800 font-medium">Error Loading Sections</h3>
                        <p className="text-red-600 text-sm mt-1">
                            Failed to load sections from file system. Please try refreshing the page.
                        </p>
                    </div>
                    {children}
                </Step12V2ButtonsProvider>
            </Step12V2Context.Provider>
        );
    }

    return (
        <Step12V2Context.Provider value={contextValue}>
            <Step12V2ButtonsProvider>
                {children}
            </Step12V2ButtonsProvider>
        </Step12V2Context.Provider>
    );
}

export function useStep12V2Root(): Step12V2ContextType {
    const context = useContext(Step12V2Context);
    if (context === undefined) {
        throw new Error("useStep12V2Root must be used within a Step12V2Provider");
    }
    return context;
}

// Hook для упрощенного доступа к save функциональности
export function useStep12V2Save() {
    const context = useStep12V2Root();
    const { useStep12V2Save: saveHook } = require("../(_hooks)/use-step12-v2-save");

    return saveHook(
        context.sections,
        context.isAllReady,
        context.resetAllFlags,
        context.setSaving,
        context.page
    );
}

export { Step12V2Context };
export type { Step12V2ContextType };
