import { LabTest } from "@/components/composed/test-results/types";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip } from "recharts";

export const DistributionChart: React.FC<{ data: LabTest[] }> = ({ data }) => {
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
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
