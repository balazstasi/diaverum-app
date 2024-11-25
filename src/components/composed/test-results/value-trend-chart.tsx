import { PatientResult } from "@/components/composed/test-results/types";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip } from "recharts";

export const ValueTrendChart: React.FC<{ data: PatientResult[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
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