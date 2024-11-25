import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import {
    Info,
    ChevronDown,
    ChevronUp, FileText
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Types
interface LabTest {
  testCode: string;
  testName: string;
  result: number | string;
  unit: string;
  refRangeLow?: number;
  refRangeHigh?: number;
  collectionDate: string;
  collectionTime: string;
  note?: string;
  nonSpecRefs?: string;
  patientInfo: {
    id: string;
    name: string;
    dob: string;
    gender: string;
  };
}

interface PatientResult {
  testName: string;
  value: number;
  date: string;
  referenceRange: {
    low?: number;
    high?: number;
  };
}

// Helper Components
const ValueTrendChart: React.FC<{ data: PatientResult[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <RechartsTooltip />
        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
        {data[0].referenceRange.low && (
          <Line type="monotone" dataKey="referenceRange.low" stroke="#dc2626" strokeDasharray="5 5" />
        )}
        {data[0].referenceRange.high && (
          <Line type="monotone" dataKey="referenceRange.high" stroke="#dc2626" strokeDasharray="5 5" />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

const DistributionChart: React.FC<{ data: LabTest[] }> = ({ data }) => {
  const numericalResults = data.filter(
    (test) => !isNaN(Number(test.result)) && test.refRangeLow && test.refRangeHigh
  );

  const normalizedData = numericalResults.map((test) => ({
    name: test.testName,
    value:
      ((Number(test.result) - Number(test.refRangeLow)) /
        (Number(test.refRangeHigh) - Number(test.refRangeLow))) *
      100,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={normalizedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "% of Range", angle: -90, position: "insideLeft" }} />
        <RechartsTooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const TestResultRow: React.FC<{ test: LabTest }> = ({ test }) => {
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

// Main Component
interface MedicalDashboardProps {
  labData: LabTest[];
}

const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ labData }) => {
  const [selectedTab, setSelectedTab] = useState("results");

  const exportToPDF = () => {
    // In a real implementation, this would use a PDF library like jsPDF
    // For now, we'll just console.log the data
    console.log("Exporting to PDF:", labData);
    alert("PDF export functionality would be implemented here");
  };

  const groupedByCategory = labData.reduce((acc, test) => {
    const category =
      test.testCode.charAt(0) === "B"
        ? "Blood Tests"
        : test.testCode.charAt(0) === "T"
        ? "Thyroid Tests"
        : test.testCode.charAt(0) === "V"
        ? "Viral Tests"
        : "Other Tests";

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(test);
    return acc;
  }, {} as Record<string, LabTest[]>);

  const patientInfo = labData[0]?.patientInfo;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Medical Laboratory Results</CardTitle>
          {patientInfo && (
            <div className="text-sm text-gray-500 mt-2">
              Patient: {patientInfo.name} | ID: {patientInfo.id} | DOB: {patientInfo.dob} | Gender:{" "}
              {patientInfo.gender}
            </div>
          )}
        </div>
        <Button onClick={exportToPDF} className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Export PDF
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="results">Test Results</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            {Object.entries(groupedByCategory).map(([category, tests]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold mb-4">{category}</h3>
                <div className="space-y-2">
                  {tests.map((test, index) => (
                    <TestResultRow key={`${test.testCode}-${index}`} test={test} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="trends">
            <div className="space-y-6">
              {Object.entries(groupedByCategory).map(([category, tests]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-4">{category}</h3>
                  <ValueTrendChart
                    data={tests
                      .filter((test) => !isNaN(Number(test.result)))
                      .map((test) => ({
                        testName: test.testName,
                        value: Number(test.result),
                        date: test.collectionDate,
                        referenceRange: {
                          low: Number(test.refRangeLow),
                          high: Number(test.refRangeHigh),
                        },
                      }))}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="distribution">
            <DistributionChart data={labData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Example usage
export const ExampleUsage: React.FC = () => {
  const sampleData: LabTest[] = [
    {
      testCode: "T2511",
      testName: "Thyrotropin",
      result: 2.0,
      unit: "mIU/L",
      refRangeLow: 0.4,
      refRangeHigh: 4.0,
      collectionDate: "2014-11-08",
      collectionTime: "10:00",
      patientInfo: {
        id: "650",
        name: "Benjy Odetta",
        dob: "1984-07-04",
        gender: "F",
      },
    },
    {
      testCode: "B2011",
      testName: "Sodium",
      result: 140,
      unit: "mmol/L",
      refRangeLow: 137,
      refRangeHigh: 145,
      collectionDate: "2014-11-08",
      collectionTime: "10:20",
      patientInfo: {
        id: "661",
        name: "Patty Blanch",
        dob: "1931-02-02",
        gender: "F",
      },
    },
    // Add more sample data as needed
  ];

  return <MedicalDashboard labData={sampleData} />;
};

export default ExampleUsage;
