'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Order {
  id: number;
  status: string;
  serviceDetails: string;
  orderDate: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    status: 'В обработке',
    serviceDetails: 'Детали услуги',
    orderDate: '15.03.2025'
  },
  {
    id: 2,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '14.03.2025'
  },
  {
    id: 3,
    status: 'В работе',
    serviceDetails: 'Детали услуги',
    orderDate: '13.03.2025'
  },
  {
    id: 4,
    status: 'Завершен',
    serviceDetails: 'Детали услуги',
    orderDate: '12.03.2025'
  },
  {
    id: 5,
    status: 'Отменен',
    serviceDetails: 'Детали услуги',
    orderDate: '11.03.2025'
  },
  {
    id: 6,
    status: 'В обработке',
    serviceDetails: 'Детали услуги',
    orderDate: '10.03.2025'
  },
  {
    id: 7,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '09.03.2025'
  },
  {
    id: 8,
    status: 'В работе',
    serviceDetails: 'Детали услуги',
    orderDate: '08.03.2025'
  },
  {
    id: 9,
    status: 'Завершен',
    serviceDetails: 'Детали услуги',
    orderDate: '07.03.2025'
  },
  {
    id: 10,
    status: 'В обработке',
    serviceDetails: 'Детали услуги',
    orderDate: '06.03.2025'
  },
  {
    id: 11,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '05.03.2025'
  },
  {
    id: 12,
    status: 'В работе',
    serviceDetails: 'Детали услуги',
    orderDate: '04.03.2025'
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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

  const handleRepeatOrder = (orderId: number) => {
    // Логика повторения заказа
    console.log('Повтор заказа:', orderId);
    // Можно добавить уведомление или модальное окно
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
    <div className="orders-page">
      <Header />
      
      <main className="orders-main">
        {/* Заголовок */}
        <div className="orders-header">
          <h1 className="orders-title">Заказы</h1>
        </div>

        {/* Сетка заказов */}
        <div className="orders-grid">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="order-card"
            >
              {/* Статус */}
              <div className="order-status">
                <div className="status-dot"></div>
                <span className="status-label">Статус</span>
              </div>

              {/* Детали услуги */}
              <h3 className="order-service">
                {order.serviceDetails}
              </h3>

              {/* Дата заказа */}
              <p className="order-date">
                {order.orderDate}
              </p>

              {/* Кнопка повторения заказа */}
              <button
                onClick={() => handleRepeatOrder(order.id)}
                className="repeat-button"
              >
                Повторить заказ
              </button>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
