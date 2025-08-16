import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectItem, Button, Image } from "@heroui/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Palette, ArrowRight, ArrowLeft, Upload, Camera } from "lucide-react";
import { ART_STYLE_OPTIONS } from "@/constants";
import { useImageUpload } from "@/hooks/use-image-upload";
import { StoryData } from "@/types";

interface ArtStyleStepProps {
  storyData: StoryData;
  updateStoryData: (field: keyof StoryData, value: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function ArtStyleStep({
  storyData,
  updateStoryData,
  onNext,
  onPrev,
}: ArtStyleStepProps) {
  const { handleImageUpload } = useImageUpload();
  const canProceed = storyData.artStyle;

  const onImageUpload = (result: string) => {
    updateStoryData("uploadedImage", result);
  };

  return (
    <Card className="w-full hover:shadow-lg dark:hover:shadow-white/10 transition-shadow rounded-2xl max-w-2xl mx-auto">
      <CardHeader className="text-center">
        {/* <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Palette className="h-6 w-6 text-accent" />
        </div> */}
        <CardTitle className="text-2xl font-serif">Art Style & Photo</CardTitle>
        <CardDescription>Choose how your story will look</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="artStyle">Art Style</Label>
          <Select
            selectedKeys={storyData.artStyle ? [storyData.artStyle] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;
              updateStoryData("artStyle", key);
            }}
            placeholder="Choose an art style"
            size="md"
            variant="bordered"
          >
            {ART_STYLE_OPTIONS.map((style) => (
              <SelectItem key={style.value}>{style.label}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photoUpload">
            Upload Inspiration Photo (Optional)
          </Label>
          <div className="border-2 border-dashed border-border rounded-lg p-3 text-center">
            {storyData.uploadedImage ? (
              <div className="space-y-2">
                <Image
                  src={storyData.uploadedImage}
                  alt="Uploaded inspiration"
                  className="max-h-32 mx-auto"
                  radius="lg"
                  isZoomed
                />
                <p className="text-sm text-muted-foreground">
                  Photo uploaded successfully!
                </p>
                <Button
                  variant="bordered"
                  size="sm"
                  onPress={() => updateStoryData("uploadedImage", "")}
                >
                  Remove Photo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Upload a photo for inspiration
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This will help create consistent characters and scenes
                  </p>
                </div>
                <Label htmlFor="photoUpload" className="cursor-pointer">
                  <Input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, onImageUpload)}
                    className="hidden"
                  />
                  <Button
                    variant="bordered"
                    size="sm"
                    startContent={<Upload className="h-4 w-4" />}
                    as="span"
                    className="mx-auto"
                  >
                    Choose File
                  </Button>
                </Label>
              </div>
            )}
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
