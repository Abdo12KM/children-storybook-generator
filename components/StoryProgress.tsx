import { Progress, Chip } from "@heroui/react";
import { STEPS } from "@/constants";

interface StoryProgressProps {
  currentStep: number;
  progress: number;
}

export function StoryProgress({ currentStep, progress }: StoryProgressProps) {
  return (
    <div className="mx-auto mb-8 w-full max-w-4xl">
      <div className="xs:px-8 flex flex-col gap-4 md:px-12">
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
                startContent={<Icon className="xs:me-0 ms-1 -me-1.5 h-4 w-4" />}
                endContent={
                  isCompleted ? (
                    <span className="me-1 text-xs">✓</span>
                  ) : undefined
                }
                className="transition-all"
              >
                <span className="xs:inline hidden text-sm font-medium">
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
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Step {currentStep} of {STEPS.length}
          </p>
        </div>
      </div>
    </div>
  );
}
