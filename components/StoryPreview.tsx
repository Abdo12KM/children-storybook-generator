"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip, Button, Image, Spinner } from "@heroui/react";
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
import { GeneratedStory } from "@/types";

interface StoryPreviewProps {
  story: GeneratedStory;
  childName?: string;
}

export function StoryPreview({ story, childName }: StoryPreviewProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Helper function to convert image URL to base64
  const getImageBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
      if (imageUrl.startsWith("data:")) {
        return imageUrl;
      }

      if (imageUrl.includes("placeholder.svg")) {
        return null; // Skip placeholder images
      }

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      console.log("Starting client-side PDF generation...");

      // Dynamically import jsPDF to avoid SSR issues
      const { jsPDF } = await import("jspdf");

      // Create new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // Helper function to add text with word wrapping
      const addWrappedText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        fontSize = 12,
      ) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + lines.length * fontSize * 0.35; // Return new Y position
      };

      // Helper function to add image to PDF
      const addImageToPage = async (
        imageUrl: string,
        x: number,
        y: number,
        width: number,
        height: number,
      ) => {
        try {
          const base64Image = await getImageBase64(imageUrl);

          if (base64Image) {
            pdf.addImage(base64Image, "JPEG", x, y, width, height);
          } else {
            // Create placeholder rectangle
            pdf.setFillColor(240, 240, 240);
            pdf.rect(x, y, width, height, "F");
            pdf.setTextColor(100, 100, 100);
            pdf.setFontSize(10);
            pdf.text("Image placeholder", x + width / 2, y + height / 2, {
              align: "center",
            });
            pdf.setTextColor(0, 0, 0);
          }
        } catch (error) {
          console.error("Error adding image to PDF:", error);
          // Fallback: draw a simple rectangle
          pdf.setFillColor(240, 240, 240);
          pdf.rect(x, y, width, height, "F");
        }
      };

      // Title Page
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(story.title, pageWidth / 2, 60, { align: "center" });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `A personalized story for ${childName || "you"}`,
        pageWidth / 2,
        80,
        { align: "center" },
      );

      pdf.setFontSize(12);
      const summaryLines = pdf.splitTextToSize(story.summary, contentWidth);
      pdf.text(summaryLines, pageWidth / 2, 100, { align: "center" });

      // Add decorative elements to title page
      pdf.setFillColor(139, 92, 246); // Purple accent color
      pdf.circle(pageWidth / 2, 120, 2, "F");

      // Story Pages
      for (let i = 0; i < story.pages.length; i++) {
        const page = story.pages[i];

        // Add new page for each story page
        pdf.addPage();

        let currentY = margin + 10;

        // Page number
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${page.pageNumber}`, pageWidth - margin, margin, {
          align: "right",
        });
        pdf.setTextColor(0, 0, 0);

        // Image section (top half of page)
        if (page.imageUrl) {
          const imageHeight = 80;
          await addImageToPage(
            page.imageUrl,
            margin,
            currentY,
            contentWidth,
            imageHeight,
          );
          currentY += imageHeight + 15;
        }

        // Story text
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "normal");
        currentY = addWrappedText(
          page.content,
          margin,
          currentY,
          contentWidth,
          14,
        );

        // Image description (smaller text)
        currentY += 10;
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        addWrappedText(
          `Illustration: ${page.imagePrompt}`,
          margin,
          currentY,
          contentWidth,
          9,
        );
        pdf.setTextColor(0, 0, 0);
      }

      // Add Educational Companion Pages
      if (
        story.keyVocabulary?.length > 0 ||
        story.discussionQuestions?.length > 0 ||
        story.activityIdea
      ) {
        // Educational Companion Title Page
        pdf.addPage();
        let currentY = margin + 20;

        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(139, 92, 246); // Purple color
        pdf.text("Educational Companion", pageWidth / 2, currentY, {
          align: "center",
        });
        currentY += 20;

        // Key Vocabulary Section
        if (story.keyVocabulary?.length > 0) {
          pdf.setFontSize(16);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("Key Vocabulary", margin, currentY);
          currentY += 15;

          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");
          const vocabText = story.keyVocabulary.join(" • ");
          currentY = addWrappedText(
            vocabText,
            margin,
            currentY,
            contentWidth,
            12,
          );
          currentY += 15;
        }

        // Discussion Questions Section
        if (story.discussionQuestions?.length > 0) {
          pdf.setFontSize(16);
          pdf.setFont("helvetica", "bold");
          pdf.text("Discussion Questions", margin, currentY);
          currentY += 15;

          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");
          story.discussionQuestions.forEach((question, index) => {
            const questionText = `${index + 1}. ${question}`;
            currentY = addWrappedText(
              questionText,
              margin,
              currentY,
              contentWidth,
              12,
            );
            currentY += 8;
          });
          currentY += 10;
        }

        // Activity Idea Section
        if (story.activityIdea) {
          pdf.setFontSize(16);
          pdf.setFont("helvetica", "bold");
          pdf.text("Fun Activity", margin, currentY);
          currentY += 15;

          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");
          currentY = addWrappedText(
            story.activityIdea,
            margin,
            currentY,
            contentWidth,
            12,
          );
        }
      }

      // Save the PDF
      const fileName = `${story.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      pdf.save(fileName);

      console.log("PDF generated and downloaded successfully (client-side)");
    } catch (error) {
      console.error("Client-side PDF generation failed:", error);
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
          <Chip variant="flat" color="secondary" className="text-sm">
            {story.pages.length} pages
          </Chip>

          <Button
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
          <CardContent className="space-y-5">
            {/* Key Vocabulary */}
            {story.keyVocabulary?.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Key Vocabulary
                </h3>
                <div className="flex flex-wrap gap-2">
                  {story.keyVocabulary.map((word, index) => (
                    <Chip
                      key={index}
                      variant="flat"
                      color="primary"
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
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
                    <Image
                      src={page.imageUrl || "/placeholder.svg"}
                      alt={`Illustration for page ${page.pageNumber}`}
                      className="w-full h-full object-cover"
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
                            <Chip
                              key={index}
                              variant="bordered"
                              color="secondary"
                              size="sm"
                              className="text-xs bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
                            >
                              {word}
                            </Chip>
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
