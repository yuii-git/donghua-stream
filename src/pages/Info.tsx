import { Info as InfoIcon, Github, MessageCircle } from 'lucide-react';

export default function Info() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-in fade-in duration-500 relative z-10">
      <div className="text-center space-y-4 mb-12">
        <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 border border-white/20 backdrop-blur-md shadow-lg shadow-white/5 overflow-hidden">
          <img src="/logo.png" alt="Donghua Yukz Logo" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget.parentElement as HTMLElement).innerHTML = '<div class="text-white flex items-center justify-center w-full h-full bg-white/10"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>' }} />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">About Donghua stream</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          A platform for streaming your favorite donghua seamlessly.
        </p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Developer</p>
              <p className="text-lg font-medium text-gray-200">NANOMI</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Community</p>
              <p className="text-lg font-medium text-gray-200">CodeCraft</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Source</p>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-200">Open Source</p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-200">Join Community</h3>
              <p className="text-sm text-gray-400 mt-1">Get the latest updates and chat with other members.</p>
            </div>
            <a
              href="https://whatsapp.com/channel/0029VbDTqKCDJ6GrxdIIKQ0j"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-5 rounded-xl transition-colors border border-white/20 shadow-lg shadow-white/5"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Channel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
