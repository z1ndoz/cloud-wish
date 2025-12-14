import React, { useState } from 'react';
import { Send, Copy, RefreshCw, Wand2, AlertCircle, Sparkles } from 'lucide-react';
import { Tone, GreetingRequest, GreetingResponse, HistoryItem } from '../types';
import { generateGreeting } from '../services/geminiService';

export const Generator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<GreetingRequest>({
    name: '',
    occasion: '',
    tone: Tone.FUNNY,
    details: ''
  });

  const handleGenerate = async () => {
    if (!formData.name || !formData.occasion) {
      setError("Пожалуйста, заполните имя и повод.");
      return;
    }
    
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const generatedText = await generateGreeting(formData);
      setResult(generatedText);
      
      // Simulate saving to DynamoDB by adding to local state history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        text: generatedText,
        timestamp: new Date().toLocaleTimeString(),
        name: formData.name,
        occasion: formData.occasion
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Wand2 size={20} className="text-indigo-500"/>
            Параметры поздравления
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Кого поздравляем?</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Например: Иван Иванович, Мама, Коллега"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Какой повод?</label>
              <input 
                type="text" 
                value={formData.occasion}
                onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                placeholder="Например: День Рождения, Повышение, Новый Год"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Стиль (Tone)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.values(Tone).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFormData({...formData, tone: t})}
                    className={`px-2 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      formData.tone === t 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Детали (опционально)</label>
              <textarea 
                value={formData.details || ''}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                placeholder="Любит рыбалку, недавно купил машину..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all min-h-[80px] text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Генерируем магию...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Сгенерировать
                </>
              )}
            </button>
          </div>
        </div>

        {/* History simulated (DynamoDB view) */}
        {history.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">История (DynamoDB)</h4>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm hover:bg-slate-100 cursor-pointer" onClick={() => setResult(item.text)}>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{item.name} • {item.occasion}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="text-slate-700 line-clamp-1">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Result */}
      <div className="lg:col-span-7">
        <div className="h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl shadow-2xl">
          <div className="h-full bg-white rounded-[14px] p-8 flex flex-col justify-center items-center relative overflow-hidden min-h-[500px]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {result ? (
              <div className="relative z-10 w-full max-w-lg text-center animate-fade-in">
                <div className="mb-6">
                  <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                    Успешно сгенерировано
                  </span>
                </div>
                <h2 className="text-3xl font-serif text-slate-800 mb-8 leading-relaxed whitespace-pre-line">
                  {result}
                </h2>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => copyToClipboard(result)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    <Copy size={18} />
                    Копировать
                  </button>
                  <button 
                    onClick={handleGenerate}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw size={18} />
                    Ещё раз
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 relative z-10">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-medium text-slate-600 mb-2">Ваша открытка появится здесь</h3>
                <p className="max-w-xs mx-auto">Заполните форму слева, чтобы AI создал уникальное поздравление.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};