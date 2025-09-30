// @/app/@right/interception_modal/lead-form/page.tsx
"use client"
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { appConfig } from "@/config/appConfig";
import { useTranslation } from "@/app/@right/(_service)/(_libs)/translation";




// Client component wrapper for translations
function LeadFormPageContent() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Home className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {appConfig.short_name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {appConfig.description}
                        </p>
                    </div>

                    <Link href="/home">
                        <Button
                            className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 text-base
                        transition-all duration-200 hover:shadow-lg w-full"
                        >
                            {t('Go to Homepage')}
                        </Button>
                    </Link>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        {t('Use Form on Homepage')}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LeadFormPage() {
    // Since this is a server component by default, we need to make it client-side
    // to use translations. Alternative: use static translations or convert to client component
    return <LeadFormPageContent />;
}
