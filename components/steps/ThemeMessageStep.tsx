import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectItem, Textarea, Button, Spinner } from "@heroui/react";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowLeft, Wand2, Wand } from "lucide-react";
import {
  THEME_OPTIONS,
  STORY_LENGTH_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "@/constants";
import { StoryData } from "@/types";

interface ThemeMessageStepProps {
  storyData: StoryData;
  updateStoryData: (field: keyof StoryData, value: string | string[]) => void;
  onPrev: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canProceed: boolean;
}

export function ThemeMessageStep({
  storyData,
  updateStoryData,
  onPrev,
  onGenerate,
  isGenerating,
  canProceed,
}: ThemeMessageStepProps) {
  // Auto fill handler
  const handleAutoFill = () => {
    const randomTheme =
      THEME_OPTIONS[Math.floor(Math.random() * THEME_OPTIONS.length)];
    const randomLesson = [
      "Always be kind to others.",
      "Never give up on your dreams.",
      "Teamwork makes everything better.",
      "Imagination is powerful.",
      "Courage helps you grow.",
      "Honesty is the best policy.",
      "Respect everyone, big or small.",
      "Helping others makes the world better.",
      "Patience brings good things.",
      "Learning from mistakes is important.",
      "Friendship is a treasure.",
      "Sharing brings happiness.",
      "Listening is just as important as speaking.",
      "Be grateful for what you have.",
      "Stay curious and keep exploring.",
    ][Math.floor(Math.random() * 15)];
    const randomLength =
      STORY_LENGTH_OPTIONS[
        Math.floor(Math.random() * STORY_LENGTH_OPTIONS.length)
      ].value;
    const randomDifficulty =
      DIFFICULTY_OPTIONS[Math.floor(Math.random() * DIFFICULTY_OPTIONS.length)]
        .value;
    updateStoryData("theme", randomTheme);
    updateStoryData("moralLesson", randomLesson);
    updateStoryData("storyLength", randomLength);
    updateStoryData("difficulty", randomDifficulty);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl rounded-2xl transition-shadow hover:shadow-lg dark:hover:shadow-white/10">
      <CardHeader className="text-center">
        {/* <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-accent" />
        </div> */}
        <CardTitle className="font-serif text-2xl">Theme & Message</CardTitle>
        <CardDescription>What lesson should your story teach?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="mb-1 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onPress={handleAutoFill}
            startContent={<Wand className="h-4 w-4" />}
          >
            Random Fill
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="theme">Story Theme</Label>
          <Select
            selectedKeys={storyData.theme ? [storyData.theme] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;
              updateStoryData("theme", key);
            }}
            placeholder="Choose a theme"
            size="md"
            variant="bordered"
          >
            {THEME_OPTIONS.map((theme) => (
              <SelectItem key={theme}>{theme}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="moralLesson">Moral Lesson (Optional)</Label>
          <Textarea
            id="moralLesson"
            placeholder="What should your child learn from this story?"
            value={storyData.moralLesson}
            onChange={(e) => updateStoryData("moralLesson", e.target.value)}
            minRows={2}
            variant="bordered"
            size="md"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="storyLength">Story Length</Label>
            <Select
              selectedKeys={
                storyData.storyLength ? [storyData.storyLength] : []
              }
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string;
                updateStoryData("storyLength", key);
              }}
              placeholder="Choose length"
              size="md"
              variant="bordered"
            >
              {STORY_LENGTH_OPTIONS.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Reading Level</Label>
            <Select
              selectedKeys={storyData.difficulty ? [storyData.difficulty] : []}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string;
                updateStoryData("difficulty", key);
              }}
              placeholder="Choose difficulty"
              size="md"
              variant="bordered"
            >
              {DIFFICULTY_OPTIONS.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onPress={onPrev}
            variant="bordered"
            size="md"
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <Button
            onPress={onGenerate}
            isDisabled={!canProceed || isGenerating}
            isLoading={isGenerating}
            className="flex-1"
            size="md"
            color="primary"
            variant="solid"
            spinner={<Spinner size="sm" color="white" />}
            endContent={
              !isGenerating ? <Wand2 className="h-4 w-4" /> : undefined
            }
          >
            {isGenerating ? "Creating Magic..." : "Generate Story"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
