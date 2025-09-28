import { NextRequest, NextResponse } from 'next/server';
import { UserDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json();
    
    // Валидация
    if (!login || !password) {
      return NextResponse.json(
        { error: 'Логин и пароль обязательны' },
        { status: 400 }
      );
    }
    
    // Поиск пользователя по логину или email
    let user = UserDatabase.getUserByLogin(login);
    if (!user) {
      user = UserDatabase.getUserByEmail(login);
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      );
    }
    
    // Проверка пароля
    if (!UserDatabase.verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      );
    }
    
    // Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Успешная авторизация',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
