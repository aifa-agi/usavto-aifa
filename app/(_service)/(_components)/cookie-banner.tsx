"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Settings, Shield, BarChart3, Target } from "lucide-react";
import { useTranslation } from "@/app/(_service)/(_libs)/translation";
import { appConfig } from "@/config/appConfig";
import Image from "next/image";
import Cookies from "js-cookie";

type CookieConsent = {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: number;
    version: string;
};

const COOKIE_CONSENT_KEY = "cookie-consent";
const CONSENT_VERSION = "2025.1";
const CONSENT_EXPIRY_DAYS = 180;

export function CookieBanner() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [consent, setConsent] = useState<CookieConsent>({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
        version: CONSENT_VERSION,
    });

    useEffect(() => {
        const existingConsent = Cookies.get(COOKIE_CONSENT_KEY);

        if (!existingConsent) {
            const timer = setTimeout(() => setIsVisible(true), 200);
            return () => clearTimeout(timer);
        } else {
            try {
                const parsed = JSON.parse(existingConsent) as CookieConsent;
                setConsent(parsed);
                applyConsent(parsed);
            } catch (error) {
                setIsVisible(true);
            }
        }
    }, []);

    const applyConsent = (consentData: CookieConsent) => {
        if (consentData.analytics && typeof window !== "undefined") {
            if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
                window.gtag?.('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
            }
        }

        if (consentData.marketing && typeof window !== "undefined") {
            window.fbq?.('init', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
        }
    };

    const saveConsent = (consentData: CookieConsent) => {
        Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(consentData), {
            expires: CONSENT_EXPIRY_DAYS,
            secure: true,
            sameSite: 'strict'
        });

        applyConsent(consentData);
        setIsVisible(false);

        if (typeof window !== "undefined" && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                'event': 'cookie_consent_given',
                'consent_analytics': consentData.analytics,
                'consent_marketing': consentData.marketing,
                'consent_timestamp': consentData.timestamp
            });
        }
    };

    const handleAcceptAll = () => {
        const newConsent: CookieConsent = {
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: Date.now(),
            version: CONSENT_VERSION,
        };
        saveConsent(newConsent);
    };

    const handleRejectAll = () => {
        const newConsent: CookieConsent = {
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: Date.now(),
            version: CONSENT_VERSION,
        };
        saveConsent(newConsent);
    };

    const handleSavePreferences = () => {
        const newConsent: CookieConsent = {
            ...consent,
            timestamp: Date.now(),
            version: CONSENT_VERSION,
        };
        saveConsent(newConsent);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

            <div
                className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
                role="dialog"
                aria-labelledby="cookie-banner-title"
                aria-describedby="cookie-banner-description"
            >
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    {!showDetails ? (
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex items-start gap-3 flex-1">

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex-shrink-0 mt-1">
                                            <Image
                                                src={appConfig.logo}
                                                alt={appConfig.short_name}
                                                width={32}
                                                height={32}
                                                className="rounded"
                                            />
                                        </div>
                                        <h3 id="cookie-banner-title" className="font-semibold text-gray-900 dark:text-white">
                                            {t('Cookie Banner Title')} - {appConfig.short_name}
                                        </h3>
                                    </div>
                                    <p id="cookie-banner-description" className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {t('Cookie Banner Description')}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>v{CONSENT_VERSION}</span>
                                        <span>•</span>
                                        <a
                                            href="/privacy-policy"
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {t('Privacy Policy')}
                                        </a>
                                        <span>•</span>
                                        <a
                                            href={`mailto:${appConfig.mailSupport}`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            Support
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 min-w-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDetails(true)}
                                    className="text-gray-700 dark:text-gray-300 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    {t('Manage Preferences')}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRejectAll}
                                    className="text-gray-700 dark:text-gray-300 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                                >
                                    {t('Reject All Cookies')}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleAcceptAll}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {t('Accept All Cookies')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={appConfig.logo}
                                        alt={appConfig.short_name}
                                        width={40}
                                        height={40}
                                        className="rounded"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {t('Cookie Settings')}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {appConfig.short_name} - Customize your privacy preferences
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 h-8 w-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                    <div className="flex-shrink-0 mt-1">
                                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {t('Essential Cookies')}
                                            </h4>
                                            <div className="flex items-center">
                                                <span className="text-sm text-green-600 dark:text-green-400 font-medium mr-2">Always On</span>
                                                <div className="w-12 h-6 bg-green-600 rounded-full flex items-center justify-end px-1">
                                                    <div className="w-4 h-4 bg-white rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {t('Essential Cookies Description')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                                    <div className="flex-shrink-0 mt-1">
                                        <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {t('Analytics Cookies')}
                                            </h4>
                                            <button
                                                onClick={() => setConsent(prev => ({ ...prev, analytics: !prev.analytics }))}
                                                className={`w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${consent.analytics
                                                    ? 'bg-blue-600 justify-end'
                                                    : 'bg-gray-300 dark:bg-gray-600 justify-start'
                                                    } flex items-center px-1`}
                                            >
                                                <div className="w-4 h-4 bg-white rounded-full shadow transition-transform duration-300" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {t('Analytics Cookies Description')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                                    <div className="flex-shrink-0 mt-1">
                                        <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {t('Marketing Cookies')}
                                            </h4>
                                            <button
                                                onClick={() => setConsent(prev => ({ ...prev, marketing: !prev.marketing }))}
                                                className={`w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${consent.marketing
                                                    ? 'bg-purple-600 justify-end'
                                                    : 'bg-gray-300 dark:bg-gray-600 justify-start'
                                                    } flex items-center px-1`}
                                            >
                                                <div className="w-4 h-4 bg-white rounded-full shadow transition-transform duration-300" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {t('Marketing Cookies Description')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span>Consent expires in {CONSENT_EXPIRY_DAYS} days</span>
                                    <span>•</span>
                                    <a
                                        href="/privacy-policy"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {t('Privacy Policy')}
                                    </a>
                                    <span>•</span>
                                    <a
                                        href={`mailto:${appConfig.mailSupport}`}
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Contact Support
                                    </a>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRejectAll}
                                        className="font-medium"
                                    >
                                        {t('Reject All Cookies')}
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSavePreferences}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        {t('Save Preferences')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
