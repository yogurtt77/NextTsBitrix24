'use client';

import { useState, useEffect, useRef } from 'react';

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


export default function PaymentsBlock() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (status: string) => {
    return status === 'paid' ? 'Оплачено' : 'Не оплачено';
  };

  const handlePeriodSelect = (value: string) => {
    setSelectedPeriod(value);
    setIsDropdownOpen(false);
  };

  const getSelectedPeriodLabel = () => {
    return periodOptions.find(option => option.value === selectedPeriod)?.label || '';
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
        
        <div className="custom-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="dropdown-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="dropdown-text">{getSelectedPeriodLabel()}</span>
            <svg 
              className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none"
            >
              <path 
                d="M1 1.5L6 6.5L11 1.5" 
                stroke="#6B7280" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`dropdown-item ${selectedPeriod === option.value ? 'selected' : ''}`}
                  onClick={() => handlePeriodSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
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
                        <img className="employee-img" src={'/paymentsavatar.svg'} />
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
