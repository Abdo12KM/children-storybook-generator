import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CollectionService } from "@/services/server";

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

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user's collections
    const collections = await CollectionService.getUserCollections(user.id);

    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 },
    );
  }
}

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

    // Get collection data from request body
    const collectionData = await request.json();

    // Add user ID to collection data
    const newCollection = {
      ...collectionData,
      userId: user.id,
    };

    // Create the collection
    const collection = await CollectionService.createCollection(newCollection);

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
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

    // Get collection data from request body
    const { collectionId, ...updateData } = await request.json();

    if (!collectionId) {
      return NextResponse.json(
        { error: "Collection ID is required" },
        { status: 400 },
      );
    }

    // Update the collection
    const collection = await CollectionService.updateCollection(
      collectionId,
      updateData,
    );

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
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

    // Get collection ID from URL or body
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get("id");

    if (!collectionId) {
      return NextResponse.json(
        { error: "Collection ID is required" },
        { status: 400 },
      );
    }

    // Delete the collection
    await CollectionService.deleteCollection(collectionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 },
    );
  }
}
