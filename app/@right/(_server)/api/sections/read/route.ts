// @/app/@right/(_server)/api/sections/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

interface ReadSectionsRequest {
  filePath: string;
}

interface ReadSectionsResponse {
  success: boolean;
  message: string;
  sections?: any[];
  source?: string;
  environment?: string;
}

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_PAGES_BASE_PATH = process.env.GITHUB_PAGES_BASE_PATH || "app/@right/(_PAGES)";

/**
 * Упрощенное определение среды выполнения
 * Логика:
 * - development -> всегда локальная файловая система
 * - production -> всегда GitHub API (если есть конфигурация)
 */
function detectEnvironment(): { useLocal: boolean; source: string; reason: string } {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Development режим - всегда локальные файлы
  if (isDevelopment) {
    return {
      useLocal: true,
      source: "Local FileSystem",
      reason: "Development mode - using local files"
    };
  }

  // Production режим - проверяем наличие GitHub конфигурации
  const hasGitHubConfig = !!(GITHUB_TOKEN && GITHUB_REPO);
  
  if (hasGitHubConfig) {
    return {
      useLocal: false,
      source: "GitHub API",
      reason: "Production mode with GitHub configuration"
    };
  }

  // Fallback - если в production нет GitHub конфигурации, используем локальные файлы
  // (этот случай не должен происходить в нормальном деплойменте)
  console.warn("⚠️ Production mode without GitHub config - falling back to local files");
  return {
    useLocal: true,
    source: "Local FileSystem (Fallback)",
    reason: "Production mode without GitHub config - using local files as fallback"
  };
}

/**
 * Читает содержимое page.tsx файла из локальной файловой системы
 */
async function fetchFileContentFromLocal(filePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), "app", "@right", "(_PAGES)", filePath, "page.tsx");
  
  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    console.log(`✅ Successfully read local file: ${fullPath}`);
    return content;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`Page file not found: ${fullPath}`);
    }
    throw new Error(`Failed to read local file: ${error.message}`);
  }
}

/**
 * Читает содержимое page.tsx файла из GitHub репозитория
 */
async function fetchFileContentFromGitHub(filePath: string): Promise<string> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub configuration missing: GITHUB_TOKEN and GITHUB_REPO are required");
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PAGES_BASE_PATH}/${filePath}/page.tsx`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "NextJS-App"
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Page file not found in GitHub repository: ${filePath}`);
      }
      const errorData = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.content) {
      throw new Error("No content found in GitHub file response");
    }

    const buffer = Buffer.from(data.content, "base64");
    const content = buffer.toString("utf-8");
    console.log(`✅ Successfully fetched from GitHub: ${filePath}`);
    return content;
    
  } catch (error: any) {
    if (error.message.includes("fetch failed") || error.code === 'ENOTFOUND') {
      throw new Error(`GitHub API is unreachable: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Извлекает массив sections из содержимого page.tsx файла
 */
function extractSectionsFromContent(fileContent: string, filePath: string): any[] {
  // Поиск начала массива sections
  const sectionsStartMatch = fileContent.match(/const sections = (\[)/);
  
  if (!sectionsStartMatch) {
    console.warn(`⚠️ No 'const sections = [' found in: ${filePath}`);
    return [];
  }

  // Находим начальную позицию массива
  const startIndex = sectionsStartMatch.index! + 'const sections = '.length;
  let bracketCount = 0;
  let sectionsEnd = -1;
  let inString = false;
  let stringChar = '';

  // Парсим с подсчетом скобок и учетом строк
  for (let i = startIndex; i < fileContent.length; i++) {
    const char = fileContent[i];
    const prevChar = i > 0 ? fileContent[i - 1] : '';
    
    // Обработка строковых литералов
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
      }
    }
    
    // Подсчет скобок только вне строк
    if (!inString) {
      if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          sectionsEnd = i;
          break;
        }
      }
    }
  }

  if (sectionsEnd === -1) {
    throw new Error(`Malformed sections array structure in: ${filePath}`);
  }

  // Извлекаем код массива
  const sectionsCode = fileContent.substring(startIndex, sectionsEnd + 1);
  
  // Пытаемся распарсить как JSON
  try {
    const sections = JSON.parse(sectionsCode);
    console.log(`✅ Parsed ${sections.length} sections as JSON`);
    return sections;
  } catch (jsonError) {
    // Fallback: пытаемся выполнить как JavaScript код
    console.log(`⚠️ JSON parse failed, trying Function evaluation...`);
    try {
      const sections = new Function('return ' + sectionsCode)();
      
      if (!Array.isArray(sections)) {
        throw new Error("Parsed sections is not an array");
      }
      
      console.log(`✅ Parsed ${sections.length} sections via Function evaluation`);
      return sections;
    } catch (evalError) {
      console.error('❌ Both JSON and Function parsing failed');
      console.error('Code snippet:', sectionsCode.substring(0, 200));
      throw new Error("Could not parse sections - invalid structure");
    }
  }
}

/**
 * POST endpoint для чтения секций из page.tsx файлов
 */
export async function POST(request: NextRequest): Promise<NextResponse<ReadSectionsResponse>> {
  try {
    // 1. Валидация входных данных
    const body: ReadSectionsRequest = await request.json();
    const { filePath } = body;

    if (!filePath) {
      return NextResponse.json({
        success: false,
        message: "File path is required"
      }, { status: 400 });
    }

    // Валидация формата пути
    const pathRegex = /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/;
    if (!pathRegex.test(filePath)) {
      return NextResponse.json({
        success: false,
        message: `Invalid file path format: "${filePath}"`
      }, { status: 400 });
    }

    console.log(`🔍 Reading sections from: ${filePath}`);

    // 2. Определение среды выполнения
    const { useLocal, source, reason } = detectEnvironment();
    console.log(`🌍 Environment: ${reason}`);

    // 3. Загрузка содержимого файла
    let fileContent: string;
    
    try {
      if (useLocal) {
        fileContent = await fetchFileContentFromLocal(filePath);
      } else {
        fileContent = await fetchFileContentFromGitHub(filePath);
      }
    } catch (fetchError: any) {
      // Если файл не найден - это не ошибка, возвращаем пустой массив
      if (fetchError.message.includes("not found")) {
        console.warn(`📂 Page file not found: ${filePath}`);
        return NextResponse.json({
          success: true,
          message: `No page file found at path: ${filePath}`,
          sections: [],
          source,
          environment: `${process.env.NODE_ENV} (${reason})`
        });
      }
      
      // Для остальных ошибок пробрасываем наружу
      throw fetchError;
    }

    // 4. Извлечение и парсинг секций
    const sections = extractSectionsFromContent(fileContent, filePath);

    // 5. Логирование информации о секциях
    console.log(`✅ Loaded ${sections.length} sections from ${source}`);
    sections.forEach((section, idx) => {
      console.log(`📋 Section ${idx}: id="${section.id}"`);
      if (section.bodyContent?.content) {
        const contentTypes = section.bodyContent.content.map((item: any) => item.type);
        console.log(`   Content types: [${contentTypes.join(', ')}]`);
        
        if (contentTypes.includes('table')) {
          console.log(`   🔍 TABLE detected in section "${section.id}"`);
        }
      }
    });

    // 6. Возврат успешного результата
    return NextResponse.json({
      success: true,
      message: `Successfully loaded ${sections.length} sections from ${source}`,
      sections,
      source,
      environment: `${process.env.NODE_ENV} (${reason})`
    });

  } catch (error: any) {
    // Централизованная обработка ошибок
    console.error("❌ Error in sections/read route:", error);
    
    return NextResponse.json({
      success: false,
      message: error.message || "Unknown error occurred",
      environment: `${process.env.NODE_ENV}`
    }, { status: 500 });
  }
}
