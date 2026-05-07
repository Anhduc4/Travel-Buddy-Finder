import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tripService, joinRequestService, userService, reviewService } from '../api/services';
import { getStoredUser } from '../utils/storage';

const fallbackImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [destinationReviews, setDestinationReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [memberReviewForm, setMemberReviewForm] = useState({ reviewedUserId: '', rating: 5, comment: '' });
  const [destinationReviewForm, setDestinationReviewForm] = useState({ rating: 5, comment: '' });
  const [notice, setNotice] = useState('');
  const user = getStoredUser();
  const isOwner = trip?.creatorId === user?.userId;
  const myRequest = requests.find(req => req.userId === user?.userId);
  const canChat = Boolean(user && (isOwner || myRequest?.status === 'APPROVED'));
  const isPastEndDate = trip?.endDate ? new Date(trip.endDate) < new Date(new Date().toDateString()) : false;
  const isCompleted = Boolean(trip?.completed || isPastEndDate);

  useEffect(() => { loadTrip(); }, [id]);

  const loadTrip = async () => {
    try {
      const res = await tripService.getById(id);
      setTrip(res.data);
      loadDestinationReviews(res.data.destination);

      let allReqs = [];
      if (user) {
        try {
          const reqRes = await joinRequestService.getByTrip(id);
          allReqs = Array.isArray(reqRes.data) ? reqRes.data : [];
          setRequests(allReqs);
        } catch {
          setRequests([]);
        }
      }
      await loadMembers(res.data.creatorId, allReqs.filter(r => r.status === 'APPROVED'));
    } catch (err) { console.error(err); }
  };

  const loadDestinationReviews = async (destination) => {
    try {
      const res = await reviewService.getByDestination(destination);
      setDestinationReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  const loadMembers = async (creatorId, approvedRequests) => {
    const entries = [{ userId: creatorId, role: 'Người tạo chuyến' }, ...approvedRequests.map(req => ({ userId: req.userId, role: 'Thành viên', joinRequestId: req.id }))];
    const uniqueEntries = entries.filter((entry, index, arr) => arr.findIndex(item => item.userId === entry.userId) === index);
    if (!user) {
      setMembers(uniqueEntries.map(entry => ({ id: entry.userId, name: entry.role, ...entry })));
      return;
    }
    const loadedMembers = await Promise.all(uniqueEntries.map(async (entry) => {
      try {
        const userRes = await userService.getById(entry.userId);
        return { ...userRes.data, ...entry };
      } catch {
        return { id: entry.userId, userId: entry.userId, name: `Người dùng #${entry.userId}`, email: '', ...entry };
      }
    }));
    setMembers(loadedMembers);
    const firstReviewTarget = loadedMembers.find(member => member.id !== user?.userId);
    setMemberReviewForm(prev => ({ ...prev, reviewedUserId: prev.reviewedUserId || firstReviewTarget?.id || '' }));
  };

  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await joinRequestService.create({ tripId: parseInt(id) });
      setNotice('Đã gửi yêu cầu tham gia.');
      loadTrip();
    } catch (err) {
      setNotice(err.response?.data?.message || 'Không thể gửi yêu cầu.');
    }
  };

  const handleApprove = async (reqId) => {
    try { await joinRequestService.approve(reqId); loadTrip(); } catch { setNotice('Không thể duyệt yêu cầu.'); }
  };

  const handleReject = async (reqId) => {
    try { await joinRequestService.reject(reqId); loadTrip(); } catch { setNotice('Không thể từ chối yêu cầu.'); }
  };

  const handleRemove = async (reqId) => {
    if (!window.confirm('Loại thành viên này khỏi chuyến đi?')) return;
    try {
      await joinRequestService.remove(reqId);
      setNotice('Đã loại thành viên khỏi nhóm.');
      loadTrip();
    } catch (err) {
      setNotice(err.response?.data?.message || 'Không thể loại thành viên.');
    }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm('Xóa chuyến đi này? Hành động này không thể hoàn tác.')) return;
    try {
      await tripService.delete(id);
      navigate('/');
    } catch (err) {
      setNotice(err.response?.data?.message || 'Không thể xóa chuyến đi.');
    }
  };

  const handleCompleteTrip = async () => {
    try {
      const res = await tripService.complete(id);
      setTrip(res.data);
      setNotice('Đã đánh dấu hoàn thành chuyến đi.');
    } catch (err) {
      setNotice(err.response?.data?.message || 'Không thể hoàn thành chuyến đi.');
    }
  };

  const startEditing = () => {
    setEditForm({
      destination: trip.destination || '',
      description: trip.description || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      maxPeople: trip.maxPeople || 5,
      tags: trip.tags || '',
      imageUrl: trip.imageUrl || '',
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await tripService.update(id, editForm);
      setTrip(res.data);
      setIsEditing(false);
      setNotice('Đã cập nhật chuyến đi.');
      loadDestinationReviews(res.data.destination);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Không thể cập nhật chuyến đi.');
    } finally {
      setSaving(false);
    }
  };

  const submitMemberReview = async (e) => {
    e.preventDefault();
    try {
      await reviewService.create({
        tripId: Number(id),
        reviewedUserId: Number(memberReviewForm.reviewedUserId),
        rating: Number(memberReviewForm.rating),
        comment: memberReviewForm.comment,
      });
      setMemberReviewForm({ ...memberReviewForm, comment: '', rating: 5 });
      setNotice('Đã gửi đánh giá thành viên.');
    } catch (err) {
      setNotice(err.response?.data?.message || 'Không thể gửi đánh giá thành viên.');
    }
  };

  const submitDestinationReview = async (e) => {
    e.preventDefault();
    try {
      await reviewService.createDestination({
        tripId: Number(id),
        rating: Number(destinationReviewForm.rating),
        comment: destinationReviewForm.comment,
      });
      setDestinationReviewForm({ rating: 5, comment: '' });
      setNotice('Đã gửi review địa điểm.');
      loadDestinationReviews(trip.destination);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Không thể gửi review địa điểm.');
    }
  };

  if (!trip) return <div className="soft-panel py-20 text-center text-lg font-black text-[#8aa0a6]">Đang tải...</div>;

  const tags = trip.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
  const reviewTargets = members.filter(member => member.id !== user?.userId);
  const destinationAvg = destinationReviews.length
    ? destinationReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / destinationReviews.length
    : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {notice && <div className="soft-panel p-4 font-black text-[#177a78]">{notice}</div>}

      <section className="card grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[22rem] overflow-hidden bg-gradient-to-br from-[#3ddbd9] via-[#80bfff] to-[#ffd166] p-8">
          <img src={trip.imageUrl || fallbackImage} alt={trip.destination} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17313b]/76 via-[#17313b]/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/85">chi tiết chuyến đi</p>
            <h1 className="mt-3 text-5xl font-black leading-none text-white drop-shadow-sm">{trip.destination}</h1>
          </div>
          {trip.completed && <span className="absolute left-8 top-8 rounded-full bg-[#eaffef] px-4 py-2 text-sm font-black text-[#23804f]">Đã hoàn thành</span>}
        </div>

        {!isEditing ? (
          <div className="p-7 sm:p-8">
            <p className="text-lg font-bold leading-8 text-[#6b7f86]">{trip.description || 'Chuyến đi này chưa có mô tả.'}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <InfoBox label="Bắt đầu" value={trip.startDate} tone="bg-[#f4fbfb]" />
              <InfoBox label="Kết thúc" value={trip.endDate} tone="bg-[#fff8e8]" />
              <InfoBox label="Nhóm" value={`Tối đa ${trip.maxPeople}`} tone="bg-[#f3fff5]" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="pop-chip">{isCompleted ? 'Có thể đánh giá' : 'Đang diễn ra/chưa kết thúc'}</span>
              <span className="pop-chip">{destinationReviews.length} review địa điểm</span>
              {tags.map((tag) => <span key={tag} className="pop-chip">{tag}</span>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {isOwner && <button onClick={startEditing} className="btn-secondary">Chỉnh sửa</button>}
              {isOwner && !trip.completed && <button onClick={handleCompleteTrip} className="btn-success px-5 py-3">Hoàn thành chuyến</button>}
              {isOwner && <button onClick={handleDeleteTrip} className="btn-danger px-5 py-3">Xóa chuyến</button>}
              {!isOwner && (!myRequest || myRequest.status === 'REJECTED' || myRequest.status === 'REMOVED') && <button onClick={handleJoin} className="btn-primary">Xin tham gia</button>}
              {!isOwner && myRequest?.status === 'PENDING' && <span className="btn-secondary pointer-events-none">Đang chờ duyệt</span>}
              {!isOwner && myRequest?.status === 'APPROVED' && <span className="btn-secondary pointer-events-none">Đã tham gia</span>}
              {canChat ? (
                <Link to={`/chat/${trip.id}`} className="btn-secondary">Mở trò chuyện</Link>
              ) : (
                <span className="btn-secondary pointer-events-none opacity-70">{user ? 'Cần được duyệt để trò chuyện' : 'Đăng nhập để trò chuyện'}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-7 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#17313b]">Chỉnh sửa chuyến đi</h2>
              <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-[#8aa0a6] hover:text-[#d94848]">Hủy</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" className="input-field" required value={editForm.destination} onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })} placeholder="Điểm đến" />
              <input type="url" className="input-field" value={editForm.imageUrl} onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })} placeholder="URL ảnh chuyến đi" />
              <textarea className="input-field" rows="3" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Mô tả" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="date" className="input-field" required value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} />
                <input type="date" className="input-field" required value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="number" min="2" max="50" className="input-field" value={editForm.maxPeople} onChange={(e) => setEditForm({ ...editForm, maxPeople: parseInt(e.target.value) })} />
                <input type="text" className="input-field" placeholder="biển, ăn uống, cắm trại" value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Hủy bỏ</button>
              </div>
            </form>
          </div>
        )}
      </section>

      <section className="soft-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#17313b]">Review địa điểm</h2>
          <span className="pop-chip">{destinationAvg.toFixed(1)}/5 từ {destinationReviews.length} review</span>
        </div>
        {destinationReviews.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {destinationReviews.map(review => (
              <div key={review.id} className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black text-[#e8a400]">{review.rating}/5</span>
                  <span className="text-sm font-bold text-[#8aa0a6]">người dùng #{review.reviewerId}</span>
                </div>
                <p className="mt-2 font-bold leading-6 text-[#526b73]">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white/75 p-5 font-bold text-[#6b7f86]">Chưa có review địa điểm này.</p>
        )}
      </section>

      <section className="soft-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#17313b]">Thành viên trong nhóm</h2>
          <span className="pop-chip">{members.length} / {trip.maxPeople} người</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {members.map(member => {
            const interests = member.interests?.split(',').map(item => item.trim()).filter(Boolean) || [];
            return (
              <div key={member.id} className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3ddbd9] to-[#80bfff] text-lg font-black text-white">
                    {(member.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link to={`/profile/${member.id}`} className="truncate font-black text-[#17313b] hover:underline">{member.name || `Người dùng #${member.id}`}</Link>
                      <span className="pop-chip">{member.role}</span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#6b7f86]">
                      {[member.gender, member.age ? `${member.age} tuổi` : ''].filter(Boolean).join(' · ') || 'Chưa cập nhật giới tính/tuổi'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {interests.length ? interests.map(item => <span key={item} className="pop-chip">{item}</span>) : <span className="pop-chip">Chưa có sở thích</span>}
                    </div>
                    {isOwner && member.joinRequestId && (
                      <button onClick={() => handleRemove(member.joinRequestId)} className="btn-danger mt-3 text-sm">Kick khỏi nhóm</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {isOwner && requests.length > 0 && (
        <section className="soft-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#17313b]">Yêu cầu tham gia</h2>
            <span className="pop-chip">{requests.filter(r => r.status === 'PENDING').length} chờ duyệt</span>
          </div>
          <div className="grid gap-3">
            {requests.map(req => (
              <div key={req.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/85 p-4 shadow-sm">
                <div>
                  <p className="font-black text-[#17313b]">{members.find(m => m.id === req.userId)?.name || `Người dùng #${req.userId}`}</p>
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

      {user && canChat && isCompleted && (
        <section className="soft-panel p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-[#17313b]">Đánh giá sau chuyến đi</h2>
            <p className="mt-1 font-bold text-[#6b7f86]">Thành viên đã tham gia có thể review địa điểm và đánh giá các thành viên trong nhóm.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <form onSubmit={submitDestinationReview} className="grid gap-3 rounded-2xl bg-white/75 p-4">
              <h3 className="text-lg font-black text-[#17313b]">Review địa điểm</h3>
              <select className="input-field" value={destinationReviewForm.rating} onChange={(e) => setDestinationReviewForm({ ...destinationReviewForm, rating: e.target.value })}>
                {[5, 4, 3, 2, 1].map(score => <option key={score} value={score}>{score}/5</option>)}
              </select>
              <textarea className="input-field" rows="3" placeholder={`Cảm nhận về ${trip.destination}...`} value={destinationReviewForm.comment} onChange={(e) => setDestinationReviewForm({ ...destinationReviewForm, comment: e.target.value })} required />
              <button type="submit" className="btn-primary w-fit">Gửi review địa điểm</button>
            </form>

            {reviewTargets.length > 0 && (
              <form onSubmit={submitMemberReview} className="grid gap-3 rounded-2xl bg-white/75 p-4">
                <h3 className="text-lg font-black text-[#17313b]">Đánh giá thành viên</h3>
                <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                  <select className="input-field" value={memberReviewForm.reviewedUserId} onChange={(e) => setMemberReviewForm({ ...memberReviewForm, reviewedUserId: e.target.value })} required>
                    {reviewTargets.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                  </select>
                  <select className="input-field" value={memberReviewForm.rating} onChange={(e) => setMemberReviewForm({ ...memberReviewForm, rating: e.target.value })}>
                    {[5, 4, 3, 2, 1].map(score => <option key={score} value={score}>{score}/5</option>)}
                  </select>
                </div>
                <textarea className="input-field" rows="3" placeholder="Nhận xét về người bạn đồng hành..." value={memberReviewForm.comment} onChange={(e) => setMemberReviewForm({ ...memberReviewForm, comment: e.target.value })} required />
                <button type="submit" className="btn-primary w-fit">Gửi đánh giá thành viên</button>
              </form>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoBox({ label, value, tone }) {
  return (
    <div className={`rounded-2xl ${tone} p-4`}>
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8aa0a6]">{label}</p>
      <p className="mt-1 font-black text-[#17313b]">{value}</p>
    </div>
  );
}
