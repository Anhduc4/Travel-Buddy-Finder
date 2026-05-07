import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../api/services';
import TripCard from '../components/TripCard';

const landmarks = [
  {
    name: 'Vịnh Hạ Long',
    place: 'Quảng Ninh',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Hội An',
    place: 'Quảng Nam',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Đà Lạt',
    place: 'Lâm Đồng',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80',
  },
];

export default function HomePage() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async (destination = null) => {
    setLoading(true);
    try {
      const params = destination ? { destination } : {};
      const res = await tripService.getAll(params);
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Không thể tải danh sách chuyến đi', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadTrips(search || null);
  };

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 pt-4 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <p className="eyebrow">khám phá chuyến đi</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.95] text-[#17313b] sm:text-6xl">
            Tìm bạn đồng hành cho chuyến đi đúng gu.
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-[#6b7f86]">
            Không chỉ là một chuyến đi — mà là tìm đúng hội để đi cùng 🌍          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/trips/create" className="btn-primary">Tạo chuyến đi</Link>
            <a href="#trip-board" className="btn-secondary">Xem chuyến đang mở</a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card relative min-h-[26rem] sm:col-span-2">
            <img src={landmarks[0].image} alt={landmarks[0].name} className="h-full min-h-[26rem] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17313b]/78 via-[#17313b]/18 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffd166]">điểm đến nổi bật</p>
              <h2 className="mt-2 text-4xl font-black leading-none">{landmarks[0].name}</h2>
              <p className="mt-2 font-bold text-white/80">{landmarks[0].place}</p>
            </div>
          </div>
          {landmarks.slice(1).map((item) => (
            <div key={item.name} className="soft-panel overflow-hidden p-2">
              <img src={item.image} alt={item.name} className="h-36 w-full rounded-[1.25rem] object-cover" />
              <div className="p-3">
                <p className="text-lg font-black text-[#17313b]">{item.name}</p>
                <p className="text-sm font-bold text-[#6b7f86]">{item.place}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="trip-board" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">bảng chuyến đi</p>
            <h2 className="mt-2 text-4xl font-black text-[#17313b]">Chọn một hành trình để bắt đầu.</h2>
          </div>
          <span className="pop-chip">{trips.length} chuyến đang hiển thị</span>
        </div>
        <form onSubmit={handleSearch} className="soft-panel flex flex-col gap-3 p-3 sm:flex-row">
          <input type="text" placeholder="Tìm theo điểm đến: Đà Nẵng, Hà Giang, biển, núi..." className="input-field flex-1 border-transparent"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="btn-primary">Tìm kiếm</button>
        </form>

        {loading ? (
          <div className="soft-panel py-16 text-center text-lg font-black text-[#8aa0a6]">Đang tải chuyến đi...</div>
        ) : trips.length === 0 ? (
          <div className="soft-panel py-16 text-center">
            <p className="text-4xl font-black text-[#17313b]">Chưa có chuyến đi</p>
            <p className="mt-2 font-bold text-[#6b7f86]">Hãy là người mở hành trình đầu tiên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
        )}
      </section>
    </div>
  );
}
