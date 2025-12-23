
import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  colorClass: string;
  subtext?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass, subtext }) => {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${colorClass} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{label}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-full bg-slate-50`}>
          <i className={`${icon} text-xl opacity-80`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
