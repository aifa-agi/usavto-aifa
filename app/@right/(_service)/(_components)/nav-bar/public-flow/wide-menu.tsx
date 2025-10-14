// @/app/@right/(_service)/(_components)/nav-bar/public-flow/wide-menu.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { MenuCategory } from "../../../(_types)/menu-types";
import { useTranslation } from "../../../(_libs)/translation";
import { PageData } from "../../../(_types)/page-types";
import { humanize } from "../../../(_libs)/humanize";
import { ModeToggle } from "../../shared/mode-toggle";
import { UserType } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

interface WideMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  categories: MenuCategory[];
}

const greenDotClass = "bg-emerald-500";
const MAX_VISIBLE_PER_CATEGORY = 3;
const CONTAINER_HEIGHT = 432;

export default function WideMenu({ isOpen, setIsOpen, categories }: WideMenuProps) {
  const { data: session } = useSession();
  const userType: UserType = (session?.user?.type as UserType) || "guest";
  const router = useRouter();
  const { t } = useTranslation();

  const [activeCategoryTitle, setActiveCategoryTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveCategoryTitle(null);
    }
  }, [isOpen]);

  const getFilteredLinks = (pages: PageData[]) =>
    pages.filter((singlePage) => singlePage.roles.includes(userType) && singlePage.isPublished);

  const roleFilteredCategories = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        pages: getFilteredLinks(category.pages),
      })),
    [categories, userType]
  );

  const handlePageClick = (page: PageData) => {
    if (page.href) {
      router.refresh();
      router.push(page.href);
    }
    setIsOpen(false);
  };

  const handleHomePageClick = () => {
    router.refresh();
    router.push("/home");
    setIsOpen(false);
  };

  const PageRow = ({ page }: { page: PageData }) => {
    const showBadge = page.hasBadge && page.badgeName;

    return (
      <li key={page.id}>
        <button
          type="button"
          onClick={() => handlePageClick(page)}
          className="group flex items-start justify-between text-white transition-colors duration-200 relative w-full text-left hover:text-gray-300"
        >
          <span className="flex-grow overflow-hidden line-clamp-2">
            {humanize(page.title || "")}
          </span>
          {showBadge ? (
            <Badge className={cn("ml-3 shadow-none rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center")}>
              <div className={cn("h-1.5 w-1.5 rounded-full mr-2", greenDotClass)} />
              {page.badgeName}
            </Badge>
          ) : (
            <span className="ml-3" />
          )}
        </button>
        <Separator className="bg-gray-500 my-2" />
      </li>
    );
  };

  const buildMoreLabel = (count: number) => {
    const template =
      typeof t === "function" ? t("... more pages {count}") : "... еще {count} страниц";
    return template.replace("{count}", String(count));
  };

  const MoreRow = ({ remaining }: { remaining: number }) => {
    const label = buildMoreLabel(remaining);
    return (
      <li aria-disabled className="text-gray-400 select-none">
        <div className="flex items-center justify-between">
          <span className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis">{label}</span>
          <span className="ml-3" />
        </div>
      </li>
    );
  };

  const DefaultExpandedAll = () => {
    return (
      <div className="flex-1 p-8 pb-24 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <h3 className="text-gray-400 text-lg font-semibold mb-3 tracking-wider pb-1">
            {t("Home")}
          </h3>
          <ul className="space-y-3 py-2">
            <li>
              <button
                type="button"
                onClick={handleHomePageClick}
                className="flex items-center justify-between text-white transition-colors duration-200 relative w-full text-left hover:text-gray-300"
              >
                <span className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis">
                  {t("Home page")}
                </span>
                <span className="ml-3" />
              </button>
              <Separator className="bg-gray-500 my-2" />
            </li>
          </ul>
        </div>

        {roleFilteredCategories.map((category) => {
          const total = category.pages.length;
          const visiblePages = category.pages.slice(0, MAX_VISIBLE_PER_CATEGORY);
          const remaining = Math.max(total - MAX_VISIBLE_PER_CATEGORY, 0);

          return (
            <div key={category.title} className="mb-8">
              <h3 className="text-gray-400 text-lg font-semibold mb-3 tracking-wider pb-1">
                {humanize(category.title)}
              </h3>
              <ul className="space-y-3 py-2">
                {visiblePages.map((p) => (
                  <PageRow key={p.id} page={p} />
                ))}
                {remaining > 0 && <MoreRow remaining={remaining} />}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  const ActiveFlatList = () => {
    const activeCategory = activeCategoryTitle
      ? roleFilteredCategories.find((cat) => cat.title === activeCategoryTitle)
      : null;

    const flatPages: PageData[] = activeCategory ? activeCategory.pages : [];

    return (
      <div className="flex-1 p-8 pb-24 overflow-y-auto custom-scrollbar">
        <ul className="space-y-3 py-2">
          {flatPages.map((p) => (
            <PageRow key={p.id} page={p} />
          ))}
        </ul>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-x-0 mx-auto bg-black text-white rounded-lg shadow-2xl overflow-hidden z-50 border"
          style={{ maxWidth: "90%", top: "120px", height: `${CONTAINER_HEIGHT}px` }}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex h-full">
            <div className="flex-1 flex flex-col overflow-hidden">
              {activeCategoryTitle ? <ActiveFlatList /> : <DefaultExpandedAll />}
            </div>

            <div className="w-80 bg-gray-900 p-8 flex flex-col">
              <h3 className="text-gray-400 text-sm font-semibold mb-2 tracking-wider">
                {t("Categories")}
              </h3>

              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pb-6">
                <div className="p-1">
                  <Card
                    className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer h-[60px]"
                    onClick={() => {
                      setActiveCategoryTitle(null);
                      handleHomePageClick();
                    }}
                  >
                    <CardContent className="flex items-center justify-start p-0">
                      <h4 className="text-white font-semibold text-base line-clamp-1 whitespace-nowrap overflow-hidden">
                        {t("Home page")}
                      </h4>
                    </CardContent>
                  </Card>
                </div>

                {roleFilteredCategories.map((category) => (
                  <div key={category.title} className="p-1">
                    <Card
                      className={cn(
                        "bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer h-[60px]",
                        activeCategoryTitle === category.title ? "ring-2 ring-white" : ""
                      )}
                      onClick={() =>
                        setActiveCategoryTitle(
                          activeCategoryTitle === category.title ? null : category.title
                        )
                      }
                    >
                      <CardContent className="flex items-center justify-start p-0">
                        <h4 className="text-white font-semibold text-base line-clamp-1 whitespace-nowrap overflow-hidden">
                          {humanize(category.title)}
                        </h4>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between shrink-0">
                <span className="text-gray-400 text-sm font-semibold tracking-wider">
                  {t("Theme Switcher")}
                </span>
                <ModeToggle />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
