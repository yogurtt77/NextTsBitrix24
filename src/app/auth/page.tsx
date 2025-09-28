'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface FormData {
  login: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  login?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email обязателен';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Некорректный email';
      }

      if (!formData.password) {
        newErrors.password = 'Пароль обязателен';
      }
    } else {
      if (!formData.login.trim()) {
        newErrors.login = 'Логин обязателен';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email обязателен';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Некорректный email';
      }

      if (!formData.password) {
        newErrors.password = 'Пароль обязателен';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Пароль должен содержать минимум 6 символов';
      } else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву и цифру';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Подтверждение пароля обязательно';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли должны совпадать!';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { login: formData.email, password: formData.password }
        : { 
            login: formData.login, 
            email: formData.email, 
            password: formData.password 
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем данные пользователя в localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        // Обрабатываем ошибки валидации
        if (data.error.includes('занято')) {
          if (data.error.includes('пользователя')) {
            setErrors({ login: data.error });
          } else if (data.error.includes('письмо')) {
            setErrors({ email: data.error });
          }
        } else {
          setErrors({ general: data.error });
        }
      }
    } catch (error) {
      setErrors({ general: 'Произошла ошибка. Попробуйте еще раз.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = () => {
    if (isLogin) {
      return formData.email.trim() && formData.password;
    }
    return formData.login.trim() && 
           formData.email.trim() && 
           formData.password && 
           formData.confirmPassword &&
           formData.password === formData.confirmPassword;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Левая часть - форма */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Логотип */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">ЛОГОТИП</h1>
            <h2 className="text-xl text-black">
              {isLogin ? 'Вход' : 'Регистрация'}
            </h2>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="Email"
                />
                {errors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Логин (только для регистрации) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Логин
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.login}
                    onChange={(e) => handleInputChange('login', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.login ? 'border-red-500' : ''
                    }`}
                    placeholder="Введите логин"
                  />
                  {errors.login && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                    </div>
                  )}
                </div>
                {errors.login && (
                  <p className="text-red-500 text-sm mt-1">{errors.login}</p>
                )}
              </div>
            )}

            {/* Пароль */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
                {errors.password && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Подтверждение пароля (только для регистрации) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Подтверждение пароля
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="Подтвердите пароль"
                  />
                  {errors.confirmPassword && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                    </div>
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Общая ошибка */}
            {errors.general && (
              <div className="text-red-500 text-sm text-center">
                {errors.general}
              </div>
            )}

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isFormValid() && !isLoading
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Загрузка...' : (isLogin ? 'Вход' : 'Регистрация')}
            </button>

            {/* Переключение между входом и регистрацией */}
            <div className="text-center">
              <span className="text-gray-500">или</span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="block text-blue-500 hover:text-blue-600 mt-2 underline"
              >
                {isLogin ? 'Регистрация' : 'Вход'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Правая часть - изображение Hyundai (скрывается на мобильных) */}
      <div className="hidden lg:block lg:w-3/5 relative">
        <Image
          src="/images/hyundai.png"
          alt="Hyundai Santa Fe"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
