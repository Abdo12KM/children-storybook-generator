import { type NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

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

interface PDFRequest {
  story: StoryData;
  childName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PDFRequest = await request.json();

    if (!body.story || !body.story.title || !body.story.pages) {
      return NextResponse.json(
        { error: "Invalid story data" },
        { status: 400 },
      );
    }

    console.log("Generating PDF for story:", body.story.title);

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

    // Helper function to load and add image
    const addImageToPage = async (
      imageUrl: string,
      x: number,
      y: number,
      width: number,
      height: number,
    ) => {
      try {
        if (imageUrl.startsWith("/placeholder.svg")) {
          // Skip placeholder images or create a simple rectangle
          pdf.setFillColor(240, 240, 240);
          pdf.rect(x, y, width, height, "F");
          pdf.setTextColor(100, 100, 100);
          pdf.setFontSize(10);
          pdf.text("Image placeholder", x + width / 2, y + height / 2, {
            align: "center",
          });
          pdf.setTextColor(0, 0, 0);
          return;
        }

        // For external images, we'll create a placeholder for now
        // In a production environment, you'd want to fetch and convert the image
        pdf.setFillColor(220, 220, 255);
        pdf.rect(x, y, width, height, "F");
        pdf.setTextColor(80, 80, 120);
        pdf.setFontSize(8);
        pdf.text("Generated Image", x + width / 2, y + height / 2, {
          align: "center",
        });
        pdf.setTextColor(0, 0, 0);
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
    pdf.text(body.story.title, pageWidth / 2, 60, { align: "center" });

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `A personalized story for ${body.childName || "you"}`,
      pageWidth / 2,
      80,
      { align: "center" },
    );

    pdf.setFontSize(12);
    pdf.text(body.story.summary, pageWidth / 2, 100, {
      align: "center",
      maxWidth: contentWidth,
    });

    // Add decorative elements to title page
    pdf.setFillColor(139, 92, 246); // Purple accent color
    pdf.circle(pageWidth / 2, 120, 2, "F");

    // Story Pages
    for (let i = 0; i < body.story.pages.length; i++) {
      const page = body.story.pages[i];

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
      body.story.keyVocabulary?.length > 0 ||
      body.story.discussionQuestions?.length > 0 ||
      body.story.activityIdea
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
      if (body.story.keyVocabulary?.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Key Vocabulary", margin, currentY);
        currentY += 15;

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        const vocabText = body.story.keyVocabulary.join(" • ");
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
      if (body.story.discussionQuestions?.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Discussion Questions", margin, currentY);
        currentY += 15;

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        body.story.discussionQuestions.forEach((question, index) => {
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
      if (body.story.activityIdea) {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Fun Activity", margin, currentY);
        currentY += 15;

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        currentY = addWrappedText(
          body.story.activityIdea,
          margin,
          currentY,
          contentWidth,
          12,
        );
      }
    }

    // Generate PDF buffer
    const pdfBuffer = pdf.output("arraybuffer");

    console.log("PDF generated successfully");

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${body.story.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
