import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { LabTest } from "@/components/composed/test-results/types";
import { TestResultRow } from "@/components/composed/test-results/test-results-row";
import { DistributionChart } from "@/components/composed/test-results/distribution-chart";
import { ValueTrendChart } from "@/components/composed/test-results/value-trend-chart";

interface MedicalDashboardProps {
  labData: LabTest[];
}

const TestResults: React.FC<MedicalDashboardProps> = ({ labData }) => {
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

export { TestResults };
