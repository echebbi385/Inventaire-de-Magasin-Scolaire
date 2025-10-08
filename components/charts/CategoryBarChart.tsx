import React from 'react';

interface ChartData {
  name: string;
  quantity: number;
}

interface CategoryBarChartProps {
  data: ChartData[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444'];

const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Aucune donnée disponible.</div>;
  }

  const maxQuantity = Math.max(...data.map(d => d.quantity), 0);

  return (
    <div className="w-full h-64 space-y-2">
      {data.map((item, index) => {
        const barWidth = maxQuantity > 0 ? (item.quantity / maxQuantity) * 100 : 0;
        return (
          <div key={item.name} className="flex items-center group">
            <div className="w-1/3 text-sm text-slate-600 truncate text-end pe-2">{item.name}</div>
            <div className="w-2/3 bg-slate-200 rounded-full h-6">
              <div
                className="h-6 rounded-full flex items-center justify-end px-2"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                  transition: 'width 0.5s ease-in-out',
                }}
              >
                <span className="text-white font-bold text-xs">{item.quantity}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBarChart;
