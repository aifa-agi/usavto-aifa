// @/lib/escape-utils.ts

/**
 * Escape special characters for safe inclusion in JavaScript template literals
 * 
 * This function escapes characters that have special meaning in template literals:
 * - Backticks (`)
 * - Dollar signs followed by curly braces (${})
 * - Backslashes (\)
 * 
 * ВАЖНО: Эта функция предотвращает:
 * - Legacy octal escapes (\0-\7)
 * - Template literal injection
 * - String interpolation attacks
 * 
 * @param content - Raw content to escape
 * @returns Safely escaped content for template literals
 */
export function escapeForTemplateLiteral(content: string): string {
  if (!content) return "";
  
  return content
    // 1. Экранируем обратные слеши (должно быть первым!)
    .replace(/\\/g, "\\\\")
    
    // 2. Экранируем обратные кавычки
    .replace(/`/g, "\\`")
    
    // 3. Экранируем ${ для предотвращения интерполяции
    .replace(/\$\{/g, "\\${");
}

/**
 * Escape content specifically for TypeScript file generation
 * 
 * More aggressive escaping for content that will be written to .ts files
 * and compiled by Next.js/TypeScript
 * 
 * @param content - Raw content to escape
 * @returns Safely escaped content for .ts files
 */
export function escapeForTypeScriptFile(content: string): string {
  if (!content) return "";
  
  let escaped = content;
  
  // 1. Экранируем обратные слеши (должно быть первым!)
  escaped = escaped.replace(/\\/g, "\\\\");
  
  // 2. Экранируем обратные кавычки
  escaped = escaped.replace(/`/g, "\\`");
  
  // 3. Экранируем ${ для предотвращения интерполяции
  escaped = escaped.replace(/\$\{/g, "\\${");
  
  // 4. ОПЦИОНАЛЬНО: Заменяем переводы строк на явные \n
  // (если хотите сохранить форматирование, закомментируйте)
  // escaped = escaped.replace(/\r\n/g, "\\n").replace(/\n/g, "\\n");
  
  return escaped;
}

/**
 * Sanitize user input for safe storage and display
 * 
 * Removes potentially dangerous characters while preserving readability
 * Use this for user-generated content before storing
 * 
 * @param input - User input to sanitize
 * @returns Sanitized string
 */
export function sanitizeUserInput(input: string): string {
  if (!input) return "";
  
  return input
    // Удаляем null bytes
    .replace(/\0/g, "")
    
    // Нормализуем переводы строк
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    
    // Удаляем управляющие символы (кроме \n, \t)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    
    // Trim whitespace
    .trim();
}

/**
 * Validate that content is safe for template literal inclusion
 * 
 * Returns true if content contains no problematic patterns
 * 
 * @param content - Content to validate
 * @returns Validation result with issues if any
 */
export function validateContentSafety(content: string): {
  isSafe: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!content) {
    return { isSafe: true, issues: [] };
  }
  
  // Проверка на legacy octal escapes (\0-\7 followed by digit)
  if (/\\[0-7]/.test(content)) {
    issues.push("Contains legacy octal escape sequences (e.g., \\0, \\1, \\2)");
  }
  
  // Проверка на неэкранированные обратные кавычки
  if (/(?<!\\)`/.test(content)) {
    issues.push("Contains unescaped backticks");
  }
  
  // Проверка на null bytes
  if (/\0/.test(content)) {
    issues.push("Contains null bytes");
  }
  
  // Проверка на неэкранированную интерполяцию
  if (/(?<!\\)\$\{/.test(content)) {
    issues.push("Contains unescaped template literal interpolation (${...})");
  }
  
  return {
    isSafe: issues.length === 0,
    issues,
  };
}

/**
 * Safe wrapper for template literal generation
 * 
 * Validates, sanitizes, and escapes content before including in template literal
 * Use this when generating TypeScript files with user content
 * 
 * @param content - Raw content
 * @param options - Options for processing
 * @returns Safely processed content
 */
export function prepareContentForCodeGeneration(
  content: string,
  options: {
    sanitize?: boolean;
    validate?: boolean;
    throwOnUnsafe?: boolean;
  } = {}
): string {
  const { 
    sanitize = true, 
    validate = true, 
    throwOnUnsafe = false 
  } = options;
  
  let processed = content;
  
  // 1. Sanitize if requested
  if (sanitize) {
    processed = sanitizeUserInput(processed);
  }
  
  // 2. Validate if requested
  if (validate) {
    const validation = validateContentSafety(processed);
    
    if (!validation.isSafe) {
      const errorMsg = `Unsafe content detected:\n${validation.issues.join("\n")}`;
      
      if (throwOnUnsafe) {
        throw new Error(errorMsg);
      } else {
        console.warn(`[Escape Utils] ${errorMsg}`);
        console.warn("[Escape Utils] Attempting to escape automatically...");
      }
    }
  }
  
  // 3. Escape for TypeScript file
  processed = escapeForTypeScriptFile(processed);
  
  return processed;
}
