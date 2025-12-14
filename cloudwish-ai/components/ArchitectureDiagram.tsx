import React from 'react';
import { Database, Server, Globe, Cpu, ArrowRight } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white p-8 rounded-xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Server size={200} />
      </div>
      
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="text-purple-400">AWS</span> Архитектура проекта
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Step 1: Frontend */}
        <div className="flex flex-col items-center gap-3 text-center w-full md:w-1/5 group">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
            <Globe size={32} />
          </div>
          <div className="font-bold">S3 + CloudFront</div>
          <p className="text-xs text-slate-400">Хостинг React приложения (этот сайт)</p>
        </div>

        <ArrowRight className="text-slate-600 hidden md:block" />

        {/* Step 2: API Gateway */}
        <div className="flex flex-col items-center gap-3 text-center w-full md:w-1/5 group">
          <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
            <Server size={32} />
          </div>
          <div className="font-bold">API Gateway</div>
          <p className="text-xs text-slate-400">REST API точка входа</p>
        </div>

        <ArrowRight className="text-slate-600 hidden md:block" />

        {/* Step 3: Lambda */}
        <div className="flex flex-col items-center gap-3 text-center w-full md:w-1/5 group">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
            <Cpu size={32} />
          </div>
          <div className="font-bold">Lambda</div>
          <p className="text-xs text-slate-400">Node.js/Python код + Запрос к Gemini AI</p>
        </div>

        <ArrowRight className="text-slate-600 hidden md:block" />

        {/* Step 4: DynamoDB */}
        <div className="flex flex-col items-center gap-3 text-center w-full md:w-1/5 group">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
            <Database size={32} />
          </div>
          <div className="font-bold">DynamoDB</div>
          <p className="text-xs text-slate-400">NoSQL база для истории генераций</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700 text-sm text-slate-400">
        <p>
          <strong className="text-white">Как это работает:</strong> Когда вы нажимаете кнопку "Сгенерировать", React отправляет JSON в API Gateway. Gateway запускает Lambda функцию. Lambda отправляет промпт в Google Gemini, получает текст, сохраняет его в DynamoDB для истории и возвращает результат обратно на фронтенд.
        </p>
      </div>
    </div>
  );
};