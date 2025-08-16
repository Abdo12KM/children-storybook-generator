import { StoryPreview } from "@/components/StoryPreview";
import { GeneratedStory } from "@/types";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

const demoStory: GeneratedStory = {
  title: "The Magical Forest Adventure",
  summary:
    "Join Alex and their friends on a magical journey through the enchanted forest, where they discover new friends, solve puzzles, and learn the value of kindness.",
  pages: [
    {
      pageNumber: 1,
      content:
        "Alex woke up to the sound of birds singing. Today was the day for a big adventure in the magical forest!",
      imagePrompt:
        "A child waking up in a cozy bedroom with sunlight streaming in.",
      imageUrl: "/demo.png",
      vocabulary: ["adventure", "magical", "forest"],
    },
    {
      pageNumber: 2,
      content:
        "In the forest, Alex met a talking squirrel named Sammy. Sammy needed help finding his acorn stash.",
      imagePrompt:
        "A child meeting a friendly squirrel in a lush green forest.",
      imageUrl: "/demo.png",
      vocabulary: ["squirrel", "acorn", "stash"],
    },
    {
      pageNumber: 3,
      content:
        "Together, they solved riddles and found the acorns. Sammy thanked Alex and gave them a magical leaf.",
      imagePrompt: "A child and squirrel celebrating with a pile of acorns.",
      imageUrl: "/demo.png",
      vocabulary: ["riddles", "magical", "leaf"],
    },
  ],
  keyVocabulary: [
    "adventure",
    "magical",
    "forest",
    "squirrel",
    "acorn",
    "riddles",
  ],
  discussionQuestions: [
    "What would you do if you met a talking animal?",
    "How did Alex help Sammy?",
    "Why is kindness important?",
  ],
  activityIdea:
    "Draw your own magical forest and imagine what creatures live there!",
};

export default function StorybookDemoPage() {
  return (
    <main className="from-background via-card to-muted min-h-screen bg-gradient-to-br p-4">
      <div className="mx-auto max-w-6xl">
        {/* Top Header Row */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Back Button - Top Left */}
          <Button
            variant="bordered"
            startContent={<ArrowLeft className="h-4 w-4" />}
            className="self-start bg-transparent"
          >
            Create New Story
          </Button>
          {/* Center Header */}
          <div className="flex flex-1 flex-col items-center">
            <h1 className="text-foreground font-serif text-2xl font-bold">
              Your Story is Ready!
            </h1>
            <p className="text-muted-foreground">A magical tale for Abdo</p>
          </div>
          {/* Spacer for alignment */}
          <div className="hidden w-[120px] md:block" />
        </div>
        <StoryPreview story={demoStory} childName="Alex" />
      </div>
    </main>
  );
}
