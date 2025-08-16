import { useState, useCallback } from "react";
import { STEPS } from "@/constants";

export function useStepNavigation() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  const progress = (currentStep / STEPS.length) * 100;

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    progress,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === STEPS.length,
  };
}
