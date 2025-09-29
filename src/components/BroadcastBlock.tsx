'use client';

import Image from 'next/image';

export default function BroadcastBlock() {
  return (
    <div className="broadcast-card">
      {/* Заголовок с кнопкой Live */}
      <div className="broadcast-header">
        <div className="broadcast-title-section">
          <div className="section-title">
            <h2 className="section-title-text">Трансляция</h2>
          </div>
        </div>
        
        <button className="live-button">
          <span className="live-icon">▶️</span>
          <span className="live-text">Live</span>
        </button>
      </div>

      {/* Изображение трансляции */}
      <div className="broadcast-video">
        <div className="broadcast-placeholder">
          <div className="broadcast-content">
            <div className="broadcast-icon">🔧</div>
            <div className="broadcast-title">Автосервис</div>
            <div className="broadcast-subtitle">Трансляция в реальном времени</div>
          </div>
        </div>
        
        {/* Индикатор Live */}
        <div className="live-indicator">
          <div className="live-dot"></div>
          <span className="live-label">LIVE</span>
        </div>
      </div>

      {/* Описание */}
      <div className="broadcast-description">
        <p>Прямая трансляция из автосервиса. Следите за процессом ремонта вашего автомобиля в реальном времени.</p>
      </div>
    </div>
  );
}
