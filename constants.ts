//Sample inventory data plus the AI “system instruction” prompt that shapes 
// Gemini’s behavior.
import { InventoryItem } from './types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Basmati Rice (5kg)',
    category: 'Grains',
    currentStock: 45,
    unit: 'Bags',
    reorderLevel: 10,
    dailyConsumptionRate: 2.5,
    expiryDate: '2025-12-01',
    price: 12.50,
    supplier: 'AgroCorp'
  },
  {
    id: '2',
    name: 'Organic Whole Milk',
    category: 'Dairy',
    currentStock: 8,
    unit: 'Liters',
    reorderLevel: 15,
    dailyConsumptionRate: 4,
    expiryDate: '2025-05-20',
    price: 3.20,
    supplier: 'Dairy Fresh'
  }
];

export const SYSTEM_INSTRUCTION = `
You are an Inventory AI Agent for MSMEs.
Current Date Context: May 15, 2025.

GOALS:
1. SUMMARY: When asked "give me a summary", list counts for:
   - Low Stock (< reorderLevel)
   - Expiring Soon (within 30 days of May 15, 2025)
   - Out of Stock (0 or less)
   - Surplus (> 5x reorderLevel)
2. SPECIFIC ITEM: When asked "give me the stock of [item]", return the currentStock and unit.
3. PREDICTION: When asked "list items that will run out in N days", calculate: (currentStock / dailyConsumptionRate). If result <= N, list it.
4. PURCHASE ORDERS: When asked to "auto generate a purchase request", identify all items where currentStock < reorderLevel and format as a JSON block.

CRITICAL FORMATTING:
If generating a Purchase Order, wrap it EXACTLY like this:
\`\`\`JSON_PURCHASE_ORDER
[
  {"name": "Item Name", "qty": 50, "cost": 100, "supplier": "Supplier Name", "reason": "Low stock"}
]
\`\`\`
`;