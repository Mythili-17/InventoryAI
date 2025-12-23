
import React, { useState, useRef } from 'react';
import { INITIAL_INVENTORY } from './constants';
import InventoryDashboard from './components/InventoryDashboard';
import InventoryTable from './components/InventoryTable';
import ChatInterface, { ChatInterfaceHandle } from './components/ChatInterface';
import { InventoryItem } from './types';

const App: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table'>('dashboard');
  const chatRef = useRef<ChatInterfaceHandle>(null);

  const handleSuggestedPrompt = (promptText: string) => {
    if (chatRef.current) {
      chatRef.current.sendMessage(promptText);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim() !== '');
      
      // Simple CSV Parser (assuming: ID, Name, Category, Stock, Unit, Reorder, Consumption, Expiry, Price, Supplier)
      // Skip header row
      const newItems: InventoryItem[] = rows.slice(1).map((row, index) => {
        const cols = row.split(',').map(c => c.trim());
        return {
          id: cols[0] || `new-${index}`,
          name: cols[1] || 'Unknown Item',
          category: cols[2] || 'Uncategorized',
          currentStock: parseFloat(cols[3]) || 0,
          unit: cols[4] || 'Units',
          reorderLevel: parseFloat(cols[5]) || 0,
          dailyConsumptionRate: parseFloat(cols[6]) || 1,
          expiryDate: cols[7] || '2026-01-01',
          price: parseFloat(cols[8]) || 0,
          supplier: cols[9] || 'Unknown'
        };
      });

      if (newItems.length > 0) {
        setInventory(newItems);
        if (chatRef.current) {
          chatRef.current.sendMessage(`I have just uploaded a new inventory file with ${newItems.length} items. Please analyze it and give me a summary.`);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
                <i className="fas fa-warehouse text-white"></i>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Inventory<span className="text-indigo-600">AI</span></h1>
            </div>
            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('table')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Inventory List
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-900 leading-none">Smart Mode</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active</p>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=inventory" alt="Profile" className="w-9 h-9 rounded-full bg-indigo-50 border border-slate-200" />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'dashboard' ? 'Business Insights' : 'Stock Management'}
                </h2>
                <p className="text-slate-500 font-medium">Monitoring {inventory.length} active products in real-time.</p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="file" 
                  id="csv-upload" 
                  accept=".csv" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <label 
                  htmlFor="csv-upload" 
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all shadow-sm"
                >
                  <i className="fas fa-file-upload"></i>
                  Import Data
                </label>
              </div>
            </header>

            {activeTab === 'dashboard' ? (
              <InventoryDashboard inventory={inventory} />
            ) : (
              <InventoryTable inventory={inventory} />
            )}
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              <ChatInterface ref={chatRef} inventory={inventory} />
              
              <div className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-xl shadow-indigo-100 text-white">
                <h4 className="font-black text-sm mb-4 flex items-center gap-2 uppercase tracking-widest opacity-90">
                  <i className="fas fa-bolt text-yellow-300"></i>
                  Quick Analysis
                </h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleSuggestedPrompt("Give me a full inventory summary with counts of low stock and surplus items.")}
                    className="w-full text-left text-xs bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 transition-all font-medium backdrop-blur-sm"
                  >
                    "Analyze current stock status"
                  </button>
                  <button 
                    onClick={() => handleSuggestedPrompt("Show me items that will run out in 10 days based on daily consumption.")}
                    className="w-full text-left text-xs bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 transition-all font-medium backdrop-blur-sm"
                  >
                    "Forecast stock-outs (10 days)"
                  </button>
                  <button 
                    onClick={() => handleSuggestedPrompt("Generate a professional purchase order for all low-stock items.")}
                    className="w-full text-left text-xs bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 transition-all font-medium backdrop-blur-sm"
                  >
                    "Draft purchase request"
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm font-medium">
          <p>© 2025 InventoryAI Agent. Smart Supply Chain for MSMEs.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
