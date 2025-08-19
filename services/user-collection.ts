import { ApiClient } from "@/utils/api-client";

export interface UserCollection {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  story_count: number;
  stories: CollectionStory[];
  thumbnail?: string;
  tags: string[];
}

export interface CollectionStory {
  id: string;
  title: string;
  thumbnail?: string;
  created_at: string;
  art_style: string;
  story_length: string;
}

export interface NewCollection {
  name: string;
  description: string;
  is_public: boolean;
  tags: string[];
}

export class UserCollectionService {
  static async getUserCollections(): Promise<UserCollection[]> {
    return ApiClient.get("/api/user/collections");
  }

  static async createCollection(
    collection: NewCollection,
  ): Promise<UserCollection> {
    return ApiClient.post("/api/user/collections", collection);
  }

  static async updateCollection(
    collectionId: string,
    updates: Partial<NewCollection>,
  ): Promise<UserCollection> {
    return ApiClient.put("/api/user/collections", { collectionId, ...updates });
  }

  static async deleteCollection(collectionId: string): Promise<void> {
    return ApiClient.delete(`/api/user/collections?id=${collectionId}`);
  }

  static async shareCollection(collectionId: string): Promise<void> {
    try {
      const shareData = await ApiClient.post("/api/collections/share", {
        collectionId,
      });

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

        // Show a toast notification
        if (typeof window !== "undefined") {
          const event = new CustomEvent("show-toast", {
            detail: {
              message: "Collection share link copied to clipboard!",
              type: "success",
            },
          });
          window.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.error("Error sharing collection:", error);
      throw error;
    }
  }
}
