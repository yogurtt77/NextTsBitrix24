import { NextRequest, NextResponse } from 'next/server';
import { BitrixAPI } from '@/lib/bitrix';

export async function GET(request: NextRequest) {
  try {
    const deals = await BitrixAPI.getDeals();
    
    // Отладочная информация
    console.log('Полученные сделки:', deals.map(deal => ({
      id: deal.ID,
      stageId: deal.STAGE_ID,
      stageSemanticId: deal.STAGE_SEMANTIC_ID
    })));
    
    // Преобразуем данные в формат для таблицы платежей
    const payments = deals.map(deal => {
      // Согласно ТЗ: статус "оплачен" только когда сделка в стадии "В работе" и выше
      // Стадия "В работе" имеет STAGE_ID = "EXECUTING" или содержит "работа"
      const isPaid = deal.STAGE_ID === 'EXECUTING' || 
                     deal.STAGE_ID.includes('EXECUTING') ||
                     deal.STAGE_ID.includes('работа') || 
                     deal.STAGE_ID.includes('WORK') ||
                     deal.STAGE_SEMANTIC_ID === 'W'; // Выиграна
      
      return {
        id: deal.ID,
        accountNumber: deal.ID, // Номер счета = ID сделки
        date: new Date(deal.DATE_CREATE).toLocaleDateString('ru-RU'),
        amount: `${parseFloat(deal.OPPORTUNITY).toLocaleString('ru-RU')} тг`,
        status: isPaid ? 'paid' : 'unpaid',
        stageId: deal.STAGE_ID,
        stageSemanticId: deal.STAGE_SEMANTIC_ID
      };
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Ошибка получения сделок:', error);
    return NextResponse.json(
      { error: 'Ошибка получения данных из Битрикс24' },
      { status: 500 }
    );
  }
}
