'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
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
    image: '/images/order1.jpg',
    downloadUrl: '#'
  },
  {
    id: 2,
    title: 'Гарантия на детали для переднего бампера',
    image: '/images/order2.jpg',
    downloadUrl: '#'
  },
  {
    id: 3,
    title: 'Чеки для Физ.лиц',
    image: '/images/order3.jpg',
    downloadUrl: '#'
  },
  {
    id: 4,
    title: 'Счета на оплату для Юр. Лиц',
    image: '/images/order4.jpg',
    downloadUrl: '#'
  },
  {
    id: 5,
    title: 'Документы по ремонту двигателя',
    image: '/images/order5.jpg',
    downloadUrl: '#'
  },
  {
    id: 6,
    title: 'Сертификаты качества',
    image: '/images/order6.jpg',
    downloadUrl: '#'
  }
];

export default function OrdersSlider() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Заголовок */}
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-blue-500 mr-3"></div>
        <h2 className="text-xl font-bold text-gray-900">Заказы</h2>
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
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Изображение документа */}
              <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-sm">Документ</div>
                </div>
              </div>
              
              {/* Название */}
              <h3 className="font-medium text-gray-900 mb-3 text-sm">
                {order.title}
              </h3>
              
              {/* Кнопка скачивания */}
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <span>📥</span>
                <span>Скачать</span>
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
