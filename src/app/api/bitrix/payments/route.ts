import { NextRequest, NextResponse } from 'next/server';
import { BitrixAPI } from '@/lib/bitrix';

// Функция для расчета процента выполнения на основе стадии сделки
// Согласно документации Битрикс24 и SORT значениям стадий
function calculateCompletionPercentage(stageId: string): number {
  const stage = stageId.toLowerCase();
  
  // 1. Новая сделка (SORT: 10) - 0%
  if (stage.includes('новая') || stage.includes('new') || stage === 'new' || 
      stage === 'c10:new' || stage === 'c1:new') {
    return 0;
  }
  
  // 2. Подготовка документов (SORT: 20) - 20%
  if (stage.includes('подготовка') || stage.includes('документ') || 
      stage.includes('preparation') || stage === 'c10:preparation' || 
      stage === 'c1:preparation') {
    return 20;
  }
  
  // 3. Согласование (SORT: 30) - 40%
  if (stage.includes('согласован') || stage.includes('предоплат') || 
      stage.includes('prepayment_invoice') || stage === 'c10:prepayment_invoice') {
    return 40;
  }
  
  // 4. В работе (SORT: 40) - 60%
  if (stage.includes('работа') || stage.includes('work') || stage.includes('в работе') || 
      stage.includes('executing') || stage === 'c10:executing' || stage === 'c1:work') {
    return 60;
  }
  
  // 5. Финальный счёт (SORT: 50) - 80%
  if (stage.includes('финальн') || stage.includes('final_invoice') || 
      stage === 'c10:final_invoice') {
    return 80;
  }
  
  // 6. Сделка успешна (SORT: 60) - 100%
  if (stage.includes('успешн') || stage.includes('завершен') || 
      stage.includes('won') || stage === 'c10:won' || stage === 'c1:won') {
    return 100;
  }
  
  // Дополнительные проверки для стандартных ID стадий Битрикс
  if (stage === 'c1:1') return 0;   // Новая сделка
  if (stage === 'c1:2') return 20;  // Подготовка документов  
  if (stage === 'c1:3') return 40;  // Согласование
  if (stage === 'c1:4') return 60;  // В работе (EXECUTING)
  if (stage === 'c1:5') return 80;  // Финальный счет
  if (stage === 'c1:6') return 100; // Сделка успешна
  
  // По умолчанию возвращаем 0% для неизвестных стадий
  console.warn(`Неизвестная стадия сделки: "${stageId}"`);
  return 0;
}

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
      // Определяем статус оплаты - только когда сделка в стадии "В работе" и выше
      const isPaid = deal.STAGE_ID === 'EXECUTING' || 
                     deal.STAGE_ID.includes('EXECUTING') ||
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
      
      // Рассчитываем процент выполнения на основе стадии сделки
      const completed = calculateCompletionPercentage(deal.STAGE_ID);
      
      // Отладочная информация для проверки стадий
      console.log(`Сделка ${deal.ID}: стадия "${deal.STAGE_ID}" -> ${completed}%`);
      
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
