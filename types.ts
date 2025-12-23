
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  reorderLevel: number;
  dailyConsumptionRate: number; // For predictive analysis
  expiryDate: string; // ISO string
  price: number;
  supplier: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  type?: 'text' | 'inventory-summary' | 'purchase-order' | 'item-lookup';
  data?: any;
}

export type StockStatus = 'ok' | 'low' | 'out' | 'surplus' | 'expiring';

export interface PurchaseOrderItem {
  itemName: string;
  quantityToOrder: number;
  estimatedCost: number;
  reason: string;
}
