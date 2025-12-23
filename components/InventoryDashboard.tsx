
import React, { useMemo } from 'react';
import { InventoryItem } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import StatCard from './StatCard';

interface InventoryDashboardProps {
  inventory: InventoryItem[];
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ inventory }) => {
  const stats = useMemo(() => {
    const today = new Date('2025-05-15');
    const expiringThreshold = new Date(today);
    expiringThreshold.setDate(today.getDate() + 30);

    return {
      totalItems: inventory.length,
      lowStock: inventory.filter(i => i.currentStock > 0 && i.currentStock < i.reorderLevel).length,
      outOfStock: inventory.filter(i => i.currentStock <= 0).length,
      expiringSoon: inventory.filter(i => new Date(i.expiryDate) <= expiringThreshold).length,
      surplus: inventory.filter(i => i.currentStock > i.reorderLevel * 5).length
    };
  }, [inventory]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    inventory.forEach(item => {
      map[item.category] = (map[item.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [inventory]);

  const stockLevelData = useMemo(() => {
    return inventory.map(item => ({
      name: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
      stock: item.currentStock,
      reorder: item.reorderLevel,
      fullName: item.name
    }));
  }, [inventory]);

  const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StatCard label="Total Products" value={stats.totalItems} icon="fas fa-boxes" colorClass="border-indigo-500 text-indigo-500" />
        <StatCard label="Low Stock" value={stats.lowStock} icon="fas fa-exclamation-triangle" colorClass="border-amber-500 text-amber-500" />
        <StatCard label="Out of Stock" value={stats.outOfStock} icon="fas fa-times-circle" colorClass="border-red-500 text-red-500" />
        <StatCard label="Expiring Soon" value={stats.expiringSoon} icon="fas fa-clock" colorClass="border-purple-500 text-purple-500" />
        <StatCard label="Surplus" value={stats.surplus} icon="fas fa-plus-circle" colorClass="border-emerald-500 text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-chart-bar text-indigo-500"></i>
            Stock Levels vs Reorder Point
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: any, name: string) => [value, name === 'stock' ? 'Current Stock' : 'Reorder Level']}
                />
                <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                  {stockLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.stock <= entry.reorder ? '#ef4444' : '#6366f1'} />
                  ))}
                </Bar>
                <Bar dataKey="reorder" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-chart-pie text-indigo-500"></i>
            Category Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="font-medium">{entry.name}</span>
                  <span className="text-slate-400">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
