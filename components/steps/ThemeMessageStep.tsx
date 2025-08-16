import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectItem, Textarea, Button, Spinner } from "@heroui/react";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowLeft, Wand2 } from "lucide-react";
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
  return (
    <Card className="w-full hover:shadow-lg dark:hover:shadow-white/10 transition-shadow rounded-2xl max-w-2xl mx-auto">
      <CardHeader className="text-center">
        {/* <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-accent" />
        </div> */}
        <CardTitle className="text-2xl font-serif">Theme & Message</CardTitle>
        <CardDescription>What lesson should your story teach?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
