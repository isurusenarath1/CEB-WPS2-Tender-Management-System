// React import not required with new JSX transform
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
interface DataPoint {
  name: string;
  value: number;
}
interface PieChartProps {
  data: DataPoint[];
}
const STATUS_COLORS: Record<string, string> = {
  'Under Evacuation': '#f59e0b',
  'Doc Review': '#3b82f6',
  'Negotiate or Clarification': '#a855f7',
  'Re-evaluation': '#f97316',
  Reject: '#ef4444',
  Awarded: '#10b981',
  Cancel: '#6b7280',
  Close: '#64748b',
  Retender: '#eab308',
  'In PPC': '#6366f1' // indigo
};
export function PieChart({
  data
}: PieChartProps) {
  return <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />)}
          </Pie>
          <Tooltip contentStyle={{
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }} />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{
          fontSize: '12px'
        }} />
        </RePieChart>
      </ResponsiveContainer>
    </div>;
}