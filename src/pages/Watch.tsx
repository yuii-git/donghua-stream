import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getEpisode } from '../lib/api';
import { EpisodeData } from '../types';
import { ChevronLeft, ChevronRight, Download, PlayCircle, Server, X } from 'lucide-react';

export default function Watch() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const mode = 'donghua';

  const [data, setData] = useState<EpisodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<{name: string; url: string} | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchEpisode = async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        const res = await getEpisode(slug, mode);
        if (res.success && res.data) {
          setData(res.data.data || res.data);
          const epData = res.data.data || res.data;
          
          // Select default server
          if (epData.streaming?.main_url) {
             setSelectedServer(epData.streaming.main_url);
          } else if (epData.streaming?.servers && epData.streaming.servers.length > 0) {
             setSelectedServer(epData.streaming.servers[0]);
          } else {
             setSelectedServer(null);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load episode');
      } finally {
        setLoading(false);
      }
    };
    fetchEpisode();
  }, [slug, mode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-400 p-4 bg-red-900/20 rounded-lg border border-red-900/50 backdrop-blur-md">Error: {error || 'Not found'}</div>;
  }

  // Calculate prev/next by looking at episodes_list
  let prevSlug = null;
  let nextSlug = null;
  if (data.episodes_list && data.episodes_list.length > 0) {
    const currentIndex = data.episodes_list.findIndex(e => e.slug === slug);
    if (currentIndex > -1) {
      // The array usually has latest episode first (index 0 is newest, so next episode is currentIndex - 1)
      if (currentIndex > 0) {
        nextSlug = data.episodes_list[currentIndex - 1].slug;
      }
      // Previous episode is older, so currentIndex + 1
      if (currentIndex < data.episodes_list.length - 1) {
        prevSlug = data.episodes_list[currentIndex + 1].slug;
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <X className="w-4 h-4" /> Close
        </button>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {data.title || data.episode}
        </h1>
        {data.donghua_details && (
          <Link to={`/detail/${data.donghua_details.slug}`} className="text-gray-400 hover:text-white inline-block mt-2">
             &larr; Back to {data.donghua_details.title}
          </Link>
        )}
      </div>

      {/* Video Player */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/20 relative">
         {selectedServer?.url ? (
           <iframe
             src={selectedServer.url.startsWith('/') ? `https://vps-donghuawatch.vercel.app${selectedServer.url}` : selectedServer.url}
             className="w-full h-full"
             allowFullScreen
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           ></iframe>
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-gray-500">
             <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
             <p>No video source available</p>
           </div>
         )}
      </div>

      {/* Server Selection */}
      {data.streaming?.servers && data.streaming.servers.length > 0 && (
         <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
           <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
             <Server className="w-4 h-4" /> Servers
           </h3>
           <div className="flex flex-wrap gap-2">
              {data.streaming.servers.map((srv, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedServer(srv)}
                  className={`text-sm px-4 py-2 rounded-lg transition-colors border ${
                    selectedServer?.url === srv.url 
                    ? 'bg-white text-black font-bold border-white' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                  }`}
                >
                  {srv.name}
                </button>
              ))}
           </div>
         </div>
      )}

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
         <div className="w-full sm:w-auto flex justify-center">
           {prevSlug ? (
             <Link
               to={`/watch/${prevSlug}`}
               className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors border border-white/10 w-full sm:w-auto justify-center"
             >
               <ChevronLeft className="w-5 h-5" /> Previous
             </Link>
           ) : (
             <button disabled className="inline-flex items-center gap-2 bg-white/5 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed border border-white/5 w-full sm:w-auto justify-center">
               <ChevronLeft className="w-5 h-5" /> Previous
             </button>
           )}
         </div>

         <div className="w-full sm:w-auto flex justify-center">
           {nextSlug ? (
             <Link
               to={`/watch/${nextSlug}`}
               className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto justify-center"
             >
               Next <ChevronRight className="w-5 h-5" />
             </Link>
           ) : (
             <button disabled className="inline-flex items-center gap-2 bg-white/5 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed border border-white/5 w-full sm:w-auto justify-center">
               Next <ChevronRight className="w-5 h-5" />
             </button>
           )}
         </div>
      </div>

      {/* Downloads */}
      {data.download_url && Object.keys(data.download_url).length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-4 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <Download className="w-5 h-5 text-white" />
            Download Links
          </h3>
          <div className="space-y-4">
             {Object.entries(data.download_url).map(([quality, links], i) => {
               if (Object.keys(links).length === 0) return null;
               return (
                 <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                   <span className="text-gray-400 font-mono text-sm w-24 uppercase">{quality.replace('mp4_', '')}</span>
                   <div className="flex flex-wrap gap-2">
                     {Object.entries(links).map(([host, link], j) => (
                       <a
                         key={j}
                         href={link}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="bg-white/10 hover:bg-white/20 text-xs text-gray-300 py-1.5 px-3 rounded border border-white/10 hover:border-white/20 transition-colors"
                       >
                         {host}
                       </a>
                     ))}
                   </div>
                 </div>
               );
             })}
          </div>
        </div>
      )}
    </div>
  );
}
