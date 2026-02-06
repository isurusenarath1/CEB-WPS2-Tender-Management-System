import type { ComponentType } from 'react';
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<any>;
  trend?: string;
  color?: 'blue' | 'green' | 'amber' | 'red';
}
export function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue'
}: KpiCardProps) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600'
  };
  return <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>;
}