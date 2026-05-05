/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CATEGORIES, MASTER_QUIZ_TIME } from '../constants';
import { fetchQuestions, shuffleArray } from '../lib/utils';
import { Question } from '../types';
import QuizRunner from './QuizRunner';
import { Loader2, ShieldCheck, ChevronLeft } from 'lucide-react';

interface MasterProps {
  onGoHome: () => void;
  initialCategory: string | null;
  groupName: string | null;
}

export default function Master({ onGoHome, initialCategory, groupName }: MasterProps) {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadMasterQuestions();
  }, [initialCategory, groupName]);

  const loadMasterQuestions = async () => {
    setLoading(true);
    try {
      if (groupName) {
        // Load all categories in this group
        const groupCats = CATEGORIES.filter(c => c.group === groupName);
        const allPromises = groupCats.map(cat => fetchQuestions(cat.fileName, cat.id));
        const results = await Promise.all(allPromises);
        const combined = results.flat();
        setQuestions(shuffleArray(combined).slice(0, 50)); // 50 randomized questions for group master
      } else if (initialCategory) {
        const cat = CATEGORIES.find(c => c.id === initialCategory);
        if (cat) {
          const q = await fetchQuestions(cat.fileName, cat.id);
          setQuestions(shuffleArray(q));
        }
      } else {
        // Fallback to everything
        const allPromises = CATEGORIES.map(cat => fetchQuestions(cat.fileName, cat.id));
        const results = await Promise.all(allPromises);
        const combined = results.flat();
        setQuestions(shuffleArray(combined).slice(0, 60));
      }
    } catch (error) {
      console.error("Failed to load master quiz:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
          <ShieldCheck className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={32} />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Master Certification</h3>
          <p className="text-sm font-medium text-gray-400">Assembling comprehensive question set...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button 
        onClick={onGoHome}
        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
      >
        <ChevronLeft size={16} />
        Back to Gallery
      </button>
      
      <header className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-4">
          <ShieldCheck size={14} />
          <span>Master Mode: 60 Min Challenge</span>
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          {groupName || (initialCategory ? CATEGORIES.find(c => c.id === initialCategory)?.name : 'General')} Master
        </h2>
        <p className="text-gray-500 text-lg">A full mastery exam. You have 60 minutes to complete all questions. Accuracy and speed are critical.</p>
      </header>

      <QuizRunner 
        key={`master-runner-${initialCategory}`}
        questions={questions} 
        mode="master" 
        onFinish={() => {}} 
        onGoHome={onGoHome} 
      />
    </div>
  );
}
