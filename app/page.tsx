"use client";

import { StoryPreview } from "@/components/StoryPreview";
import { StoryProgress } from "@/components/StoryProgress";
import {
  ChildDetailsStep,
  MainCharacterStep,
  StorySettingStep,
  ArtStyleStep,
  ThemeMessageStep,
} from "@/components/steps";
import { useStoryGenerator } from "@/hooks/use-story-generator";
import { useStepNavigation } from "@/hooks/use-step-navigation";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

export default function StoryCreator() {
  const {
    storyData,
    generatedStory,
    isGenerating,
    error,
    updateStoryData,
    generateStory,
    resetStory,
  } = useStoryGenerator();

  const { currentStep, nextStep, prevStep, progress } = useStepNavigation();

  if (generatedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="bordered"
              onPress={resetStory}
              startContent={<ArrowLeft className="h-4 w-4" />}
              className="bg-transparent"
            >
              Create New Story
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-serif font-bold text-foreground">
                Your Story is Ready!
              </h1>
              <p className="text-muted-foreground">
                A magical tale for {storyData.childName}
              </p>
            </div>
          </div>

          <StoryPreview
            story={generatedStory}
            childName={storyData.childName}
          />
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ChildDetailsStep
            storyData={storyData}
            updateStoryData={updateStoryData}
            onNext={nextStep}
            onPrev={prevStep}
            canProceed={Boolean(storyData.childName && storyData.childAge)}
          />
        );
      case 2:
        return (
          <MainCharacterStep
            storyData={storyData}
            updateStoryData={updateStoryData}
            onNext={nextStep}
            onPrev={prevStep}
            canProceed={Boolean(storyData.mainCharacter)}
          />
        );
      case 3:
        return (
          <StorySettingStep
            storyData={storyData}
            updateStoryData={updateStoryData}
            onNext={nextStep}
            onPrev={prevStep}
            canProceed={Boolean(storyData.setting)}
          />
        );
      case 4:
        return (
          <ArtStyleStep
            storyData={storyData}
            updateStoryData={updateStoryData}
            onNext={nextStep}
            onPrev={prevStep}
            canProceed={Boolean(storyData.artStyle)}
          />
        );
      case 5:
        return (
          <ThemeMessageStep
            storyData={storyData}
            updateStoryData={updateStoryData}
            onPrev={prevStep}
            onGenerate={generateStory}
            isGenerating={isGenerating}
            canProceed={Boolean(
              storyData.theme && storyData.storyLength && storyData.difficulty,
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            AI Storybook Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create magical personalized stories for your little ones.
          </p>
        </div>

        {/* Progress Indicator */}
        <StoryProgress currentStep={currentStep} progress={progress} />

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
        )}

        {/* Step Content */}
        {renderStep()}
      </div>
    </div>
  );
}
