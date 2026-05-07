import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { reviewService, tripService } from '../api/services';
import TripCard from '../components/TripCard';

const fallbackImages = {
  'Vịnh Hạ Long': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
  'Hội An': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
  'Đà Lạt': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
};

export default function DestinationPage() {
  const { destination } = useParams();
  const name = decodeURIComponent(destination);
  const [trips, setTrips] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestination();
  }, [destination]);

  const loadDestination = async () => {
    setLoading(true);
    try {
      const [tripRes, reviewRes] = await Promise.all([
        tripService.getAll({ destination: name }),
        reviewService.getByDestination(name),
      ]);
      setTrips(Array.isArray(tripRes.data) ? tripRes.data : []);
      setReviews(Array.isArray(reviewRes.data) ? reviewRes.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const avg = reviews.length ? reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="card grid overflow-hidden lg:grid-cols-[1fr_0.9fr]">
        <div className="p-8">
          <p className="eyebrow">địa điểm</p>
          <h1 className="mt-3 text-5xl font-black leading-none text-[#17313b]">{name}</h1>
          <p className="mt-4 max-w-2xl text-lg font-bold leading-8 text-[#6b7f86]">
            Xem các chuyến đang mở và đánh giá từ những người đã từng đi địa điểm này.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="pop-chip">{trips.length} chuyến</span>
            <span className="pop-chip">{reviews.length} đánh giá</span>
            <span className="pop-chip">{avg.toFixed(1)}/5 điểm</span>
          </div>
        </div>
        <img src={fallbackImages[name] || trips[0]?.imageUrl || fallbackImages['Vịnh Hạ Long']} alt={name} className="h-80 w-full object-cover lg:h-full" />
      </section>

      <section className="soft-panel p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-[#17313b]">Review địa điểm</h2>
          <Link to="/" className="btn-secondary py-2 text-sm">Quay lại trang chủ</Link>
        </div>
        {reviews.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {reviews.map(review => (
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
          <p className="rounded-2xl bg-white/75 p-5 font-bold text-[#6b7f86]">Chưa có review cho địa điểm này.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black text-[#17313b]">Chuyến đi liên quan</h2>
        {loading ? (
          <div className="soft-panel py-12 text-center font-black text-[#8aa0a6]">Đang tải...</div>
        ) : trips.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
        ) : (
          <div className="soft-panel py-12 text-center">
            <p className="text-2xl font-black text-[#17313b]">Chưa có chuyến nào đến {name}</p>
            <Link to="/trips/create" className="btn-primary mt-4">Tạo chuyến đi</Link>
          </div>
        )}
      </section>
    </div>
  );
}
