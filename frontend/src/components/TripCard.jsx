import { Link } from 'react-router-dom';

const palette = [
  { bg: 'from-[#ffd166] to-[#ff9f8e]', mark: 'NẮNG' },
  { bg: 'from-[#3ddbd9] to-[#80bfff]', mark: 'BIỂN' },
  { bg: 'from-[#7bd88f] to-[#ffd166]', mark: 'ĐI' },
];

export default function TripCard({ trip }) {
  const tone = palette[(trip.id || 0) % palette.length];
  const tags = trip.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

  return (
    <Link to={`/trips/${trip.id}`} className="card group block cursor-pointer transition-all duration-300 hover:-translate-y-1">
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${tone.bg}`}>
        <div className="absolute left-5 top-5 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-[#17313b] shadow-sm">
          {tone.mark}
        </div>
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/85">điểm đến</p>
          <h3 className="mt-1 line-clamp-2 text-3xl font-black leading-none text-white drop-shadow-sm">
            {trip.destination}
          </h3>
        </div>
      </div>
      <div className="p-5">
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-[#6b7f86]">{trip.description || 'Một chuyến đi mới đang tìm bạn đồng hành phù hợp.'}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#f4fbfb] p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8aa0a6]">ngày đi</p>
            <p className="mt-1 text-sm font-black text-[#17313b]">{trip.startDate}</p>
          </div>
          <div className="rounded-2xl bg-[#fff8e8] p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8aa0a6]">nhóm</p>
            <p className="mt-1 text-sm font-black text-[#17313b]">Tối đa {trip.maxPeople}</p>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="pop-chip">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
