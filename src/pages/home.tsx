import BrowseFile from "@/components/composed/browse-file/browse-file";
import { TestResults } from "@/components/composed/test-results/test-results/test-results";
import { LabTest } from "@/components/composed/test-results/types";
import { Button } from "@/components/ui/button";
import { useFileBrowse } from "@/lib/use-file-browse";
import { useLabResultParser } from "@/lib/use-lab-result-parser";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Make sure to install lucide-react
import { useState, useEffect } from "react";

export default function Home() {
  const { fileContent, readFile } = useFileBrowse({ onFileRead: console.log });
  const { results, processLabResults } = useLabResultParser();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (fileContent != null) {
      processLabResults(fileContent);
    }
  }, [fileContent, processLabResults]);

  const handleNext = () => {
    if (currentStep < results.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 justify-center h-100%">
      <h1 className="text-2xl font-bold">Medical Laboratory Results</h1>
      <p className="text-lg pt-8">Please upload your lab results .txt file</p>
      <div className="max-w-md">
        <BrowseFile onFileRead={readFile} />
      </div>
      {results.length > 0 && (
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Result {currentStep + 1} of {results.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentStep === results.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <TestResults labData={results[currentStep] as LabTest} />
        </div>
      )}
    </div>
  );
}
