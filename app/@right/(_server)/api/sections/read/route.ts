// @/app/api/read-sections/route.ts
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

// GitHub API configuration - обновленные пути
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_PAGES_BASE_PATH = process.env.GITHUB_PAGES_BASE_PATH || "app/@right/(_PAGES)";

/**
* Автоматическое определение среды выполнения
*/
function detectEnvironment(): { isDevelopment: boolean; useLocal: boolean; reason: string } {
    const nodeEnv = process.env.NODE_ENV;
    const hasGitHubConfig = !!(GITHUB_TOKEN && GITHUB_REPO);
    const localPath = path.join(process.cwd(), "app", "@right", "(_PAGES)");
    let hasLocalFiles = false;
    try {
        const fs_sync = require('fs');
        const stats = fs_sync.statSync(localPath);
        hasLocalFiles = stats.isDirectory();
    } catch (error) {
        hasLocalFiles = false;
    }

    const isVercel = !!process.env.VERCEL;
    const isNetlify = !!process.env.NETLIFY;
    const isLocal = !isVercel && !isNetlify && (
    process.env.PWD?.includes('/Users/') ||
    process.env.PWD?.includes('/home/') ||
    process.env.USERPROFILE?.includes('\\Users\\') ||
    process.env.COMPUTERNAME ||
    !!process.env.USERNAME
    );

    if (nodeEnv === 'development') {
        if (hasLocalFiles) {
            return {
            isDevelopment: true,
            useLocal: true,
            reason: "Development mode with local page files available"
            };
        } else if (hasGitHubConfig) {
            return {
            isDevelopment: true,
            useLocal: false,
            reason: "Development mode but no local page files, using GitHub"
            };
        }
    }

    if (nodeEnv === 'production') {
        if (hasGitHubConfig) {
            return {
            isDevelopment: false,
            useLocal: false,
            reason: "Production mode with GitHub config"
            };
        } else if (hasLocalFiles && isLocal) {
            return {
            isDevelopment: false,
            useLocal: true,
            reason: "Production mode locally with local page files"
            };
        }
    }

    if (hasLocalFiles && isLocal) {
        return {
            isDevelopment: true,
            useLocal: true,
            reason: "Local environment detected with local page files"
        };
    }

    if (hasGitHubConfig && (isVercel || isNetlify)) {
        return {
            isDevelopment: false,
            useLocal: false,
            reason: "Cloud deployment detected with GitHub config"
        };
    }

    if (hasGitHubConfig) {
        return {
            isDevelopment: false,
            useLocal: false,
            reason: "Fallback to GitHub (only available option)"
        };
    }

    return {
        isDevelopment: true,
        useLocal: true,
        reason: "No valid config found, attempting local page files"
    };
}

/**
* Читает page.tsx файлы из новой структуры
*/
async function fetchFileContentFromLocal(filePath: string): Promise<string> {
    const fullPath = path.join(process.cwd(), "app", "@right", "(_PAGES)", filePath, "page.tsx");
    try {
        const content = await fs.readFile(fullPath, 'utf-8');
        return content;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            throw new Error("Page file not found in local filesystem");
        }
        throw error;
    }
}

/**
* Читает page.tsx файлы из GitHub
*/
async function fetchFileContentFromGitHub(filePath: string): Promise<string> {
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
        throw new Error("GitHub configuration missing: GITHUB_TOKEN and GITHUB_REPO are required");
    }
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PAGES_BASE_PATH}/${filePath}/page.tsx`;
    const response = await fetch(apiUrl, {
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "NextJS-App"
        }
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Page file not found in GitHub repository");
        }
        const errorData = await response.text();
        throw new Error(`GitHub API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    if (!data.content) {
        throw new Error("No content found in GitHub file response");
    }
    const buffer = Buffer.from(data.content, "base64");
    return buffer.toString("utf-8");
}

export async function POST(request: NextRequest): Promise<NextResponse<ReadSectionsResponse>> {
    try {
        const body: ReadSectionsRequest = await request.json();
        const { filePath } = body;
        console.log(`🔍 Received request to read sections from filePath: ${filePath}`);

        if (!filePath) {
            return NextResponse.json({
                success: false,
                message: "File path is required"
            }, { status: 400 });
        }

        const pathRegex = /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/;
        if (!pathRegex.test(filePath)) {
            return NextResponse.json({
                success: false,
                message: `Invalid file path format. Path "${filePath}" is not allowed.`
            }, { status: 400 });
        }

        const { isDevelopment, useLocal, reason } = detectEnvironment();
        console.log(`🌍 Environment Detection: ${reason} (Development: ${isDevelopment}, UseLocal: ${useLocal})`);

        try {
            let fileContent: string;
            let source: string;

            if (useLocal) {
                console.log(`📁 Reading page from LOCAL filesystem: ${filePath}`);
                fileContent = await fetchFileContentFromLocal(filePath);
                source = "Local FileSystem";
            } else {
                console.log(`🔗 Reading page from GITHUB repository: ${filePath}`);
                fileContent = await fetchFileContentFromGitHub(filePath);
                source = "GitHub API";
            }

            console.log(`📄 File content length: ${fileContent.length} characters`);

            // ✅ ИСПРАВЛЕННАЯ ЛОГИКА ПАРСИНГА
            const sectionsStartMatch = fileContent.match(/const sections = (\[)/);
            
            if (!sectionsStartMatch) {
                console.warn(`❌ No 'const sections = [' found in page file: ${filePath}`);
                return NextResponse.json({
                    success: true,
                    message: `No sections found in page file from ${source}`,
                    sections: [],
                    source,
                    environment: `${process.env.NODE_ENV} (${reason})`
                });
            }

            // Находим начальную позицию массива
            const startIndex = sectionsStartMatch.index! + 'const sections = '.length;
            let bracketCount = 0;
            let sectionsEnd = -1;
            let inString = false;
            let stringChar = '';

            // Парсим с подсчетом скобок и учетом строк для корректного определения конца массива
            for (let i = startIndex; i < fileContent.length; i++) {
                const char = fileContent[i];
                const prevChar = i > 0 ? fileContent[i - 1] : '';
                
                // Обработка строк
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
                console.error(`❌ Could not find closing bracket for sections array in: ${filePath}`);
                return NextResponse.json({
                    success: false,
                    message: "Could not parse sections - malformed array structure",
                    source,
                    environment: `${process.env.NODE_ENV} (${reason})`
                }, { status: 500 });
            }

            // Извлекаем код секций с правильными границами
            const sectionsCode = fileContent.substring(startIndex, sectionsEnd + 1);
            console.log(`📝 Sections code length: ${sectionsCode.length} characters`);
            console.log(`🔍 Sections preview: ${sectionsCode.substring(0, 200)}...`);

            let sections;
            try {
                // ✅ БЕЗОПАСНЫЙ ПАРСИНГ JSON
                sections = JSON.parse(sectionsCode);
                console.log(`✅ Successfully parsed sections as JSON`);
            } catch (jsonError) {
                console.log(`⚠️ JSON parse failed, trying Function evaluation...`);
                try {
                    // Fallback к Function eval если это JS объект
                    sections = new Function('return ' + sectionsCode)();
                    console.log(`✅ Successfully parsed sections via Function evaluation`);
                } catch (evalError) {
                    console.error('❌ Both JSON and Function parsing failed:', evalError);
                    console.error('📄 Problematic sections code:', sectionsCode.substring(0, 500));
                    return NextResponse.json({
                        success: false,
                        message: "Could not parse sections from page file - invalid structure",
                        source,
                        environment: `${process.env.NODE_ENV} (${reason})`
                    }, { status: 500 });
                }
            }

            if (!Array.isArray(sections)) {
                console.error(`❌ Parsed sections is not an array:`, typeof sections);
                return NextResponse.json({
                    success: false,
                    message: "Sections data is not an array",
                    source,
                    environment: `${process.env.NODE_ENV} (${reason})`
                }, { status: 500 });
            }

            console.log(`✅ Successfully parsed ${sections.length} sections from ${source}`);
            
            // ✅ ДОПОЛНИТЕЛЬНОЕ ЛОГИРОВАНИЕ ДЛЯ ОТЛАДКИ
            sections.forEach((section, idx) => {
                console.log(`📋 Section ${idx}: id="${section.id}", has bodyContent: ${!!section.bodyContent}`);
                if (section.bodyContent?.content) {
                    const contentTypes = section.bodyContent.content.map((item: any) => item.type);
                    console.log(`   Content types: [${contentTypes.join(', ')}]`);
                    
                    // Специально проверяем наличие таблиц
                    const hasTable = contentTypes.includes('table');
                    if (hasTable) {
                        console.log(`   🔍 TABLE FOUND in section ${section.id}!`);
                    }
                }
            });

            return NextResponse.json({
                success: true,
                message: `Sections loaded successfully from ${source}`,
                sections,
                source,
                environment: `${process.env.NODE_ENV} (${reason})`
            });

        } catch (fetchError: any) {
            const source = useLocal ? "Local FileSystem" : "GitHub API";
            if (fetchError.message.includes("not found")) {
                console.warn(`📂 Page file not found: ${filePath}`);
                return NextResponse.json({
                    success: true,
                    message: `No page file found in ${source}`,
                    sections: [],
                    source,
                    environment: `${process.env.NODE_ENV} (${reason})`
                });
            }
            console.error(`❌ Error fetching from ${source}:`, fetchError);
            throw fetchError;
        }

    } catch (error) {
        console.error("❌ Error reading page sections:", error);
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown error occurred",
            environment: `${process.env.NODE_ENV}`
        }, { status: 500 });
    }
}
