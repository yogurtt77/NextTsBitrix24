'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import OrdersSlider from '@/components/OrdersSlider';
import ProfileBlock from '@/components/ProfileBlock';
import BroadcastBlock from '@/components/BroadcastBlock';
import PaymentsBlock from '@/components/PaymentsBlock';

interface User {
  id: number;
  login: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (error) {
      console.error('Ошибка парсинга данных пользователя:', error);
      router.push('/auth');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Приветствие */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Привет, {user.name || user.login} 👋
          </h1>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Заказы */}
          <div className="lg:col-span-2">
            <OrdersSlider />
          </div>

          {/* Правая колонка - Профиль */}
          <div className="lg:col-span-1">
            <ProfileBlock user={user} />
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Трансляция */}
          <div>
            <BroadcastBlock />
          </div>

          {/* Платежи */}
          <div>
            <PaymentsBlock />
          </div>
        </div>
      </main>
    </div>
  );
}
