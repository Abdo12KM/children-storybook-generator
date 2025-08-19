import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { stories, storyImages } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get story count
    const storyCountResult = await db
      .select({ count: count() })
      .from(stories)
      .where(eq(stories.userId, user.id));

    const storyCount = storyCountResult[0]?.count || 0;

    // Get image count
    const imageCountResult = await db
      .select({ count: count() })
      .from(storyImages)
      .innerJoin(stories, eq(storyImages.storyId, stories.id))
      .where(eq(stories.userId, user.id));

    const imageCount = imageCountResult[0]?.count || 0;

    // Estimate storage used (images and stories)
    // Since we don't store file sizes, we'll estimate:
    // - Average story JSON: ~50KB
    // - Average image: ~500KB (based on typical base64 encoded images)
    const estimatedStorySize = storyCount * 50 * 1024; // 50KB per story
    const estimatedImageSize = imageCount * 500 * 1024; // 500KB per image
    const usedStorageBytes = estimatedStorySize + estimatedImageSize;

    // Set total storage limit (e.g., 5GB per user)
    const totalStorageBytes = 5 * 1024 * 1024 * 1024; // 5GB

    const storageData = {
      used_storage: usedStorageBytes,
      total_storage: totalStorageBytes,
      story_files: storyCount,
      image_files: imageCount,
    };

    return NextResponse.json(storageData);
  } catch (error) {
    console.error("Error fetching storage data:", error);
    return NextResponse.json(
      { error: "Failed to fetch storage data" },
      { status: 500 },
    );
  }
}
