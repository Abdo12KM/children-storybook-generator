import { useState, useCallback } from "react";
import { StoryData, GeneratedStory } from "@/types";
import { StoryService } from "@/services";
import { StoryAPI } from "@/services/client-api";
import { useAuth } from "@/hooks/use-auth";

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
  const { user } = useAuth();
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
      // Generate the story using the existing API
      const story = await StoryService.generateStory(storyData);
      setGeneratedStory(story);

      // If user is authenticated, save the story to database via API
      if (user) {
        try {
          const storyToSave = {
            ...story,
            childName: storyData.childName,
            childAge: storyData.childAge,
            mainCharacter: storyData.mainCharacter,
            characterDescription: storyData.characterDescription,
            setting: storyData.setting,
            theme: storyData.theme,
            moralLesson: storyData.moralLesson,
            storyLength: storyData.storyLength,
            artStyle: storyData.artStyle,
            personalityTraits: storyData.personalityTraits,
            difficulty: storyData.difficulty,
          };

          await StoryAPI.saveStory(storyToSave);
          // Story saved successfully
        } catch (saveError) {
          console.error("Failed to save story:", saveError);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate story";
      console.error("Story generation failed:", err);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [storyData, user]);

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
