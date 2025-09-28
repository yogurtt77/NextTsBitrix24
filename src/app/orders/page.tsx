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
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Заказы</h1>
        </div>

        {/* Сетка заказов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              {/* Статус */}
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Статус</span>
              </div>

              {/* Детали услуги */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {order.serviceDetails}
              </h3>

              {/* Дата заказа */}
              <p className="text-sm text-gray-500 mb-6">
                {order.orderDate}
              </p>

              {/* Кнопка повторения заказа */}
              <button
                onClick={() => handleRepeatOrder(order.id)}
                className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Повторить заказ
              </button>
            </div>
          ))}
        </div>

        {/* Пагинация (если нужно) */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Предыдущая
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Следующая
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
