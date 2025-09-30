// @/app/@right/(_service)/(_components)/home-page/sections/hero-section.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="pt-16 md:pt-32 pb-20 px-4 xl:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row justify-between items-center min-h-96 gap-10">
        {/* Текстовый контент */}
        <div className="w-full max-w-3xl flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-center xl:text-left text-base mb-6">
                Цифровые решения
              </p>
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-center xl:text-left text-gray-900 dark:text-white">
                Управляйте коммерческим транспортом в удобной программе{" "}
                <span className="text-blue-800">US AUTO*</span>
              </h1>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-center xl:text-left">
              *Включено в реестр отечественного программного обеспечения
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">
            {/* 
              Используем Link для мягкой навигации
              Перехватывающий маршрут сработает только в правом слоте
              Левый слот (чат) останется полностью независимым
            */}
            <Link
              href="/interception_modal/lead-form"
              className="inline-block"
            >
              <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-6 text-base w-full sm:w-auto transition-all duration-200 hover:shadow-lg">
                Попробовать бесплатно
              </Button>
            </Link>
            <Link
              href="/interception_modal/lead-form"
              className="inline-block"
            >
              <Button
                variant="outline"
                className="border-blue-800 text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-800 w-full dark:hover:text-white px-8 py-6 text-base bg-white dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400 transition-all duration-200 hover:shadow-lg"
              >
                Записаться на презентацию
              </Button></Link>
          </div>
        </div>

        {/* Hero Images */}
        <div className="relative w-full max-w-lg h-96 mr-4">
          <div className="absolute inset-0">
            <div
              className="absolute size-full bg-black rounded-2xl"
              style={{ left: "23px", top: "0" }}
            />
            <div
              className="absolute size-full bg-gray-200 dark:bg-gray-700 border border-black dark:border-gray-600 rounded-2xl"
              style={{ left: "12px", top: "6px" }}
            />
            <div
              className="absolute size-full bg-blue-800 border border-black dark:border-gray-600 rounded-2xl shadow-lg overflow-hidden relative"
              style={{
                transform: "translate(0px, 14px)",
                maxWidth: "630px",
                height: "384px",
              }}
            >
              <Image
                src="/images/usautopro1.jpg"
                alt="USAUTO Интерфейс системы"
                fill
                priority
                className="object-cover object-left-top"
                sizes="(max-width: 768px) 100vw, 630px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="size-full flex items-center justify-center text-white text-lg font-semibold text-center">
                        USAUTO<br/>Интерфейс системы
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
