import { NextRequest, NextResponse } from 'next/server';
import { BitrixAPI } from '@/lib/bitrix';

export async function GET(request: NextRequest) {
  try {
    // Получаем сделки и контакты параллельно
    const [deals, contacts] = await Promise.all([
      BitrixAPI.getDeals(),
      BitrixAPI.getContacts()
    ]);
    
    // Создаем мапу контактов для быстрого поиска
    const contactsMap = new Map();
    contacts.forEach(contact => {
      contactsMap.set(contact.ID, contact);
    });
    
    // Отладочная информация
    console.log('Полученные сделки:', deals.length);
    console.log('Полученные контакты:', contacts.length);
    
    // Преобразуем данные в формат для таблицы платежей
    const payments = deals.map(deal => {
      // Определяем статус оплаты
      const isPaid = deal.STAGE_ID === 'PREPARATION' || 
                     deal.STAGE_ID.includes('работа') || 
                     deal.STAGE_ID.includes('WORK') ||
                     deal.STAGE_SEMANTIC_ID === 'W'; // Выиграна
      
      // Получаем данные контакта
      const contact = deal.CONTACT_ID ? contactsMap.get(deal.CONTACT_ID) : null;
      
      // Формируем имя сотрудника
      let employeeName = 'Неизвестный сотрудник';
      let employeeEmail = 'email@example.com';
      
      if (contact) {
        const firstName = contact.NAME || '';
        const lastName = contact.LAST_NAME || '';
        employeeName = `${firstName} ${lastName}`.trim() || 'Без имени';
        
        if (contact.EMAIL && contact.EMAIL.length > 0) {
          employeeEmail = contact.EMAIL[0].VALUE;
        }
      }
      
      // Генерируем случайный процент выполнения (для демонстрации)
      const completed = Math.floor(Math.random() * 40) + 60; // 60-100%
      
      return {
        id: deal.ID,
        employee: employeeName,
        email: employeeEmail,
        status: isPaid ? 'paid' : 'unpaid',
        completed: completed,
        dealTitle: deal.TITLE,
        amount: parseFloat(deal.OPPORTUNITY),
        date: new Date(deal.DATE_CREATE).toLocaleDateString('ru-RU'),
        stageId: deal.STAGE_ID,
        stageSemanticId: deal.STAGE_SEMANTIC_ID
      };
    });

    // Ограничиваем количество записей для дашборда (последние 5)
    const limitedPayments = payments.slice(0, 5);

    return NextResponse.json(limitedPayments);
  } catch (error) {
    console.error('Ошибка получения платежей:', error);
    return NextResponse.json(
      { error: 'Ошибка получения данных из Битрикс24' },
      { status: 500 }
    );
  }
}
