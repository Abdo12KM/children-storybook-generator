"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip, Button, Image, Spinner } from "@heroui/react";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Download,
  FileText,
  Sparkles,
  ImageIcon,
  BookOpen,
  Brain,
  MessageCircle,
  Lightbulb,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GeneratedStory } from "@/types";
import { generateStoryPDF } from "@/utils/pdf-generator";

interface StoryPreviewProps {
  story: GeneratedStory;
  childName?: string;
}

export function StoryPreview({ story, childName }: StoryPreviewProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid");
  const [currentPage, setCurrentPage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      await generateStoryPDF(story, childName);
    } catch (error) {
      console.error("Client-side PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Update current page when carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentPage(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const goToPage = (pageIndex: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(pageIndex);
    }
  };

  // Reusable story page card component
  const StoryPageCard = ({ page }: { page: any }) => (
    <Card className="overflow-hidden !py-0">
      <CardContent className="p-0">
        <div className="flex flex-col gap-0 md:grid md:grid-cols-2">
          {/* Image Section */}
          <div className="bg-muted relative aspect-[4/3] w-full md:w-auto">
            {page.imageUrl && (
              <Image
                src={page.imageUrl || "/placeholder.svg"}
                alt={`Illustration for page ${page.pageNumber}`}
                className="h-full w-full object-cover"
                radius="none"
                loading="lazy"
                fallbackSrc={`/placeholder.svg?height=400&width=600&query=${encodeURIComponent(page.imagePrompt)}`}
              />
            )}
            <div className="absolute top-4 left-4">
              <Chip variant="solid" color="primary" size="sm">
                Page {page.pageNumber}
              </Chip>
            </div>
            <div className="absolute top-4 right-4">
              {page.imageUrl?.startsWith("data:") ? (
                <Chip
                  variant="solid"
                  color="success"
                  size="sm"
                  startContent={<Sparkles className="h-3 w-3" />}
                >
                  AI Generated
                </Chip>
              ) : (
                <Chip
                  variant="solid"
                  color="default"
                  size="sm"
                  startContent={<ImageIcon className="h-3 w-3" />}
                >
                  Placeholder
                </Chip>
              )}
            </div>
          </div>

          {/* Text Section */}
          <div className="flex w-full items-center p-4 md:w-auto md:p-6">
            <div className="w-full space-y-4">
              <p className="text-foreground font-sans text-lg leading-relaxed">
                {page.content}
              </p>

              {/* Page Vocabulary */}
              {page.vocabulary && page.vocabulary.length > 0 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Page Vocabulary:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {page.vocabulary.map((word: string, index: number) => (
                      <Chip
                        key={index}
                        variant="bordered"
                        color="secondary"
                        size="sm"
                        className="border-purple-200 bg-purple-50 text-sm text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300"
                      >
                        {word}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* <p className="text-muted-foreground text-sm italic">
                {page.imagePrompt}
              </p> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Story Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-foreground font-serif text-3xl font-bold">
          {story.title}
        </h1>
        <p className="text-muted-foreground">{story.summary}</p>
        <div className="flex items-center justify-center gap-4">
          <Chip variant="flat" color="secondary" className="text-sm">
            {story.pages.length} pages
          </Chip>

          <Button
            disableRipple
            onPress={downloadPDF}
            isDisabled={isGeneratingPDF}
            isLoading={isGeneratingPDF}
            color="primary"
            variant="solid"
            startContent={
              !isGeneratingPDF ? <Download className="h-4 w-4" /> : undefined
            }
            spinner={<Spinner size="sm" color="white" />}
          >
            {isGeneratingPDF ? "Creating PDF..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <Button
          disableRipple
          onPress={() => setViewMode("grid")}
          variant={viewMode === "grid" ? "solid" : "bordered"}
          color={viewMode === "grid" ? "primary" : "default"}
          size="sm"
          startContent={<Grid3X3 className="h-4 w-4" />}
        >
          Grid View
        </Button>
        <Button
          disableRipple
          onPress={() => setViewMode("carousel")}
          variant={viewMode === "carousel" ? "solid" : "bordered"}
          color={viewMode === "carousel" ? "primary" : "default"}
          size="sm"
          startContent={<ChevronRight className="h-4 w-4" />}
        >
          Carousel View
        </Button>
      </div>

      {/* Story Pages */}
      {viewMode === "grid" ? (
        <div className="grid gap-6">
          {story.pages.map((page) => (
            <StoryPageCard key={page.pageNumber} page={page} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Carousel className="w-full" setApi={setCarouselApi}>
              <CarouselContent>
                {story.pages.map((page) => (
                  <CarouselItem key={page.pageNumber}>
                    <StoryPageCard page={page} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Custom Carousel Controls */}
          <div className="flex items-center justify-between rounded-lg bg-black/5 p-4 dark:bg-white/5">
            <Button
              isIconOnly
              disableRipple
              variant="bordered"
              size="sm"
              onPress={() => carouselApi?.scrollPrev()}
              isDisabled={currentPage === 0}
              startContent={<ChevronLeft className="h-4 w-4" />}
              className="flex items-center gap-2 bg-white dark:bg-black"
            />

            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground text-sm">
                Page {currentPage + 1} of {story.pages.length}
              </span>
              <div className="flex space-x-1">
                {story.pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${
                      index === currentPage
                        ? "bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <Button
              isIconOnly
              disableRipple
              variant="bordered"
              size="sm"
              onPress={() => carouselApi?.scrollNext()}
              isDisabled={currentPage === story.pages.length - 1}
              endContent={<ChevronRight className="h-4 w-4" />}
              className="flex items-center gap-2 bg-white dark:bg-black"
            />
          </div>
        </div>
      )}

      {/* Educational Companion Features */}
      {(story.keyVocabulary?.length > 0 ||
        story.discussionQuestions?.length > 0 ||
        story.activityIdea) && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-purple-600" />
              Educational Companion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-10">
            {/* Key Vocabulary */}
            {story.keyVocabulary?.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Key Vocabulary
                </h3>
                <div className="flex flex-wrap gap-2">
                  {story.keyVocabulary.map((word, index) => (
                    <Chip
                      key={index}
                      variant="flat"
                      color="primary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {word}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Discussion Questions */}
            {story.discussionQuestions?.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  Discussion Questions
                </h3>
                <ul className="space-y-2">
                  {story.discussionQuestions.map((question, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700 dark:bg-green-900 dark:text-green-300">
                        {index + 1}
                      </span>
                      <span className="text-sm">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Activity Idea */}
            {story.activityIdea && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Fun Activity
                </h3>
                <p className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm dark:border-yellow-800 dark:bg-yellow-950/20">
                  {story.activityIdea}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
