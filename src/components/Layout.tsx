/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, BookOpen, Clock, Target, Menu, X, ShieldCheck, Terminal, Info, Folder } from 'lucide-react';
import { AppMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { InstructionsModal } from './InstructionsModal';

interface NavItemProps {
  id: AppMode;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: (id: AppMode) => void;
}

const NavItem = ({ id, label, icon, active, onClick }: NavItemProps) => (
  <button
    onClick={() => onClick(id)}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
      active 
        ? "bg-indigo-50 text-indigo-700 font-medium" 
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
    )}
  >
    <span className={cn(active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600")}>
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export default function Layout({ children, currentMode, onModeChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = React.useState(false);

  const navItems = [
    { id: 'home' as AppMode, label: 'Home', icon: <Home size={18} /> },
    { id: 'files' as AppMode, label: 'Files', icon: <Folder size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex-col z-30 hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => onModeChange('home')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
              Q
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Quizmotic</span>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                {...item}
                active={currentMode === item.id}
                onClick={onModeChange}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-100">
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2">Pro Member</p>
            <p className="text-xs font-medium mb-1 text-white">Ad-free experience</p>
            <p className="text-[10px] text-indigo-100 opacity-60">Unlock premium tracks</p>
          </div>
        </div>
      </aside>

      {/* Header - Desktop/Mobile Overlay */}
      <header className="lg:pl-64 fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-10 flex items-center justify-between z-40">
        <div className="flex items-center gap-2 lg:hidden" onClick={() => onModeChange('home')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            Q
          </div>
          <span className="font-bold tracking-tight text-gray-900">Quizmotic</span>
        </div>
        
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold text-gray-900">
            {currentMode === 'home' ? 'Welcome back, Mohi' : 
             currentMode.charAt(0).toUpperCase() + currentMode.slice(1).replace('-', ' ')}
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => setIsInstructionsOpen(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm whitespace-nowrap"
          >
            <Info size={14} />
            <span className="hidden sm:inline">Instructions</span>
            <span className="sm:hidden">Rules</span>
          </button>

          <div className="hidden md:flex flex-col items-end">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Current Rank</p>
            <p className="text-xs font-bold text-indigo-600">Gold Tier • Top 5%</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm ring-1 ring-gray-100"></div>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden p-8 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
                  <span className="font-bold text-gray-900">Quizmotic</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.id}
                    {...item}
                    active={currentMode === item.id}
                    onClick={(id) => {
                      onModeChange(id);
                      setIsMobileMenuOpen(false);
                    }}
                  />
                ))}
              </nav>

              <div className="mt-auto">
                <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Current Rank</p>
                  <p className="text-sm font-bold text-gray-900">Gold Tier • Top 5%</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-64 pt-24 min-h-screen">
        <div className="w-full max-w-6xl mx-auto p-5 md:p-10">
          {children}
        </div>
      </main>

      <InstructionsModal 
        isOpen={isInstructionsOpen} 
        onClose={() => setIsInstructionsOpen(false)} 
      />
    </div>
  );
}
