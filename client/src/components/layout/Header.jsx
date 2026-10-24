import { Brain, Layers, Sun } from 'lucide-react';

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#060a16]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/25">
            <Brain className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Microrep
          </span>
        </a>

        <nav className="flex items-center gap-2">
          <button
            aria-current="page"
            className="flex h-10 items-center gap-2 rounded-xl bg-indigo-500/15 px-3 text-sm font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30 transition-colors hover:bg-indigo-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:px-4"
          >
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">My Decks</span>
          </button>
          <button
            aria-label="Change theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-amber-400 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <Sun className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
