import { useState, useCallback } from "react";
import { StoryData, GeneratedStory } from "@/types";
import { StoryService } from "@/services";

const initialStoryData: StoryData = {
  childName: "",
  childAge: "",
  mainCharacter: "",
  characterDescription: "",
  setting: "",
  theme: "",
  moralLesson: "",
  storyLength: "",
  artStyle: "",
  uploadedImage: "",
  personalityTraits: [],
  difficulty: "",
};

export function useStoryGenerator() {
  const [storyData, setStoryData] = useState<StoryData>(initialStoryData);
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStoryData = useCallback(
    (field: keyof StoryData, value: string | string[]) => {
      setStoryData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const generateStory = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log("Starting story generation...");
      const story = await StoryService.generateStory(storyData);
      console.log("Story generated successfully:", story);
      setGeneratedStory(story);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate story";
      console.error("Story generation failed:", err);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [storyData]);

  const resetStory = useCallback(() => {
    setGeneratedStory(null);
    setStoryData(initialStoryData);
    setError(null);
  }, []);

  return {
    storyData,
    generatedStory,
    isGenerating,
    error,
    updateStoryData,
    generateStory,
    resetStory,
  };
}
