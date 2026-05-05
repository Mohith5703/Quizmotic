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
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface PracticeProps {
  onGoHome: () => void;
  initialCategory: string | null;
}

export default function Practice({ onGoHome, initialCategory }: PracticeProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(initialCategory);
  const [availableQuestions, setAvailableQuestions] = React.useState<Question[]>([]);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [questionCount, setQuestionCount] = React.useState<number | null>(null);
  const [shouldShuffle, setShouldShuffle] = React.useState(false);

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
      const processed = shouldShuffle ? shuffleArray(availableQuestions) : availableQuestions;
      setQuestions(processed.slice(0, questionCount));
    }
  }, [availableQuestions, questionCount, shouldShuffle]);

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
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Practice Mode</h2>
          <p className="text-gray-500 text-lg">Pick a track to challenge yourself with shuffled questions.</p>
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
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Track...</p>
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
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Customize Your Session</h2>
          <p className="text-gray-500">Pick a preset or enter a custom amount.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[10, 20, 30, 50].map((count) => {
            const isAvailable = availableQuestions.length >= count;
            if (!isAvailable && count !== 10) return null;
            return (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-xl hover:scale-[1.02] transition-all group"
              >
                <p className="text-3xl font-black text-gray-900 mb-1 group-hover:text-indigo-600">{count}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Questions</p>
              </button>
            );
          })}
          <button
            onClick={() => setQuestionCount(availableQuestions.length)}
            className="col-span-2 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden relative"
          >
            <div className="relative z-10">
              <p className="text-3xl font-black text-indigo-600 mb-1">MAX ({availableQuestions.length})</p>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Select All Questions</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Loader2 size={80} className="rotate-45" />
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <p className="text-sm font-bold text-gray-900">Shuffle Questions</p>
            <p className="text-xs text-gray-400">Randomize question order</p>
          </div>
          <button 
            onClick={() => setShouldShuffle(!shouldShuffle)}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              shouldShuffle ? "bg-indigo-600" : "bg-gray-200"
            )}
          >
            <motion.div 
              animate={{ x: shouldShuffle ? 24 : 2 }}
              className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Custom Amount</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="e.g. 15"
              className="flex-grow bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all"
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
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
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
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Track...</p>
      </div>
    );
  }

  return (
    <QuizRunner 
      key={activeCategory}
      questions={questions} 
      mode="practice" 
      onFinish={() => {}} 
      onGoHome={onGoHome} 
    />
  );
}
