'use client';

import Image from 'next/image';

export default function BroadcastBlock() {
  return (
    <div className="broadcast-card">
      {/* Заголовок с кнопкой Live */}
      <div className="broadcast-header">
        <div className="broadcast-title-section">
          <div className="section-title" >
            <h2 className="section-title-text">Трансляция</h2>
          </div>
        </div>
        
        <button className="live-button">
          <img className="live-icon" src="/live/live.svg" alt="Live" />
          <span className="live-text">Live</span>
        </button>
      </div>

      {/* Изображение трансляции */}
      <div className="broadcast-video">
            <img className="broadcast-image" src="/live/liveimage.svg" alt="Live" />
     
      </div>
    </div>
  );
}
