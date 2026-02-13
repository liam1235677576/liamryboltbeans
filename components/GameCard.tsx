
import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  onClick, 
  isFavorite, 
  onToggleFavorite 
}) => {
  return (
    <div 
      className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-500/10"
      onClick={() => onClick(game)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(e, game.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-black/20 text-white hover:bg-black/40'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider text-white">
          {game.category}
        </div>
      </div>

      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{game.title}</h3>
        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{game.description}</p>
      </div>
      
      <div className="px-4 pb-4">
        <div className="w-full py-2 bg-slate-700/50 rounded-xl text-center text-xs font-bold text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase tracking-widest">
          Play Now
        </div>
      </div>
    </div>
  );
};
