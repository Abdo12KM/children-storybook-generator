import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserService } from "@/services/server";
import { CollectionService } from "@/services/collections";

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

    // Get user profile
    const userProfile = await UserService.getUserById(user.id);

    // Get user stories
    const userStories = await UserService.getUserStories(user.id);

    // Get user collections
    const userCollections = await CollectionService.getUserCollections(user.id);

    // Get user preferences (if stored separately)
    // This would depend on your schema

    // Compile all user data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        ...userProfile,
      },
      stories: userStories,
      collections: userCollections,
      preferences: {
        // Add any user preferences here
      },
      statistics: {
        totalStories: userStories.length,
        totalCollections: userCollections.length,
        favoriteStories: userStories.filter((story) => story.isFavorite).length,
      },
    };

    return NextResponse.json(exportData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="user-data-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
