// @/app/@right/interception_modal/lead-form/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const metadata: Metadata = {
    title: "Заявка на тестирование - US AUTO",
    description: "Заполните форму для получения бесплатного доступа к тестированию системы управления коммерческим транспортом US AUTO",
    robots: {
        index: false,
        follow: true,
    },
};

export const dynamic = "force-static";

export default function LeadFormPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Home className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            US AUTO
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Система управления коммерческим транспортом
                        </p>
                    </div>

                    <Link href="/home">
                        <Button
                            className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 text-base
                        transition-all duration-200 hover:shadow-lg w-full"
                        >
                            Перейти на главную страницу
                        </Button>
                    </Link>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Для получения заявки воспользуйтесь формой на главной странице
                    </p>
                </div>
            </div>
        </div>
    );
}
