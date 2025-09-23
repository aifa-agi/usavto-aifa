// @/app/@right/(_service)/(_components)/home-page/(_components)/advantages-section.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdvantagesSection() {
  // Данные о преимуществах
  const advantages = [
    {
      number: "01",
      title: "Комплексные решения",
      description: "Одна система для всех задач управления автопарком",
    },
    {
      number: "02",
      title: "Простота внедрения",
      description: "Начало работы сразу без сложной настройки",
    },
    {
      number: "03",
      title: "Соответствие законодательству",
      description: "Все процессы соответствуют требованиям законодательства РФ",
    },
    {
      number: "04",
      title: "Интеграция с нашими страховыми продуктами",
      description:
        "Специальные тарифы и условия страхования для пользователей US AUTO",
    },
    {
      number: "05",
      title: "Техническая поддержка 24/7",
      description: "Помощь специалистов в любое время суток",
    },
  ];

  return (
    <section className="py-20 px-4 xl:px-10 max-w-7xl mx-auto">
      <Card className="bg-gray-100 dark:bg-gray-800 border-t-4 border-t-blue-800 rounded-3xl shadow-lg py-10 px-0 lg:p-10">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
            Преимущества нашего предложения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 mb-5">
            {advantages.map((advantage, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-xl p-4 h-auto transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="text-blue-800 dark:text-blue-400 text-lg font-bold mb-3">
                    {advantage.number}
                  </div>
                  <h3 className="text-xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
                    {advantage.title}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* CTA Card */}
            <Card className="bg-white dark:bg-gray-700 border-blue-800 dark:border-blue-400 rounded-xl p-4 h-auto flex items-center justify-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white">
                  Убедитесь в эффективности US AUTO
                </h3>
                <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Попробовать бесплатно
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
