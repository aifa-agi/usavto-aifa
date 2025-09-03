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
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function TravelSheetsSection() {
  // Анимации для карточек
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

  return (
    <section className="py-20 px-4 xl:px-10 max-w-7xl mx-auto">
      {/* Badge модуля */}
      <div className="flex justify-center mb-8">
        <Badge
          variant="secondary"
          className="bg-blue-800 text-white dark:bg-blue-800 hover:bg-blue-900 px-4 py-2 text-sm font-semibold"
        >
          <BadgeCheck className="w-4 h-4 mr-2" />
          1-й Mодуль USAUTO
        </Badge>
      </div>

      <Card className="bg-gray-100 dark:bg-gray-800 border-t-4 border-t-black dark:border-t-gray-600 rounded-3xl shadow-lg p-10">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
            Путевые листы дистанционно
          </CardTitle>

          {/* Кнопки навигации - размещены СВЕРХУ над карточками */}
          <motion.div
            className="flex flex-wrap gap-3 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={buttonVariants}
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm px-4 py-2 rounded-full transform transition-all duration-300 hover:scale-105"
            >
              Электронные путевые листы (ЭПЛ)
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm px-4 py-2 rounded-full transform transition-all duration-300 hover:scale-105"
            >
              Телемедицина{" "}
              <span className="text-blue-600 font-semibold">[NEW]</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm px-4 py-2 rounded-full transform transition-all duration-300 hover:scale-105"
            >
              Путевые листы со штатными марками и контроллерами
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </CardHeader>
        <CardContent>
          {/* Остальной контент секции - без изменений */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Первая колонка - flex для равной высоты карточек */}
            <div className="flex flex-col gap-5">
              {/* Карточка 1 */}
              <motion.div
                className="flex flex-grow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={0}
                variants={cardVariants}
              >
                <Card className="p-4 w-full border dark:border-gray-600 bg-white dark:bg-gray-700 transition-transform duration-300 ease-in-out cursor-pointer hover:scale-105 hover:shadow-lg">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-800 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                          Сократите работу с путевыми листами до 5 минут в день
                        </h3>
                        <div className="space-y-2 flex-1">
                          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            Создавайте шаблоны путевых листов под водителей или
                            сразу на весь парк
                          </p>
                          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            Добавляйте адреса и задания сразу в путевой лист
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Карточка 3 - БЕЗ кнопки лицензии */}
              <motion.div
                className="flex flex-grow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={2}
                variants={cardVariants}
              >
                <Card className="p-4 w-full border dark:border-gray-600 bg-white dark:bg-gray-700 transition-transform duration-300 ease-in-out cursor-pointer hover:scale-105 hover:shadow-lg">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-800 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <Fuel className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                          Списывайте ГСМ
                        </h3>
                        <div className="space-y-2 flex-1">
                          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            Правильный учет и списание ГСМ по путевым листам
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Вторая колонка - flex для равной высоты карточек */}
            <div className="flex flex-col gap-5">
              {/* Карточка 2 */}
              <motion.div
                className="flex flex-grow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={1}
                variants={cardVariantsRight}
              >
                <Card className="p-4 w-full border dark:border-gray-600 bg-white dark:bg-gray-700 transition-transform duration-300 ease-in-out cursor-pointer hover:scale-105 hover:shadow-lg">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-800 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                          Подготавливайте документы под любые проверки ГИБДД и
                          МАДИ
                        </h3>
                        <div className="space-y-2 flex-1">
                          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            Выгрузка журналов на конкретные поездки
                          </p>
                          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            Межведомственный обмен согласно законодательству РФ
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Карточка 4 - синяя с кнопкой лицензии ТОЛЬКО ЗДЕСЬ */}
              <motion.div
                className="flex flex-grow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={3}
                variants={cardVariantsRight}
              >
                <Card className="p-4 w-full border dark:border-gray-600 bg-blue-800 text-white transition-transform duration-300 ease-in-out cursor-pointer hover:scale-105 hover:shadow-lg">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="flex gap-4 h-full">
                      <div className="flex-1 flex flex-col">
                        <div className="flex gap-3 mb-4">
                          <div className="w-8 h-8 bg-white text-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col gap-3 flex-1">
                            <h3 className="text-xl font-bold leading-tight text-white">
                              ЮРИСТ медицинский центр
                            </h3>
                            <p className="text-base leading-relaxed text-white">
                              Проходите медицинские осмотры водителей в нашем
                              медицинском центре или дистанционно
                            </p>
                          </div>
                        </div>
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
                              className="text-sm font-bold bg-white text-blue-800 animate-bounce hover:animate-none"
                            >
                              *Лицензия
                            </Badge>
                          </motion.div>
                        </div>
                      </div>

                      {/* Изображение */}
                      <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden relative">
                        <Image
                          src="/images/usautopro2.jpg"
                          alt="Медицинский центр"
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
