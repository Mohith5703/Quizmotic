/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CATEGORIES } from '../constants';
import { fetchQuestions } from '../lib/utils';
import { Question } from '../types';
import { Loader2, ChevronLeft } from 'lucide-react';
import QuizRunner from './QuizRunner';

interface LearningProps {
  onGoHome: () => void;
  initialCategory: string | null;
}

export default function Learning({ onGoHome, initialCategory }: LearningProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(initialCategory);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (activeCategory) {
      loadQuestions(activeCategory);
    }
  }, [activeCategory]);

  const loadQuestions = async (catId: string) => {
    setLoading(true);
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat) {
      const q = await fetchQuestions(cat.fileName, cat.id);
      // For Learning Mode, we do NOT shuffle (as per user request: "learning mode questions must not change")
      setQuestions(q);
    }
    setLoading(false);
  };

  const content = () => {
    if (loading || (activeCategory && questions.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Preparing Lesson...</p>
        </div>
      );
    }

    return (
      <QuizRunner 
        questions={questions}
        mode="learning"
        onFinish={() => {}}
        onGoHome={onGoHome}
      />
    );
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onGoHome}
        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
      >
        <ChevronLeft size={16} />
        Back to Gallery
      </button>
      {content()}
    </div>
  );
}
