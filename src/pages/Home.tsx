import { useEffect, useState } from 'react';
import { getDonghuaOngoing } from '../lib/api';
import { VideoItem } from '../types';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock } from 'lucide-react';

export default function Home() {
  const [donghua, setDonghua] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const donghuaRes = await getDonghuaOngoing(1);

        if (donghuaRes.success && donghuaRes.data) {
           setDonghua(donghuaRes.data.ongoing_donghua || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-4 bg-red-900/20 rounded-lg border border-red-900/50">Error: {error}</div>;
  }

  return (
    <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-white/80 rounded-full inline-block"></span>
              Ongoing Donghua
            </h2>
            <Link to="/search?q=donghua" className="text-gray-400 text-sm font-medium hover:text-white transition-colors">
              View All &rarr;
            </Link>
          </div>
          <VideoGrid items={donghua} />
        </section>
    </div>
  );
}

function VideoGrid({ items }: { items: VideoItem[] }) {
  if (!items || !items.length) {
    return <div className="text-gray-500 italic">No items found.</div>;
  }

  // Slice to 12 items for home page
  const displayItems = Array.isArray(items) ? items.slice(0, 12) : [];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
      {displayItems.map((item, i) => (
        <Link
          key={`${item.slug}-${i}`}
          to={`/detail/${item.slug}`}
          className="group relative flex flex-col gap-2 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-white/5 border border-white/10 group-hover:border-white/30 backdrop-blur-sm transition-colors">
            {item.poster || item.thumbnail ? (
              <img
                src={item.poster || item.thumbnail}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
            )}
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
              <div className="bg-white/20 text-white p-3 rounded-full backdrop-blur-md shadow-lg border border-white/20">
                <PlayCircle className="w-8 h-8 fill-current" />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
              {(item.episode || item.ep) && (
                <span className="bg-black/60 text-white border border-white/10 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                  {item.episode || item.ep}
                </span>
              )}
              {(item.rating || item.score) && (item.rating?.trim() !== '' || item.score?.trim() !== '') && (
                <span className="bg-black/60 text-white border border-white/10 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm flex items-center gap-1">
                  ★ {item.rating || item.score}
                </span>
              )}
            </div>
            
            {item.status && (
               <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
                 <Clock className="w-3 h-3" />
                 {item.status}
               </div>
            )}
          </div>
          
          <h3 className="text-sm font-medium text-gray-300 line-clamp-2 leading-snug group-hover:text-white transition-colors">
            {item.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
