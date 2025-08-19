import { db } from "@/db";
import {
  users,
  userPreferences,
  stories,
  storyCollections,
  type User,
  type NewUser,
  type UserPreferences,
  type NewUserPreferences,
  type Story,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// User CRUD operations
export class UserService {
  // Create a new user
  static async createUser(userData: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();

    // Create default preferences for the user
    await this.createDefaultPreferences(user.id);

    return user;
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user || null;
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  // Update user
  static async updateUser(
    userId: string,
    updates: Partial<NewUser>,
  ): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Update last sign in
  static async updateLastSignIn(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ lastSignIn: new Date() })
      .where(eq(users.id, userId));
  }

  // Delete user (soft delete by marking inactive)
  static async deleteUser(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Create default preferences for a new user
  static async createDefaultPreferences(
    userId: string,
  ): Promise<UserPreferences> {
    const defaultPreferences: NewUserPreferences = {
      userId,
      defaultArtStyle: "cartoon",
      defaultStoryLength: "medium",
      defaultDifficulty: "intermediate",
      preferredThemes: ["Adventure", "Friendship", "Magic"],
      theme: "system",
      language: "en",
      emailNotifications: true,
    };

    const [preferences] = await db
      .insert(userPreferences)
      .values(defaultPreferences)
      .returning();

    return preferences;
  }

  // Get user preferences
  static async getUserPreferences(
    userId: string,
  ): Promise<UserPreferences | null> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences || null;
  }

  // Update user preferences
  static async updateUserPreferences(
    userId: string,
    updates: Partial<NewUserPreferences>,
  ): Promise<UserPreferences> {
    const [preferences] = await db
      .update(userPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return preferences;
  }

  // Get user's stories with pagination
  static async getUserStories(
    userId: string,
    limit = 10,
    offset = 0,
  ): Promise<Story[]> {
    return await db
      .select()
      .from(stories)
      .where(eq(stories.userId, userId))
      .orderBy(desc(stories.createdAt))
      .limit(limit)
      .offset(offset);
  }

  // Get user's favorite stories
  static async getUserFavoriteStories(userId: string): Promise<Story[]> {
    return await db
      .select()
      .from(stories)
      .where(and(eq(stories.userId, userId), eq(stories.isFavorite, true)))
      .orderBy(desc(stories.createdAt));
  }

  // Get user's story count
  static async getUserStoryCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: stories.id })
      .from(stories)
      .where(eq(stories.userId, userId));
    return result.length;
  }

  // Create default story collection for user
  static async createDefaultCollection(userId: string): Promise<void> {
    await db.insert(storyCollections).values({
      userId,
      name: "My Stories",
      description: "Default collection for all your stories",
      isDefault: true,
    });
  }

  // Delete user and all associated data
  static async deleteUserCompletely(userId: string): Promise<void> {
    // Delete all user stories (cascade will handle story pages and images)
    await db.delete(stories).where(eq(stories.userId, userId));

    // Delete all user collections (cascade will handle collection items)
    await db
      .delete(storyCollections)
      .where(eq(storyCollections.userId, userId));

    // Delete user preferences
    await db.delete(userPreferences).where(eq(userPreferences.userId, userId));

    // Finally delete the user record
    await db.delete(users).where(eq(users.id, userId));
  }
}
