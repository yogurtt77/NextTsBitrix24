'use client';

import Image from 'next/image';

export default function BroadcastBlock() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Заголовок с кнопкой Live */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-1 h-8 bg-blue-500 mr-3"></div>
          <h2 className="text-xl font-bold text-gray-900">Трансляция</h2>
        </div>
        
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <span>▶️</span>
          <span>Live</span>
        </button>
      </div>

      {/* Изображение трансляции */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🔧</div>
            <div className="text-lg font-medium">Автосервис</div>
            <div className="text-sm">Трансляция в реальном времени</div>
          </div>
        </div>
        
        {/* Индикатор Live */}
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>LIVE</span>
        </div>
      </div>

      {/* Описание */}
      <div className="mt-4 text-sm text-gray-600">
        <p>Прямая трансляция из автосервиса. Следите за процессом ремонта вашего автомобиля в реальном времени.</p>
      </div>
    </div>
  );
}
