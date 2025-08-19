import { ApiClient } from "@/utils/api-client";

export interface UserStory {
  id: string;
  title: string;
  summary: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  art_style: string;
  main_character: string;
  setting: string;
  theme: string;
  story_length: string;
  child_name: string;
  child_age: number;
  page_count: number;
  view_count: number;
  is_shared: boolean;
}

export class UserStoryService {
  static async getUserStories(): Promise<UserStory[]> {
    return ApiClient.get("/api/user/stories");
  }

  static async toggleFavorite(storyId: string): Promise<UserStory> {
    return ApiClient.post("/api/user/stories/favorite", { storyId });
  }

  static async deleteStory(storyId: string): Promise<void> {
    return ApiClient.delete(`/api/user/stories?id=${storyId}`);
  }

  static async shareStory(storyId: string): Promise<void> {
    try {
      const shareData = await ApiClient.post("/api/stories/share", { storyId });

      // Use Web Share API if available, otherwise copy to clipboard
      if (
        navigator.share &&
        navigator.canShare?.({ url: shareData.shareUrl })
      ) {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.shareUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.shareUrl);

        // Show a toast notification (you might want to use your toast system)
        if (typeof window !== "undefined") {
          const event = new CustomEvent("show-toast", {
            detail: {
              message: "Share link copied to clipboard!",
              type: "success",
            },
          });
          window.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.error("Error sharing story:", error);
      throw error;
    }
  }

  static async downloadStory(storyId: string): Promise<void> {
    try {
      // Get the story data
      const story = await ApiClient.get(`/api/user/stories?id=${storyId}`);

      // Import the PDF generator utility
      const { generateStoryPDF } = await import("../utils/pdf-generator");

      // Generate and download the PDF
      await generateStoryPDF(story);
    } catch (error) {
      console.error("Error downloading story:", error);
      throw error;
    }
  }
}
