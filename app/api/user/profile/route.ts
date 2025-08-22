import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserService } from "@/services/server";

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

    // Get user profile and preferences
    let profile = await UserService.getUserById(user.id);
    let preferences = await UserService.getUserPreferences(user.id);

    // If user doesn't exist in our database, create them
    if (!profile) {
      try {
        profile = await UserService.createUser({
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name || user.email!.split("@")[0],
          avatarUrl: user.user_metadata?.avatar_url || null,
        });
        // Preferences are created automatically in createUser
        preferences = await UserService.getUserPreferences(user.id);
      } catch (error) {
        console.error("Error creating user profile:", error);
        // Return basic profile from auth data
        profile = {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name || user.email!.split("@")[0],
          avatarUrl: user.user_metadata?.avatar_url || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignIn: null,
          isActive: true,
        };
      }
    }

    // If preferences don't exist, create default ones
    if (!preferences) {
      try {
        preferences = await UserService.createDefaultPreferences(user.id);
      } catch (error) {
        console.error("Error creating default preferences:", error);
        // Return default preferences matching the database schema
        preferences = {
          id: user.id,
          userId: user.id,
          defaultArtStyle: "cartoon",
          defaultStoryLength: "medium",
          defaultDifficulty: "intermediate",
          preferredThemes: ["adventure"],
          theme: "system",
          language: "en",
          emailNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    // Transform the data to match what the frontend expects
    const transformedProfile = {
      full_name: profile.fullName || "",
      email: profile.email,
      avatar_url: profile.avatarUrl,
      bio: null, // This field doesn't exist in the schema yet
      location: null, // This field doesn't exist in the schema yet
      website: null, // This field doesn't exist in the schema yet
      created_at: profile.createdAt.toISOString(),
      story_count: 0, // TODO: Calculate actual count
      collection_count: 0, // TODO: Calculate actual count
      total_reads: 0, // TODO: Calculate actual count
    };

    const transformedPreferences = {
      default_art_style: preferences.defaultArtStyle || "cartoon",
      default_story_length: preferences.defaultStoryLength || "medium",
      default_theme: preferences.preferredThemes?.[0] || "adventure",
      language: preferences.language || "en",
      auto_save: true, // This field doesn't exist in schema yet
      email_notifications: preferences.emailNotifications ?? true,
      push_notifications: true, // This field doesn't exist in schema yet
      marketing_emails: false, // This field doesn't exist in schema yet
      data_collection: true, // This field doesn't exist in schema yet
      public_profile: false, // This field doesn't exist in schema yet
      show_reading_progress: true, // This field doesn't exist in schema yet
      dark_mode: preferences.theme || "system",
    };

    return NextResponse.json({
      profile: transformedProfile,
      preferences: transformedPreferences,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
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

    // Get profile data from request body
    const { profile, preferences } = await request.json();

    let updatedProfile = null;
    let updatedPreferences = null;

    // Update profile if provided
    if (profile) {
      updatedProfile = await UserService.updateUser(user.id, profile);
    }

    // Update preferences if provided
    if (preferences) {
      updatedPreferences = await UserService.updateUserPreferences(
        user.id,
        preferences,
      );
    }

    return NextResponse.json({
      profile: updatedProfile,
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
