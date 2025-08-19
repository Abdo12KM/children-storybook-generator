import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  DatabaseStoryService,
  mapStoryResponseToDbFormat,
} from "@/services/server";

export async function POST(request: NextRequest) {
  try {
    const { storyData, generatedStory } = await request.json();

    // Verify the user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Convert to database format and save
    const dbStoryData = mapStoryResponseToDbFormat(
      generatedStory,
      user.id,
      storyData,
    );
    const savedStory = await DatabaseStoryService.createStory(dbStoryData);

    // If there are images, save them too
    if (
      generatedStory.pages &&
      generatedStory.pages.some((p: any) => p.imageUrl)
    ) {
      const imageData = generatedStory.pages
        .filter((page: any) => page.imageUrl)
        .map((page: any, index: number) => ({
          storyId: savedStory.id,
          pageNumber: index + 1,
          imageUrl: page.imageUrl!,
          imagePrompt: page.imagePrompt || "",
          altText: `Illustration for page ${index + 1}: ${page.content.substring(0, 50)}...`,
        }));

      await DatabaseStoryService.addStoryImages(imageData);
    }

    return NextResponse.json({ success: true, story: savedStory });
  } catch (error) {
    console.error("Error saving story:", error);
    return NextResponse.json(
      { error: "Failed to save story" },
      { status: 500 },
    );
  }
}
