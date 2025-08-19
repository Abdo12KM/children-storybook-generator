// Database-related types
export interface UserSession {
  user: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  };
  expires: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastSignIn?: Date;
  isActive: boolean;
}

export interface UserWithPreferences {
  user: AuthUser;
  preferences: {
    defaultArtStyle?: string;
    defaultStoryLength?: string;
    defaultDifficulty?: string;
    preferredThemes?: string[];
    theme: string;
    language: string;
    emailNotifications: boolean;
  };
}

export interface StoryWithMetadata {
  id: string;
  userId: string;
  title: string;
  childName: string;
  childAge: string;
  mainCharacter: string;
  setting: string;
  theme: string;
  artStyle: string;
  storyLength: string;
  difficulty: string;
  pageCount: number;
  totalWords: number;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  coverImageUrl?: string;
}

export interface StoryCollectionWithStats {
  id: string;
  name: string;
  description?: string;
  color: string;
  isDefault: boolean;
  storyCount: number;
  totalPages: number;
  mostRecentStory?: Date;
  createdAt: Date;
}

export interface ShareableStory {
  story: StoryWithMetadata;
  images: Array<{
    pageNumber: number;
    imageUrl: string;
    altText?: string;
  }>;
  shareToken: string;
  expiresAt?: Date;
  viewCount: number;
}

// API Response types for database operations
export interface CreateStoryResponse {
  success: boolean;
  story?: StoryWithMetadata;
  error?: string;
}

export interface GetStoriesResponse {
  success: boolean;
  stories?: StoryWithMetadata[];
  total?: number;
  error?: string;
}

export interface GetCollectionsResponse {
  success: boolean;
  collections?: StoryCollectionWithStats[];
  error?: string;
}

// Pagination and filtering
export interface StoryFilters {
  search?: string;
  theme?: string;
  artStyle?: string;
  difficulty?: string;
  isPublic?: boolean;
  isFavorite?: boolean;
  collectionId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface StoryQueryParams extends StoryFilters, PaginationParams {}

// Database operation results
export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BatchOperation<T> {
  success: boolean;
  results: T[];
  errors: string[];
  successCount: number;
  errorCount: number;
}
