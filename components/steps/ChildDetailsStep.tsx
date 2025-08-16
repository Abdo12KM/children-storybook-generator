import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Label } from "@/components/ui/label";
import { Users, ArrowRight } from "lucide-react";
import { AGE_OPTIONS } from "@/constants";
import { StoryData } from "@/types";

interface ChildDetailsStepProps {
  storyData: StoryData;
  updateStoryData: (field: keyof StoryData, value: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function ChildDetailsStep({
  storyData,
  updateStoryData,
  onNext,
}: ChildDetailsStepProps) {
  const canProceed = storyData.childName && storyData.childAge;

  return (
    <Card className="mx-auto w-full max-w-2xl rounded-2xl transition-shadow hover:shadow-lg dark:hover:shadow-white/10">
      <CardHeader className="text-center">
        {/* <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Users className="h-6 w-6 text-accent" />
        </div> */}
        <CardTitle className="font-serif text-2xl">
          Tell us about your child
        </CardTitle>
        <CardDescription>
          Help us create the perfect story for your little one
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="childName">Child's Name</Label>
          <Input
            id="childName"
            placeholder="What's your child's name?"
            value={storyData.childName}
            onChange={(e) => updateStoryData("childName", e.target.value)}
            size="md"
            variant="bordered"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="childAge">Age Group</Label>
          <Select
            selectedKeys={storyData.childAge ? [storyData.childAge] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;
              updateStoryData("childAge", key);
            }}
            placeholder="Select age group"
            size="md"
            variant="bordered"
          >
            {AGE_OPTIONS.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>

        <Button
          onPress={onNext}
          isDisabled={!canProceed}
          fullWidth
          size="md"
          color="primary"
          variant="solid"
          endContent={<ArrowRight className="h-4 w-4" />}
          className="mt-6"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
