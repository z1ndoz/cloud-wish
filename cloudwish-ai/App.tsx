import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { Generator } from './components/Generator';
import { Layout, PlayCircle } from 'lucide-react';

enum Tab {
  GENERATOR = 'generator',
  ARCHITECTURE = 'architecture'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GENERATOR);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
              <button
                onClick={() => setActiveTab(Tab.GENERATOR)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === Tab.GENERATOR 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <PlayCircle size={18} />
                Генератор
              </button>
              <button
                onClick={() => setActiveTab(Tab.ARCHITECTURE)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
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
            {activeTab === Tab.GENERATOR && <Generator />}
            
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