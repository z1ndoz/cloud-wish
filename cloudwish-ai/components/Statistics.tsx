import React from 'react';
import { HistoryItem, Tone } from '../types';
import { BarChart3, Calendar, Clock, MessageSquare, Trash2, Users } from 'lucide-react';

interface StatisticsProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ history, onClearHistory }) => {
  // Calculate Metrics
  const totalGenerated = history.length;
  
  const popularTone = React.useMemo(() => {
    if (totalGenerated === 0) return 'Нет данных';
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let maxTone = '';
    
    // We don't store Tone in HistoryItem in the current interface, 
    // but assuming we might extend it later. For now, let's just count names/occasions 
    // or just show total. 
    // Let's implement Occasion popularity since we have that data.
    history.forEach(item => {
      const occasion = item.occasion.toLowerCase();
      counts[occasion] = (counts[occasion] || 0) + 1;
      if (counts[occasion] > maxCount) {
        maxCount = counts[occasion];
        maxTone = item.occasion; // Using occasion as proxy for "category" stats
      }
    });
    return maxTone;
  }, [history]);

  const lastGenerated = history.length > 0 ? history[0].timestamp : '—';

  return (
    <div className="space-y-6">
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Всего открыток</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalGenerated}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Поп. повод</p>
            <h3 className="text-lg font-bold text-slate-800 capitalize truncate max-w-[150px]" title={popularTone}>
              {popularTone}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Последний раз</p>
            <h3 className="text-lg font-bold text-slate-800">{lastGenerated}</h3>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare size={20} className="text-indigo-500"/>
            История генераций (DynamoDB Scan)
          </h3>
          {history.length > 0 && (
            <button 
              onClick={onClearHistory}
              className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
              Очистить таблицу
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Calendar size={32} className="text-slate-300" />
            </div>
            <p>История пуста. Сгенерируйте первое поздравление!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-slate-100">Время</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Кому</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Повод</th>
                  <th className="p-4 font-semibold border-b border-slate-100 w-1/2">Текст</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-slate-500 font-mono text-xs">{item.timestamp}</td>
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                        {item.occasion}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 line-clamp-2 max-w-xs sm:max-w-md">
                      <div className="line-clamp-2">{item.text}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};