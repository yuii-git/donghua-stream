import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAnime } from '../lib/api';
import { VideoItem } from '../types';
import { PlayCircle, Clock } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const mode = 'donghua';

  const [results, setResults] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await searchAnime(query, pageParam, mode);
        if (res.success && res.data) {
           setResults(res.data.data || res.data);
        } else {
           setResults([]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to search');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, pageParam]);

  if (!query) {
    return <div className="text-gray-400 text-center mt-12">Enter a search term to begin.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">
        Search Results for <span className="text-white font-bold">"{query}"</span>
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-gray-500 py-12 text-center">No results found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {Array.isArray(results) && results.map((item, i) => (
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
                
                <div className="absolute inset-0 bg-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
                  <div className="bg-white/20 text-white p-3 rounded-full backdrop-blur-md shadow-lg border border-white/20">
                    <PlayCircle className="w-8 h-8 fill-current" />
                  </div>
                </div>

                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                  {(item.episode || item.ep) && (
                    <span className="bg-black/60 text-white border border-white/10 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                      {item.episode || item.ep}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-300 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
