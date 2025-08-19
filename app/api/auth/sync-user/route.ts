import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserService } from "@/services/server";

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, avatarUrl } = await request.json();

    // Verify the user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists in our database
    const existingUser = await UserService.getUserByEmail(email);

    if (!existingUser) {
      // Create user in our database
      const newUser = await UserService.createUser({
        email,
        fullName,
        avatarUrl,
      });
      return NextResponse.json({ success: true, user: newUser });
    } else {
      // Update last sign in
      await UserService.updateLastSignIn(existingUser.id);
      return NextResponse.json({ success: true, user: existingUser });
    }
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user data" },
      { status: 500 },
    );
  }
}
