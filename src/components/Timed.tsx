/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CATEGORIES } from '../constants';
import { fetchQuestions, shuffleArray } from '../lib/utils';
import { Question } from '../types';
import QuizRunner from './QuizRunner';
import { Loader2, ChevronLeft } from 'lucide-react';

interface TimedProps {
  onGoHome: () => void;
  initialCategory: string | null;
}

export default function Timed({ onGoHome, initialCategory }: TimedProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(initialCategory);
  const [availableQuestions, setAvailableQuestions] = React.useState<Question[]>([]);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [questionCount, setQuestionCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (activeCategory) {
      loadAllQuestions(activeCategory);
    } else {
      setAvailableQuestions([]);
      setQuestions([]);
      setQuestionCount(null);
    }
  }, [activeCategory]);

  const loadAllQuestions = async (catId: string) => {
    setLoading(true);
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat) {
      const q = await fetchQuestions(cat.fileName, cat.id);
      setAvailableQuestions(q);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (availableQuestions.length > 0 && questionCount) {
      setQuestions(shuffleArray(availableQuestions).slice(0, questionCount));
    }
  }, [availableQuestions, questionCount]);

  if (!activeCategory) {
    return (
      <div className="space-y-8">
        <button 
          onClick={onGoHome}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={16} />
          Back to Home
        </button>
        <header>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Timed Challenge</h2>
          <p className="text-gray-500 text-lg">Race against the clock. 60 seconds per question.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all text-left group"
            >
              <h4 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{cat.name}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Preparing Challenge...</p>
      </div>
    );
  }

  if (!questionCount) {
    return (
      <div className="max-w-xl mx-auto space-y-8 py-12">
      <button 
        onClick={onGoHome}
        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest mb-6"
      >
        <ChevronLeft size={16} />
        Back to Gallery
      </button>

      <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Set Your Goal</h2>
          <p className="text-gray-500">How many questions for this sprint?</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[5, 10, 15, 20].map((count) => {
            const isAvailable = availableQuestions.length >= count;
            if (!isAvailable && count !== 5) return null;
            return (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-rose-500 hover:shadow-xl hover:scale-[1.02] transition-all group"
              >
                <p className="text-3xl font-black text-gray-900 mb-1 group-hover:text-rose-600">{count}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Questions</p>
              </button>
            );
          })}
          <button
            onClick={() => setQuestionCount(availableQuestions.length)}
            className="col-span-2 p-6 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm hover:border-rose-500 hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden relative"
          >
            <div className="relative z-10">
              <p className="text-3xl font-black text-rose-600 mb-1">MAX ({availableQuestions.length})</p>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Select All Questions</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Loader2 size={80} className="rotate-45" />
            </div>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-rose-400">Custom Count</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="e.g. 12"
              className="flex-grow bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt((e.target as HTMLInputElement).value);
                  if (val > 0) setQuestionCount(val);
                }
              }}
            />
            <button 
              onClick={(e) => {
                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                const val = parseInt(input.value);
                if (val > 0) setQuestionCount(val);
              }}
              className="px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all"
            >
              Set
            </button>
          </div>
        </div>

        <button 
          onClick={onGoHome}
          className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors"
        >
          Cancel and Go Home
        </button>
      </div>
    );
  }

  if (loading || (activeCategory && questions.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Preparing Challenge...</p>
      </div>
    );
  }

  return (
    <QuizRunner 
      key={activeCategory}
      questions={questions} 
      mode="timed" 
      onFinish={() => {}} 
      onGoHome={onGoHome} 
    />
  );
}
