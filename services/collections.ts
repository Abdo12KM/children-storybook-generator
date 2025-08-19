import { db } from "@/db";
import {
  storyCollections,
  storyCollectionItems,
  stories,
  type StoryCollection,
  type NewStoryCollection,
  type StoryCollectionItem,
  type NewStoryCollectionItem,
  type Story,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export class CollectionService {
  // Create a new collection
  static async createCollection(
    collectionData: NewStoryCollection,
  ): Promise<StoryCollection> {
    const [collection] = await db
      .insert(storyCollections)
      .values(collectionData)
      .returning();
    return collection;
  }

  // Get collection by ID
  static async getCollectionById(
    collectionId: string,
  ): Promise<StoryCollection | null> {
    const [collection] = await db
      .select()
      .from(storyCollections)
      .where(eq(storyCollections.id, collectionId));
    return collection || null;
  }

  // Get user's collections
  static async getUserCollections(userId: string): Promise<StoryCollection[]> {
    return await db
      .select()
      .from(storyCollections)
      .where(eq(storyCollections.userId, userId))
      .orderBy(desc(storyCollections.createdAt));
  }

  // Get collection with stories
  static async getCollectionWithStories(collectionId: string): Promise<{
    collection: StoryCollection;
    stories: Story[];
  } | null> {
    const collection = await this.getCollectionById(collectionId);
    if (!collection) return null;

    const storiesInCollection = await db
      .select({
        story: stories,
        addedAt: storyCollectionItems.addedAt,
      })
      .from(storyCollectionItems)
      .innerJoin(stories, eq(storyCollectionItems.storyId, stories.id))
      .where(eq(storyCollectionItems.collectionId, collectionId))
      .orderBy(desc(storyCollectionItems.addedAt));

    return {
      collection,
      stories: storiesInCollection.map((item) => item.story),
    };
  }

  // Update collection
  static async updateCollection(
    collectionId: string,
    updates: Partial<NewStoryCollection>,
  ): Promise<StoryCollection> {
    const [collection] = await db
      .update(storyCollections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(storyCollections.id, collectionId))
      .returning();
    return collection;
  }

  // Delete collection
  static async deleteCollection(collectionId: string): Promise<void> {
    // This will cascade delete collection items
    await db
      .delete(storyCollections)
      .where(eq(storyCollections.id, collectionId));
  }

  // Add story to collection
  static async addStoryToCollection(
    collectionId: string,
    storyId: string,
  ): Promise<StoryCollectionItem> {
    // Check if story is already in collection
    const existing = await db
      .select()
      .from(storyCollectionItems)
      .where(
        and(
          eq(storyCollectionItems.collectionId, collectionId),
          eq(storyCollectionItems.storyId, storyId),
        ),
      );

    if (existing.length > 0) {
      throw new Error("Story is already in this collection");
    }

    const [collectionItem] = await db
      .insert(storyCollectionItems)
      .values({ collectionId, storyId })
      .returning();

    return collectionItem;
  }

  // Remove story from collection
  static async removeStoryFromCollection(
    collectionId: string,
    storyId: string,
  ): Promise<void> {
    await db
      .delete(storyCollectionItems)
      .where(
        and(
          eq(storyCollectionItems.collectionId, collectionId),
          eq(storyCollectionItems.storyId, storyId),
        ),
      );
  }

  // Get default collection for user
  static async getDefaultCollection(
    userId: string,
  ): Promise<StoryCollection | null> {
    const [collection] = await db
      .select()
      .from(storyCollections)
      .where(
        and(
          eq(storyCollections.userId, userId),
          eq(storyCollections.isDefault, true),
        ),
      );
    return collection || null;
  }

  // Create default collection for user
  static async createDefaultCollection(
    userId: string,
  ): Promise<StoryCollection> {
    const defaultCollection: NewStoryCollection = {
      userId,
      name: "My Stories",
      description: "Default collection for all your stories",
      isDefault: true,
      color: "#3b82f6",
    };

    return await this.createCollection(defaultCollection);
  }

  // Get collection stats
  static async getCollectionStats(collectionId: string): Promise<{
    storyCount: number;
    totalPages: number;
    mostRecentStory?: Date;
  }> {
    const result = await db
      .select({
        storyCount: stories.id,
        totalPages: stories.pageCount,
        createdAt: stories.createdAt,
      })
      .from(storyCollectionItems)
      .innerJoin(stories, eq(storyCollectionItems.storyId, stories.id))
      .where(eq(storyCollectionItems.collectionId, collectionId));

    const storyCount = result.length;
    const totalPages = result.reduce((sum, story) => sum + story.totalPages, 0);
    const mostRecentStory =
      result.length > 0
        ? new Date(Math.max(...result.map((s) => s.createdAt.getTime())))
        : undefined;

    return {
      storyCount,
      totalPages,
      mostRecentStory,
    };
  }

  // Move story between collections
  static async moveStoryToCollection(
    storyId: string,
    fromCollectionId: string,
    toCollectionId: string,
  ): Promise<void> {
    await db.transaction(async (tx) => {
      // Remove from old collection
      await tx
        .delete(storyCollectionItems)
        .where(
          and(
            eq(storyCollectionItems.collectionId, fromCollectionId),
            eq(storyCollectionItems.storyId, storyId),
          ),
        );

      // Add to new collection
      await tx
        .insert(storyCollectionItems)
        .values({ collectionId: toCollectionId, storyId });
    });
  }
}
