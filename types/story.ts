export interface StoryData {
  childName: string;
  childAge: string;
  mainCharacter: string;
  characterDescription: string;
  setting: string;
  theme: string;
  moralLesson: string;
  storyLength: string;
  artStyle: string;
  uploadedImage?: string;
  personalityTraits: string[];
  difficulty: string;
}

export interface StoryPage {
  pageNumber: number;
  content: string;
  imagePrompt: string;
  imageUrl?: string;
  vocabulary?: string[];
}

export interface GeneratedStory {
  title: string;
  pages: StoryPage[];
  summary: string;
  characterSheet?: string;
  keyVocabulary: string[];
  discussionQuestions: string[];
  activityIdea: string;
}

export interface StoryRequest extends StoryData {}

export interface StoryResponse extends GeneratedStory {}

export interface ImageRequest {
  prompt: string;
  style?: string;
  characterSheet?: string;
  referenceImage?: string; // Base64 encoded image for consistency
  pageNumber?: number; // To identify if this is the first image or subsequent
}

export interface ImageResponse {
  imageUrl: string;
  prompt: string;
  generated?: boolean;
  error?: string;
}

export type StoryLength = "short" | "medium" | "long";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ArtStyle =
  | "cartoon"
  | "watercolor"
  | "digital"
  | "realistic"
  | "fantasy";
