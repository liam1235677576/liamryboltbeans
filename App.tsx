
import React, { useState, useEffect, useMemo } from 'react';
import { Game, GameCategory, ViewState } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { GameCard } from './components/GameCard.tsx';
import { GamePlayer } from './components/GamePlayer.tsx';

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [view, setView] = useState<ViewState>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GameCategory>(GameCategory.ALL);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch games from JSON file
  useEffect(() => {
    fetch('./data/games.json')
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load games", err);
        setLoading(false);
      });
  }, []);

  // Load favorites from local storage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('nova_favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem('nova_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId) 
        : [...prev, gameId]
    );
  };

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === GameCategory.ALL || game.category === activeCategory;
      const matchesView = view !== 'favorites' || favorites.includes(game.id);
      
      return matchesSearch && matchesCategory && matchesView;
    });
  }, [games, searchQuery, activeCategory, view, favorites]);

  const featuredGames = useMemo(() => games.filter(g => g.featured), [games]);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setView('game-detail');
  };

  const handleClosePlayer = () => {
    setSelectedGame(null);
    setView('home');
  };

  const categories = Object.values(GameCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-rajdhani animate-pulse uppercase tracking-widest">Initialising NovaArcade...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500 selection:text-white">
      <Navbar 
        currentView={view} 
        onNavigate={setView} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Featured Section (only on home) */}
        {view === 'home' && !searchQuery && activeCategory === GameCategory.ALL && (
          <section className="mb-12">
            <h2 className="text-3xl font-rajdhani font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-indigo-500 rounded-full" />
              Featured Hits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredGames.map(game => (
                <div 
                  key={game.id}
                  onClick={() => handleGameSelect(game)}
                  className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-xl"
                >
                  <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="inline-block px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-tighter text-white mb-2">Featured</span>
                    <h3 className="text-3xl font-rajdhani font-bold text-white group-hover:text-indigo-400 transition-colors">{game.title}</h3>
                    <p className="text-slate-300 text-sm mt-1 max-w-lg line-clamp-1">{game.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-rajdhani font-bold text-white uppercase tracking-wider">
              {view === 'favorites' ? 'My Favorite Games' : `${activeCategory} Games`}
            </h2>
            <span className="text-slate-500 text-sm font-medium">{filteredGames.length} Results</span>
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onClick={handleGameSelect}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-400">No games found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory(GameCategory.ALL); setView('home');}}
                className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
              >
                Show All Games
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <span className="text-xl font-rajdhani font-bold tracking-tight text-white">NOVA<span className="text-indigo-400">ARCADE</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">The world's best hub for unblocked HTML5 games. No downloads, just pure gaming fun.</p>
          </div>
          <div className="flex gap-8">
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Platform</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Request a Game</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Community</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Discord</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Twitter</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">GitHub</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-600 text-xs">
          © {new Date().getFullYear()} NovaArcade. All games are properties of their respective owners.
        </div>
      </footer>

      {/* Fullscreen Player Portal */}
      {selectedGame && (
        <GamePlayer game={selectedGame} onClose={handleClosePlayer} />
      )}
    </div>
  );
};

export default App;
