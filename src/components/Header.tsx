'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

const navigation = [
  { name: 'Дашборд', href: '/dashboard', iconActive: '/headerimages/dashboard.svg', iconInactive: '/headerimages/dashboard1.svg' },
  { name: 'Профиль', href: '/profile', iconActive: '/headerimages/profile.svg', iconInactive: '/headerimages/profile1.svg' },
  { name: 'Заказы', href: '/orders', iconActive: '/headerimages/orders.svg', iconInactive: '/headerimages/orders1.svg' },
  { name: 'Платежи', href: '/payments', iconActive: '/headerimages/payments.svg', iconInactive: '/headerimages/payments1.svg' },
  { name: 'Трансляция', href: '/broadcast', iconActive: '/headerimages/broadcast.svg', iconInactive: '/headerimages/broadcast1.svg' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Логотип */}
          <div className="flex-shrink-0">
            {/* <Link href="/dashboard" className="logo">
              логотип
            </Link> */}
          </div>

          {/* Десктопная навигация */}
          <nav className="desktop-nav">
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
                    width={20}
                    height={20}
                    className="nav-icon"
                  />
                  <span className="nav-text">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Мобильная кнопка меню */}
          <div className="mobile-menu-button">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="menu-toggle"
            >
              <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Мобильная навигация */}
        {isMobileMenuOpen && (
          <div className="mobile-nav">
            <div className="mobile-nav-content">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Image 
                      src={isActive ? item.iconActive : item.iconInactive} 
                      alt={item.name}
                      width={20}
                      height={20}
                      className="mobile-nav-icon"
                    />
                    <span className="mobile-nav-text">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
