import { LucideIcon } from "lucide-react";
import { StoryData } from "./story";

export interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

export interface StepComponentProps {
  storyData: StoryData;
  updateStoryData: (field: keyof StoryData, value: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}
