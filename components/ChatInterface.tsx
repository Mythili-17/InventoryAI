
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChatMessage, InventoryItem } from '../types';
import { getGeminiResponse } from '../services/geminiService';

export interface ChatInterfaceHandle {
  sendMessage: (text: string) => void;
}

interface ChatInterfaceProps {
  inventory: InventoryItem[];
}

const PurchaseOrderCard: React.FC<{ items: any[] }> = ({ items }) => {
  const total = items.reduce((sum, item) => sum + (item.cost || 0), 0);
  
  return (
    <div className="mt-3 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Draft Purchase Order</span>
        <span className="text-indigo-600 font-bold text-xs">${total.toFixed(2)}</span>
      </div>
      <div className="p-3 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <div>
              <p className="font-bold text-slate-800">{item.name}</p>
              <p className="text-[10px] text-slate-400">Qty: {item.qty} • {item.supplier}</p>
            </div>
            <p className="font-semibold text-slate-600">${(item.cost || 0).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <button 
        onClick={() => alert("Purchase Order Approved & Sent to Suppliers!")}
        className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors border-t border-slate-200"
      >
        Confirm & Send Order
      </button>
    </div>
  );
};

const ChatInterface = forwardRef<ChatInterfaceHandle, ChatInterfaceProps>(({ inventory }, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AI Inventory Agent. I have full access to your stock data and can help you predict run-out dates or draft purchase orders. How can I assist today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    if (!customText) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await getGeminiResponse(textToSend, inventory, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => {
      handleSend(text);
    }
  }));

  const renderMessageContent = (text: string) => {
    const jsonMatch = text.match(/```JSON_PURCHASE_ORDER\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const poData = JSON.parse(jsonMatch[1]);
        const cleanText = text.replace(/```JSON_PURCHASE_ORDER\s*[\s\S]*?\s*```/, '').trim();
        return (
          <>
            <p>{cleanText}</p>
            <PurchaseOrderCard items={poData} />
          </>
        );
      } catch (e) {
        return <p className="whitespace-pre-wrap">{text}</p>;
      }
    }
    return <p className="whitespace-pre-wrap">{text}</p>;
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden border border-slate-200">
      <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <i className="fas fa-robot text-white"></i>
          </div>
          <div>
            <h2 className="font-black text-slate-800 text-sm">Inventory Agent</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Analysis Online</span>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
              }`}>
                <div className="text-sm leading-relaxed">
                  {renderMessageContent(msg.text)}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-bold px-1">
                {msg.role === 'user' ? 'YOU' : 'AGENT'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 rounded-tl-none flex gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your stock..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 pr-14 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            <i className="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChatInterface;
