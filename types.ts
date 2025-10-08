
export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  lastRestockDate: string;
  lowStockThreshold?: number;
  expirationDate?: string;
}
