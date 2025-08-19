import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DatabaseStoryService } from "@/services/database-story";

export async function POST(request: NextRequest) {
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

    const { storyId } = await request.json();

    if (!storyId) {
      return NextResponse.json(
        { error: "Story ID is required" },
        { status: 400 },
      );
    }

    // Get the story to verify ownership and get details
    const story = await DatabaseStoryService.getStoryById(storyId);

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only share your own stories" },
        { status: 403 },
      );
    }

    // Generate a shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/story/${storyId}?shared=true`;

    return NextResponse.json(
      {
        shareUrl,
        title: story.title,
        description: `Check out this children's story: ${story.title}`,
        storyId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sharing story:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
