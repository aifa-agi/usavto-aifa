// @/app/@right/(_service)/(_components)/home-page/(_components)/calculator-section.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import Image from "next/image";
import {
  calculatePrice,
  calculateSavings,
  PERIODS,
  VEHICLE_OPTIONS,
  type PeriodType,
} from "../(_libs)/pricing-data";

export function CalculatorSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("3 месяца");
  const [selectedVehicles, setSelectedVehicles] = useState("другое");
  const [vehicleCount, setVehicleCount] = useState("20");

  // Вычисляем актуальное количество автомобилей
  const actualVehicleCount = useMemo(() => {
    if (selectedVehicles === "другое") {
      const count = parseInt(vehicleCount) || 0;
      return Math.max(1, count); // Минимум 1 авто
    }

    // Извлекаем число из строки типа "10 авто"
    const match = selectedVehicles.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  }, [selectedVehicles, vehicleCount]);

  // Рассчитываем стоимость и экономию
  const calculationResults = useMemo(() => {
    const price = calculatePrice(actualVehicleCount, selectedPeriod);
    const savings = calculateSavings(actualVehicleCount, selectedPeriod);

    return {
      price,
      ...savings,
    };
  }, [actualVehicleCount, selectedPeriod]);

  // Функция для форматирования цены
  const formatPrice = (price: number): string => {
    return price.toLocaleString("ru-RU") + " ₽";
  };

  return (
    <section className="py-20 px-4 xl:px-10 max-w-7xl mx-auto">
      <Card className="bg-gray-200 dark:bg-gray-800 rounded-3xl shadow-lg py-10 px-0 lg:p-10">
        <CardContent>
          <div className="flex flex-col xl:flex-row gap-20 items-start">
            <div className="flex-1 max-w-3xl">
              <div className="mb-10">
                <h2 className="text-4xl font-bold text-center xl:text-left text-gray-900 dark:text-white">
                  Расчет стоимости услуг
                </h2>
              </div>

              <div className="mb-10">
                <div className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
                  Период
                </div>
                <div className="flex flex-wrap gap-2">
                  {PERIODS.map((period) => (
                    <Button
                      key={period}
                      variant={
                        selectedPeriod === period ? "default" : "outline"
                      }
                      className={`px-4 py-3 rounded-3xl transform transition-all duration-300 hover:scale-105 ${
                        selectedPeriod === period
                          ? "border-blue-800 bg-white dark:bg-gray-700 text-black dark:text-white"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md"
                      }`}
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <div className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
                  Количество автомобилей в парке
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {VEHICLE_OPTIONS.map((option) => (
                    <Button
                      key={option}
                      variant={
                        selectedVehicles === option ? "default" : "outline"
                      }
                      className={`px-4 py-3 rounded-3xl transform transition-all duration-300 hover:scale-105 ${
                        selectedVehicles === option
                          ? "border-blue-800 bg-white dark:bg-gray-700 text-black dark:text-white"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md"
                      }`}
                      onClick={() => {
                        setSelectedVehicles(option);
                        // Если выбран не "другое", очищаем поле ввода
                        if (option !== "другое") {
                          setVehicleCount("");
                        }
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {selectedVehicles === "другое" && (
                  <div className="max-w-sm">
                    <div className="mb-4 text-base text-gray-900 dark:text-white">
                      Напишите количество авто для расчета
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        value={vehicleCount}
                        onChange={(e) => setVehicleCount(e.target.value)}
                        className="border-blue-800 dark:border-blue-400 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 focus:scale-105"
                        placeholder="Введите количество"
                        min="1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transform transition-transform duration-300 hover:scale-110"
                        onClick={() => setVehicleCount("")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Calculator Result */}
            <Card className="w-full xl:w-96 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-3xl shadow-lg h-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-5">
                <div className="flex gap-3 mb-5">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/usautopro7.jpg"
                      alt="Аватар консультанта"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-base leading-relaxed mb-3 text-gray-900 dark:text-white">
                      {calculationResults.savingsPercent > 0 ? (
                        <>
                          Я посчитал: при {actualVehicleCount} ТС за{" "}
                          {selectedPeriod} вы экономите{" "}
                          {calculationResults.savingsPercent}% или{" "}
                          {formatPrice(calculationResults.savings)}. Больше ТС -
                          больше выгоды!
                        </>
                      ) : (
                        <>
                          Я посчитал стоимость для {actualVehicleCount} ТС за{" "}
                          {selectedPeriod}. Больше ТС и длительный период дают
                          больше выгоды!
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-300 dark:bg-gray-600 my-5"></div>

                <div className="mb-5">
                  <h3 className="text-lg font-bold mb-5 text-gray-900 dark:text-white">
                    Результаты расчета
                  </h3>
                  <div className="space-y-4">
                    <div className="text-gray-900 dark:text-white">
                      <span className="text-gray-500 dark:text-gray-400">
                        Период:
                      </span>{" "}
                      {selectedPeriod}
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      <span className="text-gray-500 dark:text-gray-400">
                        Количество автомобилей:
                      </span>{" "}
                      {actualVehicleCount}
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      <span className="text-gray-500 dark:text-gray-400">
                        Стоимость:
                      </span>{" "}
                      {formatPrice(calculationResults.price)}
                    </div>
                    {selectedPeriod !== "1 месяц" && (
                      <div className="text-gray-900 dark:text-white">
                        <span className="text-gray-500 dark:text-gray-400">
                          Цена за месяц:
                        </span>{" "}
                        {formatPrice(calculationResults.monthlyPrice)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px bg-gray-300 dark:bg-gray-600 my-5"></div>

                <Card className="bg-gray-100 dark:bg-gray-600 rounded-xl p-4">
                  <CardContent className="p-0 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-800 rounded-xl flex items-center justify-center text-white">
                      ₽
                    </div>
                    <div className="flex-1">
                      {calculationResults.savingsPercent > 0 ? (
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          <span className="font-normal text-base">
                            Ваша выгода с USAUTO:
                          </span>{" "}
                          до {formatPrice(calculationResults.savings)}
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          <span className="font-normal text-base">
                            Стоимость за период:
                          </span>{" "}
                          {formatPrice(calculationResults.price)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          <div className="h-px bg-gray-400 dark:bg-gray-600 my-5"></div>

          <div className="flex flex-col sm:flex-row gap-5 mb-5">
            <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Попробовать бесплатно
            </Button>
            <Button
              variant="outline"
              className="border-blue-800 dark:border-blue-400 text-blue-800 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800 dark:hover:text-white px-8 py-3 bg-white dark:bg-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Купить
            </Button>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-4xl">
            Цена указана без учета НДС (5%). Окончательная стоимость будет
            рассчитана при оформлении покупки. Это предварительный расчет и не
            является публичной офертой.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
