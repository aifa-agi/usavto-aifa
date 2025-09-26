// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/badges-actions-dropdown/components/type-item-row.tsx


"use client";


import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BadgesStatusIndicator } from "./badges-status-indicator";
import {
    PageType,
    PAGE_TYPE_TRANSLATIONS,
} from "@/app/@right/(_service)/(_types)/page-types";
import { appConfig } from "@/config/appConfig";


interface TypeItemRowProps {
    pageType: PageType;
    isActive: boolean;
    onToggle: () => void;
}


/**
 * Получает переведенное отображаемое имя для данного PageType.
 * Возвращает английскую версию, если перевод на текущий язык недоступен.
 * @param pageType - Тип страницы.
 * @param lang - Код текущего языка (например, 'ru', 'en').
 * @returns Переведенная строка.
 */
function getTranslatedPageType(pageType: PageType, lang: string): string {
    const translations = PAGE_TYPE_TRANSLATIONS[pageType];
    return translations?.[lang] || translations?.["en"] || pageType;
}


/**
 * Отдельная строка элемента типа страницы с функцией переключения
 */
export function TypeItemRow({
    pageType,
    isActive,
    onToggle,
}: TypeItemRowProps) {
    // Получаем переведенную метку на основе настроенного языка приложения
    const translatedLabel = getTranslatedPageType(pageType, appConfig.lang);


    return (
        <DropdownMenuItem
            onClick={onToggle}
            className="cursor-pointer select-none"
        >
            <BadgesStatusIndicator isActive={isActive} />
            {/* Мы больше не используем 'capitalize', так как текст уже отформатирован */}
            <span>{translatedLabel}</span>
        </DropdownMenuItem>
    );
}
