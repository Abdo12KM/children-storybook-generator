import { db } from "@/db";
import {
  stories,
  storyImages,
  storyCollections,
  storyCollectionItems,
  storyShares,
  type Story,
  type NewStory,
  type StoryImage,
  type NewStoryImage,
  type StoryShare,
  type NewStoryShare,
} from "@/db/schema";
import { eq, desc, and, sql, ilike } from "drizzle-orm";
import { nanoid } from "nanoid";

export class DatabaseStoryService {
  // Create a new story
  static async createStory(storyData: NewStory): Promise<Story> {
    // Generate a title if not provided
    if (!storyData.title) {
      storyData.title = `${storyData.childName}'s ${storyData.theme} Adventure`;
    }

    const [story] = await db.insert(stories).values(storyData).returning();

    // Add to default collection
    await this.addToDefaultCollection(story.userId, story.id);

    return story;
  }

  // Get story by ID
  static async getStoryById(storyId: string): Promise<Story | null> {
    const [story] = await db
      .select()
      .from(stories)
      .where(eq(stories.id, storyId));
    return story || null;
  }

  // Get story with images
  static async getStoryWithImages(storyId: string): Promise<{
    story: Story;
    images: StoryImage[];
  } | null> {
    const story = await this.getStoryById(storyId);
    if (!story) return null;

    const images = await db
      .select()
      .from(storyImages)
      .where(eq(storyImages.storyId, storyId))
      .orderBy(storyImages.pageNumber);

    return { story, images };
  }

  // Update story
  static async updateStory(
    storyId: string,
    updates: Partial<NewStory>,
  ): Promise<Story> {
    const [story] = await db
      .update(stories)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(stories.id, storyId))
      .returning();
    return story;
  }

  // Delete story
  static async deleteStory(storyId: string): Promise<void> {
    // This will cascade delete related images and collection items
    await db.delete(stories).where(eq(stories.id, storyId));
  }

  // Toggle story favorite status
  static async toggleFavorite(storyId: string): Promise<Story> {
    const story = await this.getStoryById(storyId);
    if (!story) throw new Error("Story not found");

    return await this.updateStory(storyId, {
      isFavorite: !story.isFavorite,
    });
  }

  // Toggle story public status
  static async togglePublic(storyId: string): Promise<Story> {
    const story = await this.getStoryById(storyId);
    if (!story) throw new Error("Story not found");

    return await this.updateStory(storyId, {
      isPublic: !story.isPublic,
    });
  }

  // Add story images
  static async addStoryImages(images: NewStoryImage[]): Promise<StoryImage[]> {
    return await db.insert(storyImages).values(images).returning();
  }

  // Update story image
  static async updateStoryImage(
    imageId: string,
    updates: Partial<NewStoryImage>,
  ): Promise<StoryImage> {
    const [image] = await db
      .update(storyImages)
      .set(updates)
      .where(eq(storyImages.id, imageId))
      .returning();
    return image;
  }

  // Get stories by user with filtering and pagination
  static async getUserStories(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      search?: string;
      theme?: string;
      artStyle?: string;
      difficulty?: string;
      isPublic?: boolean;
      isFavorite?: boolean;
    } = {},
  ): Promise<Story[]> {
    const {
      limit = 10,
      offset = 0,
      search,
      theme,
      artStyle,
      difficulty,
      isPublic,
      isFavorite,
    } = options;

    // Add filters
    const conditions = [eq(stories.userId, userId)];

    if (search) {
      conditions.push(
        sql`(${stories.title} ILIKE ${`%${search}%`} OR ${stories.childName} ILIKE ${`%${search}%`})`,
      );
    }

    if (theme) {
      conditions.push(eq(stories.theme, theme));
    }

    if (artStyle) {
      conditions.push(eq(stories.artStyle, artStyle));
    }

    if (difficulty) {
      conditions.push(eq(stories.difficulty, difficulty));
    }

    if (typeof isPublic === "boolean") {
      conditions.push(eq(stories.isPublic, isPublic));
    }

    if (typeof isFavorite === "boolean") {
      conditions.push(eq(stories.isFavorite, isFavorite));
    }

    return await db
      .select()
      .from(stories)
      .where(and(...conditions))
      .orderBy(desc(stories.createdAt))
      .limit(limit)
      .offset(offset);
  }

  // Get public stories for discovery
  static async getPublicStories(
    limit = 20,
    offset = 0,
    theme?: string,
  ): Promise<Story[]> {
    const conditions = [eq(stories.isPublic, true)];

    if (theme) {
      conditions.push(eq(stories.theme, theme));
    }

    return await db
      .select()
      .from(stories)
      .where(and(...conditions))
      .orderBy(desc(stories.createdAt))
      .limit(limit)
      .offset(offset);
  }

  // Create shareable link for story
  static async createShareLink(
    storyId: string,
    expiresInDays?: number,
  ): Promise<StoryShare> {
    const shareToken = nanoid(32);
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const shareData: NewStoryShare = {
      storyId,
      shareToken,
      expiresAt,
      isActive: true,
      viewCount: 0,
    };

    const [share] = await db.insert(storyShares).values(shareData).returning();
    return share;
  }

  // Get story by share token
  static async getStoryByShareToken(shareToken: string): Promise<{
    story: Story;
    images: StoryImage[];
  } | null> {
    const [share] = await db
      .select()
      .from(storyShares)
      .where(
        and(
          eq(storyShares.shareToken, shareToken),
          eq(storyShares.isActive, true),
        ),
      );

    if (!share) return null;

    // Check if expired
    if (share.expiresAt && share.expiresAt < new Date()) {
      return null;
    }

    // Increment view count
    await db
      .update(storyShares)
      .set({ viewCount: share.viewCount + 1 })
      .where(eq(storyShares.id, share.id));

    // Get story and images
    return await this.getStoryWithImages(share.storyId);
  }

  // Add story to default collection
  private static async addToDefaultCollection(
    userId: string,
    storyId: string,
  ): Promise<void> {
    const [defaultCollection] = await db
      .select()
      .from(storyCollections)
      .where(
        and(
          eq(storyCollections.userId, userId),
          eq(storyCollections.isDefault, true),
        ),
      );

    if (defaultCollection) {
      await db.insert(storyCollectionItems).values({
        collectionId: defaultCollection.id,
        storyId,
      });
    }
  }

  // Get story analytics
  static async getStoryAnalytics(storyId: string): Promise<{
    viewCount: number;
    shareCount: number;
    isPublic: boolean;
  }> {
    const story = await this.getStoryById(storyId);
    if (!story) throw new Error("Story not found");

    const shares = await db
      .select()
      .from(storyShares)
      .where(eq(storyShares.storyId, storyId));

    const totalViews = shares.reduce((sum, share) => sum + share.viewCount, 0);

    return {
      viewCount: totalViews,
      shareCount: shares.length,
      isPublic: story.isPublic,
    };
  }
}
