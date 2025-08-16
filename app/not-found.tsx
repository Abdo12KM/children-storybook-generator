"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { DotPattern } from "@/components/magicUI/DotPattern";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push(`/`);
  };

  return (
    <div className="from-colorScheme-50/30 to-colorScheme-100/50 dark:from-colorScheme-950/30 dark:to-colorScheme-800/50 flex min-h-[100vh] flex-col items-center justify-center bg-linear-to-b px-4 py-16 text-center antialiased dark:bg-linear-to-t">
      {/* Background pattern */}
      <div className="pointer-events-none fixed inset-0 z-20 h-full w-full overflow-hidden">
        <DotPattern glow={true} className="opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex max-w-md flex-col items-center justify-center space-y-8"
      >
        {/* Error code */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="absolute inset-0 -z-10 blur-3xl"
          >
            <h1 className="text-color0/20 font-syne text-8xl font-bold md:text-9xl">
              404
            </h1>
          </motion.div>
          <h1 className="font-syne text-color0 text-8xl font-bold md:text-9xl">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="from-color5 to-color40 font-syne hover:text-color0 bg-linear-to-b bg-clip-text text-xl font-bold text-transparent uppercase transition-all duration-500 ease-in-out hover:tracking-wider sm:text-2xl md:text-3xl">
            Not Found
          </h2>
          <p className="text-color30">
            The page you are looking for does not exist.
          </p>
        </div>

        {/* Action button */}
        <Button onClick={handleGoBack} variant={"outline"} className="mt-8">
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
