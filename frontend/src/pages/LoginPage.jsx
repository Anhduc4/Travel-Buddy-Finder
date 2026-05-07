import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [resetForm, setResetForm] = useState({ email: '', newPassword: '' });
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');
    try {
      const res = await authService.login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');
    try {
      await authService.forgotPassword(resetForm);
      setNotice('Đã đổi mật khẩu. Bạn có thể đăng nhập lại.');
      setForm({ email: resetForm.email, password: '' });
      setShowReset(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Đăng nhập bằng ${provider} đang chờ cấu hình OAuth ở backend.`);
  };

  return (
    <div className="grid min-h-[78vh] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden lg:block">
        <p className="eyebrow">chào mừng trở lại</p>
        <h1 className="mt-3 text-6xl font-black leading-[0.95] text-[#17313b]">Nhóm đi chơi tiếp theo đang chờ bạn.</h1>
        <p className="mt-5 max-w-md text-lg font-bold leading-8 text-[#6b7f86]">
          Đăng nhập để tạo chuyến, xin tham gia và trò chuyện với những người cùng gu du lịch.
        </p>
      </section>

      <section className="card mx-auto w-full max-w-md p-8">
        <div className="mb-8">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#ffd166] text-lg font-black text-[#17313b]">TB</div>
          <h1 className="text-3xl font-black text-[#17313b]">{showReset ? 'Quên mật khẩu' : 'Đăng nhập'}</h1>
          <p className="mt-1 font-bold text-[#6b7f86]">{showReset ? 'Nhập email và mật khẩu mới.' : 'Tiếp tục tìm bạn đồng hành.'}</p>
        </div>

        {!showReset && (
          <>
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => handleSocialLogin('Google')} className="btn-secondary py-3 text-sm">Gmail</button>
              <button type="button" onClick={() => handleSocialLogin('Facebook')} className="btn-secondary py-3 text-sm">Facebook</button>
            </div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#d7ecec]" />
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#8aa0a6]">hoặc</span>
              <span className="h-px flex-1 bg-[#d7ecec]" />
            </div>
          </>
        )}

        {error && <div className="mb-4 rounded-2xl bg-[#fff0f0] p-3 text-sm font-bold text-[#d94848]">{error}</div>}
        {notice && <div className="mb-4 rounded-2xl bg-[#eaffef] p-3 text-sm font-bold text-[#23804f]">{notice}</div>}

        {!showReset ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Email" className="input-field" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Mật khẩu" className="input-field" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <div className="text-right">
              <button type="button" onClick={() => setShowReset(true)} className="text-sm font-black text-[#177a78] hover:underline">Quên mật khẩu?</button>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input type="email" placeholder="Email" className="input-field" required value={resetForm.email} onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })} />
            <input type="password" placeholder="Mật khẩu mới" className="input-field" required minLength="6" value={resetForm.newPassword} onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })} />
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Đang đổi...' : 'Đổi mật khẩu'}</button>
            <button type="button" onClick={() => setShowReset(false)} className="btn-secondary w-full">Quay lại đăng nhập</button>
          </form>
        )}

        <p className="mt-6 text-center text-sm font-bold text-[#6b7f86]">
          Chưa có tài khoản? <Link to="/register" className="font-black text-[#177a78] hover:underline">Đăng ký ngay</Link>
        </p>
      </section>
    </div>
  );
}
