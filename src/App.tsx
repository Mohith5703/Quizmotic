/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppMode } from './types';
import Layout from './components/Layout';
import Home from './components/Home';
import Practice from './components/Practice';
import Timed from './components/Timed';
import Learning from './components/Learning';
import Master from './components/Master';
import FileManager from './components/FileManager';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from './constants';

import ModeSelection from './components/ModeSelection';
import FileSelection from './components/FileSelection';

export default function App() {
  const [currentMode, setCurrentMode] = React.useState<AppMode>('home');
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const handleTrackSelect = (groupName: string) => {
    setSelectedGroup(groupName);
    setCurrentMode('mode-selection');
  };

  const handleModeSelect = (mode: AppMode) => {
    setCurrentMode(mode === 'master' ? 'master' : 'file-selection');
    // If master is selected, it might need a specific category or we just pick the first one from the group
    if (mode === 'master') {
      const firstInGroup = CATEGORIES.find(c => c.group === selectedGroup);
      if (firstInGroup) setSelectedCategory(firstInGroup.id);
    }
    // We capture the intended quiz mode temporarily if it's practice, timed, or learning
    if (mode !== 'master') {
      setTargetMode(mode);
    }
  };

  const [targetMode, setTargetMode] = React.useState<AppMode | null>(null);

  const handleFileSelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (targetMode) setCurrentMode(targetMode);
  };

  const handleGoHome = () => {
    setCurrentMode('home');
    setSelectedGroup(null);
    setSelectedCategory(null);
    setTargetMode(null);
  };

  const handleBackFromMode = () => {
    if (currentMode === 'master' && selectedGroup && !selectedCategory) {
      setCurrentMode('mode-selection');
    } else {
      setCurrentMode('file-selection');
    }
  };

  const renderContent = () => {
    switch (currentMode) {
      case 'home':
        return <Home onTrackSelect={handleTrackSelect} />;
      case 'mode-selection':
        return (
          <ModeSelection 
            groupName={selectedGroup || ''} 
            onSelect={handleModeSelect} 
            onBack={() => setCurrentMode('home')} 
          />
        );
      case 'file-selection':
        return (
          <FileSelection 
            groupName={selectedGroup || ''} 
            onSelect={handleFileSelect} 
            onBack={() => setCurrentMode('mode-selection')} 
          />
        );
      case 'practice':
        return <Practice onGoHome={handleBackFromMode} initialCategory={selectedCategory} />;
      case 'timed':
        return <Timed onGoHome={handleBackFromMode} initialCategory={selectedCategory} />;
      case 'learning':
        return <Learning onGoHome={handleBackFromMode} initialCategory={selectedCategory} />;
      case 'master':
        return <Master onGoHome={handleBackFromMode} initialCategory={selectedCategory} groupName={selectedGroup} />;
      case 'files':
        return <FileManager />;
      default:
        return <Home onTrackSelect={handleTrackSelect} />;
    }
  };

  return (
    <Layout currentMode={currentMode} onModeChange={handleGoHome}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMode + (selectedCategory || '')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

