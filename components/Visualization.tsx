import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ErrorBar, Cell 
} from 'recharts';
import { GroupData, MetricType } from '../types';
import { calculateStats, getMetricDataForGroup } from '../utils/statistics';

interface VisualizationProps {
  groups: GroupData[];
  metric: MetricType;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded text-sm z-50">
        <p className="font-bold text-slate-700 border-b pb-1 mb-1">{data.fullName}</p>
        <div className="space-y-1">
          <p className="flex justify-between gap-4">
            <span className="text-slate-500">Mean:</span>
            <span className="font-mono font-bold text-slate-700">{Number(data.mean).toFixed(2)}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-slate-500">SEM:</span>
            <span className="font-mono text-slate-600">±{Number(data.sem).toFixed(2)}</span>
          </p>
          <p className="flex justify-between gap-4 text-xs text-slate-400 mt-1">
            <span>Sample Size:</span>
            <span>n = {data.n}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Visualization: React.FC<VisualizationProps> = ({ groups, metric }) => {
  const chartData = groups.map(group => {
    const values = getMetricDataForGroup(group, metric);
    const stats = calculateStats(values);
    
    return {
      name: `${group.name}`, // Base name, we will append (n=) in formatter if needed or use full label
      displayName: `${group.name} (n=${stats.n})`, // Explicit display name
      fullName: group.name,
      mean: stats.mean,
      sem: stats.sem,
      color: group.color,
      n: stats.n
    };
  });

  return (
    <div className="w-full h-[350px] bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-center font-bold text-slate-700 mb-2 flex items-center justify-center gap-2">
        {metric}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="displayName" 
            tick={{ fill: '#64748b', fontSize: 11 }} 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
            interval={0}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 11 }} 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="mean" name="Mean Value" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <ErrorBar dataKey="sem" width={20} strokeWidth={2} stroke="#334155" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Visualization;