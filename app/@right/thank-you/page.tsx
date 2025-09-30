// @/app/@right/thank-you/page.tsx

"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Clock, Users } from "lucide-react";
import { useTranslation } from "@/app/@right/(_service)/(_libs)/translation";
import { useTheme } from "next-themes";
import { appConfig } from "@/config/appConfig";

export default function ThankYouPage() {
    const { t } = useTranslation();
    const { theme, systemTheme } = useTheme();

    // Determine current theme for illustration
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const illustrationPath = currentTheme === 'dark'
        ? appConfig.illustrations.loading.dark
        : appConfig.illustrations.loading.light;

    // Track page view for conversion analytics
    useEffect(() => {
        // Google Analytics conversion tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
                'send_to': 'CONVERSION_ID', // Replace with your actual conversion ID
                'event_category': 'Lead Generation',
                'event_label': 'Thank You Page View'
            });
        }

        // Facebook Pixel tracking
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Lead');
        }

        // Custom analytics event
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                'event': 'lead_submitted',
                'event_category': 'conversion',
                'event_action': 'thank_you_page_view'
            });
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center">

                    {/* Success Illustration */}
                    <div className="mb-8">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6">
                            <Image
                                src={illustrationPath}
                                alt="Success illustration"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" aria-hidden="true" />
                    </div>

                    {/* Main Content */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('Thank You Title')}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            {t('Thank You Message')}
                        </p>
                    </div>

                    {/* What Happens Next Section */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {t('What Happens Next')}
                            </h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {t('Next Steps Description')}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/home">
                            <Button
                                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 text-base
                           transition-all duration-200 hover:shadow-lg w-full sm:w-auto
                           flex items-center justify-center"
                                size="lg"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t('Back to Home')}
                            </Button>
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-2" />
                            <span>
                                {appConfig.short_name} • {t('Thank You Message')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
