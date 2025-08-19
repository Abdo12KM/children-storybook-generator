// Environment variable validation for production
export function validateEnvironment() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "GOOGLE_GENERATIVE_AI_API_KEY",
    "DATABASE_URL",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please check your .env.local file and ensure all required variables are set.",
    );
  }

  // Validate URLs
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  ) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL");
  }

  if (process.env.DATABASE_URL && !isValidUrl(process.env.DATABASE_URL)) {
    throw new Error("DATABASE_URL must be a valid URL");
  }

  // Validate API key format
  if (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
    process.env.GOOGLE_GENERATIVE_AI_API_KEY.length < 10
  ) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY appears to be invalid");
  }
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Production environment checks
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

// Initialize environment validation
if (typeof window === "undefined") {
  // Only run on server side
  try {
    validateEnvironment();
  } catch (error) {
    console.error("Environment validation failed:", error);
    if (isProduction()) {
      throw error; // Fail hard in production
    }
  }
}
