/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppMode = 'home' | 'mode-selection' | 'file-selection' | 'practice' | 'timed' | 'learning' | 'master' | 'files';

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index
  explanation?: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  fileName: string;
  folder?: string;
  group?: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  userAnswers: (number | null)[];
  timeLeft: number;
  mode: AppMode;
}
