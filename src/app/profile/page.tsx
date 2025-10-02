'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface User {
  id: number;
  login: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Проверяем авторизацию
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || ''
      });
    } catch (error) {
      console.error('Ошибка парсинга данных пользователя:', error);
      router.push('/auth');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Неправильное поле ввода';
    } else if (formData.name.includes(' ')) {
      newErrors.name = 'Неправильное поле ввода';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !user) return;

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
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.error });
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setErrors({ general: 'Произошла ошибка при сохранении' });
    }
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <Header />
      
      <main className="profile-main">
        {/* Заголовок */}
        <div className="profile-header">
          <div className="profile-title-section">
            <div className="profile-title-bar"></div>
            <h1 className="profile-title">Профиль</h1>
          </div>
        </div>

        {/* Основной контент */}
        <div className="profile-content-card">
          <div className="profile-layout">
            {/* Левая часть - Аватар */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                <img className="profile-avatar-img" src="/profilepageavatar.svg" alt="Avatar" />
              </div>
            </div>

            {/* Правая часть - Форма */}
            <div className="profile-form-section">
              <div className="profile-form-fields">
                {/* Имя */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className={`profile-form-input ${errors.name ? 'error' : ''} ${isEditing ? 'editable' : 'disabled'}`}
                    placeholder="Телефон"
                  />
                  {errors.name && (
                    <p className="profile-error-message">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="profile-form-input disabled"
                    placeholder="Телефон"
                  />
                </div>

                {/* Телефон */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`profile-form-input ${isEditing ? 'editable' : 'disabled'}`}
                    placeholder="+7 (123) 420 __ - __"
                  />
                </div>

                {/* Адрес */}
                <div className="profile-form-group">
                  <label className="profile-form-label">
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className={`profile-form-input ${isEditing ? 'editable' : 'disabled'}`}
                    placeholder="Телефон"
                  />
                </div>

                {/* Общая ошибка */}
                {errors.general && (
                  <div className="profile-general-error">
                    {errors.general}
                  </div>
                )}

                {/* Кнопка редактирования/сохранения */}
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="profile-save-button"
                >
                  Редактировать
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
