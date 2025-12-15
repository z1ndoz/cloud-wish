import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { Generator } from './components/Generator';
import { Statistics } from './components/Statistics';
import { Layout, PlayCircle, BarChart2 } from 'lucide-react';
import { HistoryItem } from './types';

enum Tab {
  GENERATOR = 'generator',
  STATISTICS = 'statistics',
  ARCHITECTURE = 'architecture'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GENERATOR);

  // GLOBAL STATE: History
  // We lift the state here so it can be shared between Generator (Add) and Statistics (Read)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cloudwish_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cloudwish_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const clearHistory = () => {
    if (confirm('Вы уверены, что хотите очистить всю историю и сбросить счетчик?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab(Tab.GENERATOR)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === Tab.GENERATOR 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <PlayCircle size={18} />
                Генератор
              </button>
              <button
                onClick={() => setActiveTab(Tab.STATISTICS)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === Tab.STATISTICS 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BarChart2 size={18} />
                Статистика
              </button>
              <button
                onClick={() => setActiveTab(Tab.ARCHITECTURE)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === Tab.ARCHITECTURE 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Layout size={18} />
                Архитектура AWS
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            {activeTab === Tab.GENERATOR && (
              <Generator onGenerateSuccess={addToHistory} />
            )}

            {activeTab === Tab.STATISTICS && (
              <Statistics history={history} onClearHistory={clearHistory} />
            )}
            
            {activeTab === Tab.ARCHITECTURE && (
              <div className="max-w-5xl mx-auto">
                <ArchitectureDiagram />
                <div className="mt-8 text-center text-slate-500 text-sm">
                  Эта диаграмма наглядно демонстрирует использование 4 сервисов AWS (S3, API Gateway, Lambda, DynamoDB) для зачета.
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2025 CloudWish AI. Проект для демонстрации AWS Free Tier Architecture.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
