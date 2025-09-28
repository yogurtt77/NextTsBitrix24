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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-1 h-12 bg-blue-500 mr-4"></div>
            <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
          </div>
        </div>

        {/* Основной контент */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Левая часть - Аватар */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 border-2 border-blue-200 rounded-full flex items-center justify-center bg-gray-50">
                <span className="text-4xl text-gray-400">👤</span>
              </div>
            </div>

            {/* Правая часть - Форма */}
            <div className="flex-1">
              <div className="space-y-6">
                {/* Имя */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                        errors.name 
                          ? 'border-red-500' 
                          : isEditing 
                            ? 'border-blue-300 focus:border-blue-500' 
                            : 'border-gray-200 bg-gray-50'
                      }`}
                      placeholder="Введите имя"
                    />
                    {errors.name && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">!</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg"
                  />
                </div>

                {/* Телефон */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      isEditing 
                        ? 'border-blue-300 focus:border-blue-500' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                {/* Адрес */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      isEditing 
                        ? 'border-blue-300 focus:border-blue-500' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="Введите адрес"
                  />
                </div>

                {/* Общая ошибка */}
                {errors.general && (
                  <div className="text-red-500 text-sm">
                    {errors.general}
                  </div>
                )}

                {/* Кнопка редактирования/сохранения */}
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    isEditing
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isEditing ? 'Сохранить' : 'Редактировать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
