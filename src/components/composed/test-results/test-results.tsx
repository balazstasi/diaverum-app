import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { LabTest } from "@/components/composed/test-results/types";
import { TestResultRow } from "@/components/composed/test-results/test-results-row";

interface MedicalDashboardProps {
  labData: LabTest;
}

const TestResults: React.FC<MedicalDashboardProps> = ({ labData }) => {
  const [selectedTab, setSelectedTab] = useState("results");

  const exportToPDF = () => {
    // In a real implementation, this would use a PDF library like jsPDF
    // For now, we'll just console.log the data
    console.log("Exporting to PDF:", labData);
    alert("PDF export functionality would be implemented here");
  };

  const groupedByCategory = (test: LabTest) => {
    const category =
      test.testCode?.[0] === "B"
        ? "Blood Tests"
        : test.testCode?.[0] === "T"
        ? "Thyroid Tests"
        : test.testCode?.[0] === "V"
        ? "Viral Tests"
        : "Other Tests";

    return {
      category,
      test,
    };
  };

  const patientInfo = labData?.patientInfo;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Medical Laboratory Results</CardTitle>
          {patientInfo && (
            <div className="text-sm text-gray-500 mt-2">
              <p>
                Patient Name: <span className="font-bold bg-gray-100 px-1">{patientInfo.name}</span>
              </p>
              <p>
                Patient ID: <span className="font-bold bg-gray-100 px-1">{patientInfo.id}</span>
              </p>
              <p>
                Date of Birth: <span className="font-bold bg-gray-100 px-1">{patientInfo.dob}</span>
              </p>
              <p>
                Gender:{" "}
                <span
                  className={`font-bold ${patientInfo.gender === "M" ? "text-blue-500" : "text-pink-500"}`}
                >
                  {patientInfo.gender}
                </span>
              </p>
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
          </TabsList>

          <TabsContent value="results">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">{`${groupedByCategory(labData).category} (${
                labData.testCode
              })`}</h3>
              <div className="space-y-2">
                <TestResultRow test={groupedByCategory(labData).test} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export { TestResults };
