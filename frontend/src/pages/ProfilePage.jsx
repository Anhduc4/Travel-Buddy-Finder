import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { reviewService, userService } from '../api/services';
import { getStoredUser } from '../utils/storage';

export default function ProfilePage() {
  const { id } = useParams();
  const currentUser = getStoredUser();
  const isMe = Number(id) === currentUser?.userId;
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', gender: '', age: '', interests: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
    loadReviews();
  }, [id]);

  const loadProfile = async () => {
    try {
      const res = await userService.getById(id);
      setProfile(res.data);
      setForm({
        name: res.data.name || '',
        bio: res.data.bio || '',
        gender: res.data.gender || '',
        age: res.data.age || '',
        interests: res.data.interests || '',
      });
    } catch (err) { console.error(err); }
  };

  const loadReviews = async () => {
    try {
      const [revRes, avgRes] = await Promise.all([
        reviewService.getByUser(id),
        reviewService.getAverage(id)
      ]);
      setReviews(revRes.data);
      setAvgRating(avgRes.data.averageRating || 0);
    } catch (err) { console.error(err); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : null };
      const res = await userService.update(id, payload);
      setProfile(res.data);
      setIsEditing(false);
      setMessage('Đã cập nhật hồ sơ.');
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, name: res.data.name }));
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Không thể cập nhật hồ sơ.');
    }
  };

  if (!profile) return <div className="soft-panel py-20 text-center text-lg font-black text-[#8aa0a6]">Đang tải...</div>;

  const interests = profile.interests?.split(',').map(item => item.trim()).filter(Boolean) || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-[2rem] bg-gradient-to-br from-[#ff6b6b] to-[#ffd166] text-5xl font-black text-white shadow-xl">
            {profile.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow">hồ sơ du lịch</p>
              {isMe && !isEditing && <button onClick={() => setIsEditing(true)} className="btn-secondary py-2 text-sm">Sửa hồ sơ</button>}
            </div>
            {!isEditing ? (
              <>
                <h1 className="mt-2 text-4xl font-black text-[#17313b]">{profile.name}</h1>
                <p className="mt-1 font-bold text-[#6b7f86]">{profile.email}</p>
                {profile.bio && <p className="mt-4 max-w-2xl text-lg font-bold leading-8 text-[#526b73]">{profile.bio}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.gender && <span className="pop-chip">Giới tính: {profile.gender}</span>}
                  {profile.age && <span className="pop-chip">Tuổi: {profile.age}</span>}
                  {interests.map((item) => <span key={item} className="pop-chip">{item}</span>)}
                </div>
              </>
            ) : (
              <form onSubmit={saveProfile} className="mt-4 grid gap-3">
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên" required />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <input className="input-field" type="number" min="1" max="120" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Tuổi" />
                </div>
                <input className="input-field" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="Sở thích: biển, ăn uống, chụp ảnh" />
                <textarea className="input-field" rows="3" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Giới thiệu ngắn" />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">Lưu hồ sơ</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Hủy</button>
                </div>
              </form>
            )}
            {message && <p className="mt-3 text-sm font-black text-[#177a78]">{message}</p>}
          </div>
          <div className="rounded-[1.5rem] bg-[#fff8e8] p-5 text-center">
            <p className="text-4xl font-black text-[#e8a400]">{Number(avgRating).toFixed(1)}</p>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8aa0a6]">{reviews.length} đánh giá</p>
          </div>
        </div>
      </section>

      <section className="soft-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#17313b]">Đánh giá</h2>
          <span className="pop-chip">uy tín cộng đồng</span>
        </div>
        {reviews.length > 0 ? (
          <div className="grid gap-3">
            {reviews.map(rev => (
              <div key={rev.id} className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-black text-[#e8a400]">{`${rev.rating}/5`}</span>
                  <span className="text-sm font-bold text-[#8aa0a6]">bởi người dùng #{rev.reviewerId}</span>
                </div>
                <p className="mt-2 font-bold leading-6 text-[#526b73]">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white/75 p-5 font-bold text-[#6b7f86]">Chưa có đánh giá. Những kỷ niệm đầu tiên vẫn đang chờ được viết.</p>
        )}
      </section>
    </div>
  );
}
