import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tripService, joinRequestService } from '../api/services';
import { getStoredUser } from '../utils/storage';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [requests, setRequests] = useState([]);
  const user = getStoredUser();
  const isOwner = trip?.creatorId === user?.userId;

  useEffect(() => { loadTrip(); }, [id]);

  const loadTrip = async () => {
    try {
      const res = await tripService.getById(id);
      setTrip(res.data);
      if (user?.userId === res.data.creatorId) {
        const reqRes = await joinRequestService.getByTrip(id);
        setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      }
    } catch (err) { console.error(err); }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await joinRequestService.create({ tripId: parseInt(id) });
      alert('Đã gửi yêu cầu tham gia!');
      loadTrip();
    } catch (err) { alert(err.response?.data?.message || 'Không thể gửi yêu cầu'); }
  };

  const handleApprove = async (reqId) => {
    try { await joinRequestService.approve(reqId); loadTrip(); } catch (err) { alert('Không thể duyệt yêu cầu'); }
  };
  const handleReject = async (reqId) => {
    try { await joinRequestService.reject(reqId); loadTrip(); } catch (err) { alert('Không thể từ chối yêu cầu'); }
  };

  if (!trip) return <div className="soft-panel py-20 text-center text-lg font-black text-[#8aa0a6]">Đang tải...</div>;

  const tags = trip.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="card grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[22rem] bg-gradient-to-br from-[#3ddbd9] via-[#80bfff] to-[#ffd166] p-8">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/35" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/85">chi tiết chuyến đi</p>
            <h1 className="mt-3 text-5xl font-black leading-none text-white drop-shadow-sm">{trip.destination}</h1>
          </div>
        </div>
        <div className="p-7 sm:p-8">
          <p className="text-lg font-bold leading-8 text-[#6b7f86]">{trip.description || 'Chuyến đi này chưa có mô tả.'}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f4fbfb] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8aa0a6]">bắt đầu</p>
              <p className="mt-1 font-black text-[#17313b]">{trip.startDate}</p>
            </div>
            <div className="rounded-2xl bg-[#fff8e8] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8aa0a6]">kết thúc</p>
              <p className="mt-1 font-black text-[#17313b]">{trip.endDate}</p>
            </div>
            <div className="rounded-2xl bg-[#f3fff5] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8aa0a6]">nhóm</p>
              <p className="mt-1 font-black text-[#17313b]">Tối đa {trip.maxPeople}</p>
            </div>
          </div>
          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag, i) => <span key={i} className="pop-chip">{tag}</span>)}
            </div>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            {!isOwner && <button onClick={handleJoin} className="btn-primary">Xin tham gia</button>}
            {user ? (
              <Link to={`/chat/${trip.id}`} className="btn-secondary">Mở trò chuyện</Link>
            ) : (
              <Link to="/login" className="btn-secondary">Đăng nhập để trò chuyện</Link>
            )}
          </div>
        </div>
      </section>

      {isOwner && requests.length > 0 && (
        <section className="soft-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#17313b]">Yêu cầu tham gia</h2>
            <span className="pop-chip">{requests.length} yêu cầu</span>
          </div>
          <div className="grid gap-3">
            {requests.map(req => (
              <div key={req.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/85 p-4 shadow-sm">
                <div>
                  <p className="font-black text-[#17313b]">Người dùng #{req.userId}</p>
                  <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-black ${req.status === 'PENDING' ? 'bg-[#fff8e8] text-[#a06900]' : req.status === 'APPROVED' ? 'bg-[#eaffef] text-[#23804f]' : 'bg-[#fff0f0] text-[#c64848]'}`}>{req.status}</span>
                </div>
                {req.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(req.id)} className="btn-success text-sm">Duyệt</button>
                    <button onClick={() => handleReject(req.id)} className="btn-danger text-sm">Từ chối</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
