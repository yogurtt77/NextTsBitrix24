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
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Заголовок */}
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-blue-500 mr-3"></div>
        <h2 className="text-xl font-bold text-gray-900">Профиль</h2>
      </div>

      <div className="space-y-6">
        {/* Аватар */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl text-gray-400">👤</span>
          </div>
        </div>

        {/* Поля формы */}
        <div className="space-y-4">
          {/* Имя */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                isEditing 
                  ? 'border-gray-300 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="Введите имя"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                isEditing 
                  ? 'border-gray-300 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          {/* Адрес */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Адрес
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                isEditing 
                  ? 'border-gray-300 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="Введите адрес"
            />
          </div>
        </div>

        {/* Кнопка редактирования/сохранения */}
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isEditing
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isEditing ? 'Сохранить' : 'Редактировать'}
        </button>
      </div>
    </div>
  );
}
