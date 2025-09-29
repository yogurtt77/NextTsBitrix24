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
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    phone: user.phone || '',
    address: user.address || ''
  });

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
        setIsEditing(false);
        // Можно добавить уведомление об успешном сохранении
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="profile-card">
      {/* Заголовок */}
      <div className="section-title">
        <h2 className="section-title-text">Профиль</h2>
      </div>

      <div className="profile-content">
        {/* Аватар */}
        <div className="avatar-container">
          <div className="avatar">
            <span className="avatar-icon">👤</span>
          </div>
        </div>

        {/* Поля формы */}
        <div className="form-fields">
          {/* Имя */}
          <div className="form-field">
            <label className="form-label">
              Имя
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              className={`form-input ${isEditing ? 'editable' : 'disabled'}`}
              placeholder="Введите имя"
            />
          </div>

          {/* Email */}
          <div className="form-field">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="form-input disabled"
            />
          </div>

          {/* Телефон */}
          <div className="form-field">
            <label className="form-label">
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className={`form-input ${isEditing ? 'editable' : 'disabled'}`}
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          {/* Адрес */}
          <div className="form-field">
            <label className="form-label">
              Адрес
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              className={`form-input ${isEditing ? 'editable' : 'disabled'}`}
              placeholder="Введите адрес"
            />
          </div>
        </div>

        {/* Кнопка редактирования/сохранения */}
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`profile-button ${isEditing ? 'save' : 'edit'}`}
        >
          {isEditing ? 'Сохранить' : 'Редактировать'}
        </button>
      </div>
    </div>
  );
}
