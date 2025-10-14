// @/app/@right/(_service)/(_components)/smooth-scroll-handler.tsx
"use client";

// Client component for smooth scroll behavior
// Comments in English: Minimal JS for smooth anchor navigation
// Does NOT affect SSG - this is a client island for UX enhancement

import { useEffect } from "react";

/**
 * SmoothScrollHandler - Client component for smooth scroll
 * 
 * Features:
 * - Intercepts anchor link clicks
 * - Applies smooth scroll animation
 * - Respects scroll-margin-top offset
 * - Works with SSG (doesn't affect static generation)
 * 
 * Usage: Place once in layout or main page component
 */
export function SmoothScrollHandler() {
    useEffect(() => {
        /**
         * Handle anchor link clicks with smooth scroll
         */
        const handleAnchorClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Check if clicked element is an anchor link
            const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;

            if (!anchor) return;

            // Get the href (e.g., "#section-id")
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            // Get target element
            const targetId = href.substring(1); // Remove '#'
            const targetElement = document.getElementById(targetId);

            if (!targetElement) return;

            // Prevent default jump behavior
            event.preventDefault();

            // Smooth scroll to element
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });

            // Update URL without page reload (optional)
            if (history.pushState) {
                history.pushState(null, '', href);
            }
        };

        // Add event listener to document
        document.addEventListener('click', handleAnchorClick);

        // Cleanup on unmount
        return () => {
            document.removeEventListener('click', handleAnchorClick);
        };
    }, []);

    // This component renders nothing - it only adds behavior
    return null;
}

export default SmoothScrollHandler;
