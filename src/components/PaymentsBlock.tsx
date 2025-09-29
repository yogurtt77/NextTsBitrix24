'use client';

import { useState, useEffect } from 'react';

interface Payment {
  id: string;
  employee: string;
  email: string;
  status: 'paid' | 'unpaid';
  completed: number;
  dealTitle?: string;
  amount?: number;
  date?: string;
  stageId?: string;
  stageSemanticId?: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    employee: 'Имя',
    email: 'Почта@jourrapide.com',
    status: 'unpaid',
    completed: 96
  },
  {
    id: '2',
    employee: 'Gregory Davis A',
    email: 'gregorydavis@dayrep.com',
    status: 'paid',
    completed: 73
  },
  {
    id: '3',
    employee: 'Gregory Davis A',
    email: 'gregorydavis@dayrep.com',
    status: 'paid',
    completed: 73
  }
];

export default function PaymentsBlock() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const periodOptions = [
    { value: 'week', label: 'Все платежи за последнюю неделю' },
    { value: 'month', label: 'Все платежи за последний месяц' },
    { value: 'year', label: 'Все платежи за последний год' }
  ];

  // Загрузка данных из Битрикс
  const loadPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/bitrix/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        throw new Error('Ошибка загрузки данных');
      }
    } catch (error) {
      console.error('Ошибка загрузки платежей:', error);
      setError('Ошибка загрузки данных из Битрикс24');
      // В случае ошибки используем моковые данные
      setPayments(mockPayments);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (status: string) => {
    return status === 'paid' ? 'Оплачено' : 'Не оплачено';
  };

  return (
    <div className="payments-card">
      {/* Заголовок с выпадающим меню */}
      <div className="payments-header">
        <div className="payments-title-section">
          <div className="section-title">
            <h2 className="section-title-text">Платежи</h2>
          </div>
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="period-select"
        >
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Таблица платежей */}
      <div className="payments-table-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-text">Загрузка платежей...</div>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={loadPayments} className="btn-primary">
              Попробовать снова
            </button>
          </div>
        ) : (
          <table className="payments-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header">Employee ↑</th>
                <th className="table-header">Статус</th>
                <th className="table-header">Выполнено</th>
                <th className="table-header">Действие</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment.id} className="table-row">
                  {/* Employee */}
                  <td className="table-cell">
                    <div className="employee-info">
                      <div className="employee-avatar">
                        <span className="employee-icon">👤</span>
                      </div>
                      <div className="employee-details">
                        <div className="employee-name">{payment.employee}</div>
                        <div className="employee-email">{payment.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Статус */}
                  <td className="table-cell">
                    <div className="status-info">
                      <div className={`status-indicator ${payment.status}`}></div>
                      <span className="status-text">{getStatusText(payment.status)}</span>
                    </div>
                  </td>

                  {/* Выполнено */}
                  <td className="table-cell">
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${payment.completed}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">{payment.completed}%</div>
                    </div>
                  </td>

                  {/* Действие */}
                  <td className="table-cell">
                    <button className="action-button">
                      Смотреть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
