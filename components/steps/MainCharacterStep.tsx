import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Textarea, Button, Chip } from "@heroui/react";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { PERSONALITY_TRAITS } from "@/constants";
import { StoryData } from "@/types";

interface MainCharacterStepProps {
  storyData: StoryData;
  updateStoryData: (field: keyof StoryData, value: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function MainCharacterStep({
  storyData,
  updateStoryData,
  onNext,
  onPrev,
}: MainCharacterStepProps) {
  const canProceed = storyData.mainCharacter;

  const toggleTrait = (trait: string) => {
    const currentTraits = storyData.personalityTraits || [];
    const newTraits = currentTraits.includes(trait)
      ? currentTraits.filter((t) => t !== trait)
      : [...currentTraits, trait];
    updateStoryData("personalityTraits", newTraits);
  };

  return (
    <Card className="w-full hover:shadow-lg dark:hover:shadow-white/10 transition-shadow rounded-2xl max-w-2xl mx-auto">
      <CardHeader className="text-center">
        {/* <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-accent" />
        </div> */}
        <CardTitle className="text-2xl font-serif">
          Create the Main Character
        </CardTitle>
        <CardDescription>Design the hero of your story</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="mainCharacter">Main Character</Label>
          <Input
            id="mainCharacter"
            placeholder="e.g., A brave little dragon, A curious robot, etc."
            value={storyData.mainCharacter}
            onChange={(e) => updateStoryData("mainCharacter", e.target.value)}
            size="md"
            variant="bordered"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="characterDescription">
            Character Description (Optional)
          </Label>
          <Textarea
            id="characterDescription"
            placeholder="Describe what your character looks like..."
            value={storyData.characterDescription}
            onChange={(e) =>
              updateStoryData("characterDescription", e.target.value)
            }
            minRows={3}
            variant="bordered"
            size="md"
          />
        </div>

        <div className="space-y-3">
          <Label>Personality Traits (Optional)</Label>
          <div className="flex flex-wrap gap-2">
            {PERSONALITY_TRAITS.map((trait) => (
              <Chip
                key={trait}
                color={
                  storyData.personalityTraits?.includes(trait)
                    ? "primary"
                    : "default"
                }
                variant={
                  storyData.personalityTraits?.includes(trait)
                    ? "solid"
                    : "bordered"
                }
                className="cursor-pointer transition-colors capitalize"
                onClick={() => toggleTrait(trait)}
              >
                {trait}
              </Chip>
            ))}
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
            onPress={onNext}
            isDisabled={!canProceed}
            className="flex-1"
            size="md"
            color="primary"
            variant="solid"
            endContent={<ArrowRight className="h-4 w-4" />}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
