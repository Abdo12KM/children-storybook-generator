import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

export default function LoadingOverlay({
  isVisible,
  childName,
  backgroundBlur = true,
  blockScroll = true,
}: {
  isVisible: boolean;
  childName?: string;
  backgroundBlur?: boolean;
  blockScroll?: boolean;
}) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const getMessages = (name: string = "your little one") => [
    `✨ Sprinkling magic dust for ${name}...`,
    `📖 Writing the perfect adventure for ${name}...`,
    `🎨 Painting beautiful illustrations for ${name}...`,
    `🌟 Creating magical characters for ${name}...`,
    `🦄 Adding unicorns and rainbows for ${name}...`,
    `🏰 Building enchanted castles for ${name}...`,
    `🧚‍♀️ Gathering fairy tale wisdom for ${name}...`,
    `⭐ Weaving dreams into words for ${name}...`,
    `🎭 Bringing characters to life for ${name}...`,
    `📚 Almost ready! Putting finishing touches for ${name}...`,
  ];

  const messages = getMessages(childName);

  useEffect(() => {
    if (isVisible && blockScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible, blockScroll]);

  useEffect(() => {
    if (!isVisible) return;

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => {
      clearInterval(messageInterval);
    };
  }, [isVisible, messages.length]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 ${
        backgroundBlur && "backdrop-blur-sm"
      }`}
    >
      <div className="shadow-accent/50 mx-4 flex w-lg flex-col items-center rounded-2xl bg-white p-8 shadow-lg dark:bg-black">
        {/* Animated Message */}
        <div className="text-center">
          <p
            key={currentMessageIndex}
            className="animate-fade-in text-lg font-medium text-gray-800 dark:text-gray-200"
          >
            {messages[currentMessageIndex]}
          </p>
          {/* Spinner */}
          <Spinner
            size="lg"
            variant="wave"
            classNames={{
              dots: "bg-accent",
            }}
          />
          <p className="mt-2 animate-pulse text-sm text-gray-600 dark:text-gray-400">
            This might take a minute or two...
          </p>
        </div>
      </div>
    </div>
  );
}
