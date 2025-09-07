import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p className="label">{`${payload[0].name}`}</p> 
        <p className="intro">{`Amount : ₹${payload[0].value}`}</p> 
      </div>
    );
  }

  return null;
};

export default function ExpenseDonutChart({ data, COLORS }) {
  return (
    <div className="flex justify-center w-full p-2 rounded">
      {/* Responsive container will take 100% width of parent div */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius="75%" 
            innerRadius="45%"
            paddingAngle={2}
          >
            {data?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.category]}
              />
            ))}
          </Pie>
          <Tooltip content={CustomTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

