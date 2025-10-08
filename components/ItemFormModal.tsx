import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import CloseIcon from './icons/CloseIcon';
import { useTranslation } from '../i18n';

interface ItemFormModalProps {
  item: InventoryItem | null;
  onSave: (item: Omit<InventoryItem, 'id'> & { id?: number }) => void;
  onClose: () => void;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({ item, onSave, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    supplier: '',
    lastRestockDate: new Date().toISOString().split('T')[0],
    lowStockThreshold: 10,
    expirationDate: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        supplier: item.supplier,
        lastRestockDate: item.lastRestockDate,
        lowStockThreshold: item.lowStockThreshold ?? 10,
        expirationDate: item.expirationDate || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: 0,
        price: 0,
        supplier: '',
        lastRestockDate: new Date().toISOString().split('T')[0],
        lowStockThreshold: 10,
        expirationDate: '',
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: item?.id, expirationDate: formData.expirationDate || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">{item ? t('modal.editTitle') : t('modal.addTitle')}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">{t('modal.labels.name')}</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">{t('modal.labels.category')}</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">{t('modal.labels.quantity')}</label>
              <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">{t('modal.labels.price')}</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.001" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-slate-700 mb-1">{t('modal.labels.supplier')}</label>
                <input type="text" name="supplier" id="supplier" value={formData.supplier} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-slate-700 mb-1">{t('modal.labels.lowStockThreshold')}</label>
              <input type="number" name="lowStockThreshold" id="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastRestockDate" className="block text-sm font-medium text-slate-700 mb-1">{t('modal.labels.restockDate')}</label>
              <input type="date" name="lastRestockDate" id="lastRestockDate" value={formData.lastRestockDate} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-slate-700 mb-1">{t('modal.labels.expirationDate')}</label>
              <input type="date" name="expirationDate" id="expirationDate" value={formData.expirationDate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-2 rtl:space-x-reverse">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">{t('modal.cancel')}</button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors">{t('modal.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemFormModal;