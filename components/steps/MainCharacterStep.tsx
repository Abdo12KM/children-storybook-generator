import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Textarea, Button, Chip } from "@heroui/react";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, ArrowLeft, Wand } from "lucide-react";
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

  // Auto fill handler
  const handleAutoFill = () => {
    const characters = [
      "A dragon",
      "A robot",
      "A unicorn",
      "A fox",
      "An alien",
      "A squirrel",
      "An owl",
      "A pirate",
      "A giant",
      "A cheetah",
      "A puppy",
      "A mermaid",
      "A turtle",
      "An astronaut",
      "A fairy",
    ];
    const descriptions = [
      "Small, green, and loves to fly.",
      "Shiny metal body and big blue eyes.",
      "Sparkly mane and rainbow tail.",
      "Red fur and bushy tail.",
      "Glowing skin and three eyes.",
      "Quick and loves collecting acorns.",
      "Big round eyes and soft feathers.",
      "Wears a striped shirt and loves treasure.",
      "Tall, gentle, and loves flowers.",
      "Spots all over and runs very fast.",
      "Fluffy, energetic, and loves to play.",
      "Long hair and a beautiful singing voice.",
      "Slow but always thinking deeply.",
      "Wears a space suit and loves exploring.",
      "Tiny wings and a magical wand.",
    ];
    const idx = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[idx];
    const randomDescription = descriptions[idx];
    const randomTraits = PERSONALITY_TRAITS.sort(
      () => 0.5 - Math.random(),
    ).slice(0, 3);
    updateStoryData("mainCharacter", randomCharacter);
    updateStoryData("characterDescription", randomDescription);
    updateStoryData("personalityTraits", randomTraits);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl rounded-2xl transition-shadow hover:shadow-lg dark:hover:shadow-white/10">
      <CardHeader className="text-center">
        {/* <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-accent" />
        </div> */}
        <CardTitle className="font-serif text-2xl">
          Create the Main Character
        </CardTitle>
        <CardDescription>Design the hero of your story</CardDescription>
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
          <Label htmlFor="mainCharacter">Main Character</Label>
          <Input
            id="mainCharacter"
            placeholder="e.g., A little dragon, robot, etc."
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
                className="cursor-pointer capitalize transition-colors"
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
