import { StoryData } from "@/types";

export function validateStoryStep(step: number, storyData: StoryData): boolean {
  switch (step) {
    case 1:
      return Boolean(storyData.childName && storyData.childAge);
    case 2:
      return Boolean(storyData.mainCharacter);
    case 3:
      return Boolean(storyData.setting);
    case 4:
      return Boolean(storyData.artStyle);
    case 5:
      return Boolean(
        storyData.theme && storyData.storyLength && storyData.difficulty,
      );
    default:
      return false;
  }
}

export function getStepDescription(step: number): string {
  const descriptions = {
    1: "Tell us about your child to personalize the story",
    2: "Create the main character for your story",
    3: "Choose where your adventure will take place",
    4: "Select the visual style for your storybook",
    5: "Define the theme and moral lesson",
  };
  return descriptions[step as keyof typeof descriptions] || "";
}

export function calculateProgress(
  currentStep: number,
  totalSteps: number,
): number {
  return (currentStep / totalSteps) * 100;
}
