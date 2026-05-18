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
      if (groupName === 'Current Dumps') {
        const weightage: { section: string, count: number, categoryId: string, keywords?: string[] }[] = [
          { section: 'Java', count: 8, categoryId: 'current_dumps' },
          { section: 'HTML5/CSS', count: 6, categoryId: 'step1' },
          { section: 'JavaScript', count: 7, categoryId: 'step2' },
          { section: 'Angular', count: 8, categoryId: 'cd_angular' },
          { section: 'React', count: 7, categoryId: 'cd_react' },
          { section: 'MongoDB', count: 7, categoryId: 'step4' },
          { section: 'Spring Core, Spring Boot', count: 15, categoryId: 'step5' },
          { section: 'DevOps', count: 2, categoryId: 'step6' },
        ];

        let masterQuestions: Question[] = [];
        
        // Fetch categories once to avoid multiple hits
        const uniqueCatIds = Array.from(new Set(weightage.map(w => w.categoryId)));
        const catContentMap: { [key: string]: Question[] } = {};
        
        await Promise.all(uniqueCatIds.map(async (id) => {
          const cat = CATEGORIES.find(c => c.id === id);
          if (cat) {
            const qs = await fetchQuestions(cat.fileName, id);
            catContentMap[id] = qs;
          }
        }));

        weightage.forEach(w => {
          let available = catContentMap[w.categoryId] || [];
          
          if (w.keywords) {
            // Filter by keywords if provided
            available = available.filter(q => 
              w.keywords?.some(k => q.text.toLowerCase().includes(k.toLowerCase()))
            );
            // If filtering results in too few, fallback to just sampling from the category
            if (available.length < w.count) {
              available = catContentMap[w.categoryId] || [];
            }
          }
          
          const selected = shuffleArray(available).slice(0, w.count).map(q => ({
            ...q,
            section: w.section
          }));
          masterQuestions = [...masterQuestions, ...selected];
        });

        setQuestions(masterQuestions);
      } else if (groupName) {
        // Load all categories in this group
        const groupCats = CATEGORIES.filter(c => c.group === groupName);
        const allPromises = groupCats.map(cat => fetchQuestions(cat.fileName, cat.id));
        const results = await Promise.all(allPromises);
        const combined = results.flat();
        setQuestions(shuffleArray(combined).slice(0, 60)); // 60 randomized questions for group master
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
