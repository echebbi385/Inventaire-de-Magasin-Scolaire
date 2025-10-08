import React, { useState, useMemo, useEffect } from 'react';
import { InventoryItem } from './types';
import Header from './components/Header';
import InventoryTable from './components/InventoryTable';
import ItemFormModal from './components/ItemFormModal';
import { useTranslation } from './i18n';
import CategoryBarChart from './components/charts/CategoryBarChart';
import StockStatusPieChart from './components/charts/StockStatusPieChart';

const initialInventory: InventoryItem[] = [
  { id: 1, name: 'Cahier N°24', category: 'Papeterie', quantity: 150, price: 0.850, supplier: 'SOTUPAPIER', lastRestockDate: '2024-08-15', lowStockThreshold: 50 },
  { id: 2, name: 'Stylo Bic Bleu', category: 'Fournitures', quantity: 300, price: 0.500, supplier: 'Bic Tunisie', lastRestockDate: '2024-08-10', lowStockThreshold: 100 },
  { id: 3, name: 'Gomme Staedtler', category: 'Fournitures', quantity: 40, price: 1.200, supplier: 'Distributeur XYZ', lastRestockDate: '2024-07-25', lowStockThreshold: 50 },
  { id: 4, name: 'Règle 20cm', category: 'Fournitures', quantity: 120, price: 0.700, supplier: 'Maped Tunisie', lastRestockDate: '2024-08-10', lowStockThreshold: 30 },
  { id: 5, name: 'Goûter Saïda', category: 'Collations', quantity: 200, price: 0.600, supplier: 'Saïda Group', lastRestockDate: '2024-09-01', lowStockThreshold: 80, expirationDate: '2025-03-01' },
  { id: 6, name: 'Jus Délice 200ml', category: 'Boissons', quantity: 180, price: 0.750, supplier: 'Délice Danone', lastRestockDate: '2024-09-01', lowStockThreshold: 80, expirationDate: '2024-11-15' },
  { id: 7, name: 'Cahier de Travaux Pratiques', category: 'Papeterie', quantity: 25, price: 2.500, supplier: 'SOTUPAPIER', lastRestockDate: '2024-08-20', lowStockThreshold: 30 },
  { id: 8, name: 'Feutres de couleur (12)', category: 'Fournitures', quantity: 50, price: 5.400, supplier: 'Maped Tunisie', lastRestockDate: '2024-08-18', lowStockThreshold: 20 },
  { id: 9, name: 'Yaourt à boire', category: 'Boissons', quantity: 30, price: 0.450, supplier: 'Délice Danone', lastRestockDate: '2024-08-28', lowStockThreshold: 20, expirationDate: '2024-09-10' }, // Expired item example
];

const App: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  // Initialize filter state from localStorage
  const [searchTerm, setSearchTerm] = useState<string>(() => localStorage.getItem('inventorySearchTerm') || '');
  const [dateFilterType, setDateFilterType] = useState<'lastRestockDate' | 'expirationDate' | ''>(() => (localStorage.getItem('inventoryDateFilterType') as any) || '');
  const [startDate, setStartDate] = useState<string>(() => localStorage.getItem('inventoryStartDate') || '');
  const [endDate, setEndDate] = useState<string>(() => localStorage.getItem('inventoryEndDate') || '');
  
  const { t } = useTranslation();

  // Save filter state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inventorySearchTerm', searchTerm);
    localStorage.setItem('inventoryDateFilterType', dateFilterType);
    localStorage.setItem('inventoryStartDate', startDate);
    localStorage.setItem('inventoryEndDate', endDate);
  }, [searchTerm, dateFilterType, startDate, endDate]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm(t('alerts.deleteConfirm'))) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const handleSaveItem = (item: Omit<InventoryItem, 'id'> & { id?: number }) => {
    if (item.id) {
      // Update
      setInventory(inventory.map(i => i.id === item.id ? { ...i, ...item } as InventoryItem : i));
    } else {
      // Add
      const newItem: InventoryItem = {
        ...item,
        id: Math.max(...inventory.map(i => i.id), 0) + 1,
        lowStockThreshold: item.lowStockThreshold ?? 10,
      };
      setInventory([...inventory, newItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filteredInventory = useMemo(() => {
    let filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (dateFilterType && (startDate || endDate)) {
      filtered = filtered.filter(item => {
        const itemDateStr = item[dateFilterType as keyof InventoryItem] as string | undefined;

        if (!itemDateStr) {
          return false; // Item doesn't have the date field we're filtering by
        }

        const isAfterStartDate = !startDate || itemDateStr >= startDate;
        const isBeforeEndDate = !endDate || itemDateStr <= endDate;

        return isAfterStartDate && isBeforeEndDate;
      });
    }
    
    return filtered;
  }, [inventory, searchTerm, dateFilterType, startDate, endDate]);
  
  const { stats, chartData } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time for date comparison

    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const uniqueCategories = new Set(inventory.map(item => item.category)).size;
    
    let lowStockItemsCount = 0;
    let expiredItemsCount = 0;
    
    inventory.forEach(item => {
        const isLowStock = item.lowStockThreshold !== undefined && item.quantity < item.lowStockThreshold;
        const isExpired = item.expirationDate && new Date(item.expirationDate) < today;

        if(isExpired) {
          expiredItemsCount++;
        } else if (isLowStock) {
          lowStockItemsCount++;
        }
    });

    const inStockItemsCount = inventory.length - lowStockItemsCount - expiredItemsCount;
    
    const categoryQuantities = inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryQuantities)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      stats: {
        totalItems,
        totalValue,
        uniqueCategories,
        lowStockItems: lowStockItemsCount,
        expiredItems: expiredItemsCount,
      },
      chartData: {
        topCategories,
        stockStatus: {
          inStock: inStockItemsCount,
          lowStock: lowStockItemsCount,
          expired: expiredItemsCount,
        }
      }
    };
  }, [inventory]);

  const handleExportCSV = () => {
    if (filteredInventory.length === 0) {
      alert(t('alerts.noDataToExport'));
      return;
    }

    const headers = [
      t('csvHeaders.id'),
      t('csvHeaders.name'),
      t('csvHeaders.category'),
      t('csvHeaders.quantity'),
      t('csvHeaders.price'),
      t('csvHeaders.supplier'),
      t('csvHeaders.lastRestock'),
      t('csvHeaders.lowStockThreshold'),
      t('csvHeaders.expirationDate')
    ];

    const escapeCSV = (value: string | number | undefined | null) => {
      if (value === undefined || value === null) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = filteredInventory.map(item => [
      item.id,
      escapeCSV(item.name),
      escapeCSV(item.category),
      item.quantity,
      item.price.toFixed(3),
      escapeCSV(item.supplier),
      escapeCSV(item.lastRestockDate),
      escapeCSV(item.lowStockThreshold),
      escapeCSV(item.expirationDate)
    ].join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventaire_scolaire.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFilterType('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">{t('dashboard.title')}</h1>
                <p className="text-slate-500 mt-1">{t('dashboard.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mt-4 md:mt-0">
                <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                <i className="fas fa-file-csv me-2"></i>
                {t('dashboard.exportCSV')}
                </button>
                <button
                onClick={handleAddItem}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                <i className="fas fa-plus me-2"></i>
                {t('dashboard.addItem')}
                </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center">
                <div className="bg-blue-100 p-4 rounded-full me-4">
                    <i className="fas fa-boxes-stacked text-2xl text-blue-600"></i>
                </div>
                <div>
                    <p className="text-slate-500">{t('dashboard.totalItems')}</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.totalItems}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center">
                <div className="bg-green-100 p-4 rounded-full me-4">
                    <i className="fas fa-coins text-2xl text-green-600"></i>
                </div>
                <div>
                    <p className="text-slate-500">{t('dashboard.totalValue')}</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.totalValue.toFixed(3)} TND</p>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg flex items-center">
                <div className="bg-purple-100 p-4 rounded-full me-4">
                    <i className="fas fa-tags text-2xl text-purple-600"></i>
                </div>
                <div>
                    <p className="text-slate-500">{t('dashboard.categories')}</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.uniqueCategories}</p>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg flex items-center">
                <div className="bg-orange-100 p-4 rounded-full me-4">
                    <i className="fas fa-triangle-exclamation text-2xl text-orange-600"></i>
                </div>
                <div>
                    <p className="text-slate-500">{t('dashboard.lowStock')}</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.lowStockItems}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center">
                <div className="bg-red-100 p-4 rounded-full me-4">
                    <i className="fas fa-calendar-times text-2xl text-red-600"></i>
                </div>
                <div>
                    <p className="text-slate-500">{t('dashboard.expiredItems')}</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.expiredItems}</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('charts.title')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">{t('charts.topCategories')}</h3>
                <CategoryBarChart data={chartData.topCategories} />
            </div>
            <div className="bg-slate-50/50 p-4 rounded-lg">
                 <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">{t('charts.stockStatus')}</h3>
                <StockStatusPieChart data={chartData.stockStatus} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-4 md:p-6 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">{t('filters.search')}</label>
                    <div className="relative">
                        <i className="fas fa-search absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input
                            type="text" id="search" placeholder={t('filters.searchPlaceholder')}
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full ps-9 pe-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="dateFilterType" className="block text-sm font-medium text-slate-700 mb-1">{t('filters.filterByDate')}</label>
                    <select id="dateFilterType" value={dateFilterType} onChange={(e) => setDateFilterType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">{t('filters.dateType')}</option>
                        <option value="lastRestockDate">{t('filters.lastRestock')}</option>
                        <option value="expirationDate">{t('filters.expirationDate')}</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">{t('filters.from')}</label>
                        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={!dateFilterType}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">{t('filters.to')}</label>
                        <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!dateFilterType}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleResetFilters}
                        className="w-full bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-slate-600 transition-colors duration-200 flex items-center justify-center"
                    >
                        <i className="fas fa-times me-2"></i>
                        {t('filters.reset')}
                    </button>
                </div>
            </div>
          </div>
          <InventoryTable
            items={filteredInventory}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        </div>
      </main>
      {isModalOpen && (
        <ItemFormModal
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;