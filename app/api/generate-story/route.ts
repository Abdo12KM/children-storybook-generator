import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { StoryRequest, StoryResponse } from "@/types";
import { STORY_PARAMS, VOCABULARY_LEVELS } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const body: StoryRequest = await request.json();

    // Validate required fields
    if (
      !body.childName ||
      !body.childAge ||
      !body.mainCharacter ||
      !body.setting ||
      !body.theme ||
      !body.storyLength
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Determine story parameters based on length
    const params =
      STORY_PARAMS[body.storyLength as keyof typeof STORY_PARAMS] ||
      STORY_PARAMS.short;

    // Create enhanced character description for consistency
    const characterTraits =
      body.personalityTraits.length > 0
        ? body.personalityTraits.join(", ")
        : "kind and brave";

    const characterSheet = `Character Appearance: ${body.characterDescription || "A friendly character"} with these personality traits: ${characterTraits}. Keep this appearance consistent throughout all illustrations.`;

    // Handle uploaded image context
    let imageContext = "";
    if (body.uploadedImage) {
      imageContext = `IMPORTANT: The user has uploaded an inspiration image. Incorporate elements, colors, or themes from this image into the story and illustrations where appropriate.`;
    }

    // Determine difficulty level content
    const vocabularyInstruction =
      VOCABULARY_LEVELS[body.difficulty as keyof typeof VOCABULARY_LEVELS];

    // Create the enhanced story generation prompt
    const storyPrompt = `You are a world-class children's story author and educational expert. You MUST respond with ONLY valid JSON - no additional text before or after.

STORY DETAILS:
- Child's Name: ${body.childName}
- Age Group: ${body.childAge}
- Reading Level: ${body.difficulty} - ${vocabularyInstruction}
- Main Character: ${body.mainCharacter}
- Character Details: ${characterSheet}
- Setting: ${body.setting}
- Theme: ${body.theme}
- Moral Lesson: ${body.moralLesson || "The importance of kindness and friendship"}
- Story Length: ${params.pages} pages, approximately ${params.wordsPerPage} words per page
- Art Style: ${body.artStyle}

${imageContext}

CRITICAL: Respond with ONLY valid JSON in this exact format (no markdown, no backticks, no additional text):

{
  "title": "Story Title Here",
  "characterSheet": "Detailed physical description for consistent character appearance",
  "pages": [
    {
      "pageNumber": 1,
      "content": "Page content here (approximately ${params.wordsPerPage} words)...",
      "imagePrompt": "Character sheet details + scene description in ${body.artStyle} style",
      "vocabulary": ["word1", "word2"]
    }
  ],
  "summary": "Brief story summary",
  "keyVocabulary": ["word1", "word2", "word3", "word4", "word5"],
  "discussionQuestions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ],
  "activityIdea": "A creative activity suggestion related to the story theme"
}

Requirements:
- Create exactly ${params.pages} pages
- Each page ~${params.wordsPerPage} words
- Age-appropriate for ${body.childAge} year olds
- Include ${body.childName} as main character
- Theme: ${body.theme}
- Setting: ${body.setting}
- Main character: ${body.mainCharacter}
- Moral lesson: ${body.moralLesson || "kindness and friendship"}
- Art style: ${body.artStyle}

RESPOND WITH ONLY VALID JSON - NO OTHER TEXT:`;

    console.log("Generating story with Google Gemini...");

    // Generate the story using Google Gemini with system instruction
    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      system:
        "You are a children's story author. You MUST respond with ONLY valid JSON format - no additional text, explanations, or markdown. Start your response with { and end with }.",
      prompt: storyPrompt,
      temperature: 0.7,
    });

    console.log("Story generated, parsing response...");
    console.log("Raw response:", text.substring(0, 500) + "...");

    // Parse the JSON response
    let storyData: StoryResponse;
    try {
      // Clean the response - remove any markdown formatting and extra text
      let cleanedText = text.trim();

      // Remove markdown code blocks if present
      cleanedText = cleanedText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "");

      // Find JSON object boundaries
      const jsonStart = cleanedText.indexOf("{");
      const jsonEnd = cleanedText.lastIndexOf("}") + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("No JSON object found in response");
      }

      const jsonText = cleanedText.substring(jsonStart, jsonEnd);
      console.log("Extracted JSON:", jsonText.substring(0, 200) + "...");

      storyData = JSON.parse(jsonText);

      // Validate the structure
      if (
        !storyData.title ||
        !storyData.pages ||
        !Array.isArray(storyData.pages)
      ) {
        throw new Error("Invalid story structure - missing required fields");
      }

      // Ensure we have the right number of pages
      if (storyData.pages.length !== params.pages) {
        console.log(
          `Warning: Expected ${params.pages} pages, got ${storyData.pages.length}`,
        );

        // Pad or trim pages to match expected count
        while (storyData.pages.length < params.pages) {
          const pageNum = storyData.pages.length + 1;
          storyData.pages.push({
            pageNumber: pageNum,
            content: `${body.childName} continued the adventure with the ${body.mainCharacter}, discovering more about ${body.theme}.`,
            imagePrompt: `${body.mainCharacter} with ${body.childName} in ${body.setting}, ${body.artStyle} style, children's book illustration`,
            vocabulary: ["adventure", "discover"],
          });
        }

        if (storyData.pages.length > params.pages) {
          storyData.pages = storyData.pages.slice(0, params.pages);
        }
      }

      // Ensure all required fields exist with defaults
      if (!storyData.characterSheet) {
        storyData.characterSheet = `${body.mainCharacter} is ${body.characterDescription || "a friendly character"} with ${characterTraits} personality.`;
      }
      if (!storyData.summary) {
        storyData.summary = `A story about ${body.childName} learning about ${body.theme} with a ${body.mainCharacter}.`;
      }
      if (!storyData.keyVocabulary || !Array.isArray(storyData.keyVocabulary)) {
        storyData.keyVocabulary = [
          "adventure",
          "friendship",
          "brave",
          "kind",
          "learn",
        ];
      }
      if (
        !storyData.discussionQuestions ||
        !Array.isArray(storyData.discussionQuestions)
      ) {
        storyData.discussionQuestions = [
          `What did ${body.childName} learn in this story?`,
          `How would you handle the same situation?`,
          `What was your favorite part of the adventure?`,
        ];
      }
      if (!storyData.activityIdea) {
        storyData.activityIdea = `Draw a picture of your favorite scene from ${body.childName}'s adventure.`;
      }
    } catch (parseError) {
      console.error("Failed to parse story JSON:", parseError);
      console.error("Original response:", text);

      // Try to extract any partial JSON for debugging
      try {
        const partialMatch = text.match(/\{[^}]*"title"[^}]*\}/);
        if (partialMatch) {
          console.log("Found partial JSON:", partialMatch[0]);
        }
      } catch (e) {
        // Ignore partial extraction errors
      }

      // Fallback: create a simple story structure
      storyData = {
        title: `${body.childName}'s Adventure with the ${body.mainCharacter}`,
        characterSheet: `${body.mainCharacter} is ${body.characterDescription || "a friendly character"} with ${characterTraits} personality traits.`,
        pages: Array.from({ length: params.pages }, (_, i) => ({
          pageNumber: i + 1,
          content:
            i === 0
              ? `Once upon a time, there was a child named ${body.childName} who lived in ${body.setting}. One day, ${body.childName} met a wonderful ${body.mainCharacter} who would teach them about ${body.theme}.`
              : i === params.pages - 1
                ? `And so ${body.childName} learned that ${body.moralLesson || "kindness and friendship are the most important things in life"}. From that day forward, ${body.childName} always remembered this important lesson. The End.`
                : `${body.childName} and the ${body.mainCharacter} continued their adventure in ${body.setting}, learning more about ${body.theme} together.`,
          imagePrompt: `${body.mainCharacter} with ${body.childName} in ${body.setting}, ${body.artStyle} style, children's book illustration`,
          vocabulary: ["adventure", "friendship", "brave"].slice(0, 2),
        })),
        summary: `A heartwarming story about ${body.childName} learning about ${body.theme} with help from a ${body.mainCharacter} in ${body.setting}.`,
        keyVocabulary: ["adventure", "friendship", "brave", "kind", "learn"],
        discussionQuestions: [
          `What did ${body.childName} learn from the ${body.mainCharacter}?`,
          `How can you be like ${body.childName} in your own life?`,
          `What would you do if you met a ${body.mainCharacter}?`,
        ],
        activityIdea: `Draw your own picture of ${body.childName} and the ${body.mainCharacter} having an adventure in ${body.setting}.`,
      };
    }

    console.log("Generating images for story pages...");

    const imagePromises = storyData.pages.map(async (page, index) => {
      try {
        console.log(`Generating image for page ${page.pageNumber}...`);

        const imageResponse = await fetch(
          `${request.nextUrl.origin}/api/generate-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: page.imagePrompt,
              style: body.artStyle,
              characterSheet: storyData.characterSheet,
            }),
          },
        );

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          return {
            ...page,
            imageUrl: imageData.imageUrl,
          };
        } else {
          console.error(`Failed to generate image for page ${page.pageNumber}`);
          return {
            ...page,
            imageUrl: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(page.imagePrompt)}`,
          };
        }
      } catch (error) {
        console.error(
          `Error generating image for page ${page.pageNumber}:`,
          error,
        );
        return {
          ...page,
          imageUrl: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(page.imagePrompt)}`,
        };
      }
    });

    // Wait for all images to be generated
    const pagesWithImages = await Promise.all(imagePromises);
    storyData.pages = pagesWithImages;

    console.log("Story and image generation completed successfully");

    return NextResponse.json(storyData);
  } catch (error) {
    console.error("Story generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate story",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
