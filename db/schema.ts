import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignIn: timestamp("last_sign_in"),
  isActive: boolean("is_active").default(true).notNull(),
});

// Stories table to save generated stories
export const stories = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  childName: varchar("child_name", { length: 100 }).notNull(),
  childAge: varchar("child_age", { length: 10 }).notNull(),

  // Story configuration
  mainCharacter: text("main_character").notNull(),
  characterTraits: text("character_traits").array(),
  setting: varchar("setting", { length: 100 }).notNull(),
  theme: varchar("theme", { length: 100 }).notNull(),
  artStyle: varchar("art_style", { length: 50 }).notNull(),
  storyLength: varchar("story_length", { length: 20 }).notNull(), // 'short', 'medium', 'long'
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // 'beginner', 'intermediate', 'advanced'

  // Generated content
  storyContent: jsonb("story_content").notNull(), // Full story structure with pages
  coverImageUrl: text("cover_image_url"),

  // Story metadata
  pageCount: integer("page_count").notNull(),
  wordsPerPage: integer("words_per_page").notNull(),
  totalWords: integer("total_words").notNull(),
  moralLesson: text("moral_lesson"),
  vocabularyWords: text("vocabulary_words").array(),
  discussionQuestions: text("discussion_questions").array(),

  // Status and sharing
  isPublic: boolean("is_public").default(false).notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Story images table to store individual page images
export const storyImages = pgTable("story_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  storyId: uuid("story_id")
    .references(() => stories.id, { onDelete: "cascade" })
    .notNull(),
  pageNumber: integer("page_number").notNull(),
  imageUrl: text("image_url").notNull(),
  imagePrompt: text("image_prompt"), // The prompt used to generate this image
  altText: text("alt_text"), // For accessibility
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  // Default preferences for story generation
  defaultArtStyle: varchar("default_art_style", { length: 50 }),
  defaultStoryLength: varchar("default_story_length", { length: 20 }),
  defaultDifficulty: varchar("default_difficulty", { length: 20 }),
  preferredThemes: text("preferred_themes").array(),

  // UI preferences
  theme: varchar("theme", { length: 20 }).default("system"), // 'light', 'dark', 'system'
  language: varchar("language", { length: 10 }).default("en"),

  // Notification preferences
  emailNotifications: boolean("email_notifications").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Story collections/folders for organization
export const storyCollections = pgTable("story_collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 20 }).default("#3b82f6"), // Hex color for UI
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Junction table for stories in collections
export const storyCollectionItems = pgTable("story_collection_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  collectionId: uuid("collection_id")
    .references(() => storyCollections.id, { onDelete: "cascade" })
    .notNull(),
  storyId: uuid("story_id")
    .references(() => stories.id, { onDelete: "cascade" })
    .notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Story shares for public sharing
export const storyShares = pgTable("story_shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  storyId: uuid("story_id")
    .references(() => stories.id, { onDelete: "cascade" })
    .notNull(),
  shareToken: varchar("share_token", { length: 100 }).notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema validation using Zod
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertStorySchema = createInsertSchema(stories);
export const selectStorySchema = createSelectSchema(stories);

export const insertStoryImageSchema = createInsertSchema(storyImages);
export const selectStoryImageSchema = createSelectSchema(storyImages);

export const insertUserPreferencesSchema = createInsertSchema(userPreferences);
export const selectUserPreferencesSchema = createSelectSchema(userPreferences);

export const insertStoryCollectionSchema = createInsertSchema(storyCollections);
export const selectStoryCollectionSchema = createSelectSchema(storyCollections);

export const insertStoryCollectionItemSchema =
  createInsertSchema(storyCollectionItems);
export const selectStoryCollectionItemSchema =
  createSelectSchema(storyCollectionItems);

export const insertStoryShareSchema = createInsertSchema(storyShares);
export const selectStoryShareSchema = createSelectSchema(storyShares);

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Story = typeof stories.$inferSelect;
export type NewStory = typeof stories.$inferInsert;

export type StoryImage = typeof storyImages.$inferSelect;
export type NewStoryImage = typeof storyImages.$inferInsert;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;

export type StoryCollection = typeof storyCollections.$inferSelect;
export type NewStoryCollection = typeof storyCollections.$inferInsert;

export type StoryCollectionItem = typeof storyCollectionItems.$inferSelect;
export type NewStoryCollectionItem = typeof storyCollectionItems.$inferInsert;

export type StoryShare = typeof storyShares.$inferSelect;
export type NewStoryShare = typeof storyShares.$inferInsert;
