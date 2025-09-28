'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Payment {
  id: string;
  accountNumber: string;
  date: string;
  amount: string;
  status: 'paid' | 'unpaid';
  stageId: string;
  stageSemanticId: string;
}

export default function PaymentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

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
      loadPayments();
    } catch (error) {
      console.error('Ошибка парсинга данных пользователя:', error);
      router.push('/auth');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const loadPayments = async () => {
    try {
      const response = await fetch('/api/bitrix/deals');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        console.error('Ошибка загрузки платежей');
        // Используем моковые данные в случае ошибки
        setPayments(getMockPayments());
      }
    } catch (error) {
      console.error('Ошибка загрузки платежей:', error);
      // Используем моковые данные в случае ошибки
      setPayments(getMockPayments());
    }
  };

  const getMockPayments = (): Payment[] => [
    {
      id: '1',
      accountNumber: '321312321',
      date: '16.03.2025',
      amount: '15,000 тг',
      status: 'unpaid',
      stageId: 'NEW',
      stageSemanticId: 'P'
    },
    {
      id: '2',
      accountNumber: '321312321',
      date: '16.03.2025',
      amount: '15,000 тг',
      status: 'paid',
      stageId: 'PREPARATION',
      stageSemanticId: 'P'
    },
    {
      id: '3',
      accountNumber: '321312321',
      date: '16.03.2025',
      amount: '15,000 тг',
      status: 'paid',
      stageId: 'PREPARATION',
      stageSemanticId: 'P'
    },
    {
      id: '4',
      accountNumber: '321312321',
      date: '16.03.2025',
      amount: '15,000 тг',
      status: 'paid',
      stageId: 'PREPARATION',
      stageSemanticId: 'P'
    },
    {
      id: '5',
      accountNumber: '321312321',
      date: '16.03.2025',
      amount: '15,000 тг',
      status: 'paid',
      stageId: 'PREPARATION',
      stageSemanticId: 'P'
    },
    {
      id: '6',
      accountNumber: '321312321',
      date: '16.03.2025',
      amount: '15,000 тг',
      status: 'paid',
      stageId: 'PREPARATION',
      stageSemanticId: 'P'
    },
    {
      id: '7',
      accountNumber: '321312321',
      date: '16.03.2025',
      amount: '15,000 тг',
      status: 'paid',
      stageId: 'PREPARATION',
      stageSemanticId: 'P'
    },
    {
      id: '8',
      accountNumber: '321312321',
      date: '16.03.2025',
      amount: '15,000 тг',
      status: 'paid',
      stageId: 'PREPARATION',
      stageSemanticId: 'P'
    }
  ];

  const handlePay = async (paymentId: string) => {
    setIsProcessing(paymentId);
    
    try {
      const response = await fetch(`/api/bitrix/deals/${paymentId}/pay`, {
        method: 'POST',
      });

      if (response.ok) {
        // Обновляем статус платежа
        setPayments(prev => 
          prev.map(payment => 
            payment.id === paymentId 
              ? { ...payment, status: 'paid' as const }
              : payment
          )
        );
      } else {
        console.error('Ошибка обработки платежа');
      }
    } catch (error) {
      console.error('Ошибка обработки платежа:', error);
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusText = (status: string) => {
    return status === 'paid' ? 'Оплачено' : 'Не оплачено';
  };

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'text-blue-500' : 'text-black';
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
          <h1 className="text-3xl font-bold text-gray-900">Платежи</h1>
        </div>

        {/* Таблица платежей */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                    Номер счета
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                    Дата
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                    Сумма
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                    Действие
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    {/* Номер счета */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.accountNumber}
                    </td>

                    {/* Дата */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.date}
                    </td>

                    {/* Сумма */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.amount}
                    </td>

                    {/* Статус */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getStatusColor(payment.status)}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>

                    {/* Действие */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.status === 'unpaid' ? (
                        <button
                          onClick={() => handlePay(payment.id)}
                          disabled={isProcessing === payment.id}
                          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing === payment.id ? 'Обработка...' : 'Оплатить'}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Информация о платежах */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 text-blue-400">ℹ️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Информация о платежах
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  • Статус "Оплачено" означает, что сделка находится на стадии "В работе" или выше
                </p>
                <p>
                  • Кнопка "Оплатить" переводит сделку в стадию "В работе" в Битрикс24
                </p>
                <p>
                  • Данные синхронизируются с CRM системой Битрикс24
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
