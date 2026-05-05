/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Brain, Database, Layout as LayoutIcon, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import React from 'react';

interface HomeProps {
  onTrackSelect: (groupName: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
       staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home({ onTrackSelect }: HomeProps) {
  const groups = Array.from(new Set(CATEGORIES.map(c => c.group || 'General')));

  const getGroupDetails = (groupName: string) => {
    switch (groupName) {
      case 'Current Dumps': 
        return { 
          icon: <Database size={32} />, 
          desc: 'The master track containing standardized exams for full-stack progression (Step 1-6).',
          color: 'bg-indigo-600'
        };
      case 'Step 1 Collection':
        return { 
          icon: <LayoutIcon size={32} />, 
          desc: 'Detailed deep-dives into frontend architecture, Java foundations, and modern frameworks.',
          color: 'bg-emerald-600'
        };
      case 'Step 2 Collection':
        return { 
          icon: <Brain size={32} />, 
          desc: 'Advanced frontend topics, including React, Angular, and complex TypeScript patterns.',
          color: 'bg-rose-600'
        };
      case 'Step 3 Collection':
        return { 
          icon: <Database size={32} />, 
          desc: 'try to avoid this step here because there so many snippets code u may get confuse',
          color: 'bg-amber-600'
        };
      case 'Step 4 Collection':
        return { 
          icon: <LayoutIcon size={32} />, 
          desc: 'Comprehensive coverage of Spring Framework, AOP principles, and Java configuration patterns.',
          color: 'bg-cyan-600'
        };
      case 'Step 5 Collection':
        return { 
          icon: <Terminal size={32} />, 
          desc: 'Java, Spring Core, AOP, REST & DevOps. Note: still many Questions aare there in PDF but because of no options i added only which have options',
          color: 'bg-violet-600'
        };
      default:
        return { 
          icon: <Brain size={32} />, 
          desc: 'Supplementary learning materials and community-curated dumps.',
          color: 'bg-gray-600'
        };
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      <header className="space-y-4">
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
          <Brain size={12} />
          <span>Curated Learning Path</span>
        </motion.div>
        <motion.h1 variants={item} className="text-5xl font-black tracking-tight text-gray-900 leading-[1.05]">
          Select your track<br />
          <span className="text-gray-400 font-medium">and start mastering.</span>
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {groups.map((groupName) => {
          const details = getGroupDetails(groupName);
          return (
            <motion.button
              key={groupName}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => onTrackSelect(groupName)}
              className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-all p-8 flex flex-col items-start text-left overflow-hidden hover:shadow-2xl hover:border-transparent ring-1 ring-gray-100"
            >
              <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-6 transition-transform group-hover:scale-110", details.color)}>
                {details.icon}
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                  {groupName}
                </h3>
                <p className={cn(
                  "text-gray-500 font-medium leading-relaxed max-w-md",
                  (groupName === 'Step 3 Collection' || groupName === 'Step 5 Collection') && "p-4 rounded-2xl border shadow-sm italic text-sm",
                  groupName === 'Step 3 Collection' && "text-amber-800 bg-amber-50 border-amber-100",
                  groupName === 'Step 5 Collection' && "text-violet-800 bg-violet-50 border-violet-100"
                )}>
                  {(groupName === 'Step 3 Collection' || groupName === 'Step 5 Collection') && (
                    <span className={cn(
                      "block mb-1 not-italic font-black text-[10px] uppercase tracking-widest",
                      groupName === 'Step 3 Collection' ? "text-amber-600" : "text-violet-600"
                    )}>
                      Note:
                    </span>
                  )}
                  {details.desc.replace('Note: ', '')}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
                Explore Tracks
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>

              <div className={cn("absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-[0.03] transition-all group-hover:scale-150 group-hover:opacity-[0.05]", details.color)} />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
