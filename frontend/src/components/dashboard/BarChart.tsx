import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
interface DataPoint {
  name: string;
  value: number;
}
interface BarChartProps {
  data: DataPoint[];
}
export function BarChart({
  data
}: BarChartProps) {
  return <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
          fill: '#64748b',
          fontSize: 12
        }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{
          fill: '#64748b',
          fontSize: 12
        }} />
          <Tooltip cursor={{
          fill: '#f1f5f9'
        }} contentStyle={{
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }} />
          <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>;
}