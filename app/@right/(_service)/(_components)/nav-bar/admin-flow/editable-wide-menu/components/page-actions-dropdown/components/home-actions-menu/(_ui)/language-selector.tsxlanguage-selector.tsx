// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_ui)/language-selector.tsxlanguage-selector.tsx

import { Check } from "lucide-react";
import {
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TinyDot } from "./tiny-dot";
import { SUPPORTED_LANGUAGES } from "../(_constants)/supported-languages";

interface LanguageSelectorProps {
    currentLang: string | undefined;
    loading: boolean;
    error: boolean;
    onSelectLanguage: (langCode: string) => void;
}

/**
 * Комментарии: Компонент выбора языка с выпадающим подменю
 * Показывает галочку рядом с текущим выбранным языком
 */
export function LanguageSelector({
    currentLang,
    loading,
    error,
    onSelectLanguage,
}: LanguageSelectorProps) {
    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center">
                <TinyDot
                    colorClass={
                        loading
                            ? "bg-muted-foreground/40"
                            : error || !currentLang
                                ? "bg-red-500"
                                : "bg-green-600"
                    }
                />
                <span className="flex-1">
                    Language {currentLang && `(${currentLang})`}
                </span>
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => onSelectLanguage(lang.code)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <span>{lang.label}</span>
                        {/* Комментарии: Показываем галочку для текущего выбранного языка */}
                        {currentLang === lang.code && (
                            <Check className="w-4 h-4 ml-2 text-green-600" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}
