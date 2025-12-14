import React from 'react';
import { Cloud, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2 rounded-lg shadow-lg">
              <Cloud size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                CloudWish AI
              </h1>
              <p className="text-xs text-slate-500 font-medium">AWS Serverless Demo</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              System Operational
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};