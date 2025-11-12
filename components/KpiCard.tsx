import React from 'react';

interface Kpi {
    label: string;
    value: string;
    valueComponent?: React.ReactNode;
    trend: string;
    colorClass: string;
}

export const KpiCard: React.FC<Kpi> = ({ label, value, valueComponent, trend, colorClass }) => {
  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-line dark:border-dark-line rounded-xl p-4 shadow-sm h-full">
      <div className="text-sm text-light-muted dark:text-dark-muted">{label}</div>
      <div className={`text-3xl font-bold mt-2 ${colorClass}`}>{valueComponent || value}</div>
      <div className="text-xs text-light-muted dark:text-dark-muted mt-2">{trend}</div>
    </div>
  );
};
