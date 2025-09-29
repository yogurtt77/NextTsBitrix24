'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface OrderCard {
  id: number;
  title: string;
  image: string;
  downloadUrl: string;
}

const mockOrders: OrderCard[] = [
  {
    id: 1,
    title: 'Счета на оплату для Юр. Лиц',
    image: '/swiperimages/1.png',
    downloadUrl: '#'
  },
  {
    id: 2,
    title: 'Гарантия на детали для переднего бампера',
    image: '/swiperimages/2.png',
    downloadUrl: '#'
  },
  {
    id: 3,
    title: 'Чеки для Физ.лиц',
    image: '/swiperimages/3.png',
    downloadUrl: '#'
  },
  {
    id: 4,
    title: 'Счета на оплату для Юр. Лиц',
    image: '/swiperimages/4.png',
    downloadUrl: '#'
  },
  {
    id: 5,
    title: 'Документы по ремонту двигателя',
    image: '/swiperimages/5.png',
    downloadUrl: '#'
  },
  {
    id: 6,
    title: 'Сертификаты качества',
    image: '/swiperimages/6.png',
    downloadUrl: '#'
  }
];

export default function OrdersSlider() {
  return (
    <div className="orders-card">
      {/* Заголовок */}
      <div className="section-title">
        <h2 className="section-title-text">Заказы</h2>
      </div>

      {/* Слайдер */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 15
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20
          }
        }}
        className="orders-swiper"
      >
        {mockOrders.map((order) => (
          <SwiperSlide key={order.id}>
            <div className="order-item">
              {/* Изображение документа */}
              <div className="order-image">
                <Image
                  src={order.image}
                  alt={order.title}
                  width={200}
                  height={150}
                  className="order-image-content"
                />
              </div>
              
              {/* Название */}
              <h3 className="order-title">
                {order.title}
              </h3>
              
              {/* Кнопка скачивания */}
              <button className="download-button">
                <span className="download-icon">📥</span>
                <span className="download-text">Скачать</span>
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
