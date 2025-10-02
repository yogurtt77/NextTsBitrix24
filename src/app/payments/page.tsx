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
      <div className="loading-page">
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="payments-page">
      <Header />
      
      <main className="payments-main">
        {/* Заголовок */}
        <div className="payments-header" style={{ padding: '32px' }}>
          <h1 className="payments-title">Платежи</h1>
        </div>

        {/* Таблица платежей */}
        <div className="payments-table-card">
          <div className="payments-table-wrapper">
            <table className="payments-table">
              <thead className="payments-table-header">
                <tr>
                  <th className="payments-table-header-cell">
                    Номер счета
                  </th>
                  <th className="payments-table-header-cell">
                    Дата
                  </th>
                  <th className="payments-table-header-cell">
                    Сумма
                  </th>
                  <th className="payments-table-header-cell">
                    Статус
                  </th>
                  <th className="payments-table-header-cell">
                    Действие
                  </th>
                </tr>
              </thead>
              <tbody className="payments-table-body">
                {payments.map((payment) => (
                  <tr key={payment.id} className="payments-table-row">
                    {/* Номер счета */}
                    <td className="payments-table-cell">
                      {payment.accountNumber}
                    </td>

                    {/* Дата */}
                    <td className="payments-table-cell">
                      {payment.date}
                    </td>

                    {/* Сумма */}
                    <td className="payments-table-cell">
                      {payment.amount}
                    </td>

                    {/* Статус */}
                    <td className="payments-table-cell">
                      <span className={`payments-status-text ${payment.status}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>

                    {/* Действие */}
                    <td className="payments-table-cell">
                      {payment.status === 'unpaid' ? (
                        <button
                          onClick={() => handlePay(payment.id)}
                          disabled={isProcessing === payment.id}
                          className="payments-pay-button"
                        >
                          {isProcessing === payment.id ? 'Обработка...' : 'Оплатить'}
                        </button>
                      ) : (
                        <span className="payments-no-action">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
