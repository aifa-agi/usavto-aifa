// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_context)/section-provider.tsx

"use client";

import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from "react";
import { findPageBySlug } from "../(_utils)/page-helpers";

// Интерфейсы и reducer остаются без изменений
interface SectionState {
  sections: Record<string, ExtendedSection[]>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  lastLoaded: Record<string, number>;
}

type SectionAction =
  | { type: "LOAD_START"; href: string }
  | { type: "LOAD_SUCCESS"; href: string; sections: ExtendedSection[] }
  | { type: "LOAD_ERROR"; href: string; error: string }
  | { type: "UPDATE_SECTIONS"; href: string; sections: ExtendedSection[] }
  | { type: "CLEAR_CACHE"; href?: string }
  | { type: "INVALIDATE_CACHE"; href: string }
  | { type: "CLEAR_ERROR"; href: string };

interface SectionContextValue {
  sections: Record<string, ExtendedSection[]>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  loadSections: (
    href: string,
    force?: boolean
  ) => Promise<ExtendedSection[] | null>;
  updateSections: (href: string, sections: ExtendedSection[]) => void;
  getSections: (href: string) => ExtendedSection[] | null;
  clearCache: (href?: string) => void;
  invalidateCache: (href: string) => void;
  clearError: (href: string) => void;
  isSectionsLoaded: (href: string) => boolean;
  isLoading: (href: string) => boolean;
  hasError: (href: string) => boolean;
  getError: (href: string) => string | null;
  getCacheTimestamp: (href: string) => number | null;
}

interface ApiReadResponse {
  success: boolean;
  message: string;
  sections?: ExtendedSection[];
}

const initialState: SectionState = {
  sections: {},
  loading: {},
  errors: {},
  lastLoaded: {},
};

function sectionReducer(
  state: SectionState,
  action: SectionAction
): SectionState {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        loading: { ...state.loading, [action.href]: true },
        errors: { ...state.errors, [action.href]: null },
      };
    case "LOAD_SUCCESS":
      return {
        ...state,
        sections: { ...state.sections, [action.href]: action.sections },
        loading: { ...state.loading, [action.href]: false },
        errors: { ...state.errors, [action.href]: null },
        lastLoaded: { ...state.lastLoaded, [action.href]: Date.now() },
      };
    case "LOAD_ERROR":
      return {
        ...state,
        loading: { ...state.loading, [action.href]: false },
        errors: { ...state.errors, [action.href]: action.error },
      };
    case "UPDATE_SECTIONS":
      return {
        ...state,
        sections: { ...state.sections, [action.href]: action.sections },
        lastLoaded: { ...state.lastLoaded, [action.href]: Date.now() },
        errors: { ...state.errors, [action.href]: null },
      };
    case "CLEAR_CACHE":
      if (action.href) {
        const newState = { ...state };
        delete newState.sections[action.href];
        delete newState.loading[action.href];
        delete newState.errors[action.href];
        delete newState.lastLoaded[action.href];
        return newState;
      } else {
        return initialState;
      }
    case "INVALIDATE_CACHE":
      const newState = { ...state };
      delete newState.lastLoaded[action.href];
      return newState;
    case "CLEAR_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.href]: null },
      };
    default:
      return state;
  }
}

const SectionContext = createContext<SectionContextValue | undefined>(undefined);

interface SectionProviderProps {
  children: React.ReactNode;
  cacheTimeout?: number;
  debug?: boolean;
  slug?: string;
}

export function SectionProvider({
  children,
  cacheTimeout = 5 * 60 * 1000,
  debug = false,
  slug,
}: SectionProviderProps) {
  const [state, dispatch] = useReducer(sectionReducer, initialState);
  const { categories, initialized } = useNavigationMenu();
  const [pageHref, setPageHref] = useState<string | null>(null);

  // ===================== ИСПРАВЛЕНИЕ ЗДЕСЬ =====================
  // Эта функция больше не обрезает путь. Она просто убирает
  // начальный слэш, если он есть, и возвращает путь как есть.
  const getFilePath = useCallback((href: string): string => {
    return href.startsWith("/") ? href.slice(1) : href;
  }, []);
  // =============================================================

  const isCacheValid = useCallback(
    (href: string): boolean => {
      const lastLoaded = state.lastLoaded[href];
      if (!lastLoaded) return false;
      return Date.now() - lastLoaded < cacheTimeout;
    },
    [state.lastLoaded, cacheTimeout]
  );

  const loadSections = useCallback(async (
    href: string,
    force: boolean = false
  ): Promise<ExtendedSection[] | null> => {
    if (!href) return null;
    if (!force && state.sections[href] && isCacheValid(href)) {
      return state.sections[href];
    }
    if (state.loading[href]) return null;

    dispatch({ type: "LOAD_START", href });
    try {
      const filePath = getFilePath(href);
      if (!filePath) {
        throw new Error(`Could not generate a valid file path from href: ${href}`);
      }

      const response = await fetch(`/api/sections/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) {
        // Успешный ответ, даже если файл не найден (возвращает success: true, sections: [])
        const errorText = await response.text();
        if (response.status === 404 || response.status === 400) {
          console.warn(`Server responded with ${response.status} for ${filePath}. Treating as empty.`);
          dispatch({ type: "LOAD_SUCCESS", href, sections: [] });
          return [];
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const result: ApiReadResponse = await response.json();
      if (!result.success) {
        // Если API явно говорит об ошибке
        throw new Error(result.message || 'API returned success: false');
      }

      const sections = result.sections || [];
      dispatch({ type: "LOAD_SUCCESS", href, sections });
      return sections;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      dispatch({ type: "LOAD_ERROR", href, error: errorMessage });
      if (debug) console.error(`SectionProvider: Error loading sections for ${href}`, error);
      return null;
    }
  }, [state.sections, state.loading, isCacheValid, getFilePath, debug]);

  useEffect(() => {
    if (slug && initialized && categories.length > 0) {
      const searchResult = findPageBySlug(categories, slug);
      const newHref = searchResult && 'page' in searchResult ? searchResult.page.href : null;

      if (newHref) {
        setPageHref(newHref);
        if (!state.loading[newHref] && !isCacheValid(newHref)) {
          loadSections(newHref);
        }
      } else {
        if (debug) console.warn(`SectionProvider: Page not found for slug: "${slug}"`);
        setPageHref(null);
      }
    }
  }, [slug, categories, initialized, debug, loadSections, isCacheValid, state.loading]);

  const updateSections = useCallback((href: string, sections: ExtendedSection[]) => {
    if (!Array.isArray(sections)) return;
    dispatch({ type: "UPDATE_SECTIONS", href, sections });
  }, []);

  const getSections = useCallback((href: string): ExtendedSection[] | null => {
    return state.sections[href] || null;
  }, [state.sections]);

  const clearCache = useCallback((href?: string) => {
    dispatch({ type: "CLEAR_CACHE", href });
  }, []);

  const invalidateCache = useCallback((href: string) => {
    dispatch({ type: "INVALIDATE_CACHE", href });
  }, []);

  const clearError = useCallback((href: string) => {
    dispatch({ type: "CLEAR_ERROR", href });
  }, []);

  const isSectionsLoaded = useCallback((href: string): boolean => {
    return !!state.sections[href] && isCacheValid(href);
  }, [state.sections, isCacheValid]);

  const isLoading = useCallback((href: string): boolean => {
    return !!state.loading[href];
  }, [state.loading]);

  const hasError = useCallback((href: string): boolean => {
    return !!state.errors[href];
  }, [state.errors]);

  const getError = useCallback((href: string): string | null => {
    return state.errors[href] || null;
  }, [state.errors]);

  const getCacheTimestamp = useCallback((href: string): number | null => {
    return state.lastLoaded[href] || null;
  }, [state.lastLoaded]);

  const contextValue: SectionContextValue = {
    sections: state.sections,
    loading: state.loading,
    errors: state.errors,
    loadSections,
    updateSections,
    getSections,
    clearCache,
    invalidateCache,
    clearError,
    isSectionsLoaded,
    isLoading,
    hasError,
    getError,
    getCacheTimestamp,
  };

  return (
    <SectionContext.Provider value={contextValue}>
      {children}
    </SectionContext.Provider>
  );
}

// Остальные хуки (useSections, usePageSections и т.д.) остаются без изменений.
export function useSections() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error("useSections must be used within a SectionProvider");
  }
  return context;
}

export function usePageSections(href?: string) {
  const context = useSections();
  const [autoLoaded, setAutoLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!href) return;
    const shouldLoad = !autoLoaded && !context.isSectionsLoaded(href) && !context.isLoading(href);
    if (shouldLoad) {
      context.loadSections(href).then(() => setAutoLoaded(true));
    }
  }, [href, context, autoLoaded]);

  const reload = React.useCallback(() => {
    if (!href) return Promise.resolve();
    setAutoLoaded(false);
    return context.loadSections(href, true);
  }, [href, context]);

  const update = React.useCallback(
    (sections: ExtendedSection[]) => {
      if (!href) return;
      context.updateSections(href, sections);
    },
    [href, context]
  );

  return {
    sections: href ? context.getSections(href) : null,
    loading: href ? context.isLoading(href) : false,
    error: href ? context.getError(href) : null,
    isLoaded: href ? context.isSectionsLoaded(href) : false,
    reload,
    update,
  };
}

export function useMultiPageSections(hrefs: string[]) {
  const context = useSections();
  const loadMultiple = React.useCallback(async (force = false) => {
    const promises = hrefs.map((href) => context.loadSections(href, force));
    return await Promise.allSettled(promises);
  }, [hrefs, context]);

  const sectionsMap = React.useMemo(() => {
    const map: Record<string, ExtendedSection[] | null> = {};
    hrefs.forEach((href) => { map[href] = context.getSections(href); });
    return map;
  }, [hrefs, context]);

  return { sectionsMap, loadMultiple };
}

export type { SectionContextValue, ExtendedSection };
