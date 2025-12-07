// @/app/@right/(_service)/(_components)/home-page/(_components)/travel-sheets-section.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  FileText,
  Fuel,
  Shield,
  ArrowRight,
  BadgeCheck,
  LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// TypeScript interfaces for type safety
interface NavigationButton {
  id: string;
  label: string;
  isNew?: boolean;
}

interface TravelCard {
  id: string;
  icon: LucideIcon;
  title: string;
  descriptions: string[];
  variant?: "default" | "special";
  image?: {
    src: string;
    alt: string;
  };
  badge?: {
    text: string;
    animate?: boolean;
  };
  animationSide: "left" | "right";
}

// Configuration objects at the beginning of the component
const NAVIGATION_BUTTONS: NavigationButton[] = [
  {
    id: "electronic-sheets",
    label: "Электронные путевые листы (ЭПЛ)",
  },
  {
    id: "telemedicine",
    label: "Телемедицина",
    isNew: true,
  },
  {
    id: "waybills-controllers",
    label: "Путевые листы со штатными марками и контроллерами",
  },
];

const TRAVEL_CARDS: TravelCard[] = [
  {
    id: "time-reduction",
    icon: Clock,
    title: "Сократите работу с путевыми листами до 5 минут в день",
    descriptions: [
      "Создавайте шаблоны путевых листов под водителей или сразу на весь парк",
      "Добавляйте адреса и задания сразу в путевой лист",
    ],
    animationSide: "left",
  },
  {
    id: "documents-preparation",
    icon: FileText,
    title: "Подготавливайте документы под любые проверки ГИБДД и МАДИ",
    descriptions: [
      "Выгрузка журналов на конкретные поездки",
      "Межведомственный обмен согласно законодательству РФ",
    ],
    animationSide: "right",
  },
  {
    id: "fuel-management",
    icon: Fuel,
    title: "Списывайте ГСМ",
    descriptions: ["Правильный учет и списание ГСМ по путевым листам"],
    animationSide: "left",
  },
  {
    id: "medical-center",
    icon: Shield,
    title: "ЮВИТ медицинский центр",
    descriptions: [
      "Проходите медицинские осмотры водителей в нашем медицинском центре или дистанционно",
    ],
    variant: "special",
    image: {
      src: "/images/usautopro2.jpg",
      alt: "Медицинский центр",
    },
    badge: {
      text: "*Лицензия",
      animate: true,
    },
    animationSide: "right",
  },
];

export function TravelSheetsSection() {
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const cardVariantsRight = {
    hidden: { opacity: 0, x: 50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: [0.68, -0.55, 0.265, 1.55], // bounce effect
      },
    },
  };

  // Helper function to render navigation buttons
  const renderNavigationButtons = () => {
    return NAVIGATION_BUTTONS.map((button) => (
      <Button
        key={button.id}
        variant="outline"
        size="sm"
        className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm px-4 py-2 rounded-full transform transition-all duration-300 hover:scale-105"
      >
        {button.label}
        {button.isNew && (
          <span className="text-blue-600 font-semibold ml-1">[NEW]</span>
        )}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    ));
  };

  // Helper function to render travel cards
  const renderTravelCard = (card: TravelCard, index: number) => {
    const IconComponent = card.icon;
    const isSpecial = card.variant === "special";
    const variants =
      card.animationSide === "left" ? cardVariants : cardVariantsRight;

    return (
      <motion.div
        key={card.id}
        className="flex flex-grow"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={index}
        variants={variants}
      >
        <Card
          className={`p-4 w-full border dark:border-gray-600 transition-transform duration-300 ease-in-out cursor-pointer hover:scale-105 hover:shadow-lg ${isSpecial ? "bg-blue-800 text-white" : "bg-white dark:bg-gray-700"
            }`}
        >
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex gap-4 h-full">
              <div className="flex-1 flex flex-col">
                <div className="flex gap-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isSpecial
                        ? "bg-white text-blue-800"
                        : "bg-blue-800 text-white"
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <h3
                      className={`text-xl font-bold leading-tight ${isSpecial
                          ? "text-white"
                          : "text-gray-900 dark:text-white"
                        }`}
                    >
                      {card.title}
                    </h3>
                    <div className="space-y-2 flex-1">
                      {card.descriptions.map((description, descIndex) => (
                        <p
                          key={descIndex}
                          className={`text-base leading-relaxed ${isSpecial
                              ? "text-white"
                              : "text-gray-700 dark:text-gray-300"
                            }`}
                        >
                          {description}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badge rendering for special cards */}
                {card.badge && (
                  <div className="mt-auto">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={{
                        hidden: { opacity: 0, scale: 0 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          transition: {
                            delay: 1.2,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                          },
                        },
                      }}
                    >
                      <Badge
                        variant="secondary"
                        className={`text-sm font-bold bg-white text-blue-800 ${card.badge.animate
                            ? "animate-bounce hover:animate-none"
                            : ""
                          }`}
                      >
                        {card.badge.text}
                      </Badge>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Image rendering for cards with images */}
              {card.image && (
                <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden relative hidden xl:block">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    className="object-cover origin-top-left transition-transform duration-300 hover:scale-110"
                    sizes="96px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="size-full bg-white/20 flex items-center justify-center text-white text-xs text-center">
                            Медицинский<br/>центр
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Helper function to organize cards into columns
  const organizeCardsIntoColumns = () => {
    const leftColumnCards = TRAVEL_CARDS.filter((_, index) => index % 2 === 0);
    const rightColumnCards = TRAVEL_CARDS.filter((_, index) => index % 2 === 1);

    return { leftColumnCards, rightColumnCards };
  };

  const { leftColumnCards, rightColumnCards } = organizeCardsIntoColumns();

  return (
    <section className="py-20 px-4 xl:px-10 max-w-7xl mx-auto">
      {/* Module badge */}
      <div className="flex justify-center mb-8">
        <Badge
          variant="secondary"
          className="bg-blue-800 text-white dark:bg-blue-800 hover:bg-blue-900 px-4 py-2 text-sm font-semibold"
        >
          <BadgeCheck className="w-4 h-4 mr-2" />
          1-й Mодуль USAUTO
        </Badge>
      </div>

      <Card className="bg-gray-100 dark:bg-gray-800 border-t-4 border-t-black dark:border-t-gray-600 rounded-3xl shadow-lg py-10 px-2 lg:p-10">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
            Путевые листы дистанционно
          </CardTitle>

          {/* Navigation buttons - rendered dynamically from config */}
          <motion.div
            className="lg:flex flex-wrap gap-3 mb-8 hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={buttonVariants}
          >
            {renderNavigationButtons()}
          </motion.div>
        </CardHeader>

        <CardContent>
          {/* Cards grid - rendered dynamically from config */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left column */}
            <div className="flex flex-col gap-5">
              {leftColumnCards.map((card, index) =>
                renderTravelCard(card, index * 2)
              )}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
              {rightColumnCards.map((card, index) =>
                renderTravelCard(card, index * 2 + 1)
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
