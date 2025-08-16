import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectItem, Button } from "@heroui/react";
import { Label } from "@/components/ui/label";
import { MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { SETTING_OPTIONS } from "@/constants";
import { StoryData } from "@/types";

interface StorySettingStepProps {
  storyData: StoryData;
  updateStoryData: (field: keyof StoryData, value: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function StorySettingStep({
  storyData,
  updateStoryData,
  onNext,
  onPrev,
}: StorySettingStepProps) {
  const canProceed = storyData.setting;

  return (
    <Card className="mx-auto w-full max-w-2xl rounded-2xl transition-shadow hover:shadow-lg dark:hover:shadow-white/10">
      <CardHeader className="text-center">
        {/* <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-accent" />
        </div> */}
        <CardTitle className="font-serif text-2xl">
          Choose the Setting
        </CardTitle>
        <CardDescription>Where will your adventure take place?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="setting">Story Setting</Label>
          <Select
            selectedKeys={storyData.setting ? [storyData.setting] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;
              updateStoryData("setting", key);
            }}
            placeholder="Choose a magical setting"
            size="md"
            variant="bordered"
          >
            {SETTING_OPTIONS.map((setting) => (
              <SelectItem key={setting}>{setting}</SelectItem>
            ))}
          </Select>
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
