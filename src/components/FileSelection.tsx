/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, Database, Layout as LayoutIcon, Code2, Server, Coffee, Leaf, Infinity as InfinityIcon, Brain, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface FileSelectionProps {
  groupName: string;
  onSelect: (categoryId: string) => void;
  onBack: () => void;
}

export default function FileSelection({ groupName, onSelect, onBack }: FileSelectionProps) {
  const filteredCategories = CATEGORIES.filter(c => c.group === groupName);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database': return <Database size={24} />;
      case 'Layout': return <LayoutIcon size={24} />;
      case 'Code2': return <Code2 size={24} />;
      case 'Server': return <Server size={24} />;
      case 'Coffee': return <Coffee size={24} />;
      case 'Leaf': return <Leaf size={24} />;
      case 'Infinity': return <InfinityIcon size={24} />;
      case 'ShieldCheck': return <ShieldCheck size={24} />;
      default: return <Brain size={24} />;
    }
  };

  return (
    <div className="space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
      >
        <ChevronLeft size={16} />
        Back to Modes
      </button>

      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{groupName}</h2>
        <p className="text-gray-500 font-medium tracking-wide">Select a topic to start your practice session</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat, index) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(cat.id)}
            className="group flex items-center gap-6 p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              {getIcon(cat.icon)}
            </div>
            
            <div className="flex-grow min-w-0">
              <h3 className="text-lg font-bold text-gray-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                {cat.name}
              </h3>
            </div>

            <ArrowRight size={20} className="text-gray-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
