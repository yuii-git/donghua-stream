import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, Tv, Film, Info, Crown, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-white/30 relative">
      {/* Background glass effect blur elements */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to={`/`} className="flex items-center gap-2 flex-shrink-0 group">
            {/* Fallback to Crown icon representing the uploaded Nanzz logo */}
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors overflow-hidden">
               <img src="/logo.png" alt="Nanzz" className="w-full h-full object-cover hidden" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => { e.currentTarget.style.display = 'block'; (e.currentTarget.previousSibling as HTMLElement).style.display = 'none'; }} />
               <Crown className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block text-white">Donghua Yukz</span>
          </Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-xl flex items-center">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-full leading-5 bg-white/5 text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 sm:text-sm transition-all backdrop-blur-md"
                placeholder="Search donghua..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 bg-transparent mt-12 py-8 mb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm flex flex-col items-center gap-3">
           <Crown className="w-6 h-6 text-gray-600" />
           <p>© {new Date().getFullYear()} Donghua Yukz by Nanzz. All rights reserved.</p>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/' || location.pathname.startsWith('/detail') || location.pathname.startsWith('/watch') || location.pathname.startsWith('/search') ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            <Tv className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link to="/info" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/info' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            <Info className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Info</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
