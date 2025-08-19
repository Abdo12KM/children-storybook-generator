import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserService } from "@/services/server";

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

    // First, delete all user data from the database
    try {
      // Delete user stories, collections, and profile data
      await UserService.deleteUserCompletely(user.id);
    } catch (dbError) {
      console.error("Error deleting user data from database:", dbError);
      // Continue with auth deletion even if DB deletion fails
    }

    // Delete the user from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user.id,
    );

    if (deleteError) {
      console.error("Error deleting user from auth:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete account completely" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
