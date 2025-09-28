import { NextRequest, NextResponse } from 'next/server';
import { UserDatabase } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      );
    }
    
    const user = UserDatabase.getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    // Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      );
    }
    
    const updates = await request.json();
    
    // Удаляем поля, которые нельзя обновлять
    delete updates.id;
    delete updates.created_at;
    delete updates.password;
    
    const updatedUser = UserDatabase.updateUser(userId, updates);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    // Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    return NextResponse.json({
      message: 'Данные пользователя обновлены',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
