// @/app/api/lead-form/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Инициализация Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM;
const toEmail = process.env.EMAIL_TO;

// Схема валидации
const leadFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа."),
  phone: z.string().min(10, "Введите корректный номер телефона."),
  email: z.string().email("Введите корректный email."),
});

export async function POST(request: NextRequest) {
  // Добавьте в начало POST функции для отладки
console.log("Email configuration:", {
  fromEmail: process.env.EMAIL_FROM,
  toEmail: process.env.EMAIL_TO,
  hasApiKey: !!process.env.RESEND_API_KEY
});
    try {
    const body = await request.json();
    
    // Валидация данных
    const validationResult = leadFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
        message: 'Ошибка валидации. Проверьте корректность введенных данных.'
      }, { status: 400 });
    }

    const { name, phone, email } = validationResult.data;

    // Проверка наличия переменных окружения
    if (!process.env.RESEND_API_KEY || !fromEmail || !toEmail) {
      console.error("Missing required environment variables");
      return NextResponse.json({
        success: false,
        message: 'Сервис временно недоступен. Попробуйте позже.'
      }, { status: 500 });
    }

    // Отправка email через Resend
    const emailResult = await resend.emails.send({
      from: `Сайт US AUTO <${fromEmail}>`,
      to: [toEmail],
      subject: `Новая заявка на бесплатное тестирование`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e40af; margin-bottom: 24px;">
            Новая заявка на бесплатное тестирование US AUTO
          </h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin-top: 0; color: #374151;">Контактная информация:</h2>
            <p style="margin: 8px 0;"><strong>Имя:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Телефон:</strong> ${phone}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Заявка отправлена через сайт US AUTO<br>
              Дата и время: ${new Date().toLocaleString('ru-RU', { 
                timeZone: 'Europe/Moscow',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      `,
    });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      return NextResponse.json({
        success: false,
        message: 'Не удалось отправить заявку. Попробуйте еще раз.'
      }, { status: 500 });
    }

    // Логирование успешной отправки
    console.log(`Lead form submitted successfully: ${email} (${name})`);

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
    });

  } catch (error) {
    console.error("Lead form API error:", error);
    return NextResponse.json({
      success: false,
      message: 'Произошла непредвиденная ошибка. Попробуйте еще раз.'
    }, { status: 500 });
  }
}

// Опционально: обработка OPTIONS для CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
