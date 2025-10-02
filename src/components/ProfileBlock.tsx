'use client';

import { useState } from 'react';

interface User {
  id: number;
  login: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
}

interface ProfileBlockProps {
  user: User;
}

export default function ProfileBlock({ user }: ProfileBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    phone: user.phone || '',
    address: user.address || ''
  });
  
  // Исходные данные для сравнения
  const originalData = {
    name: user.name || '',
    email: user.email,
    phone: user.phone || '',
    address: user.address || ''
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Обновляем данные в localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        setHasChanges(false);
        setIsEditing(false);
        // Можно добавить уведомление об успешном сохранении
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Проверяем, есть ли изменения
    const newData = { ...formData, [field]: value };
    const hasChangesNow = Object.keys(newData).some(key => 
      newData[key as keyof typeof newData] !== originalData[key as keyof typeof originalData]
    );
    setHasChanges(hasChangesNow);
    
    // Если есть изменения, включаем режим редактирования
    if (hasChangesNow && !isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div className="profile-card">
      {/* Заголовок */}
      <div className="section-title">
        <h2 className="section-title-text">Профиль</h2>
      </div>

      <div className="profile-content">
        {/* Аватар - левая часть */}
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <img src="/avatar.svg" alt="Avatar" className="profile-avatar-icon" />
          </div>
        </div>

        {/* Формы - правая часть */}
        <div className="profile-form-section">
          {/* Имя */}
          <div className="profile-form-field">
          <label className="profile-form-label">
              Имя
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              // disabled={!isEditing}
              className={`profile-form-input ${isEditing ? 'editable' : 'disabled'}`}
              placeholder="Введите имя"
            />
          </div>

          {/* Email */}
          <div className="profile-form-field">
            <label className="profile-form-label">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="profile-form-input disabled"
            />
          </div>

          {/* Телефон */}
          <div className="profile-form-field">
            <label className="profile-form-label">
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              // disabled={!isEditing}
              className={`profile-form-input ${isEditing ? 'editable' : 'disabled'}`}
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          {/* Адрес */}
          <div className="profile-form-field">
            <label className="profile-form-label">
              Адрес
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              // disabled={!isEditing}
              className={`profile-form-input ${isEditing ? 'editable' : 'disabled'}`}
              placeholder="Адрес"
            />
          </div>
        </div>
      </div>

      {/* Кнопка сохранения - показывается только при изменениях */}
      {hasChanges && (
        <div className="profile-actions">
          <button
            onClick={handleSave}
            className="profile-save-button"
          >
            Сохранить
          </button>
        </div>
      )}
    </div>
  );
}
