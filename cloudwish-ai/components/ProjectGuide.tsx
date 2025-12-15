import React from 'react';
import { Terminal, Code, Layers, CheckCircle } from 'lucide-react';

export const ProjectGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Пошаговая реализация проекта</h2>
        <p className="text-slate-600 mb-6">
          Используйте это руководство для развертывания проекта в рамках курсовой работы или хакатона.
        </p>
        
        <div className="space-y-6">
          <Step 
            number={1} 
            title="Подготовка Terraform (Infrastructure as Code)"
            icon={<Layers size={20} />}
            content={
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                <li>Создайте файл <code>main.tf</code>.</li>
                <li>Опишите ресурс <strong>AWS S3 Bucket</strong> (для хостинга этого сайта).</li>
                <li>Опишите <strong>DynamoDB Table</strong> (ключ: id).</li>
                <li>Опишите <strong>Lambda Function</strong> (runtime: nodejs18.x или python3.9).</li>
                <li>Настройте <strong>API Gateway</strong> (HTTP API) для триггера Lambda.</li>
              </ul>
            }
          />

          <Step 
            number={2} 
            title="Backend Логика (Lambda)"
            icon={<Code size={20} />}
            content={
              <div className="text-sm text-slate-600 space-y-2">
                <p>В коде Lambda функции нужно реализовать:</p>
                <div className="bg-slate-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                  {`// Пример логики handler
exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  // 1. Вызов Gemini API
  const aiText = await callGemini(body.prompt); 
  // 2. Сохранение в DynamoDB
  await saveToDynamoDB({ id: uuid(), text: aiText });
  // 3. Ответ
  return { statusCode: 200, body: JSON.stringify({ text: aiText }) };
};`}
                </div>
              </div>
            }
          />

          <Step 
            number={3} 
            title="Frontend Развертывание"
            icon={<Terminal size={20} />}
            content={
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                <li>Соберите этот React проект: <code>npm run build</code>.</li>
                <li>Загрузите содержимое папки <code>dist/</code> или <code>build/</code> в созданный S3 бакет.</li>
                <li>В настройках S3 включите "Static Website Hosting".</li>
                <li>В коде фронтенда замените мок-функцию на <code>fetch('URL_ВАШЕГО_API_GATEWAY')</code>.</li>
              </ul>
            }
          />
          
          <Step 
            number={4} 
            title="Презентация"
            icon={<CheckCircle size={20} />}
            content={
              <p className="text-sm text-slate-600">
                Откройте вкладку "Архитектура" на этом сайте во время защиты проекта, чтобы наглядно показать схему работы комиссии.
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
};

const Step: React.FC<{ number: number; title: string; icon: React.ReactNode; content: React.ReactNode }> = ({ number, title, icon, content }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
        {title}
        <span className="text-slate-400">{icon}</span>
      </h3>
      {content}
    </div>
  </div>
);