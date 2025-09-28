'use client';

import { useState, useEffect } from 'react';

interface Payment {
  id: string;
  employee: string;
  email: string;
  status: 'paid' | 'unpaid';
  completed: number;
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
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const periodOptions = [
    { value: 'week', label: 'Все платежи за последнюю неделю' },
    { value: 'month', label: 'Все платежи за последний месяц' },
    { value: 'year', label: 'Все платежи за последний год' }
  ];

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (status: string) => {
    return status === 'paid' ? 'Оплачено' : 'Не оплачено';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Заголовок с выпадающим меню */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-1 h-8 bg-blue-500 mr-3"></div>
          <h2 className="text-xl font-bold text-gray-900">Платежи</h2>
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Таблица платежей */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-blue-600 font-medium">Employee ↑</th>
              <th className="text-left py-3 px-2 text-blue-600 font-medium">Статус</th>
              <th className="text-left py-3 px-2 text-blue-600 font-medium">Выполнено</th>
              <th className="text-left py-3 px-2 text-blue-600 font-medium">Действие</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment.id} className="border-b border-gray-100">
                {/* Employee */}
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm text-gray-600">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{payment.employee}</div>
                      <div className="text-sm text-gray-500">{payment.email}</div>
                    </div>
                  </div>
                </td>

                {/* Статус */}
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(payment.status)}`}></div>
                    <span className="text-sm">{getStatusText(payment.status)}</span>
                  </div>
                </td>

                {/* Выполнено */}
                <td className="py-4 px-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${payment.completed}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{payment.completed}%</div>
                </td>

                {/* Действие */}
                <td className="py-4 px-2">
                  <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                    Смотреть
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
