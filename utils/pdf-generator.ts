import { GeneratedStory } from "@/types";

// Helper function to convert image URL to base64
const getImageBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    if (imageUrl.startsWith("data:")) {
      return imageUrl;
    }

    // Skip if no valid image URL
    if (!imageUrl || imageUrl.includes("placeholder")) {
      return null;
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

export const generateStoryPDF = async (
  story: GeneratedStory,
  childName?: string,
): Promise<void> => {
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
        // No image available - show placeholder text
        pdf.setFillColor(240, 240, 240);
        pdf.rect(x, y, width, height, "F");
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(10);
        pdf.text("Image not available", x + width / 2, y + height / 2, {
          align: "center",
        });
        pdf.setTextColor(0, 0, 0);
      }
    } catch (error) {
      console.error("Error adding image to PDF:", error);
      // Show placeholder when image processing fails
      pdf.setFillColor(240, 240, 240);
      pdf.rect(x, y, width, height, "F");
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text("Image not available", x + width / 2, y + height / 2, {
        align: "center",
      });
      pdf.setTextColor(0, 0, 0);
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
      // Make image larger and center it horizontally
      const maxImageSize = Math.min(pageWidth - margin * 2, 120); // up to 120mm or fit page
      const imageSize = maxImageSize;
      const imageX = (pageWidth - imageSize) / 2;
      await addImageToPage(
        page.imageUrl,
        imageX,
        currentY,
        imageSize,
        imageSize,
      );
      currentY += imageSize + 15;
    }

    // Story text
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    currentY = addWrappedText(page.content, margin, currentY, contentWidth, 14);

    // Image description (smaller text)
    currentY += 10;
    pdf.setFontSize(9);
    pdf.setTextColor(120, 120, 120);
    /*  addWrappedText(
      `Illustration: ${page.imagePrompt}`,
      margin,
      currentY,
      contentWidth,
      9,
    ); */
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
      currentY = addWrappedText(vocabText, margin, currentY, contentWidth, 12);
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
};
