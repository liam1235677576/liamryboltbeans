
export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  thumbnail: string;
  iframeUrl: string;
  featured?: boolean;
}

export enum GameCategory {
  ALL = 'All',
  ACTION = 'Action',
  PUZZLE = 'Puzzle',
  ARCADE = 'Arcade',
  STRATEGY = 'Strategy',
  SPORTS = 'Sports'
}

export type ViewState = 'home' | 'game-detail' | 'favorites';
