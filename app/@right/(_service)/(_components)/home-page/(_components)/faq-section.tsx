// @/app/@right/(_service)/(_components)/home-page/(_components)/faq-section.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BadgeCheck } from "lucide-react";

export function FAQSection() {
  // Данные FAQ
  const faqItems = [
    {
      question: "Какие штрафы за неоплаченный проезд по платной дороге?",
      answer:
        "1. Штраф от 1 000 до 2 000 рублей за неоплаченный проезд.\n2. Дополнительные штрафы могут применяться за повторные нарушения или за отказ от оплаты.",
    },
    {
      question: "Какие есть платные дороги?",
      answer: "Информация о платных дорогах в системе.",
    },
    {
      question: "ФССП списали штраф за негабарит на 150 000 р. Как быть?",
      answer: "Рекомендации по работе с ФССП.",
    },
  ];

  return (
    <section className="py-20 px-4 xl:px-10 max-w-7xl mx-auto">
      {/* Badge модуля */}

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Ответы на вопросы
        </h2>
      </div>

      <Accordion type="single" collapsible className="max-w-4xl mx-auto">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-gray-300 dark:border-gray-600 py-4 transform transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <AccordionTrigger className="text-lg font-bold text-left hover:no-underline text-gray-900 dark:text-white transition-colors duration-300 hover:text-blue-800 dark:hover:text-blue-400">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 mt-5 whitespace-pre-line">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
