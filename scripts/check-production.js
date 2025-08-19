#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Check for production readiness
function checkProductionReadiness() {
  const issues = [];

  // Check for environment variables
  const envFile = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envFile)) {
    issues.push("❌ Missing .env.local file");
  }

  // Check for TODO/FIXME comments in production files
  const searchDirs = ["app", "components", "services", "utils", "hooks"];
  const todoPattern = /(TODO|FIXME|HACK|XXX|console\.log|debugger)/gi;

  for (const dir of searchDirs) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      checkDirectoryForIssues(dirPath, todoPattern, issues);
    }
  }

  // Check package.json for dev dependencies in production
  const packageJson = require(path.join(process.cwd(), "package.json"));
  if (packageJson.dependencies) {
    const suspiciousDeps = Object.keys(packageJson.dependencies).filter(
      (dep) =>
        dep.includes("dev") || dep.includes("test") || dep.includes("mock"),
    );
    if (suspiciousDeps.length > 0) {
      issues.push(
        `⚠️  Suspicious dependencies in production: ${suspiciousDeps.join(", ")}`,
      );
    }
  }

  // Check for proper error handling
  const apiDir = path.join(process.cwd(), "app", "api");
  if (fs.existsSync(apiDir)) {
    checkApiErrorHandling(apiDir, issues);
  }

  return issues;
}

function checkDirectoryForIssues(dir, pattern, issues) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      checkDirectoryForIssues(filePath, pattern, issues);
    } else if (
      file.endsWith(".ts") ||
      file.endsWith(".tsx") ||
      file.endsWith(".js") ||
      file.endsWith(".jsx")
    ) {
      const content = fs.readFileSync(filePath, "utf8");
      const matches = content.match(pattern);

      // Skip logger utility as it's designed to have console statements
      const relativeFile = path.relative(process.cwd(), filePath);
      if (relativeFile.includes("logger.ts")) {
        continue;
      }

      if (matches) {
        issues.push(
          `⚠️  Found development code in ${relativeFile}: ${matches.join(", ")}`,
        );
      }
    }
  }
}

function checkApiErrorHandling(apiDir, issues) {
  const files = getAllFiles(apiDir, [".ts", ".js"]);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");

    // Check if API routes have proper error handling
    if (
      content.includes("export async function") &&
      !content.includes("try {")
    ) {
      const relativeFile = path.relative(process.cwd(), file);
      issues.push(`❌ API route missing error handling: ${relativeFile}`);
    }

    // Check for proper status codes
    if (content.includes("NextResponse.json") && !content.includes("status:")) {
      const relativeFile = path.relative(process.cwd(), file);
      issues.push(`⚠️  API route should specify status codes: ${relativeFile}`);
    }
  }
}

function getAllFiles(dir, extensions) {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, extensions));
    } else if (extensions.some((ext) => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

// Run the check
console.log("🔍 Checking production readiness...\n");

const issues = checkProductionReadiness();

if (issues.length === 0) {
  console.log(
    "✅ All checks passed! Your app appears to be production ready.\n",
  );
  process.exit(0);
} else {
  console.log("Issues found:\n");
  issues.forEach((issue) => console.log(issue));
  console.log(
    `\n❌ Found ${issues.length} issue(s) that should be addressed before production deployment.\n`,
  );
  process.exit(1);
}
