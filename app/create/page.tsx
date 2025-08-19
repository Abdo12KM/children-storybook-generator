"use client";

import { useAuth } from "@/hooks/use-auth";
import { StoryPreview } from "@/components/StoryPreview";
import { StoryProgress } from "@/components/StoryProgress";
import LoadingOverlay from "@/components/LoadingOverlay";
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
import Link from "next/link";

export default function CreateStoryPage() {
  const {
    storyData,
    generatedStory,
    isGenerating,
    error,
    updateStoryData,
    generateStory,
    resetStory,
  } = useStoryGenerator();

  const { currentStep, nextStep, prevStep, progress, resetSteps } =
    useStepNavigation();

  const handleCreateNewStory = () => {
    resetStory();
    resetSteps();
  };

  if (generatedStory) {
    return (
      <div className="from-background via-background/95 to-primary/5 min-h-screen bg-gradient-to-br">
        <div className="mx-auto max-w-6xl p-4">
          {/* Top Header Row */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Back Button - Top Left */}
            <Button
              variant="bordered"
              startContent={<ArrowLeft className="h-4 w-4" />}
              className="self-start bg-transparent"
              onPress={handleCreateNewStory}
            >
              Create New Story
            </Button>
            {/* Center Header */}
            <div className="flex flex-1 flex-col items-center">
              <h1 className="text-foreground font-serif text-2xl font-bold">
                Your Story is Ready!
              </h1>
              <p className="text-muted-foreground">
                A magical tale for {storyData.childName}
              </p>
            </div>
            {/* Dashboard Link */}
            <Link href="/dashboard">
              <Button variant="bordered" className="w-[120px]">
                Dashboard
              </Button>
            </Link>
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
    <div className="from-background via-background/95 to-primary/5 min-h-screen bg-gradient-to-br">
      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isGenerating}
        childName={storyData.childName}
      />

      <div className="mx-auto max-w-4xl p-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-foreground font-serif text-4xl font-bold">
            Create a New Story
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Create magical personalized stories for your little ones.
          </p>
        </div>

        {/* Progress Indicator */}
        <StoryProgress currentStep={currentStep} progress={progress} />

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border-destructive/20 mb-6 rounded-lg border p-4 text-center">
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
        )}

        {/* Step Content */}
        {renderStep()}
      </div>
    </div>
  );
}
