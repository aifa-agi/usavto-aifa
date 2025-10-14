// app/@right/(_server)/api/menu/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/app/@left/(_public)/(_AUTH)/(_service)/(_actions)/auth";


/**
 * Menu read route with role-based data source selection
 * 
 * Architecture:
 * 1. Get current user session via NextAuth
 * 2. Determine if user has privileged role (architect, admin, editor)
 * 3. In production:
 *    - Privileged users → GitHub API (fresh data, low frequency)
 *    - Regular/guest users → Local filesystem (static data, high frequency)
 * 4. In development:
 *    - All users → Local filesystem
 * 
 * Goal: Optimize GitHub API rate limits by serving static data to most users
 * while privileged users always get fresh content for admin operations
 */

// -------------------- Types --------------------

interface ReadMenuResponse {
  success: boolean;
  message: string;
  categories?: unknown[];
  source?: "Local FileSystem" | "GitHub API";
  environment?: string;
  userRole?: string; // Log which role accessed the endpoint
  isPrivileged?: boolean; // Log if user has privileged access
}

interface ReadMenuBody {
  filePath?: string;
}

// User role type based on your schema
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
const DEFAULT_GITHUB_FILE_PATH =
  process.env.GITHUB_FILE_PATH || "config/content/content-data.ts";

const PROJECT_ROOT = process.cwd();

// Define privileged roles that can access GitHub API in production
const PRIVILEGED_ROLES: UserRole[] = ["architect", "admin", "editor"];

// -------------------- Helpers --------------------

function getEnvMode(): "development" | "production" {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

/**
 * Check if user has privileged role
 */
function isPrivilegedRole(role?: string | null): boolean {
  if (!role) return false;
  return PRIVILEGED_ROLES.includes(role as UserRole);
}

/**
 * Get user role from session with fallback to guest
 */
function getUserRole(session: any): UserRole {
  // Adjust this path based on your NextAuth session structure
  // Common paths: session?.user?.role or session?.role
  const role = session?.user?.role || session?.role;
  
  if (!role) return "guest";
  
  // Validate role is one of allowed types
  const validRoles: UserRole[] = [
    "guest", "architect", "admin", "editor", 
    "authUser", "subscriber", "customer", "apiUser"
  ];
  
  return validRoles.includes(role as UserRole) ? (role as UserRole) : "guest";
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

async function readMenuFromLocal(filePath: string, requestId: string): Promise<string> {
  const absolute = resolveLocalAbsolutePath(filePath);
  
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

async function readMenuFromGitHub(filePath: string, requestId: string): Promise<string> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub config missing");
  }
  
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  
  console.log(`[${requestId}] 🌐 READING FROM GITHUB API`);
  console.log(`[${requestId}] 🔗 URL: ${apiUrl}`);
  console.log(`[${requestId}] 🔑 Token configured: YES`);
  console.log(`[${requestId}] ⚠️  GitHub API rate limit will be consumed`);
  
  const startTime = Date.now();
  
  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NextJS-App",
      },
      cache: "no-store",
    });
    
    const duration = Date.now() - startTime;
    
    // Log rate limit info from headers if available
    const rateLimit = res.headers.get("x-ratelimit-remaining");
    const rateLimitTotal = res.headers.get("x-ratelimit-limit");
    
    console.log(`[${requestId}] 📡 GitHub response: ${res.status} (${duration}ms)`);
    if (rateLimit && rateLimitTotal) {
      console.log(`[${requestId}] 📊 GitHub API remaining: ${rateLimit}/${rateLimitTotal}`);
    }
    
    if (!res.ok) {
      const text = await res.text();
      console.error(`[${requestId}] ❌ GITHUB READ FAILED`);
      console.error(`[${requestId}] 🔴 Status: ${res.status}`);
      console.error(`[${requestId}] 🔴 Response: ${text.substring(0, 200)}`);
      
      if (res.status === 404) {
        throw new Error("Menu file not found in GitHub repository");
      }
      throw new Error(`GitHub API error: ${res.status} - ${text}`);
    }
    
    const json = (await res.json()) as { content?: string; encoding?: string };
    
    if (!json.content) {
      console.error(`[${requestId}] ❌ No content in GitHub response`);
      throw new Error("No content found in GitHub file response");
    }
    
    const content = Buffer.from(json.content, "base64").toString("utf-8");
    
    console.log(`[${requestId}] ✅ GITHUB READ SUCCESS`);
    console.log(`[${requestId}] 📊 Content length: ${content.length} bytes`);
    console.log(`[${requestId}] 📊 Encoding: ${json.encoding || "unknown"}`);
    
    return content;
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
  let filePath: string = DEFAULT_GITHUB_FILE_PATH;

  // Get user session
  let session: any = null;
  let userRole: UserRole = "guest";
  let isPrivileged = false;

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
  console.log(`[${requestId}] 🔧 Default file path: ${DEFAULT_GITHUB_FILE_PATH}`);

  try {
    const body = (await req.json().catch(() => ({}))) as ReadMenuBody;
    if (body?.filePath && typeof body.filePath === "string" && body.filePath.trim()) {
      filePath = body.filePath.trim();
      console.log(`[${requestId}] 📝 Custom file path requested: ${filePath}`);
    }
  } catch {
    // ignore body parse errors
  }

  try {
    let raw = "";
    let source: ReadMenuResponse["source"];

    // Data source decision logic
    if (environment === "production") {
      // Production: check if user is privileged AND GitHub is configured
      if (isPrivileged && GITHUB_TOKEN && GITHUB_REPO) {
        console.log(`[${requestId}] ⚙️  DECISION: GITHUB API`);
        console.log(`[${requestId}] ⚙️  Reason: Production + Privileged user (${userRole}) + GitHub configured`);
        raw = await readMenuFromGitHub(filePath, requestId);
        source = "GitHub API";
      } else {
        console.log(`[${requestId}] ⚙️  DECISION: LOCAL FILESYSTEM`);
        if (!isPrivileged) {
          console.log(`[${requestId}] ⚙️  Reason: Regular user (${userRole}) → serve static data`);
        } else if (!GITHUB_TOKEN || !GITHUB_REPO) {
          console.log(`[${requestId}] ⚙️  Reason: GitHub not configured (fallback to local)`);
        }
        raw = await readMenuFromLocal(filePath, requestId);
        source = "Local FileSystem";
      }
    } else {
      // Development: always local
      console.log(`[${requestId}] ⚙️  DECISION: LOCAL FILESYSTEM`);
      console.log(`[${requestId}] ⚙️  Reason: Development environment`);
      raw = await readMenuFromLocal(filePath, requestId);
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
          isPrivileged
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
      isPrivileged
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
        isPrivileged
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
        isPrivileged
      },
      { status: 500 }
    );
  }
}
