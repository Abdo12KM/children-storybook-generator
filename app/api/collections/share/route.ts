import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CollectionService } from "@/services/collections";

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

    const { collectionId } = await request.json();

    if (!collectionId) {
      return NextResponse.json(
        { error: "Collection ID is required" },
        { status: 400 },
      );
    }

    // Get the collection to verify ownership and get details
    const collection = await CollectionService.getCollectionById(collectionId);

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }

    if (collection.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only share your own collections" },
        { status: 403 },
      );
    }

    // Generate a shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/collections/${collectionId}?shared=true`;

    return NextResponse.json(
      {
        shareUrl,
        title: collection.name,
        description:
          collection.description ||
          `Check out this story collection: ${collection.name}`,
        collectionId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sharing collection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
