
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, ChevronRight, Info, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    step: 1,
    title: "Initial Preparation",
    subtitle: "Complete cloud_fsd_dumps",
    content: "Practice all questions from this folder. If you become perfect with it and feel confident that you can score 60/60, then move to the next step.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    icon: <BookOpen size={18} />
  },
  {
    step: 2,
    title: "Frontend Mastery",
    subtitle: "Complete FE complete folder",
    content: "Focus on deepening your understanding of frontend architecture and implementation details.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: <ChevronRight size={18} />
  },
  {
    step: 3,
    title: "Java Deep Dive",
    subtitle: "Java continue",
    content: "Most of the Java questions will come only from this PDF, so make sure you read it carefully.",
    isImportant: true,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    icon: <AlertCircle size={18} />
  },
  {
    step: 4,
    title: "Spring Framework",
    subtitle: "Study spring all pdf",
    content: "Comprehensive review of the Spring ecosystem and its core modules.",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    icon: <ChevronRight size={18} />
  },
  {
    step: 5,
    title: "Core Ecosystem & DevOps",
    subtitle: "Advanced Study",
    content: "Study these PDFs: java, spring core, aop, rest, devops pdf.",
    color: "bg-violet-50 text-violet-600 border-violet-100",
    icon: <ChevronRight size={18} />
  },
  {
    step: 6,
    title: "Final Review",
    subtitle: "Previous year Dumps",
    content: "Go to previous year Dumps folder to wrap up your preparation with legacy content.",
    color: "bg-gray-50 text-gray-600 border-gray-100",
    icon: <Info size={18} />
  }
];

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden border border-gray-100"
          >
            <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <span className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                      <BookOpen size={24} />
                    </span>
                    STUDY ROADMAP
                  </h2>
                  <p className="text-gray-500 font-medium mt-2">Recommended order for reading these dumps</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {steps.map((s) => (
                  <div 
                    key={s.step}
                    className={cn(
                      "group p-6 rounded-3xl border transition-all hover:shadow-md",
                      s.isImportant ? "bg-amber-50/30 border-amber-200" : "bg-gray-50/50 border-gray-100"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg border",
                        s.color
                      )}>
                        {s.step}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">
                            Step {s.step}
                          </h3>
                          {s.isImportant && (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-black uppercase rounded-full tracking-widest">
                              Important
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-gray-700 text-base mb-2">
                          {s.subtitle}
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {s.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-indigo-600 rounded-[2rem] text-white flex items-center justify-between group cursor-pointer" onClick={onClose}>
                <div>
                  <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.2em] mb-1">Ready to start?</p>
                  <h4 className="text-xl font-bold">Good luck with your prep, Mohi!</h4>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
