import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser } from '../utils/storage';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/80 bg-white/72 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 py-3">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#17313b] text-sm font-black text-white shadow-[0_10px_24px_rgba(23,49,59,0.18)] transition-transform group-hover:-rotate-3">
              TB
            </span>
            <span>
              <span className="block text-xl font-black leading-none text-[#17313b]">Travel Buddy</span>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff6b6b]">tìm bạn đi cùng</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-2">
            <Link to="/" className="rounded-full px-4 py-2 text-sm font-black text-[#526b73] transition-colors hover:bg-[#ecfbfa] hover:text-[#177a78]">Chuyến đi</Link>
            <Link to="/trips/create" className="rounded-full bg-[#ffd166] px-4 py-2 text-sm font-black text-[#17313b] shadow-sm transition-transform hover:-translate-y-0.5">Tạo chuyến</Link>
            {user ? (
              <>
                <Link to={`/profile/${user.userId}`} className="rounded-full px-4 py-2 text-sm font-black text-[#526b73] transition-colors hover:bg-[#fff3dc] hover:text-[#17313b]">
                  {user.name}
                </Link>
                <button onClick={logout} className="rounded-full px-4 py-2 text-sm font-black text-[#ff6b6b] transition-colors hover:bg-[#fff0f0]">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-black text-[#526b73] hover:bg-[#ecfbfa]">Đăng nhập</Link>
                <Link to="/register" className="btn-primary py-2 text-sm">Đăng ký</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
