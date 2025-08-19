import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DatabaseStoryService } from "@/services/server";

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

    // Get user's stories
    const stories = await DatabaseStoryService.getUserStories(user.id);

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching user stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    // Get story ID from URL or body
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get("id");

    if (!storyId) {
      return NextResponse.json(
        { error: "Story ID is required" },
        { status: 400 },
      );
    }

    // Delete the story
    await DatabaseStoryService.deleteStory(storyId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 },
    );
  }
}
