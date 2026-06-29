import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getDetail } from '../lib/api';
import { DetailData } from '../types';
import { Play, Calendar, Video, Info, Tag, X } from 'lucide-react';

export default function Detail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const mode = 'donghua';

  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getDetail(slug, mode);
        if (res.success && res.data) {
          setData(res.data.data || res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug, mode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-400 p-4 bg-red-900/20 rounded-lg border border-red-900/50 backdrop-blur-md">Error: {error || 'Not found'}</div>;
  }

  const episodeList = data.episodes_list || data.episodes;
  // Make a shallow copy and reverse it so episode 1 is at the top
  const sortedEpisodes = episodeList ? [...episodeList].reverse() : null;
  const firstEpisodeSlug = sortedEpisodes && sortedEpisodes.length > 0 ? sortedEpisodes[0].slug : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <X className="w-4 h-4" /> Close
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0 mx-auto md:mx-0 w-64 sm:w-72">
          <div className="rounded-2xl overflow-hidden shadow-none border border-white/10 bg-white/5 backdrop-blur-md p-1">
            <img src={data.poster || data.thumbnail} alt={data.title} className="w-full h-auto object-cover aspect-[2/3] rounded-xl" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              {data.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
               {data.status && (
                 <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md text-gray-300">
                   <Info className="w-4 h-4" /> {data.status}
                 </span>
               )}
               {data.type && (
                 <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md text-gray-300">
                   <Video className="w-4 h-4" /> {data.type}
                 </span>
               )}
               {data.released && (
                 <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md text-gray-300">
                   <Calendar className="w-4 h-4" /> {data.released}
                 </span>
               )}
            </div>
          </div>

          <div className="flex gap-4">
             {firstEpisodeSlug && (
                <Link
                  to={`/watch/${firstEpisodeSlug}`}
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold py-3 px-6 rounded-full transition-colors shadow-lg shadow-white/10 border border-white"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </Link>
             )}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Synopsis</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {data.synopsis || 'No synopsis available.'}
              </p>
            </div>
            
            {data.genre && data.genre.length > 0 && (
              <div className="pt-2">
                 <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                   <Tag className="w-4 h-4" /> Genres
                 </h3>
                 <div className="flex flex-wrap gap-2">
                   {data.genre.map((g, i) => (
                     <span key={i} className="text-xs text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-md">
                       {g}
                     </span>
                   ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Episodes List */}
      {sortedEpisodes && sortedEpisodes.length > 0 && (
        <div className="pt-8 border-t border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
             <Video className="w-6 h-6 text-white" />
             Episodes <span className="text-gray-500 text-lg font-normal">({sortedEpisodes.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {sortedEpisodes.map((ep, i) => (
              <Link
                key={ep.slug}
                to={`/watch/${ep.slug}`}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white p-3 rounded-lg text-sm text-center transition-all line-clamp-1 backdrop-blur-md"
                title={ep.title}
              >
                {ep.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
