// @/app/@right/(_service)/(_components)/home-page/(_components)/fines-section.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function FinesSection() {
  // Данные о штрафах
  const fines = [
    "Мониторинг штрафов ГИБДД, МАДИ, АМПП, ПЛАТОН",
    "Сопоставление штрафов, которые попали в ФССП",
    "Фиксация всех штрафах и отображение в удобном интерфейсе",
    "Экономия до 20% на своевременной оплате",
    "Распределение штрафов по водителям",
  ];

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

  // Анимации для блока штрафов
  const finesVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const screenshotVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.section
      className="py-20 px-4 xl:px-10 w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={finesVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Badge модуля */}
        <div className="flex justify-center mb-8">
          <Badge
            variant="secondary"
            className="bg-blue-800 text-white dark:bg-blue-800 hover:bg-blue-900 px-4 py-2 text-sm font-semibold"
          >
            <BadgeCheck className="w-4 h-4 mr-2" />
            2-й Mодуль USAUTO
          </Badge>
        </div>

        <motion.h2
          className="text-4xl font-bold mb-10 text-gray-900 dark:text-white text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: -30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
        >
          Штрафы. Автоматическое разнесение
        </motion.h2>

        <div className="flex flex-col xl:flex-row items-start gap-14 mb-10">
          <motion.div
            className="xl:w-1/2 space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            variants={cardVariants}
          >
            {fines.map((fine, index) => (
              <div
                key={index}
                className="flex items-center gap-3 transform transition-all duration-300 hover:translate-x-2"
              >
                <CheckCircle className="w-6 h-6 text-blue-800 flex-shrink-0 transition-colors duration-300 hover:text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">{fine}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={cardVariantsRight}
          >
            <Card className="shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-600 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      + Платные дороги
                    </h3>
                    <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      Фиксируем все проезды по платным дорогам и контролируем
                      даты оплаты для недопущения штрафов
                    </p>
                  </div>
                  <div className="w-48 aspect-square rounded-xl flex items-center justify-center overflow-hidden relative">
                    <Image
                      src="/images/usautopro3.jpg"
                      alt="Платные дороги"
                      fill
                      className="object-cover object-left-top rounded-xl origin-top-left transition-transform duration-300 hover:scale-105"
                      sizes="192px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="size-full bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                              Платные<br/>дороги
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

        {/* Screenshots - правильное позиционирование изображений */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-10">
          <div className="flex flex-col xl:flex-row gap-9 justify-center">
            <motion.div
              className="xl:w-1/2 h-96 rounded-xl shadow-lg overflow-hidden relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
              variants={screenshotVariants}
            >
              <Image
                src="/images/usautopro4.jpg"
                alt="Скриншот системы - Штрафы ГИБДД"
                fill
                priority
                className="object-cover object-left-top origin-top-left transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 1280px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="size-full bg-gray-300 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                        Скриншот системы<br/>Штрафы ГИБДД
                      </div>
                    `;
                  }
                }}
              />
            </motion.div>
            <motion.div
              className="xl:w-1/2 h-96 rounded-xl shadow-lg overflow-hidden relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={1}
              variants={screenshotVariants}
            >
              <Image
                src="/images/usautopro5.jpg"
                alt="Скриншот системы - Платные дороги"
                fill
                priority
                className="object-cover object-left-top origin-top-left transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 1280px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="size-full bg-gray-300 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                        Скриншот системы<br/>Платные дороги
                      </div>
                    `;
                  }
                }}
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="text-center mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.4, duration: 0.6, ease: "easeOut" },
            },
          }}
        >
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Пришлем актуальные данные по штрафам, подскажем как сэкономить
          </p>
          <Link
            href="/interception_modal/lead-form"
            className="inline-block"
          >
            <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Узнать подробнее
            </Button></Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
