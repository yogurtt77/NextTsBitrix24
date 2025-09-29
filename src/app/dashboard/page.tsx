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
      <div className="loading-page">
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <Header />
      
      <main className="dashboard-main">
        {/* Приветствие */}
        <div className="dashboard-greeting">
          <h1 className="greeting-title">
            Привет, {user.name || user.login} 👋
          </h1>
        </div>

        {/* Основной контент - сетка 2x2 */}
        <div className="dashboard-grid">
          {/* Верхний ряд */}
          <div className="dashboard-row">
            {/* Заказы - левая часть (широкая) */}
            <div className="orders-section">
              <OrdersSlider />
            </div>
            
            {/* Профиль - правая часть (узкая) */}
            <div className="profile-section">
              <ProfileBlock user={user} />
            </div>
          </div>

          {/* Нижний ряд */}
          <div className="dashboard-row">
            {/* Трансляция - левая часть (широкая) */}
            <div className="broadcast-section">
              <BroadcastBlock />
            </div>
            
            {/* Платежи - правая часть (узкая) */}
            <div className="payments-section">
              <PaymentsBlock />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
