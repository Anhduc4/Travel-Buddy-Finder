import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { reviewService } from '../api/services';

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    loadProfile();
    loadReviews();
  }, [id]);

  const loadProfile = async () => {
    try {
      const res = await api.get(`/api/users/${id}`);
      setProfile(res.data);
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

  if (!profile) return <div className="soft-panel py-20 text-center text-lg font-black text-[#8aa0a6]">Đang tải...</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-[2rem] bg-gradient-to-br from-[#ff6b6b] to-[#ffd166] text-5xl font-black text-white shadow-xl">
            {profile.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="eyebrow">hồ sơ du lịch</p>
            <h1 className="mt-2 text-4xl font-black text-[#17313b]">{profile.name}</h1>
            <p className="mt-1 font-bold text-[#6b7f86]">{profile.email}</p>
            {profile.bio && <p className="mt-4 max-w-2xl text-lg font-bold leading-8 text-[#526b73]">{profile.bio}</p>}
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
