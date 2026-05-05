/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Zap, ShieldCheck, GraduationCap, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { AppMode } from '../types';
import { cn } from '../lib/utils';

interface ModeSelectionProps {
  onSelect: (mode: AppMode) => void;
  onBack: () => void;
  groupName: string;
}

export default function ModeSelection({ onSelect, onBack, groupName }: ModeSelectionProps) {
  const modes = [
    { id: 'practice', label: 'Practice', icon: <Target size={32} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', desc: 'Study at your own pace with unlimited time' },
    { id: 'timed', label: 'Timed', icon: <Zap size={32} />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', desc: 'Test your speed with 1 minute per question' },
    { id: 'learning', label: 'Learning', icon: <GraduationCap size={32} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'Review questions with answers revealed instantly' },
    { id: 'master', label: 'Master', icon: <ShieldCheck size={32} />, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', desc: 'Full exam simulation with a 60-minute timer' },
  ];

  return (
    <div className="space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
      >
        <ChevronLeft size={16} />
        Back to Tracks
      </button>

      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{groupName}</h2>
        <p className="text-gray-500 font-medium tracking-wide">Choose your preferred training method</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modes.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(mode.id as AppMode)}
            className={cn(
              "group p-8 rounded-[2.5rem] border border-transparent bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col items-start gap-6",
              "ring-1 ring-gray-100"
            )}
          >
            <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110", mode.bg, mode.color)}>
              {mode.icon}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                {mode.label} Quiz
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {mode.desc}
              </p>
            </div>

            <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              Select Mode
              <span className="text-lg">→</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
