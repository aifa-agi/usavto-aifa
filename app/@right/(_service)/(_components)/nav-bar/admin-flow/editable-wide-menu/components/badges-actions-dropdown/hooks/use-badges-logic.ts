// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/badges-actions-dropdown/hooks/use-badges-logic.ts

import { useCallback } from "react";
import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { PageData, PageType } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { transliterate } from "@/lib/utils/transliterate";
import { BadgeName } from "@/config/pages-config/badges/badge-config";
import { UserType } from "@prisma/client";

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

interface UseBadgesLogicProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

interface UseBadgesLogicReturn {
  handleToggleRole: (role: UserType) => void;
  handleToggleBadge: (badge: BadgeName) => void;
  handleRename: () => void;
  handleDelete: () => void;
  handlePageTypeChange: (newPageType: PageType) => void; // Добавили новую функцию
}

/**
 * Custom hook to handle badges and roles management logic
 */
export function useBadgesLogic({
  singlePage,
  categoryTitle,
  setCategories,
}: UseBadgesLogicProps): UseBadgesLogicReturn {
  const dialogs = useDialogs();

  const handleToggleRole = useCallback(
    (role: UserType) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((l) =>
                  l.id !== singlePage.id
                    ? l
                    : {
                        ...l,
                        roles: l.roles.includes(role)
                          ? l.roles.filter((r) => r !== role)
                          : [...l.roles, role],
                      }
                ),
              }
        )
      );
    },
    [singlePage.id, categoryTitle, setCategories]
  );

  const handleToggleBadge = useCallback(
    (badge: BadgeName) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((l) =>
                  l.id !== singlePage.id
                    ? l
                    : {
                        ...l,
                        hasBadge:
                          l.hasBadge && l.badgeName === badge ? false : true,
                        badgeName:
                          l.hasBadge && l.badgeName === badge
                            ? undefined
                            : badge,
                      }
                ),
              }
        )
      );
    },
    [singlePage.id, categoryTitle, setCategories]
  );

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
  
  const handlePageTypeChange = useCallback(
    (newPageType: PageType) => {
      // ИСПРАВЛЕНИЕ: Используем оператор `??` для безопасной работы с возможно undefined href.
      const currentHref = singlePage.href ?? "";
      const slug = currentHref.split("/").pop() || "";
  
      if (!slug) {
        console.error("Could not extract slug from href:", currentHref);
        return; // Прерываем выполнение, если slug не найден
      }
  
      const categorySlug = transliterate(categoryTitle);
      let newHref = "";
  
      if (newPageType === "rootCategorias") {
        newHref = `/${slug}`;
      } else if (newPageType === "customCategorias") {
        newHref = `/${categorySlug}/${slug}`;
      } else {
        const prefix = getPageTypePrefix(newPageType);
        newHref = `/${prefix}/${categorySlug}/${slug}`;
      }
  
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((p) =>
                  p.id !== singlePage.id
                    ? p
                    : {
                        ...p,
                        type: newPageType,
                        href: newHref,
                      }
                ),
              }
        )
      );
    },
    [singlePage, categoryTitle, setCategories]
  );

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
    handleToggleRole,
    handleToggleBadge,
    handleRename,
    handleDelete,
    handlePageTypeChange,
  };
}
