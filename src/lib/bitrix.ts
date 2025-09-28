// Замените на ваш URL вебхука из Битрикс24
const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL || 'https://your-domain.bitrix24.ru/rest/1/webhook-code/';

export interface BitrixContact {
  ID: string;
  NAME: string;
  LAST_NAME?: string;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  PHONE?: Array<{ VALUE: string; VALUE_TYPE: string }>;
}

export interface BitrixDeal {
  ID: string;
  TITLE: string;
  DATE_CREATE: string;
  OPPORTUNITY: string;
  STAGE_ID: string;
  STAGE_SEMANTIC_ID: string;
}

export interface CreateContactData {
  NAME: string;
  LAST_NAME?: string;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  PHONE?: Array<{ VALUE: string; VALUE_TYPE: string }>;
}

export class BitrixAPI {
  private static async makeRequest(method: string, params: any = {}) {
    try {
      const response = await fetch(`${BITRIX_WEBHOOK_URL}${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error_description || 'Ошибка API Битрикс24');
      }

      return data;
    } catch (error) {
      console.error('Ошибка запроса к Битрикс24:', error);
      throw error;
    }
  }

  // Создание контакта
  static async createContact(contactData: CreateContactData): Promise<BitrixContact> {
    const result = await this.makeRequest('crm.contact.add', {
      fields: contactData
    });
    
    return result.result;
  }

  // Получение контакта по ID
  static async getContact(contactId: string): Promise<BitrixContact> {
    const result = await this.makeRequest('crm.contact.get', {
      id: contactId
    });
    
    return result.result;
  }

  // Получение всех сделок
  static async getDeals(): Promise<BitrixDeal[]> {
    const result = await this.makeRequest('crm.deal.list', {
      select: ['ID', 'TITLE', 'DATE_CREATE', 'OPPORTUNITY', 'STAGE_ID', 'STAGE_SEMANTIC_ID'],
      filter: {},
      order: { DATE_CREATE: 'DESC' }
    });
    
    return result.result;
  }

  // Обновление сделки
  static async updateDeal(dealId: string, fields: any): Promise<BitrixDeal> {
    const result = await this.makeRequest('crm.deal.update', {
      id: dealId,
      fields: fields
    });
    
    return result.result;
  }

  // Получение стадий сделок
  static async getDealStages(): Promise<any[]> {
    const result = await this.makeRequest('crm.deal.fields');
    return result.result.STAGE_ID?.items || [];
  }

  // Перевод сделки в стадию "В работе"
  static async moveDealToWork(dealId: string): Promise<BitrixDeal> {
    // Получаем стадии сделок
    const stages = await this.getDealStages();
    
    console.log('Доступные стадии:', stages);
    
    // Находим стадию "В работе" (обычно это "PREPARATION" или содержит "работа")
    const workStage = stages.find(stage => 
      stage.VALUE === 'PREPARATION' || 
      stage.VALUE.includes('работа') ||
      stage.VALUE.includes('WORK') ||
      stage.VALUE.includes('В работе')
    );
    
    if (!workStage) {
      // Если не найдена стадия "В работе", используем PREPARATION как fallback
      console.log('Стадия "В работе" не найдена, используем PREPARATION');
      return this.updateDeal(dealId, {
        STAGE_ID: 'PREPARATION'
      });
    }
    
    console.log('Переводим сделку в стадию:', workStage.VALUE);
    
    return this.updateDeal(dealId, {
      STAGE_ID: workStage.VALUE
    });
  }
}
