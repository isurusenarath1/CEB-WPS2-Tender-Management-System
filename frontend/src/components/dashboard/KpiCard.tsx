import type { ComponentType } from 'react';
import { useState } from 'react';
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<any>;
  trend?: string;
  color?: 'blue' | 'green' | 'amber' | 'red';
  breakdown?: { label: string; value: number }[];
}
export function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  breakdown
}: KpiCardProps) {
  const [showPopup, setShowPopup] = useState(false);
  
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600'
  };
  return <div 
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative group cursor-default transition-all duration-200 ${showPopup ? 'z-[100] shadow-md ring-1 ring-blue-100' : 'z-10'}`}
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {breakdown && breakdown.length > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" title="Hover for breakdown"></div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Hover Popup Breakdown */}
      {showPopup && breakdown && breakdown.length > 0 && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-slate-900 text-white p-4 rounded-xl shadow-2xl text-xs ring-1 ring-white/20">
          <div className="space-y-2.5 relative">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">{item.label}:</span>
                <span className="font-bold text-white text-sm">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45"></div>
        </div>
      )}
    </div>;
}