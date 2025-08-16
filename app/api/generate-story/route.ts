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
    const storyPrompt = `You are a world-class children's story author and educational expert. Create a personalized, engaging children's storybook with educational value.

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

CHARACTER CONSISTENCY REQUIREMENTS:
- Create a detailed character sheet description
- Use this character sheet in every image prompt to maintain consistent appearance
- Include specific details about appearance, clothing, and distinguishing features

STORY REQUIREMENTS:
1. Create an engaging, age-appropriate title
2. Write exactly ${params.pages} pages of story content
3. Each page should be approximately ${params.wordsPerPage} words
4. Include ${body.childName} as a key character who learns and grows
5. Make language appropriate for ${body.childAge} year olds at ${body.difficulty} reading level
6. Incorporate the theme of ${body.theme} throughout the story
7. End with a clear moral lesson about ${body.moralLesson || "kindness and friendship"}
8. Create detailed, consistent image prompts in ${body.artStyle} style

EDUCATIONAL COMPANION FEATURES:
- Identify 5-8 key vocabulary words for this age group
- Create 3-4 thoughtful discussion questions for parents/teachers
- Suggest 1 creative activity related to the story theme

IMAGE PROMPT REQUIREMENTS:
- Start each image prompt with the character sheet details for consistency
- Include art style: "${body.artStyle}"
- Make images safe, positive, and engaging for children
- Ensure diversity and inclusivity in character representations

FORMAT YOUR RESPONSE AS JSON:
{
  "title": "Story Title Here",
  "characterSheet": "Detailed physical description for consistent character appearance",
  "pages": [
    {
      "pageNumber": 1,
      "content": "Page content here...",
      "imagePrompt": "[Character sheet details] + scene description in ${body.artStyle} style",
      "vocabulary": ["word1", "word2"] // 2-3 key words from this page
    }
  ],
  "summary": "Brief story summary...",
  "keyVocabulary": ["word1", "word2", "word3", "word4", "word5"],
  "discussionQuestions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ],
  "activityIdea": "A creative activity suggestion related to the story theme"
}

Create a magical, educational, and memorable story that will inspire young minds!`;

    console.log("Generating story with Google Gemini...");

    // Generate the story using Google Gemini
    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: storyPrompt,
      temperature: 0.7,
    });

    console.log("Story generated, parsing response...");

    // Parse the JSON response
    let storyData: StoryResponse;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      storyData = JSON.parse(jsonMatch[0]);

      // Validate the structure
      if (
        !storyData.title ||
        !storyData.pages ||
        !Array.isArray(storyData.pages)
      ) {
        throw new Error("Invalid story structure");
      }

      // Ensure we have the right number of pages
      if (storyData.pages.length !== params.pages) {
        console.log(
          `Warning: Expected ${params.pages} pages, got ${storyData.pages.length}`,
        );
      }
    } catch (parseError) {
      console.error("Failed to parse story JSON:", parseError);

      // Fallback: create a simple story structure
      storyData = {
        title: `${body.childName} and the ${body.mainCharacter}`,
        pages: [
          {
            pageNumber: 1,
            content: `Once upon a time, there was a child named ${body.childName} who met a wonderful ${body.mainCharacter} in ${body.setting}. This is their magical adventure about ${body.theme}.`,
            imagePrompt: `A child named ${body.childName} meeting a ${body.mainCharacter} in ${body.setting}, children's book illustration style`,
          },
        ],
        summary: `A heartwarming story about ${body.childName} learning about ${body.theme} with help from a ${body.mainCharacter}.`,
        keyVocabulary: ["adventure", "friendship", "brave"],
        discussionQuestions: [
          `What did ${body.childName} learn from the ${body.mainCharacter}?`,
          `How can you be brave like ${body.childName}?`,
        ],
        activityIdea: `Draw your own picture of ${body.childName} and the ${body.mainCharacter} having an adventure together.`,
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
