import { Progress, Chip } from "@heroui/react";
import { STEPS } from "@/constants";

interface StoryProgressProps {
  currentStep: number;
  progress: number;
}

export function StoryProgress({ currentStep, progress }: StoryProgressProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex flex-col gap-2 sm:gap-4 sm:px-8 md:px-12">
        <div className="flex flex-wrap justify-between gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <Chip
                key={step.id}
                color={
                  isActive ? "primary" : isCompleted ? "success" : "default"
                }
                variant={isActive ? "solid" : isCompleted ? "flat" : "bordered"}
                startContent={<Icon className="ms-1 -me-1.5 sm:me-0 h-4 w-4" />}
                endContent={
                  isCompleted ? (
                    <span className="text-xs me-1">✓</span>
                  ) : undefined
                }
                className="transition-all"
              >
                <span className="text-sm font-medium hidden sm:inline">
                  {step.title}
                </span>
              </Chip>
            );
          })}
        </div>

        <div>
          <Progress
            aria-label="Story Progress"
            value={progress}
            size="md"
            color="primary"
          />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep} of {STEPS.length}
          </p>
        </div>
      </div>
    </div>
  );
}
