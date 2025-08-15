"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sparkles,
  BookOpen,
  Users,
  MapPin,
  Palette,
  Wand2,
  ArrowLeft,
  Upload,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { StoryPreview } from "@/components/story-preview";

interface StoryData {
  childName: string;
  childAge: string;
  mainCharacter: string;
  characterDescription: string;
  setting: string;
  theme: string;
  moralLesson: string;
  storyLength: string;
  artStyle: string;
  uploadedImage?: string;
  personalityTraits: string[];
  difficulty: string;
}

interface StoryPage {
  pageNumber: number;
  content: string;
  imagePrompt: string;
  imageUrl?: string;
  vocabulary?: string[];
}

interface GeneratedStory {
  title: string;
  pages: StoryPage[];
  summary: string;
  characterSheet?: string;
  keyVocabulary: string[];
  discussionQuestions: string[];
  activityIdea: string;
}

const steps = [
  { id: 1, title: "Child Details", icon: Users },
  { id: 2, title: "Main Character", icon: Sparkles },
  { id: 3, title: "Story Setting", icon: MapPin },
  { id: 4, title: "Art Style & Photo", icon: Palette },
  { id: 5, title: "Theme & Message", icon: BookOpen },
];

export default function StoryCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(
    null,
  ); // Added state for generated story
  const [storyData, setStoryData] = useState<StoryData>({
    childName: "",
    childAge: "",
    mainCharacter: "",
    characterDescription: "",
    setting: "",
    theme: "",
    moralLesson: "",
    storyLength: "",
    artStyle: "",
    uploadedImage: "",
    personalityTraits: [],
    difficulty: "",
  });

  const updateStoryData = (
    field: keyof StoryData,
    value: string | string[],
  ) => {
    setStoryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateStoryData("uploadedImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const generateStory = async () => {
    setIsGenerating(true);

    try {
      console.log("Starting story generation...");

      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate story");
      }

      const story = await response.json();
      console.log("Story generated successfully:", story);

      setGeneratedStory(story); // Set the generated story to display it
    } catch (error) {
      console.error("Story generation failed:", error);
      alert("Failed to generate story. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startOver = () => {
    setGeneratedStory(null);
    setCurrentStep(1);
    setStoryData({
      childName: "",
      childAge: "",
      mainCharacter: "",
      characterDescription: "",
      setting: "",
      theme: "",
      moralLesson: "",
      storyLength: "",
      artStyle: "",
      uploadedImage: "",
      personalityTraits: [],
      difficulty: "",
    });
  };

  if (generatedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={startOver}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Create New Story
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-serif font-bold text-foreground">
                Your Story is Ready!
              </h1>
            </div>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>

          {/* Story Preview with PDF download */}
          <StoryPreview
            story={generatedStory}
            childName={storyData.childName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-serif font-bold text-foreground">
              AI Storybook Creator
            </h1>
            <Wand2 className="h-8 w-8 text-accent" />
          </div>
          <p className="text-muted-foreground text-lg">
            Create magical personalized stories for your little ones
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                  ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }
                `}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-xs font-medium text-center ${isActive ? "text-accent" : "text-muted-foreground"}`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-foreground">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-base">
              {currentStep === 1 &&
                "Tell us about the special child this story is for"}
              {currentStep === 2 && "Create the main character of your story"}
              {currentStep === 3 && "Choose where your adventure takes place"}
              {currentStep === 4 && "Select art style and upload inspiration"}
              {currentStep === 5 && "Pick the theme and message for your story"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Child Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="childName" className="text-base font-medium">
                    Child's Name *
                  </Label>
                  <Input
                    id="childName"
                    placeholder="Enter the child's name"
                    value={storyData.childName}
                    onChange={(e) =>
                      updateStoryData("childName", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="childAge" className="text-base font-medium">
                    Age Group *
                  </Label>
                  <Select
                    value={storyData.childAge}
                    onValueChange={(value) =>
                      updateStoryData("childAge", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-5">3-5 years (Preschool)</SelectItem>
                      <SelectItem value="6-8">
                        6-8 years (Early Elementary)
                      </SelectItem>
                      <SelectItem value="9-12">
                        9-12 years (Elementary)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty" className="text-base font-medium">
                    Reading Level *
                  </Label>
                  <Select
                    value={storyData.difficulty}
                    onValueChange={(value) =>
                      updateStoryData("difficulty", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose reading difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">
                        Beginner (Simple words)
                      </SelectItem>
                      <SelectItem value="intermediate">
                        Intermediate (Mix of simple and complex)
                      </SelectItem>
                      <SelectItem value="advanced">
                        Advanced (Rich vocabulary)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Main Character */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="mainCharacter"
                    className="text-base font-medium"
                  >
                    Main Character *
                  </Label>
                  <Input
                    id="mainCharacter"
                    placeholder="e.g., A brave little dragon, A curious robot, etc."
                    value={storyData.mainCharacter}
                    onChange={(e) =>
                      updateStoryData("mainCharacter", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="characterDescription"
                    className="text-base font-medium"
                  >
                    Character Description
                  </Label>
                  <Textarea
                    id="characterDescription"
                    placeholder="Describe the character's appearance, personality, or special abilities..."
                    value={storyData.characterDescription}
                    onChange={(e) =>
                      updateStoryData("characterDescription", e.target.value)
                    }
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium">
                    Character Personality Traits
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      "brave",
                      "kind",
                      "curious",
                      "funny",
                      "helpful",
                      "clever",
                      "gentle",
                      "adventurous",
                    ].map((trait) => (
                      <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                          id={trait}
                          checked={storyData.personalityTraits.includes(trait)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateStoryData("personalityTraits", [
                                ...storyData.personalityTraits,
                                trait,
                              ]);
                            } else {
                              updateStoryData(
                                "personalityTraits",
                                storyData.personalityTraits.filter(
                                  (t) => t !== trait,
                                ),
                              );
                            }
                          }}
                        />
                        <Label htmlFor={trait} className="text-sm capitalize">
                          {trait}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Story Setting */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="setting" className="text-base font-medium">
                    Story Setting *
                  </Label>
                  <Select
                    value={storyData.setting}
                    onValueChange={(value) => updateStoryData("setting", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose where the story takes place" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enchanted-forest">
                        Enchanted Forest
                      </SelectItem>
                      <SelectItem value="magical-kingdom">
                        Magical Kingdom
                      </SelectItem>
                      <SelectItem value="underwater-world">
                        Underwater World
                      </SelectItem>
                      <SelectItem value="space-adventure">
                        Space Adventure
                      </SelectItem>
                      <SelectItem value="cozy-village">Cozy Village</SelectItem>
                      <SelectItem value="mystical-mountain">
                        Mystical Mountain
                      </SelectItem>
                      <SelectItem value="fairy-garden">Fairy Garden</SelectItem>
                      <SelectItem value="pirate-ship">Pirate Ship</SelectItem>
                      <SelectItem value="modern-city">Modern City</SelectItem>
                      <SelectItem value="prehistoric-world">
                        Prehistoric World
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Art Style & Photo Upload */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="artStyle" className="text-base font-medium">
                    Art Style *
                  </Label>
                  <Select
                    value={storyData.artStyle}
                    onValueChange={(value) =>
                      updateStoryData("artStyle", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose illustration style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartoon">
                        Cartoon - Bright & Fun
                      </SelectItem>
                      <SelectItem value="watercolor">
                        Watercolor - Soft & Dreamy
                      </SelectItem>
                      <SelectItem value="fantasy">
                        Fantasy - Magical & Mystical
                      </SelectItem>
                      <SelectItem value="realistic">
                        Realistic - Detailed & Lifelike
                      </SelectItem>
                      <SelectItem value="sketch">
                        Sketch - Hand-drawn Style
                      </SelectItem>
                      <SelectItem value="digital-art">
                        Digital Art - Modern & Vibrant
                      </SelectItem>
                      <SelectItem value="storybook">
                        Classic Storybook Style
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Upload Inspiration Image (Optional)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Upload a photo, drawing, or toy to inspire your story. Our
                    AI will analyze it and incorporate elements into the
                    narrative.
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
                        />
                      </div>
                    </div>
                  </div>

                  {storyData.uploadedImage && (
                    <div className="mt-4">
                      <div className="relative w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
                        <img
                          src={storyData.uploadedImage}
                          alt="Uploaded inspiration"
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-1 right-1 bg-green-500">
                          <Camera className="h-3 w-3 mr-1" />
                          Uploaded
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Theme & Message */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme" className="text-base font-medium">
                    Story Theme *
                  </Label>
                  <Select
                    value={storyData.theme}
                    onValueChange={(value) => updateStoryData("theme", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose the main theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendship">
                        Friendship & Kindness
                      </SelectItem>
                      <SelectItem value="courage">Courage & Bravery</SelectItem>
                      <SelectItem value="adventure">
                        Adventure & Discovery
                      </SelectItem>
                      <SelectItem value="family">Family & Love</SelectItem>
                      <SelectItem value="perseverance">
                        Never Give Up
                      </SelectItem>
                      <SelectItem value="helping-others">
                        Helping Others
                      </SelectItem>
                      <SelectItem value="self-confidence">
                        Believing in Yourself
                      </SelectItem>
                      <SelectItem value="nature">Caring for Nature</SelectItem>
                      <SelectItem value="creativity">
                        Creativity & Imagination
                      </SelectItem>
                      <SelectItem value="responsibility">
                        Being Responsible
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="moralLesson"
                    className="text-base font-medium"
                  >
                    Moral Lesson (Optional)
                  </Label>
                  <Textarea
                    id="moralLesson"
                    placeholder="What lesson should the child learn from this story?"
                    value={storyData.moralLesson}
                    onChange={(e) =>
                      updateStoryData("moralLesson", e.target.value)
                    }
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="storyLength"
                    className="text-base font-medium"
                  >
                    Story Length *
                  </Label>
                  <Select
                    value={storyData.storyLength}
                    onValueChange={(value) =>
                      updateStoryData("storyLength", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="How long should the story be?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (5-8 pages)</SelectItem>
                      <SelectItem value="medium">
                        Medium (10-15 pages)
                      </SelectItem>
                      <SelectItem value="long">Long (18-25 pages)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 bg-transparent"
              >
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 &&
                      (!storyData.childName ||
                        !storyData.childAge ||
                        !storyData.difficulty)) ||
                    (currentStep === 2 && !storyData.mainCharacter) ||
                    (currentStep === 3 && !storyData.setting) ||
                    (currentStep === 4 && !storyData.artStyle) ||
                    (currentStep === 5 &&
                      (!storyData.theme || !storyData.storyLength))
                  }
                  className="px-6 bg-accent hover:bg-accent/90"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={generateStory}
                  disabled={
                    !storyData.theme || !storyData.storyLength || isGenerating
                  }
                  className="px-6 bg-accent hover:bg-accent/90"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? "Creating Story..." : "Create Story"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
