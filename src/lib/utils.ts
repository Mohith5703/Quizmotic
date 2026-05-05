/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Question } from "../types";
import { CATEGORIES } from "../constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchQuestions(fileName: string, categoryId: string): Promise<Question[]> {
  try {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    const folder = cat?.folder || 'data';
    const response = await fetch(`/${folder}/${fileName}`);
    
    if (!response.ok) {
       // fallback to /data/ if not found in specific folder
       const fallbackResponse = await fetch(`/data/${fileName}`);
       if (!fallbackResponse.ok) throw new Error('Failed to fetch questions');
       const data = await fallbackResponse.json();
       return transformData(data, categoryId);
    }
    const data = await response.json();
    return transformData(data, categoryId);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

function transformData(data: any[], categoryId: string): Question[] {
  return data.map((q: any, index: number) => ({
    id: `${categoryId}-${index}`,
    text: q.question,
    options: q.options,
    correctAnswer: q.options.indexOf(q.correct),
    explanation: q.explanation || '',
    category: categoryId
  }));
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
