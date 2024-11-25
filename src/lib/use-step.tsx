import { useState } from "react";

interface UseStepProps {
  initialStep: number;
  maxStep: number;
}

export const useStep = ({ initialStep, maxStep }: UseStepProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const handleNext = () => {
    if (currentStep < maxStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return { next: handleNext, previous: handlePrevious, current: currentStep };
};
