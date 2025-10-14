// @/app/@right/(_service)/(_components)/client-navigation-island.tsx
"use client";

import React, { useState, useEffect } from "react";
import { NavigationSection } from "../(_utils)/navigation-utils";
import { Button } from "@/components/ui/button";

export interface ClientNavigationIslandProps {
    sections: NavigationSection[];
    trackActive?: boolean;
    className?: string;
}

const OBSERVER_OPTIONS: IntersectionObserverInit = {
    rootMargin: "-100px 0px -60% 0px",
    threshold: 0,
};

export function ClientNavigationIsland({
    sections,
    trackActive = true,
    className = "",
}: ClientNavigationIslandProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    if (!sections || sections.length === 0) {
        return null;
    }

    useEffect(() => {
        if (!trackActive) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, OBSERVER_OPTIONS);

        sections.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [sections, trackActive]);

    return (
        <div
            className={`
        client-navigation-island
        sticky top-0 z-40 mb-6
        hidden md:block 2xl:hidden
        ${className}
      `}
        >
            <div className="overflow-x-auto custom-scrollbar">
                <div className="flex gap-4 min-w-fit bg-background py-2">
                    {sections.map(({ id, shortTitle, h2Title }) => {
                        const isActive = trackActive && activeSection === id;

                        return (
                            <Button
                                key={id}
                                asChild
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                className={`
                  whitespace-nowrap flex-shrink-0
                  transition-all duration-200
                  ${isActive ? "shadow-sm" : ""}
                `}
                            >
                                <a
                                    href={`#${id}`}
                                    title={h2Title}
                                    aria-current={isActive ? "location" : undefined}
                                >
                                    {shortTitle}
                                </a>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ClientNavigationIsland;
