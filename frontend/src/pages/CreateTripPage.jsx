import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../api/services';

export default function CreateTripPage() {
  const [form, setForm] = useState({ destination: '', description: '', startDate: '', endDate: '', maxPeople: 5, tags: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tripService.create(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo chuyến đi');
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="eyebrow">chuyến đi mới</p>
        <h1 className="mt-2 text-5xl font-black leading-none text-[#17313b]">Lên kèo cho hành trình tiếp theo.</h1>
        <p className="mt-3 max-w-2xl text-lg font-bold text-[#6b7f86]">Viết rõ điểm đến, lịch trình, vibe và số người để bạn đồng hành dễ quyết định.</p>
      </div>

      <div className="card p-6 sm:p-8">
        {error && <div className="mb-4 rounded-2xl bg-[#fff0f0] p-3 text-sm font-bold text-[#d94848]">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-black text-[#526b73]">Điểm đến</label>
            <input type="text" className="input-field" required placeholder="Đà Nẵng, Hà Giang, Bangkok..."
              value={form.destination} onChange={(e) => setForm({...form, destination: e.target.value})} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-black text-[#526b73]">Mô tả chuyến đi</label>
            <textarea className="input-field" rows="5" placeholder="Lịch trình, ngân sách, phong cách, địa điểm nhất định phải đi..."
              value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black text-[#526b73]">Ngày bắt đầu</label>
              <input type="date" className="input-field" required
                value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black text-[#526b73]">Ngày kết thúc</label>
              <input type="date" className="input-field" required
                value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-[0.5fr_1fr]">
            <div>
              <label className="mb-2 block text-sm font-black text-[#526b73]">Số người tối đa</label>
              <input type="number" min="2" max="50" className="input-field"
                value={form.maxPeople} onChange={(e) => setForm({...form, maxPeople: parseInt(e.target.value)})} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black text-[#526b73]">Thẻ mô tả</label>
              <input type="text" className="input-field" placeholder="biển, ăn uống, cắm trại, chụp ảnh"
                value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Đăng chuyến đi</button>
        </form>
      </div>
    </div>
  );
}
