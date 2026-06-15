export default function Header() {
  return (
    <header className="leonardo-glass border-b border-white/[0.09] bg-gradient-to-r from-[#121215]/85 to-[#09090b]/92 px-6 py-3.5 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="4" stroke="white" strokeWidth="1.5" strokeOpacity="0.3"/>
            <path d="M6 8L10 16L14 8L18 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="18" cy="6" r="1.5" fill="white" fillOpacity="0.6"/>
          </svg>
          <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1">
            ILLUSION<span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 font-extrabold">GEN</span>
          </h1>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-widest bg-white/[0.04] text-zinc-400 px-2.5 py-0.5 rounded-full border border-white/[0.08] font-bold">
          CREATIVE STUDIO
        </span>
      </div>
    </header>
  );
}
