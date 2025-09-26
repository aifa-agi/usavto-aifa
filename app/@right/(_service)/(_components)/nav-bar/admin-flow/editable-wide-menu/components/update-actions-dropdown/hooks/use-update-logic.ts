
import { useCallback } from "react";
import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { PageData, PageType } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";

import { transliterate } from "@/lib/utils/transliterate";

/**
 * Преобразует PageType в URL-префикс (kebab-case).
 * @param pageType - Тип страницы.
 * @returns Строка префикса или пустая строка для корневых/кастомных категорий.
 */
function getPageTypePrefix(pageType: PageType): string {
  if (pageType === "rootCategorias" || pageType === "customCategorias") {
    return "";
  }
  return pageType.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

interface UseUpdateLogicProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

interface UseUpdateLogicReturn {
  handleRename: () => void;
  handleDelete: () => void;
}


export function useUpdateLogic({
  singlePage,
  categoryTitle,
  setCategories,
}: UseUpdateLogicProps): UseUpdateLogicReturn {
  const dialogs = useDialogs();

  

 
  const handleRename = useCallback(() => {
    dialogs.show({
      type: "edit",
      inputType: "input",
      title: "Rename link name",
      description: singlePage.title,
      value: singlePage.title,
      placeholder: "Enter new page title...",
      confirmLabel: "Save changes",
      cancelLabel: "Cancel",
      onConfirm: (value) => {
        const newTitle = value?.trim();
        if (!newTitle) return;

        const newSlug = transliterate(newTitle);
        const pageType = singlePage.type;
        const categorySlug = transliterate(categoryTitle);

        let newHref = "";

        if (pageType === "rootCategorias") {
          newHref = `/${newSlug}`;
        } else if (pageType === "customCategorias") {
          newHref = `/${categorySlug}/${newSlug}`;
        } else {
          const prefix = getPageTypePrefix(pageType);
          newHref = `/${prefix}/${categorySlug}/${newSlug}`;
        }

        setCategories((prev) =>
          prev.map((cat) =>
            cat.title !== categoryTitle
              ? cat
              : {
                  ...cat,
                  pages: cat.pages.map((l) =>
                    l.id === singlePage.id
                      ? {
                          ...l,
                          title: newTitle,
                          href: newHref,
                        }
                      : l
                  ),
                }
          )
        );
      },
    });
  }, [singlePage, categoryTitle, setCategories, dialogs]);
  
 

  const handleDelete = useCallback(() => {
    dialogs.show({
      type: "delete",
      title: "Delete page",
      description: `Are you sure you want to delete page "${singlePage.title}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: () => {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.title !== categoryTitle
              ? cat
              : {
                  ...cat,
                  pages: cat.pages.filter((l) => l.id !== singlePage.id),
                }
          )
        );
      },
    });
  }, [singlePage.id, singlePage.title, categoryTitle, setCategories, dialogs]);

  return {
    handleRename,
    handleDelete,
  };
}
