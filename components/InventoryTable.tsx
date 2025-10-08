import React from 'react';
import { InventoryItem } from '../types';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import ExclamationIcon from './icons/ExclamationIcon';
import { useTranslation } from '../i18n';
import BookIcon from './icons/BookIcon';
import BottleIcon from './icons/BottleIcon';
import CookieIcon from './icons/CookieIcon';
import PencilRulerIcon from './icons/PencilRulerIcon';
import TagIcon from './icons/TagIcon';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
}

const getCategoryIcon = (category: string) => {
    const lowerCaseCategory = category.toLowerCase();
    if (lowerCaseCategory.includes('papeterie')) {
        return <BookIcon />;
    }
    if (lowerCaseCategory.includes('boissons')) {
        return <BottleIcon />;
    }
    if (lowerCaseCategory.includes('collations')) {
        return <CookieIcon />;
    }
    if (lowerCaseCategory.includes('fournitures')) {
        return <PencilRulerIcon />;
    }
    return <TagIcon />;
};

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (items.length === 0) {
    return <p className="text-center p-8 text-slate-500">{t('table.noItems')}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-start text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3">{t('table.header.name')}</th>
            <th scope="col" className="px-6 py-3">{t('table.header.category')}</th>
            <th scope="col" className="px-6 py-3">{t('table.header.quantity')}</th>
            <th scope="col" className="px-6 py-3">{t('table.header.price')}</th>
            <th scope="col" className="px-6 py-3">{t('table.header.supplier')}</th>
            <th scope="col" className="px-6 py-3">{t('table.header.lastRestock')}</th>
            <th scope="col" className="px-6 py-3">{t('table.header.expirationDate')}</th>
            <th scope="col" className="px-6 py-3 text-center">{t('table.header.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const isLowStock = item.lowStockThreshold !== undefined && item.quantity < item.lowStockThreshold;
            const isExpired = item.expirationDate && new Date(item.expirationDate) < today;

            let rowClass = "bg-white border-b hover:bg-slate-50 transition-colors";
            if (isExpired) {
                rowClass = "bg-red-100 border-b hover:bg-red-200 transition-colors";
            } else if (isLowStock) {
                rowClass = "bg-orange-50 border-b hover:bg-orange-100 transition-colors";
            }

            return (
              <tr key={item.id} className={rowClass}>
                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 ${isLowStock ? 'font-bold text-orange-600' : ''}`}>
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    {isLowStock && !isExpired && <ExclamationIcon />}
                    <span>{item.quantity}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{item.price.toFixed(3)} TND</td>
                <td className="px-6 py-4">{item.supplier}</td>
                <td className="px-6 py-4">{item.lastRestockDate}</td>
                <td className={`px-6 py-4 ${isExpired ? 'font-bold text-red-600' : ''}`}>
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        {isExpired && <ExclamationIcon />}
                        <span>{item.expirationDate || t('table.notAvailable')}</span>
                    </div>
                </td>
                <td className="px-6 py-4 flex justify-center items-center space-x-3 rtl:space-x-reverse">
                  <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800 transition-colors">
                    <PencilIcon />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800 transition-colors">
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;