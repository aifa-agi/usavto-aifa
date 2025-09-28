// @/components/shared/mode-toggle.tsx

"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "../../(_libs)/translation"
import { Laptop, Moon, Sun } from "lucide-react"

export function ModeToggle() {
    const { setTheme } = useTheme()
    const { t } = useTranslation()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button

                    size="sm"
                    className="h-auto w-auto p-1 text-white hover:text-gray-300 hover:bg-transparent rounded-sm "
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">{t("Theme Switcher")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                    <Sun className="mr-2 size-4" />
                    <span>{t("Light")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                    <Moon className="mr-2 size-4" />
                    <span>{t("Dark")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                    <Laptop className="mr-2 size-4" />
                    <span>{t("System")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
