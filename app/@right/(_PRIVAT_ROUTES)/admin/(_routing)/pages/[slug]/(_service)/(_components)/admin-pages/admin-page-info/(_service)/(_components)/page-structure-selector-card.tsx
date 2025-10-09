// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_components)/page-structure-selector-card.tsx

'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Layers3, Rows3, Rows4, FileText } from 'lucide-react';
import { toast } from 'sonner';

// App context for categories update
import { useNavigationMenu } from '@/app/@right/(_service)/(_context)/nav-bar-provider';

// Preset structures exported as arrays RootContentStructure[]
import { COMPACT_CONTENT_STRUCTURE } from '@/config/compact-page-structure-config';
import { MEDIUM_CONTENT_STRUCTURE } from '@/config/medium-page-structure-config';
import { DEFAULT_CONTENT_STRUCTURE } from '@/config/default-page-structure-config';

// Types
import type { PageData, RootContentStructure } from '@/app/@right/(_service)/(_types)/page-types';
import { LONG_READ_CONTENT_STRUCTURE } from '@/config/long-read-page-structure-config';

type StructureKey = 'compact' | 'medium' | 'expanded' | 'longread';

// Use presets directly as arrays (no extra brackets)
const STRUCTURE_PRESETS: Record<StructureKey, RootContentStructure[]> = {
    compact: COMPACT_CONTENT_STRUCTURE,
    medium: MEDIUM_CONTENT_STRUCTURE,
    expanded: DEFAULT_CONTENT_STRUCTURE, // 7 sections preset
    longread: LONG_READ_CONTENT_STRUCTURE, // 9 sections preset
};

/**
 * Simply count the number of elements in the array
 * Each element in aiRecommendContentStructure array = 1 section
 * No need to look for nested children, just array.length
 */
function getSectionsCount(
    struct?: RootContentStructure[] | null,
): number {
    if (!struct || !Array.isArray(struct)) {
        console.warn('⚠️ [PageStructureSelector] Structure is not an array:', struct);
        return 0;
    }

    const count = struct.length;
    console.log('✅ [PageStructureSelector] Counted sections:', count);
    return count;
}

/**
 * Detect current preset key by array length
 * 3 objects = compact
 * 5 objects = medium
 * 7 objects = expanded
 * 9 objects = longread
 */
function detectCurrentKey(
    struct?: RootContentStructure[] | null,
): StructureKey | null {
    const count = getSectionsCount(struct);

    console.log('🔍 [PageStructureSelector] Detecting key from count:', count);

    if (count === 3) return 'compact';
    if (count === 5) return 'medium';
    if (count === 7) return 'expanded';
    if (count === 10) return 'longread';

    console.warn('⚠️ [PageStructureSelector] Unknown sections count:', count);
    return null;
}

// Render label text for a given key
function keyToLabel(key: StructureKey): string {
    switch (key) {
        case 'compact':
            return 'Compact page (3 sections, ~1,700 words)';
        case 'medium':
            return 'Medium page (5 sections,~ 2,850 words)';
        case 'expanded':
            return 'Expanded page (7 sections, ~6,280 words)';
        case 'longread':
            return 'Long-read page (10 sections, ~12,475 words)';
    }
}

export interface PageStructureSelectorCardProps {
    // Current page and category title are needed to update in the menu tree
    page: PageData;
    categoryTitle: string;
}

export function PageStructureSelectorCard({
    page,
    categoryTitle,
}: PageStructureSelectorCardProps) {
    const {
        setCategories,
        updateCategories,
        serverCategoriesRef, // for rollback to last good server state
        loading,
    } = useNavigationMenu();

    // Debug: Log initial structure on mount
    React.useEffect(() => {
        console.log('🚀 [PageStructureSelector] Component mounted:', {
            pageId: page.id,
            hasStructure: !!page.aiRecommendContentStructure,
            isArray: Array.isArray(page.aiRecommendContentStructure),
            arrayLength: Array.isArray(page.aiRecommendContentStructure)
                ? page.aiRecommendContentStructure.length
                : 'N/A',
        });
    }, [page.id]);

    // Derive initial selection key from array length
    const initialKey = React.useMemo(
        () => detectCurrentKey(page?.aiRecommendContentStructure),
        [page?.aiRecommendContentStructure],
    );

    const [selected, setSelected] = React.useState<StructureKey | null>(initialKey);
    const [isSaving, setIsSaving] = React.useState(false);

    // Keep local state in sync with external page updates
    React.useEffect(() => {
        const detectedKey = detectCurrentKey(page?.aiRecommendContentStructure);
        console.log('🔄 [PageStructureSelector] Syncing selection:', {
            previousKey: selected,
            detectedKey,
            arrayLength: page?.aiRecommendContentStructure?.length,
        });
        setSelected(detectedKey);
    }, [page?.aiRecommendContentStructure]);

    // Persist selection to aiRecommendContentStructure as an array preset
    const persistSelection = React.useCallback(
        async (key: StructureKey) => {
            if (!page?.id) {
                toast.error('Page data is not available for saving.');
                return;
            }

            const presetArray = STRUCTURE_PRESETS[key]; // RootContentStructure[]

            console.log('💾 [PageStructureSelector] Saving preset:', {
                key,
                presetLength: presetArray.length,
            });

            const updatedPage: PageData = {
                ...page,
                aiRecommendContentStructure: presetArray,
            };

            setIsSaving(true);
            const prevSnapshot = serverCategoriesRef.current;

            // Optimistic update in categories tree
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.title !== categoryTitle
                        ? cat
                        : {
                            ...cat,
                            pages: cat.pages.map((p) => (p.id !== page.id ? p : updatedPage)),
                        },
                ),
            );

            // Persist to backend
            const err = await updateCategories();
            if (err) {
                // Rollback to last known good server snapshot
                setCategories(JSON.parse(JSON.stringify(prevSnapshot)));
                toast.error(
                    `Failed to update page structure. ${err.userMessage ?? 'Please try again.'}`,
                );
                setIsSaving(false);
                return;
            }

            toast.success('Page structure updated successfully.');
            setIsSaving(false);
        },
        [page, categoryTitle, setCategories, updateCategories, serverCategoriesRef],
    );

    // Handle user click
    const handleSelect = async (key: StructureKey) => {
        if (isSaving || loading) return;
        if (selected === key) return;

        console.log('🎯 [PageStructureSelector] User selected:', key);

        setSelected(key);
        await persistSelection(key);
    };

    const activeKey = selected;

    // Calculate planned count from active preset or current structure
    const plannedCount = activeKey
        ? getSectionsCount(STRUCTURE_PRESETS[activeKey])
        : getSectionsCount(page?.aiRecommendContentStructure);

    console.log('🎨 [PageStructureSelector] Render:', {
        activeKey,
        plannedCount,
        currentArrayLength: page?.aiRecommendContentStructure?.length,
    });

    return (
        <Card className="transition-all duration-200">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Layers3 className="size-4" />
                    Page Structure
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                    Choose how many top-level sections the page will include. The selection is saved immediately.
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Vertical button stack */}
                <div className="flex flex-col gap-2">
                    <Button
                        variant={activeKey === 'compact' ? 'default' : 'outline'}
                        className="justify-start"
                        disabled={isSaving || loading}
                        onClick={() => handleSelect('compact')}
                    >
                        <Rows3 className="size-4 mr-2" />
                        {keyToLabel('compact')}
                    </Button>
                    <Button
                        variant={activeKey === 'medium' ? 'default' : 'outline'}
                        className="justify-start"
                        disabled={isSaving || loading}
                        onClick={() => handleSelect('medium')}
                    >
                        <Rows4 className="size-4 mr-2" />
                        {keyToLabel('medium')}
                    </Button>
                    <Button
                        variant={activeKey === 'expanded' ? 'default' : 'outline'}
                        className="justify-start"
                        disabled={isSaving || loading}
                        onClick={() => handleSelect('expanded')}
                    >
                        <Layers3 className="size-4 mr-2" />
                        {keyToLabel('expanded')}
                    </Button>
                    <Button
                        variant={activeKey === 'longread' ? 'default' : 'outline'}
                        className="justify-start"
                        disabled={isSaving || loading}
                        onClick={() => handleSelect('longread')}
                    >
                        <FileText className="size-4 mr-2" />
                        {keyToLabel('longread')}
                    </Button>
                </div>

                {/* Dynamic helper hint */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="size-4 flex-shrink-0" />
                    <span>
                        This preset will generate {plannedCount} top-level sections on the page.
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

export default PageStructureSelectorCard;
