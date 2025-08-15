"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  Sparkles,
  ImageIcon,
  BookOpen,
  Brain,
  MessageCircle,
  Lightbulb,
} from "lucide-react";

interface StoryPage {
  pageNumber: number;
  content: string;
  imagePrompt: string;
  imageUrl?: string;
  vocabulary?: string[];
}

interface StoryData {
  title: string;
  pages: StoryPage[];
  summary: string;
  characterSheet?: string;
  keyVocabulary: string[];
  discussionQuestions: string[];
  activityIdea: string;
}

interface StoryPreviewProps {
  story: StoryData;
  childName?: string;
}

export function StoryPreview({ story, childName }: StoryPreviewProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      console.log("Starting PDF generation...");

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story,
          childName: childName || "you",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${story.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Story Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-serif font-bold text-foreground">
          {story.title}
        </h1>
        <p className="text-muted-foreground">{story.summary}</p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {story.pages.length} pages
          </Badge>

          <Button
            onClick={downloadPDF}
            disabled={isGeneratingPDF}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isGeneratingPDF ? (
              <>
                <FileText className="h-4 w-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

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
          <CardContent className="space-y-6">
            {/* Key Vocabulary */}
            {story.keyVocabulary?.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Key Vocabulary
                </h3>
                <div className="flex flex-wrap gap-2">
                  {story.keyVocabulary.map((word, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Discussion Questions */}
            {story.discussionQuestions?.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  Discussion Questions
                </h3>
                <ul className="space-y-2">
                  {story.discussionQuestions.map((question, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs flex items-center justify-center font-bold mt-0.5 flex-shrink-0">
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
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Fun Activity
                </h3>
                <p className="text-sm bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  {story.activityIdea}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Story Pages */}
      <div className="grid gap-6">
        {story.pages.map((page) => (
          <Card key={page.pageNumber} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-muted">
                  {page.imageUrl && (
                    <img
                      src={page.imageUrl || "/placeholder.svg"}
                      alt={`Illustration for page ${page.pageNumber}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(page.imagePrompt)}`;
                      }}
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="default"
                      className="bg-accent text-accent-foreground"
                    >
                      Page {page.pageNumber}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    {page.imageUrl?.startsWith("data:") ? (
                      <Badge
                        variant="default"
                        className="bg-green-500 text-white"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-gray-500 text-white"
                      >
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Placeholder
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Text Section */}
                <div className="p-6 flex items-center">
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed font-sans text-foreground">
                      {page.content}
                    </p>

                    {/* Page Vocabulary */}
                    {page.vocabulary && page.vocabulary.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Page Vocabulary:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {page.vocabulary.map((word, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
                            >
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground italic">
                      {page.imagePrompt}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
