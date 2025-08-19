"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  Button,
  Card,
  CardBody,
  Progress,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  Share2,
  Heart,
  ArrowLeft,
  Home,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface StoryPage {
  pageNumber: number;
  content: string;
  imageUrl?: string;
  imagePrompt: string;
  vocabulary?: string[];
}

interface Story {
  id: string;
  title: string;
  summary: string;
  pages: StoryPage[];
  keyVocabulary: string[];
  discussionQuestions: string[];
  activityIdea: string;
  childName: string;
  childAge: number;
  theme: string;
  artStyle: string;
  isFavorite: boolean;
}

export default function StoryReaderPage() {
  const params = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const storyId = params?.id as string;

  useEffect(() => {
    if (storyId) {
      loadStory();
    }
  }, [storyId]);

  useEffect(() => {
    if (story) {
      const progress = ((currentPage + 1) / story.pages.length) * 100;
      setReadingProgress(progress);
    }
  }, [currentPage, story]);

  const loadStory = async () => {
    try {
      setIsLoading(true);
      // Fetch story from API
      const response = await fetch(`/api/user/stories?id=${storyId}`);

      if (!response.ok) {
        throw new Error("Failed to load story");
      }

      const storyData = await response.json();
      setStory(storyData);
    } catch (error) {
      console.error("Failed to load story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextPage = () => {
    if (story && currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const downloadStory = async () => {
    try {
      if (!story) return;
      const { generateStoryPDF } = await import("@/utils/pdf-generator");
      await generateStoryPDF(story);
    } catch (error) {
      console.error("Failed to download story:", error);
    }
  };

  const shareStory = async () => {
    try {
      if (!story?.id) return;

      const shareData = await fetch("/api/stories/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId: story.id }),
      }).then((res) => res.json());

      // Use Web Share API if available, otherwise copy to clipboard
      if (
        navigator.share &&
        navigator.canShare?.({ url: shareData.shareUrl })
      ) {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareData.shareUrl);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error("Failed to share story:", error);
    }
  };

  const toggleFavorite = async () => {
    if (story) {
      try {
        const response = await fetch("/api/user/stories/favorite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storyId: story.id,
            isFavorite: !story.isFavorite,
          }),
        });

        if (response.ok) {
          setStory({ ...story, isFavorite: !story.isFavorite });
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="from-background via-background/95 to-primary/5 flex min-h-screen items-center justify-center bg-gradient-to-br">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="from-background via-background/95 to-primary/5 min-h-screen bg-gradient-to-br">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <BookOpen className="text-default-400 mx-auto mb-4 h-16 w-16" />
          <h1 className="mb-2 text-2xl font-bold">Story Not Found</h1>
          <p className="text-default-600 mb-6">
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Button
            as={Link}
            href="/library"
            color="primary"
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  const currentStoryPage = story.pages[currentPage];

  return (
    <div className="from-background via-background/95 to-primary/5 min-h-screen bg-gradient-to-br">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              as={Link}
              href="/library"
              variant="light"
              startContent={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Library
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {story.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A story for {story.childName}, age {story.childAge}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              isIconOnly
              variant="light"
              onPress={toggleFavorite}
              color={story.isFavorite ? "danger" : "default"}
            >
              <Heart
                className={`h-4 w-4 ${story.isFavorite ? "fill-current" : ""}`}
              />
            </Button>
            <Button isIconOnly variant="light" onPress={shareStory}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button isIconOnly variant="light" onPress={downloadStory}>
              <Download className="h-4 w-4" />
            </Button>
            <Button isIconOnly variant="light" onPress={onOpen}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage + 1} of {story.pages.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {readingProgress.toFixed(0)}% complete
            </span>
          </div>
          <Progress
            value={readingProgress}
            color="primary"
            className="w-full"
          />
        </div>

        {/* Story Content */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <Card className="h-full">
              <CardBody className="p-0">
                <img
                  src={currentStoryPage.imageUrl || "/placeholder.jpg"}
                  alt={currentStoryPage.imagePrompt}
                  className="h-64 w-full rounded-lg object-cover lg:h-96"
                />
              </CardBody>
            </Card>
          </div>

          {/* Text */}
          <div className="order-1 flex flex-col justify-center lg:order-2">
            <Card className="h-full">
              <CardBody className="flex flex-col justify-center p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-lg leading-relaxed text-gray-900 dark:text-white">
                      {currentStoryPage.content}
                    </p>

                    {currentStoryPage.vocabulary &&
                      currentStoryPage.vocabulary.length > 0 && (
                        <div className="mt-6">
                          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Words:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {currentStoryPage.vocabulary.map((word) => (
                              <span
                                key={word}
                                className="rounded-full bg-purple-100 px-2 py-1 text-sm text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </motion.div>
                </AnimatePresence>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onPress={prevPage}
            isDisabled={currentPage === 0}
            startContent={<ChevronLeft className="h-4 w-4" />}
            variant="bordered"
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {story.pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === currentPage
                    ? "bg-purple-600"
                    : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          <Button
            onPress={nextPage}
            isDisabled={currentPage === story.pages.length - 1}
            endContent={<ChevronRight className="h-4 w-4" />}
            color="primary"
          >
            {currentPage === story.pages.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>

        {/* End of Story Actions */}
        {currentPage === story.pages.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Card>
              <CardBody className="p-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  🎉 Story Complete!
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Great job reading "{story.title}"! What did you think of{" "}
                  {story.childName}'s adventure?
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onPress={() => setCurrentPage(0)}
                    startContent={<BookOpen className="h-4 w-4" />}
                    variant="bordered"
                  >
                    Read Again
                  </Button>
                  <Button
                    as={Link}
                    href="/library"
                    startContent={<Home className="h-4 w-4" />}
                    variant="bordered"
                  >
                    More Stories
                  </Button>
                  <Button
                    onPress={onOpen}
                    color="primary"
                    startContent={<Settings className="h-4 w-4" />}
                  >
                    Discussion & Activities
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Discussion & Activities Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Discussion & Activities</ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Key Vocabulary */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">
                      Key Vocabulary
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {story.keyVocabulary.map((word) => (
                        <span
                          key={word}
                          className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Discussion Questions */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">
                      Discussion Questions
                    </h3>
                    <div className="space-y-2">
                      {story.discussionQuestions.map((question, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {index + 1}.
                          </span>
                          <p className="text-gray-700 dark:text-gray-300">
                            {question}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Idea */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Fun Activity</h3>
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                      <p className="text-gray-800 dark:text-gray-200">
                        {story.activityIdea}
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={downloadStory}>
                  Download PDF
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
