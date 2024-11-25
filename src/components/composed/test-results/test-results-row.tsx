import { LabTest } from "@/components/composed/test-results/types";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipProvider, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Info, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export const TestResultRow: React.FC<{ test: LabTest }> = ({ test }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isAbnormal = () => {
    if (String(test.refRangeHigh).charAt(0) === "<") {
      return Number(test.result) > Number(test.refRangeHigh);
    }
    if (String(test.refRangeLow).charAt(0) === ">") {
      return Number(test.result) < Number(test.refRangeLow);
    }

    const refRangeLow = Number(test.refRangeLow);
    const refRangeHigh = Number(test.refRangeHigh);
    const result = Number(test.result);
    return result < refRangeLow || result > refRangeHigh;
  };

  function parseRangeValue(value: string): number {
    return Number(value.replace(/[<>]/g, ""));
  }

  function getRangeDetails(refRangeLow: string, refRangeHigh: string, result: string) {
    const isLowInequality = String(refRangeLow).startsWith(">");
    const isHighInequality = String(refRangeHigh).startsWith("<");

    const lowValue = parseRangeValue(refRangeLow);
    const highValue = parseRangeValue(refRangeHigh);
    const resultValue = Number(result);

    const minValue = isLowInequality ? lowValue * 0.5 : lowValue;
    const maxValue = isHighInequality ? highValue * 1.5 : highValue * 1.5;

    return {
      minValue,
      maxValue,
      lowValue,
      highValue,
      resultValue,
      isLowInequality,
      isHighInequality,
    };
  }

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

      {isExpanded && (test.refRangeLow || test.refRangeHigh) && (
        <div className="mt-4 pl-4">
          <div className="text-sm text-gray-600">
            Reference Range {test.refRangeLow} - {test.refRangeHigh} {test.unit}
          </div>

          <div className="mt-2 relative h-6 w-full min-w-full max-w-md bg-gray-100 rounded">
            {(() => {
              const {
                minValue,
                maxValue,
                lowValue,
                highValue,
                resultValue,
                isLowInequality,
                isHighInequality,
              } = getRangeDetails(test?.refRangeLow ?? "", test?.refRangeHigh ?? "", String(test.result));

              return (
                <>
                  <div
                    className="absolute h-full bg-green-100 rounded"
                    style={{
                      left: `${((isLowInequality ? minValue : lowValue) / maxValue) * 100}%`,
                      width: `${((highValue - lowValue) / maxValue) * 100}%`,
                    }}
                  />
                  {isLowInequality && (
                    <div
                      className="absolute h-full w-2 bg-gray-300"
                      style={{ left: `${(lowValue / maxValue) * 100}%` }}
                    />
                  )}
                  {isHighInequality && (
                    <div
                      className="absolute h-full w-2 bg-gray-300"
                      style={{ left: `${(highValue / maxValue) * 100}%` }}
                    />
                  )}
                  <div
                    className={`absolute w-2 h-full -ml-1 ${isAbnormal() ? "bg-red-500" : "bg-green-600"}`}
                    style={{
                      left: `${(resultValue / maxValue) * 100}%`,
                    }}
                  />
                </>
              );
            })()}
          </div>

          {test.nonSpecRefs && (
            <div className="text-sm text-gray-500 mt-2">Additional Information: {test.nonSpecRefs}</div>
          )}
        </div>
      )}
    </div>
  );
};
