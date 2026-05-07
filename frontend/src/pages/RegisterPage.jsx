import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.register(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    alert(`Đăng ký bằng ${provider} đang chờ cấu hình OAuth ở backend.`);
  };

  return (
    <div className="grid min-h-[78vh] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="card mx-auto w-full max-w-lg p-8">
        <div className="mb-8">
          <p className="eyebrow">tham gia cộng đồng</p>
          <h1 className="mt-2 text-3xl font-black text-[#17313b]">Tạo hồ sơ du lịch</h1>
          <p className="mt-1 font-bold text-[#6b7f86]">Một hồ sơ rõ gu giúp bạn tìm đúng người đi cùng.</p>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => handleSocialSignup('Google')} className="btn-secondary py-3 text-sm">
            Đăng ký Gmail
          </button>
          <button type="button" onClick={() => handleSocialSignup('Facebook')} className="btn-secondary py-3 text-sm">
            Đăng ký Facebook
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#d7ecec]" />
          <span className="text-xs font-black uppercase tracking-[0.18em] text-[#8aa0a6]">hoặc</span>
          <span className="h-px flex-1 bg-[#d7ecec]" />
        </div>

        {error && <div className="mb-4 rounded-2xl bg-[#fff0f0] p-3 text-sm font-bold text-[#d94848]">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Họ và tên" className="input-field" required
            value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          <input type="email" placeholder="Email" className="input-field" required
            value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="Mật khẩu" className="input-field" required
            value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          <textarea placeholder="Bạn thích kiểu du lịch nào? Biển, núi, food tour, chụp ảnh..." className="input-field" rows="4"
            value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-bold text-[#6b7f86]">
          Đã có tài khoản? <Link to="/login" className="font-black text-[#177a78] hover:underline">Đăng nhập</Link>
        </p>
      </section>

      <section className="hidden lg:block">
        <div className="soft-panel relative overflow-hidden p-8">
          <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-[#3ddbd9]/45" />
          <div className="relative">
            <p className="eyebrow">du lịch đúng gu</p>
            <h2 className="mt-3 text-5xl font-black leading-none text-[#17313b]">Ít ngại ngùng hơn. Nhiều kỷ niệm hơn.</h2>
            <div className="mt-8 grid gap-3">
              {['Tìm bạn theo điểm đến', 'Trò chuyện trước chuyến đi', 'Đánh giá sau mỗi hành trình'].map(item => (
                <div key={item} className="rounded-2xl bg-white/85 p-4 font-black text-[#17313b] shadow-sm">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
