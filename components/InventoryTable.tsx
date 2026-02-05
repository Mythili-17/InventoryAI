// Renders a detailed inventory table with status badges.

import React from 'react';
import { InventoryItem } from '../types';

interface InventoryTableProps {
  inventory: InventoryItem[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold">Inventory Details</h3>
        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
          <i className="fas fa-file-export"></i> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Level</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => {
              const isLow = item.currentStock > 0 && item.currentStock < item.reorderLevel;
              const isOut = item.currentStock <= 0;
              const isSurplus = item.currentStock > item.reorderLevel * 5;

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-xs text-slate-400">SKU: {item.id.padStart(6, '0')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.currentStock}</span>
                      <span className="text-xs text-slate-400">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isOut ? (
                      <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold">
                        Low Stock
                      </span>
                    ) : isSurplus ? (
                      <span className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold">
                        Surplus
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                        Healthy
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
