import React from 'react';
import { useTranslation } from '../../i18n';

interface StockStatusData {
  inStock: number;
  lowStock: number;
  expired: number;
}

interface StockStatusPieChartProps {
  data: StockStatusData;
}

const StockStatusPieChart: React.FC<StockStatusPieChartProps> = ({ data }) => {
  const { t } = useTranslation();
  const { inStock, lowStock, expired } = data;
  const total = inStock + lowStock + expired;

  if (total === 0) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Aucune donnée disponible.</div>;
  }

  const statuses = [
    { name: t('charts.legend.inStock'), value: inStock, color: 'bg-green-500', svgColor: '#22c55e' },
    { name: t('charts.legend.lowStock'), value: lowStock, color: 'bg-orange-500', svgColor: '#f97316' },
    { name: t('charts.legend.expired'), value: expired, color: 'bg-red-600', svgColor: '#dc2626' },
  ];

  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-64 gap-8">
      <div className="relative">
        <svg viewBox="-1.2 -1.2 2.4 2.4" width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          {statuses.map(status => {
            if(status.value === 0) return null;

            const percent = status.value / total;
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            
            cumulativePercent += percent;
            
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = percent > 0.5 ? 1 : 0;
            
            const pathData = [
              `M ${startX} ${startY}`, // Move
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
              `L 0 0`, // Line
            ].join(' ');

            return <path key={status.name} d={pathData} fill={status.svgColor} />;
          })}
        </svg>
      </div>
      <div className="space-y-3">
        {statuses.map(status => (
          <div key={status.name} className="flex items-center">
            <div className={`w-4 h-4 rounded-sm me-3 ${status.color}`}></div>
            <div className="flex justify-between w-32">
              <span className="text-slate-700">{status.name}</span>
              <span className="font-semibold text-slate-800">{status.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockStatusPieChart;