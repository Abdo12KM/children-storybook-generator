import { Users, Sparkles, MapPin, Palette, BookOpen } from "lucide-react";
import { Step, StoryLength, Difficulty } from "@/types";

export const STEPS: Step[] = [
  { id: 1, title: "Child Details", icon: Users },
  { id: 2, title: "Main Character", icon: Sparkles },
  { id: 3, title: "Story Setting", icon: MapPin },
  { id: 4, title: "Art Style & Photo", icon: Palette },
  { id: 5, title: "Theme & Message", icon: BookOpen },
];

export const STORY_PARAMS = {
  short: { pages: 6, wordsPerPage: 50 },
  medium: { pages: 12, wordsPerPage: 60 },
  long: { pages: 20, wordsPerPage: 70 },
} as const;

export const VOCABULARY_LEVELS = {
  beginner: "Use simple, common words that are easy to read and understand.",
  intermediate:
    "Mix simple words with some slightly more challenging vocabulary to help learning.",
  advanced:
    "Include rich vocabulary and descriptive language while remaining age-appropriate.",
} as const;

export const AGE_OPTIONS = [
  { value: "2-4", label: "2-4 years (Toddler)" },
  { value: "4-6", label: "4-6 years (Preschool)" },
  { value: "6-8", label: "6-8 years (Early Elementary)" },
  { value: "8-10", label: "8-10 years (Elementary)" },
  { value: "10-12", label: "10-12 years (Middle Elementary)" },
];

export const STORY_LENGTH_OPTIONS = [
  { value: "short", label: "Short (6 pages)" },
  { value: "medium", label: "Medium (12 pages)" },
  { value: "long", label: "Long (20 pages)" },
];

export const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner (Simple words)" },
  { value: "intermediate", label: "Intermediate (Mixed vocabulary)" },
  { value: "advanced", label: "Advanced (Rich vocabulary)" },
];

export const ART_STYLE_OPTIONS = [
  { value: "cartoon", label: "Cartoon Style" },
  { value: "watercolor", label: "Watercolor" },
  { value: "digital", label: "Digital Art" },
  { value: "realistic", label: "Realistic" },
  { value: "fantasy", label: "Fantasy Art" },
];

export const PERSONALITY_TRAITS = [
  "brave",
  "kind",
  "curious",
  "funny",
  "smart",
  "helpful",
  "creative",
  "adventurous",
  "gentle",
  "determined",
  "cheerful",
  "wise",
];

export const THEME_OPTIONS = [
  "Adventure",
  "Friendship",
  "Family",
  "Magic",
  "Animals",
  "Space",
  "Ocean",
  "Forest",
  "School",
  "Imagination",
];

export const SETTING_OPTIONS = [
  "Magical Forest",
  "Under the Sea",
  "Outer Space",
  "Enchanted Castle",
  "Cozy Village",
  "Big City",
  "Mountain Adventure",
  "Desert Oasis",
  "Fairy Garden",
  "Pirate Ship",
  "Time Machine",
  "Robot World",
];
