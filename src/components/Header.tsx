'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const navigation = [
  { name: 'Дашборд', href: '/dashboard', iconActive: '/headerimages/dashboard.svg', iconInactive: '/headerimages/dashboard1.svg' },
  { name: 'Профиль', href: '/profile', iconActive: '/headerimages/profile.svg', iconInactive: '/headerimages/profile1.svg' },
  { name: 'Заказы', href: '/orders', iconActive: '/headerimages/orders.svg', iconInactive: '/headerimages/orders1.svg' },
  { name: 'Платежи', href: '/payments', iconActive: '/headerimages/payments.svg', iconInactive: '/headerimages/payments1.svg' },
  { name: 'Трансляция', href: '/', iconActive: '/headerimages/broadcast.svg', iconInactive: '/headerimages/broadcast1.svg' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Логотип */}
          <div className="flex-shrink-0">
           
          </div>

          {/* Навигация */}
          <nav className="header-nav">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Image 
                    src={isActive ? item.iconActive : item.iconInactive} 
                    alt={item.name}
                    width={18}
                    height={18}
                    className="nav-icon"
                  />
                  <span className="nav-text">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
