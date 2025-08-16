import {
  StoryRequest,
  StoryResponse,
  ImageRequest,
  ImageResponse,
} from "@/types";

export class StoryService {
  static async generateStory(storyData: StoryRequest): Promise<StoryResponse> {
    const response = await fetch("/api/generate-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate story");
    }

    return response.json();
  }

  static async generateImage(imageData: ImageRequest): Promise<ImageResponse> {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imageData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate image");
    }

    return response.json();
  }
}
