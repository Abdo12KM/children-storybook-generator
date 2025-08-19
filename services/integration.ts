import { DatabaseStoryService } from "./database-story";
import { UserService } from "./user";
import { StoryResponse } from "@/types";
import { NewStory } from "@/db/schema";

/**
 * Integration helper functions for connecting the existing story generation
 * with the new database functionality
 */

// Helper to convert generated story data to database format
export function mapStoryResponseToDbFormat(
  storyResponse: StoryResponse,
  userId: string,
  storyData: any, // The form data from the UI
): NewStory {
  return {
    userId,
    title:
      storyResponse.title ||
      `${storyData.childName}'s ${storyData.theme} Adventure`,
    childName: storyData.childName,
    childAge: storyData.childAge,
    mainCharacter: storyData.mainCharacter,
    characterTraits: storyData.characterTraits || [],
    setting: storyData.setting,
    theme: storyData.theme,
    artStyle: storyData.artStyle,
    storyLength: storyData.storyLength,
    difficulty: storyData.difficulty,
    storyContent: storyResponse, // Store the entire generated story
    pageCount: storyResponse.pages?.length || 0,
    wordsPerPage:
      storyData.storyLength === "short"
        ? 50
        : storyData.storyLength === "medium"
          ? 60
          : 70,
    totalWords: calculateTotalWords(storyResponse),
    moralLesson: storyData.moralLesson, // From form data, not story response
    vocabularyWords: storyResponse.keyVocabulary || [],
    discussionQuestions: storyResponse.discussionQuestions || [],
    isPublic: false,
    isFavorite: false,
  };
}

// Helper to calculate total words in a story
function calculateTotalWords(storyResponse: StoryResponse): number {
  if (!storyResponse.pages) return 0;

  return storyResponse.pages.reduce((total, page) => {
    const wordCount = page.content ? page.content.split(/\s+/).length : 0;
    return total + wordCount;
  }, 0);
}

// Enhanced story generation that saves to database
export async function generateAndSaveStory(
  storyData: any,
  userId: string,
): Promise<{ story: any; savedStory: any }> {
  // Generate the story using existing API
  const { StoryService } = await import("./story");
  const generatedStory = await StoryService.generateStory(storyData);

  // Convert to database format and save
  const dbStoryData = mapStoryResponseToDbFormat(
    generatedStory,
    userId,
    storyData,
  );
  const savedStory = await DatabaseStoryService.createStory(dbStoryData);

  // If there are images, save them too
  if (generatedStory.pages && generatedStory.pages.some((p) => p.imageUrl)) {
    const imageData = generatedStory.pages
      .filter((page) => page.imageUrl)
      .map((page, index) => ({
        storyId: savedStory.id,
        pageNumber: index + 1,
        imageUrl: page.imageUrl!,
        imagePrompt: page.imagePrompt || "",
        altText: `Illustration for page ${index + 1}: ${page.content.substring(0, 50)}...`,
      }));

    await DatabaseStoryService.addStoryImages(imageData);
  }

  return {
    story: generatedStory,
    savedStory,
  };
}

// Helper to get user's story library with pagination
export async function getUserStoryLibrary(
  userId: string,
  page = 1,
  limit = 12,
  filters: {
    search?: string;
    theme?: string;
    artStyle?: string;
    difficulty?: string;
    isFavorite?: boolean;
    collectionId?: string;
  } = {},
) {
  const offset = (page - 1) * limit;

  // Get stories
  const stories = await DatabaseStoryService.getUserStories(userId, {
    ...filters,
    limit,
    offset,
  });

  // Get user's collections
  const collections = await import("@/services/collections").then((m) =>
    m.CollectionService.getUserCollections(userId),
  );

  // Get total count for pagination (you'd need to implement this)
  const totalCount = await getUserStoryCount(userId, filters);

  return {
    stories,
    collections,
    pagination: {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
    },
  };
}

// Helper to get user story count
async function getUserStoryCount(
  userId: string,
  filters: any,
): Promise<number> {
  try {
    const stories = await DatabaseStoryService.getUserStories(userId);

    // Apply filters if provided
    if (filters?.theme) {
      return stories.filter((story) => story.theme === filters.theme).length;
    }
    if (filters?.createdAfter) {
      return stories.filter(
        (story) => new Date(story.createdAt) > new Date(filters.createdAfter),
      ).length;
    }
    if (filters?.isFavorite !== undefined) {
      return stories.filter((story) => story.isFavorite === filters.isFavorite)
        .length;
    }

    return stories.length;
  } catch (error) {
    console.error("Error getting user story count:", error);
    return 0;
  }
}

// Helper to create a new user with default setup
export async function createUserWithDefaults(userData: {
  email: string;
  fullName?: string;
  avatarUrl?: string;
}): Promise<any> {
  // Create user
  const user = await UserService.createUser(userData);

  // Create default collection
  const { CollectionService } = await import("@/services/collections");
  await CollectionService.createDefaultCollection(user.id);

  return user;
}

// Helper to get user dashboard data
export async function getUserDashboardData(userId: string) {
  const [user, preferences, recentStories, collections] = await Promise.all([
    UserService.getUserById(userId),
    UserService.getUserPreferences(userId),
    DatabaseStoryService.getUserStories(userId, { limit: 5 }),
    import("@/services/collections").then((m) =>
      m.CollectionService.getUserCollections(userId),
    ),
  ]);

  const favoriteStories = await UserService.getUserFavoriteStories(userId);
  const totalStoryCount = await UserService.getUserStoryCount(userId);

  return {
    user,
    preferences,
    recentStories,
    favoriteStories,
    collections,
    stats: {
      totalStories: totalStoryCount,
      favoriteCount: favoriteStories.length,
      collectionCount: collections.length,
    },
  };
}
