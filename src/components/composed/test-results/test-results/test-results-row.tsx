import { LabTest } from "@/components/composed/test-results/types";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipProvider, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Info, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export const TestResultRow: React.FC<{ test: LabTest }> = ({ test }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isAbnormal = () => {
    const refRangeLow = Number(test.refRangeLow);
    const refRangeHigh = Number(test.refRangeHigh);
    const result = Number(test.result);
    return result < refRangeLow || result > refRangeHigh;
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

          <div className="mt-2 relative h-6 w-full min-w-full max-w-md bg-gray-100 rounded">
            <div
              className="absolute h-full bg-green-100 rounded"
              style={{
                left: `${(Number(test.refRangeLow) / (Number(test.refRangeHigh) * 1.5)) * 100}%`,
                width: `${
                  ((Number(test.refRangeHigh) - Number(test.refRangeLow)) /
                    (Number(test.refRangeHigh) * 1.5)) *
                  100
                }%`,
              }}
            />
            <div
              className={`absolute w-2 h-full -ml-1 ${isAbnormal() ? "bg-red-500" : "bg-green-600"}`}
              style={{
                left: `${(Number(test.result) / (Number(test.refRangeHigh) * 1.5)) * 100}%`,
              }}
            />
          </div>

          {test.nonSpecRefs && (
            <div className="text-sm text-gray-500 mt-2">Additional Information: {test.nonSpecRefs}</div>
          )}
        </div>
      )}
    </div>
  );
};
