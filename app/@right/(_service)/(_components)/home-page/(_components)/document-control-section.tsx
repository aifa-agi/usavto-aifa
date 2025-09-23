// @/app/@right/(_service)/(_components)/home-page/(_components)/document-control-section.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BadgeCheck } from "lucide-react";
import Image from "next/image";

export function DocumentControlSection() {
  // Данные о контроле документов
  const documentControls = [
    "Автоматический мониторинг сроков действия страховок (ОСАГО, КАСКО, ДОСАГО)",
    "Отслеживание сроков водительских удостоверений",
    "Контроль технических осмотров и диагностических карт",
    "Система уведомлений о необходимости продления документов",
  ];

  return (
    <section className="py-20 px-4 xl:px-10 max-w-7xl mx-auto">
      {/* Badge модуля */}
      <div className="flex justify-center mb-8">
        <Badge
          variant="secondary"
          className="bg-blue-800 text-white dark:bg-blue-800 hover:bg-blue-900 px-4 py-2 text-sm font-semibold"
        >
          <BadgeCheck className="w-4 h-4 mr-2" />
          3-й Mодуль USAUTO
        </Badge>
      </div>

      <Card className="bg-gray-100 dark:bg-gray-800 border-t-4 border-t-black dark:border-t-gray-600 rounded-3xl shadow-lg p-10">
        <CardContent>
          <div className="flex flex-col xl:flex-row gap-14 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
                Контроль сроков документации
              </h2>

              <div className="space-y-3">
                {documentControls.map((control, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 transform transition-all duration-300 hover:translate-x-2"
                  >
                    <CheckCircle className="w-6 h-6 text-blue-800 flex-shrink-0 transition-colors duration-300 hover:text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {control}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Изображение справа */}
            <div className="w-full xl:w-96 h-60 rounded-xl overflow-hidden relative transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Image
                src="/images/usautopro6.jpg"
                alt="Контроль документации"
                fill
                className="object-cover object-center origin-center transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 1280px) 100vw, 384px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="size-full bg-gray-300 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                        Контроль<br/>документации
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
