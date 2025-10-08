// @/app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/hooks/use-page-actions.ts

import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { PageActionsHook } from "../types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import {
  PageData,
  PageType,
} from "@/app/@right/(_service)/(_types)/page-types";

interface UsePageActionsProps {
  singlePage: PageData;
  categoryTitle: string;
  categories?: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  getCurrentPageData: () => PageData;
}

export function usePageActions({
  singlePage,
  categoryTitle,
  setCategories,
  getCurrentPageData,
}: UsePageActionsProps): PageActionsHook {
  const dialogs = useDialogs();

  // Update page data in categories
  const updatePageInCategories = (
    pageId: string,
    updates: Partial<PageData>
  ) => {
    if (!categoryTitle) return;

    setCategories((prev) => {
      if (!Array.isArray(prev)) return prev;

      return prev.map((cat) =>
        cat.title !== categoryTitle
          ? cat
          : {
              ...cat,
              pages: cat.pages.map((page) =>
                page.id !== pageId ? page : { ...page, ...updates }
              ),
            }
      );
    });
  };

  // Page type handlers
  const handleSetPageType = (type: PageType) => {
    updatePageInCategories(singlePage.id, { type });
  };

  const isPageTypeActive = (type: PageType) => {
    const currentPage = getCurrentPageData();
    return currentPage.type === type;
  };

  // Content handlers
  const handleAddTitle = () => {
    if (!categoryTitle) return;

    const currentPage = getCurrentPageData();

    dialogs.show({
      type: currentPage.title ? "edit" : "create",
      title: currentPage.title ? "Edit Page Title" : "Add Page Title",
      description: currentPage.title
        ? `Current title: "${currentPage.title}"`
        : "Enter a title for this page",
      value: currentPage.title || "",
      placeholder: "Enter page title...",
      confirmLabel: currentPage.title ? "Update Title" : "Add Title",
      onConfirm: (value) => {
        if (!value?.trim()) return;
        updatePageInCategories(singlePage.id, { title: value.trim() });
      },
    });
  };

  const handleAddDescription = () => {
    if (!categoryTitle) return;

    const currentPage = getCurrentPageData();

    dialogs.show({
      type: currentPage.description ? "edit" : "create",
      inputType: "textarea",
      title: currentPage.description
        ? "Edit Page Description"
        : "Add Page Description",
      description: currentPage.description
        ? "Update the page description"
        : "Enter a description for this page",
      value: currentPage.description || "",
      placeholder: "Enter page description...",
      confirmLabel: currentPage.description
        ? "Update Description"
        : "Add Description",
      onConfirm: (value) => {
        if (!value?.trim()) return;
        updatePageInCategories(singlePage.id, { description: value.trim() });
      },
    });
  };

  const handleAddKeywords = () => {
    if (!categoryTitle) return;

    const currentPage = getCurrentPageData();

    dialogs.show({
      type: currentPage.keywords?.length ? "edit" : "create",
      inputType: "keywords",
      title: currentPage.keywords?.length ? "Edit Keywords" : "Add Keywords",
      description: currentPage.keywords?.length
        ? `Current keywords: ${currentPage.keywords.length} keyword${currentPage.keywords.length > 1 ? "s" : ""}`
        : "Enter keywords for this page to improve SEO",
      keywords: currentPage.keywords?.length
        ? [...currentPage.keywords]
        : [""],
      confirmLabel: currentPage.keywords?.length
        ? "Update Keywords"
        : "Add Keywords",
      onConfirm: (_, keywords) => {
        updatePageInCategories(singlePage.id, {
          keywords: keywords && keywords.length > 0 ? keywords : [],
        });
      },
    });
  };

  const handleAddImages = () => {
    if (!categoryTitle) return;

    const currentPage = getCurrentPageData();

    dialogs.show({
      type: currentPage.images?.length ? "edit" : "create",
      inputType: "images",
      title: currentPage.images?.length ? "Edit Images" : "Add Images",
      description: currentPage.images?.length
        ? `Current images: ${currentPage.images.length} image${currentPage.images.length > 1 ? "s" : ""}`
        : "Add images with alt descriptions and links for better SEO and user experience",
      images: currentPage.images?.length
        ? [...currentPage.images]
        : undefined,
      confirmLabel: currentPage.images?.length
        ? "Update Images"
        : "Add Images",
      onConfirm: (_, __, images) => {
        updatePageInCategories(singlePage.id, {
          images: images && images.length > 0 ? images : [],
        });
      },
    });
  };

  // NEW: Internal Knowledge Base handler with multi-step process
  // Uses knowledge-base input type to generate system instruction and collect AI response
  const handleAddInternalKnowledge = () => {
    if (!categoryTitle) return;

    const currentPage = getCurrentPageData();
    const isEditMode = Boolean(currentPage.internalKnowledgeBase?.trim());

    dialogs.show({
      type: isEditMode ? "edit" : "create",
      inputType: "knowledge-base",
      title: isEditMode
        ? "Edit Internal Knowledge Base"
        : "Add Internal Knowledge Base",
      description: isEditMode
        ? "Update your internal knowledge base content"
        : "Generate system instruction and paste it into the AI chat on the left side",
      knowledgeBase: {
        knowledgeType: "internal",
        pageData: {
          title: currentPage.title || "",
          description: currentPage.description || "",
          keywords: currentPage.keywords || [],
        },
        initialValue: currentPage.internalKnowledgeBase || "",
        showInfoButton: true,
      },
      confirmLabel: isEditMode
        ? "Update Internal Knowledge"
        : "Add Internal Knowledge",
      onConfirm: (value) => {
        // Save the knowledge base content
        updatePageInCategories(singlePage.id, {
          internalKnowledgeBase: value?.trim() || "",
        });
      },
    });
  };

  // NEW: External Knowledge Base handler with multi-step process
  // Uses knowledge-base input type to generate system instruction and collect AI response
  const handleAddExternalKnowledge = () => {
    if (!categoryTitle) return;

    const currentPage = getCurrentPageData();
    const isEditMode = Boolean(currentPage.externallKnowledgeBase?.trim());

    dialogs.show({
      type: isEditMode ? "edit" : "create",
      inputType: "knowledge-base",
      title: isEditMode
        ? "Edit External Knowledge Base"
        : "Add External Knowledge Base",
      description: isEditMode
        ? "Update your external knowledge base content"
        : "Generate system instruction for external research and paste the response here",
      knowledgeBase: {
        knowledgeType: "external",
        pageData: {
          title: currentPage.title || "",
          description: currentPage.description || "",
          keywords: currentPage.keywords || [],
        },
        initialValue: currentPage.externallKnowledgeBase || "",
        showInfoButton: true,
      },
      confirmLabel: isEditMode
        ? "Update External Knowledge"
        : "Add External Knowledge",
      onConfirm: (value) => {
        // Save the knowledge base content
        updatePageInCategories(singlePage.id, {
          externallKnowledgeBase: value?.trim() || "",
        });
      },
    });
  };

  const handleAddPageCode = () => {
    console.log("Add page code for:", singlePage.id);
  };

  return {
    handleAddTitle,
    handleAddDescription,
    handleAddKeywords,
    handleAddImages,
    handleAddInternalKnowledge, // NEW: Updated with knowledge-base logic
    handleAddExternalKnowledge, // NEW: Updated with knowledge-base logic
    handleAddPageCode,
    handleSetPageType,
    isPageTypeActive,
  };
}
