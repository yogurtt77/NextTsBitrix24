import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Создаем таблицу пользователей
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface User {
  id: number;
  login: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface CreateUserData {
  login: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  address?: string;
}

export class UserDatabase {
  // Создание пользователя
  static createUser(userData: CreateUserData): User {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (login, email, password, name, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userData.login,
      userData.email,
      hashedPassword,
      userData.name || null,
      userData.phone || null,
      userData.address || null
    );
    
    return this.getUserById(result.lastInsertRowid as number)!;
  }
  
  // Получение пользователя по ID
  static getUserById(id: number): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  }
  
  // Получение пользователя по логину
  static getUserByLogin(login: string): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE login = ?');
    return stmt.get(login) as User | null;
  }
  
  // Получение пользователя по email
  static getUserByEmail(email: string): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | null;
  }
  
  // Проверка существования пользователя
  static userExists(login: string, email: string): { loginExists: boolean; emailExists: boolean } {
    const loginStmt = db.prepare('SELECT 1 FROM users WHERE login = ?');
    const emailStmt = db.prepare('SELECT 1 FROM users WHERE email = ?');
    
    return {
      loginExists: !!loginStmt.get(login),
      emailExists: !!emailStmt.get(email)
    };
  }
  
  // Проверка пароля
  static verifyPassword(plainPassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
  
  // Обновление данных пользователя
  static updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at'>>): User | null {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    if (fields.length === 0) return this.getUserById(id);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => (updates as any)[field]);
    
    const stmt = db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);
    
    return this.getUserById(id);
  }
}

export default db;
