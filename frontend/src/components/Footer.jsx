import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-white/80 bg-white/72 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#17313b] text-sm font-black text-white">TB</span>
            <div>
              <p className="text-xl font-black leading-none text-[#17313b]">Travel Buddy</p>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff6b6b]">đi cùng nhau vui hơn</p>
            </div>
          </div>
          <p className="mt-4 max-w-md font-bold leading-7 text-[#6b7f86]">
            Nền tảng tìm bạn đồng hành cho những chuyến đi tự phát, nhẹ nhàng và đúng gu.
          </p>
        </div>
        <div>
          <p className="mb-3 font-black text-[#17313b]">Khám phá</p>
          <div className="grid gap-2 text-sm font-bold text-[#6b7f86]">
            <Link to="/" className="hover:text-[#177a78]">Danh sách chuyến đi</Link>
            <Link to="/trips/create" className="hover:text-[#177a78]">Tạo chuyến đi</Link>
            <Link to="/login" className="hover:text-[#177a78]">Đăng nhập</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 font-black text-[#17313b]">Liên hệ</p>
          <div className="grid gap-2 text-sm font-bold text-[#6b7f86]">
            <span>travelbuddy@example.com</span>
            <span>Hồ Chí Minh, Việt Nam</span>
            <span>Mon - Sun, 9:00 - 21:00</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
