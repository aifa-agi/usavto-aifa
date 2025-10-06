// @/app/@right/thank-you/(_components)/analytics-tracker.tsx
// ✅ CLIENT COMPONENT (минимальный, только для analytics)

"use client";

import { useEffect } from "react";

/**
 * Comments in English: Analytics tracking component for Thank You page
 * Separated from main page to keep it as Server Component
 * Tracks conversion events for Google Analytics, Facebook Pixel, etc.
 */
export function AnalyticsTracker() {
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

    console.log('[Analytics] Thank You page view tracked');
  }, []);

  // This component renders nothing
  return null;
}
