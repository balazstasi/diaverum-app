import { LabTest } from "@/components/composed/test-results/types";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipProvider, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Info, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export const TestResultRow: React.FC<{ test: LabTest }> = ({ test }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isAbnormal = () => {
    if (typeof test.result === "number" && test.refRangeLow && test.refRangeHigh) {
      return test.result < test.refRangeLow || test.result > test.refRangeHigh;
    }
    return false;
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <span className="font-medium">{test.testName}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Test Code: {test.testCode}</p>
                <p>
                  Collection: {test.collectionDate} {test.collectionTime}
                </p>
                {test.note && <p>Note: {test.note}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4">
          <span className={`font-bold ${isAbnormal() ? "text-red-500" : "text-gray-900"}`}>
            {test.result} {test.unit}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isExpanded && test.refRangeLow && test.refRangeHigh && (
        <div className="mt-4 pl-4">
          <div className="text-sm text-gray-600">
            Reference Range: {test.refRangeLow} - {test.refRangeHigh} {test.unit}
          </div>
          {test.nonSpecRefs && (
            <div className="text-sm text-gray-500 mt-2">Additional Information: {test.nonSpecRefs}</div>
          )}
        </div>
      )}
    </div>
  );
};
