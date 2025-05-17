export type Difficulty = 'easy' | 'normal' | 'hard';

export interface ThemeConfig {
  images: string[];
  path?: string;
}

export interface GameOptions {
  difficulty?: Difficulty;
  theme?: string;
}