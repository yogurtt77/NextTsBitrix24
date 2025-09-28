import { NextRequest, NextResponse } from 'next/server';
import { UserDatabase } from '@/lib/database';
import { BitrixAPI } from '@/lib/bitrix';

export async function POST(request: NextRequest) {
  try {
    const { login, email, password, name, phone, address } = await request.json();
    
    // Валидация
    if (!login || !email || !password) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }
    
    // Проверка длины пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      );
    }
    
    // Проверка наличия заглавной буквы и цифры
    if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { error: 'Пароль должен содержать хотя бы одну заглавную букву и цифру' },
        { status: 400 }
      );
    }
    
    // Проверка существования пользователя
    const { loginExists, emailExists } = UserDatabase.userExists(login, email);
    
    if (loginExists) {
      return NextResponse.json(
        { error: 'Это имя пользователя уже занято!' },
        { status: 400 }
      );
    }
    
    if (emailExists) {
      return NextResponse.json(
        { error: 'Это электронное письмо уже занято!' },
        { status: 400 }
      );
    }
    
    // Создание пользователя в БД
    const user = UserDatabase.createUser({
      login,
      email,
      password,
      name,
      phone,
      address
    });
    
    // Создание контакта в Битрикс24
    try {
      const contactData = {
        NAME: name || login,
        EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
        PHONE: phone ? [{ VALUE: phone, VALUE_TYPE: 'WORK' }] : undefined
      };
      
      const bitrixContact = await BitrixAPI.createContact(contactData);
      console.log('Контакт создан в Битрикс24:', bitrixContact.ID);
    } catch (bitrixError) {
      console.error('Ошибка создания контакта в Битрикс24:', bitrixError);
      // Не прерываем регистрацию, если не удалось создать контакт в Битрикс24
    }
    
    // Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Пользователь успешно зарегистрирован',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
