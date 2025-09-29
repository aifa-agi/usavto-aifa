// app/@right/interception_modal/lead-form/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Try Free - US AUTO",
    description: "Fill out the form for free testing of the US AUTO commercial vehicle management system",
    robots: "index, follow",
};

export const dynamic = 'force-static';

export default function LeadFormPage() {
    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                    Try Free
                </h1>

                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        It is lead form modal
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        (Full page for direct navigation and SEO)
                    </p>
                </div>
            </div>
        </div>
    );
}
