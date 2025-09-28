import { NextRequest, NextResponse } from 'next/server';
import { BitrixAPI } from '@/lib/bitrix';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;
    
    if (!dealId) {
      return NextResponse.json(
        { error: 'ID сделки не указан' },
        { status: 400 }
      );
    }

    // Переводим сделку в стадию "В работе"
    const updatedDeal = await BitrixAPI.moveDealToWork(dealId);
    
    return NextResponse.json({
      message: 'Платеж успешно обработан',
      deal: updatedDeal
    });
  } catch (error) {
    console.error('Ошибка обработки платежа:', error);
    return NextResponse.json(
      { error: 'Ошибка обработки платежа в Битрикс24' },
      { status: 500 }
    );
  }
}
