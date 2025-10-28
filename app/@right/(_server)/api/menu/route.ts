// app/@right/(_server)/api/menu//route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/app/@left/(_sub_domains)/(_AUTH)/(_service)/(_actions)/auth";

/**
 * Menu read route with role-based data source selection and rate limit tracking
 * 
 * Architecture:
 * 1. Get current user session via NextAuth
 * 2. Determine if user has privileged role (architect, admin, editor)
 * 3. In production:
 *    - Privileged users → GitHub API (fresh data, with rate limit tracking)
 *    - Regular/guest users → Local filesystem (static data, no limits)
 * 4. In development:
 *    - All users → Local filesystem
 * 
 * Goal: Optimize GitHub API rate limits while providing rate limit visibility to admins
 */

// -------------------- Types --------------------

interface RateLimitInfo {
  remaining: number;
  total: number;
  used: number;
  resetAt: string; // ISO 8601 timestamp
  percentUsed: number;
  willResetIn: string; // Human-readable format: "in 45 minutes" or "in 1 hour"
}

interface ReadMenuResponse {
  success: boolean;
  message: string;
  categories?: unknown[];
  source?: "Local FileSystem" | "GitHub API";
  environment?: string;
  userRole?: string;
  isPrivileged?: boolean;
  rateLimitInfo?: RateLimitInfo; // Only present when source is GitHub API
}

interface ReadMenuBody {
  filePath?: string;
}

type UserRole = 
  | "guest" 
  | "architect" 
  | "admin" 
  | "editor" 
  | "authUser" 
  | "subscriber" 
  | "customer" 
  | "apiUser";

// -------------------- Config --------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || "config/content/content-data.ts";

const PROJECT_ROOT = process.cwd();

const PRIVILEGED_ROLES: UserRole[] = ["architect", "admin", "editor"];

// -------------------- Helpers --------------------

function getEnvMode(): "development" | "production" {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

function isPrivilegedRole(role?: string | null): boolean {
  if (!role) return false;
  return PRIVILEGED_ROLES.includes(role as UserRole);
}

/**
 * Extract user role from NextAuth session
 * Uses session.user.type field as defined in auth.ts
 */
function getUserRole(session: any): UserRole {
  const userType = session?.user?.type;
  
  if (!userType) return "guest";
  
  const validRoles: UserRole[] = [
    "guest", "architect", "admin", "editor", 
    "authUser", "subscriber", "customer", "apiUser"
  ];
  
  return validRoles.includes(userType as UserRole) ? (userType as UserRole) : "guest";
}

function resolveLocalAbsolutePath(relPath: string): string {
  const safeRel = relPath.startsWith("/") ? relPath.slice(1) : relPath;
  const abs = path.join(PROJECT_ROOT, safeRel);
  const normalized = path.normalize(abs);
  if (!normalized.startsWith(PROJECT_ROOT)) {
    throw new Error("Unsafe path");
  }
  return normalized;
}

async function readMenuFromLocal(requestId: string): Promise<string> {
  const absolute = resolveLocalAbsolutePath(GITHUB_FILE_PATH);
  
  console.log(`[${requestId}] 📁 READING FROM LOCAL FILESYSTEM`);
  console.log(`[${requestId}] 📂 Absolute path: ${absolute}`);
  
  const startTime = Date.now();
  
  try {
    const content = await fs.readFile(absolute, "utf-8");
    const duration = Date.now() - startTime;
    
    console.log(`[${requestId}] ✅ LOCAL READ SUCCESS (${duration}ms)`);
    console.log(`[${requestId}] 📊 Content length: ${content.length} bytes`);
    
    return content;
  } catch (err: any) {
    const duration = Date.now() - startTime;
    
    console.error(`[${requestId}] ❌ LOCAL READ FAILED (${duration}ms)`);
    console.error(`[${requestId}] 🔴 Error: ${err?.code || err?.message || err}`);
    
    if (err?.code === "ENOENT") {
      throw new Error("Menu file not found in local filesystem");
    }
    throw err;
  }
}

/**
 * Read menu from GitHub API with full rate limit tracking
 * Returns both content and rate limit information for admin visibility
 */
/**
 * Read menu from GitHub API with support for files up to 100MB
 * For files > 1MB, uses raw media type to bypass base64 encoding limit
 */
async function readMenuFromGitHub(requestId: string): Promise<{
  content: string;
  rateLimitInfo: RateLimitInfo;
}> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub config missing");
  }
  
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
  
  console.log(`[${requestId}] 🌐 READING FROM GITHUB API`);
  console.log(`[${requestId}] 🔗 URL: ${apiUrl}`);
  console.log(`[${requestId}] 🔑 Token configured: YES`);
  console.log(`[${requestId}] ⚠️  GitHub API rate limit will be consumed`);
  
  const startTime = Date.now();
  
  try {
    // ВАЖНО: используем raw media type для поддержки файлов > 1MB (до 100MB)
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.raw+json", // изменено с "application/vnd.github.v3+json"
        "User-Agent": "NextJS-App",
      },
      cache: "no-store",
    });
    
    const duration = Date.now() - startTime;
    
    // Extract rate limit information
    const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
    const rateLimitTotal = res.headers.get("x-ratelimit-limit");
    const rateLimitUsed = res.headers.get("x-ratelimit-used");
    const rateLimitReset = res.headers.get("x-ratelimit-reset");
    
    const remaining = rateLimitRemaining ? parseInt(rateLimitRemaining) : 0;
    const total = rateLimitTotal ? parseInt(rateLimitTotal) : 5000;
    const used = rateLimitUsed ? parseInt(rateLimitUsed) : 0;
    const resetTimestamp = rateLimitReset ? parseInt(rateLimitReset) * 1000 : Date.now() + 3600000;
    const resetDate = new Date(resetTimestamp);
    const percentUsed = total > 0 ? Math.round((used / total) * 100) : 0;
    
    const now = Date.now();
    const msUntilReset = resetTimestamp - now;
    const minutesUntilReset = Math.ceil(msUntilReset / 60000);
    const hoursUntilReset = Math.ceil(msUntilReset / 3600000);
    
    let willResetIn = "";
    if (minutesUntilReset < 60) {
      willResetIn = `in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}`;
    } else if (hoursUntilReset === 1) {
      willResetIn = "in 1 hour";
    } else if (hoursUntilReset === 2) {
      willResetIn = "in 1-2 hours";
    } else {
      willResetIn = `in ${hoursUntilReset} hours`;
    }
    
    const rateLimitInfo: RateLimitInfo = {
      remaining,
      total,
      used,
      resetAt: resetDate.toISOString(),
      percentUsed,
      willResetIn,
    };
    
    console.log(`[${requestId}] 📡 GitHub response: ${res.status} (${duration}ms)`);
    console.log(`[${requestId}] 📊 GitHub API usage: ${used}/${total} (${percentUsed}% used)`);
    console.log(`[${requestId}] 📊 Remaining: ${remaining} requests`);
    console.log(`[${requestId}] 📊 Limit resets ${willResetIn}`);
    
    if (!res.ok) {
      const text = await res.text();
      console.error(`[${requestId}] ❌ GITHUB READ FAILED`);
      console.error(`[${requestId}] 🔴 Status: ${res.status}`);
      console.error(`[${requestId}] 🔴 Response: ${text.substring(0, 200)}`);
      
      if (res.status === 404) {
        throw new Error("Menu file not found in GitHub repository");
      }
      
      if (res.status === 403 || res.status === 429) {
        throw new Error(`GitHub rate limit exceeded. Limit resets ${willResetIn}.`);
      }
      
      throw new Error(`GitHub API error: ${res.status} - ${text}`);
    }
    
    // При использовании raw media type ответ приходит как plain text, не JSON
    const content = await res.text();
    
    console.log(`[${requestId}] ✅ GITHUB READ SUCCESS`);
    console.log(`[${requestId}] 📊 Content length: ${content.length} bytes`);
    console.log(`[${requestId}] 📊 Using raw media type (supports files up to 100MB)`);
    
    return {
      content,
      rateLimitInfo,
    };
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] ❌ GITHUB REQUEST EXCEPTION (${duration}ms)`);
    console.error(`[${requestId}] 🔴 Error: ${err?.message || err}`);
    throw err;
  }
}


function extractAndParseMenuCategories(source: string): unknown[] {
  const patterns = [
    /export\s+const\s+menuCategories\s*=\s*(\[)/,
    /const\s+menuCategories\s*=\s*(\[)/,
    /export\s+const\s+categories\s*=\s*(\[)/,
    /const\s+categories\s*=\s*(\[)/,
  ];

  let startIndex = -1;
  for (const re of patterns) {
    const m = source.match(re);
    if (m && typeof m.index === "number") {
      startIndex = m.index + m[0].lastIndexOf(m[1]);
      break;
    }
  }

  if (startIndex === -1) {
    const any = source.indexOf("[");
    if (any >= 0) startIndex = any;
    else return [];
  }

  let depth = 0;
  let endIndex = -1;
  let inString = false;
  let stringChar = "";

  for (let i = startIndex; i < source.length; i++) {
    const ch = source[i];
    const prev = i > 0 ? source[i - 1] : "";

    if ((ch === '"' || ch === "'" || ch === "`") && prev !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = ch;
      } else if (ch === stringChar) {
        inString = false;
        stringChar = "";
      }
    }

    if (!inString) {
      if (ch === "[") depth++;
      else if (ch === "]") {
        depth--;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }
  }

  if (endIndex === -1) {
    throw new Error("Could not find a closing bracket for menu categories array");
  }

  const literal = source.substring(startIndex, endIndex + 1).trim();

  try {
    return JSON.parse(literal);
  } catch {
    try {
      // eslint-disable-next-line no-new-func
      const evaluate = new Function(`"use strict"; return (${literal});`);
      const value = evaluate();
      if (!Array.isArray(value)) throw new Error("Parsed menu categories is not an array");
      return value;
    } catch {
      throw new Error("Could not parse menu categories from file");
    }
  }
}

// -------------------- HTTP handler --------------------

export async function POST(req: NextRequest): Promise<NextResponse<ReadMenuResponse>> {
  const requestId = crypto.randomUUID();
  
  console.log(`\n${"=".repeat(70)}`);
  console.log(`[${requestId}] 🚀 NEW MENU READ REQUEST`);
  console.log(`${"=".repeat(70)}`);
  
  const environment = getEnvMode();
  let session: any = null;
  let userRole: UserRole = "guest";
  let isPrivileged = false;
  let rateLimitInfo: RateLimitInfo | undefined = undefined;

  try {
    session = await auth();
    userRole = getUserRole(session);
    isPrivileged = isPrivilegedRole(userRole);
    
    console.log(`[${requestId}] 👤 USER SESSION INFO:`);
    console.log(`[${requestId}] 👤 Authenticated: ${session ? "YES" : "NO"}`);
    console.log(`[${requestId}] 👤 User email: ${session?.user?.email || "N/A"}`);
    console.log(`[${requestId}] 👤 User role: ${userRole}`);
    console.log(`[${requestId}] 👤 Privileged access: ${isPrivileged ? "YES ✅" : "NO ❌"}`);
    
    if (isPrivileged) {
      console.log(`[${requestId}] 🔑 PRIVILEGED USER DETECTED`);
      console.log(`[${requestId}] 🔑 Role "${userRole}" has access to fresh GitHub data`);
    } else {
      console.log(`[${requestId}] 📢 REGULAR USER DETECTED`);
      console.log(`[${requestId}] 📢 Role "${userRole}" will use static filesystem data`);
    }
  } catch (err) {
    console.error(`[${requestId}] ⚠️  Failed to get session:`, err);
    console.log(`[${requestId}] 👤 Defaulting to guest user (no session)`);
  }

  console.log(`[${requestId}] 🔧 Environment: ${environment}`);
  console.log(`[${requestId}] 🔧 GitHub Token exists: ${!!GITHUB_TOKEN}`);
  console.log(`[${requestId}] 🔧 GitHub Repo: ${GITHUB_REPO || "NOT SET"}`);
  console.log(`[${requestId}] 🔧 File path: ${GITHUB_FILE_PATH}`);

  try {
    let raw = "";
    let source: ReadMenuResponse["source"];

    if (environment === "production") {
      if (isPrivileged && GITHUB_TOKEN && GITHUB_REPO) {
        console.log(`[${requestId}] ⚙️  DECISION: GITHUB API`);
        console.log(`[${requestId}] ⚙️  Reason: Production + Privileged user (${userRole}) + GitHub configured`);
        
        const githubResponse = await readMenuFromGitHub(requestId);
        raw = githubResponse.content;
        rateLimitInfo = githubResponse.rateLimitInfo;
        source = "GitHub API";
      } else {
        console.log(`[${requestId}] ⚙️  DECISION: LOCAL FILESYSTEM`);
        if (!isPrivileged) {
          console.log(`[${requestId}] ⚙️  Reason: Regular user (${userRole}) → serve static data`);
        } else if (!GITHUB_TOKEN || !GITHUB_REPO) {
          console.log(`[${requestId}] ⚙️  Reason: GitHub not configured (fallback to local)`);
        }
        raw = await readMenuFromLocal(requestId);
        source = "Local FileSystem";
      }
    } else {
      console.log(`[${requestId}] ⚙️  DECISION: LOCAL FILESYSTEM`);
      console.log(`[${requestId}] ⚙️  Reason: Development environment`);
      raw = await readMenuFromLocal(requestId);
      source = "Local FileSystem";
    }

    console.log(`[${requestId}] 🔍 Parsing menu categories...`);
    const categories = extractAndParseMenuCategories(raw);
    
    if (!Array.isArray(categories)) {
      console.error(`[${requestId}] ❌ Parsed data is not an array`);
      return NextResponse.json(
        { 
          success: false, 
          message: "Menu data is not an array", 
          source, 
          environment,
          userRole,
          isPrivileged,
          rateLimitInfo,
        },
        { status: 500 }
      );
    }

    console.log(`[${requestId}] ✅ Successfully parsed ${categories.length} categories`);
    console.log(`[${requestId}] 🎯 FINAL SOURCE: ${source}`);
    console.log(`[${requestId}] 🎯 USER: ${userRole} (privileged: ${isPrivileged})`);
    console.log(`${"=".repeat(70)}\n`);

    return NextResponse.json({
      success: true,
      message: `Menu categories loaded successfully from ${source}`,
      categories,
      source,
      environment,
      userRole,
      isPrivileged,
      rateLimitInfo,
    });
  } catch (e: any) {
    const msg = String(e?.message || e || "Unknown error");
    
    console.error(`[${requestId}] 💥 REQUEST FAILED`);
    console.error(`[${requestId}] 🔴 Error message: ${msg}`);
    console.error(`[${requestId}] 🔴 Stack: ${e?.stack || "N/A"}`);
    console.log(`${"=".repeat(70)}\n`);
    
    if (msg.includes("not found")) {
      return NextResponse.json({
        success: true,
        message: `No menu file found`,
        categories: [],
        source: environment === "production" 
          ? (isPrivileged && GITHUB_TOKEN && GITHUB_REPO ? "GitHub API" : "Local FileSystem") 
          : "Local FileSystem",
        environment,
        userRole,
        isPrivileged,
        rateLimitInfo,
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        message: msg,
        source: environment === "production" 
          ? (isPrivileged && GITHUB_TOKEN && GITHUB_REPO ? "GitHub API" : "Local FileSystem") 
          : "Local FileSystem",
        environment,
        userRole,
        isPrivileged,
        rateLimitInfo,
      },
      { status: 500 }
    );
  }
}
