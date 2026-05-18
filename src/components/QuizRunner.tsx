import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, ChevronLeft, RotateCcw, Home, Clock, Loader2 } from 'lucide-react';
import { Question, AppMode } from '../types';
import { cn } from '../lib/utils';
import { MASTER_QUIZ_TIME } from '../constants';

interface QuizRunnerProps {
  questions: Question[];
  mode: AppMode;
  onFinish: (score: number) => void;
  onGoHome: () => void;
}

export default function QuizRunner({ questions, mode, onFinish, onGoHome }: QuizRunnerProps) {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [userAnswers, setUserAnswers] = React.useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showExplanation, setShowExplanation] = React.useState(mode === 'learning');
  const [score, setScore] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);
  const [globalTimeLeft, setGlobalTimeLeft] = React.useState(
    mode === 'master' ? MASTER_QUIZ_TIME : questions.length * 60
  );

  const currentQuestion = questions[currentIdx];

  const learningQuestions = mode === 'learning' ? questions : [questions[currentIdx]];

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
        <h3 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Preparing questions...</h3>
        <button onClick={onGoHome} className="text-indigo-600 font-bold hover:underline">Go Back</button>
      </div>
    );
  }

  // Global Timer for Master Quiz and Timed Mode
  React.useEffect(() => {
    if ((mode !== 'master' && mode !== 'timed') || isFinished) return;

    if (globalTimeLeft <= 0) {
      setIsFinished(true);
      onFinish(score);
      return;
    }

    const timer = setInterval(() => {
      setGlobalTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [globalTimeLeft, mode, isFinished, score, onFinish]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIdx: number, questionIdx: number = currentIdx) => {
    if (mode !== 'learning' && userAnswers[questionIdx] !== null) return;
    
    const isCorrect = optionIdx === questions[questionIdx].correctAnswer;
    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIdx] = optionIdx;
    setUserAnswers(newUserAnswers);

    if (isCorrect && mode !== 'learning') {
        setScore(s => s + 1);
    }

    if (mode !== 'learning') {
      setShowExplanation(true);
      setTimeout(() => {
        handleNext();
      }, 800);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(mode === 'learning');
    } else if (userAnswers[currentIdx] !== null || mode === 'learning') {
      setIsFinished(true);
      onFinish(score);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setShowExplanation(userAnswers[currentIdx - 1] !== null || mode === 'learning');
    }
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12 px-6 bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-indigo-100/20"
      >
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-4xl font-black mb-4">Great Job!</h2>
        <p className="text-lg text-gray-500 mb-8">
          Quiz completed. You scored <span className="font-bold text-indigo-600">{score}</span> out of {questions.length}.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Accuracy</p>
            <p className="text-3xl font-black">{Math.round((score / questions.length) * 100)}%</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">XP Earned</p>
            <p className="text-3xl font-black text-indigo-600">+{score * 25}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => {
                setCurrentIdx(0);
                setUserAnswers(new Array(questions.length).fill(null));
                setScore(0);
                setIsFinished(false);
                setGlobalTimeLeft(mode === 'master' ? MASTER_QUIZ_TIME : questions.length * 60);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            <RotateCcw size={20} /> Restart
          </button>
          <button 
            onClick={onGoHome}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all"
          >
            <Home size={20} /> Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-rose-600 transition-colors uppercase tracking-widest group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Exit
          </button>

          <div className="flex items-center gap-6 flex-grow">
            <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
              <motion.div 
                className="h-full bg-indigo-600"
                animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              {mode === 'learning' ? 'Learning Mode' : `${currentIdx + 1} / ${questions.length}`}
            </span>
          </div>

          {(mode === 'timed' || mode === 'master') && (
            <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-colors",
                globalTimeLeft < 300 ? "bg-rose-50 border-rose-100 text-rose-600 animate-pulse" : "bg-indigo-50 border-indigo-100 text-indigo-600"
            )}>
                <Clock size={16} />
                <span>{formatTime(globalTimeLeft)}</span>
            </div>
          )}
      </div>

      <div className={cn("space-y-6", mode === 'learning' ? "flex flex-col gap-8" : "")}>
        {learningQuestions.map((q, qIdx) => {
           const actualIdx = mode === 'learning' ? qIdx : currentIdx;
           
           return (
             <motion.div
               key={q.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-xl shadow-gray-100/50"
             >
               <div className="flex items-center justify-between mb-2">
                 <span className="text-indigo-600 font-bold">Q{actualIdx + 1}.</span>
                 {q.section && (
                   <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-lg">
                     {q.section}
                   </span>
                 )}
               </div>
               <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-10">
                 {q.text}
               </h3>

               <div className="grid grid-cols-1 gap-3">
                 {q.options.map((option, idx) => {
                   const isSelected = userAnswers[actualIdx] === idx;
                   const isCorrect = idx === q.correctAnswer;
                   const optionLabel = String.fromCharCode(65 + idx);
                   
                   let variant = "default";
                   if (mode === 'learning' || (showExplanation && actualIdx === currentIdx)) {
                     if (isCorrect) variant = "correct";
                     else if (isSelected) variant = "incorrect";
                     else if (userAnswers[actualIdx] !== null) variant = "dimmed";
                   }

                   return (
                     <button
                       key={idx}
                       disabled={userAnswers[actualIdx] !== null && mode !== 'learning'}
                       onClick={() => handleAnswer(idx, actualIdx)}
                       className={cn(
                         "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left",
                         variant === "default" && "border-gray-100 hover:border-indigo-600 bg-gray-50 hover:bg-white active:scale-[0.99] shadow-sm",
                         variant === "correct" && "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-100",
                         variant === "incorrect" && "border-rose-500 bg-rose-50 text-rose-900 shadow-lg shadow-rose-100",
                         variant === "dimmed" && "border-gray-100 bg-gray-50/50 opacity-40"
                       )}
                     >
                       <span className={cn(
                         "w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg font-bold text-sm",
                         variant === "default" && "bg-white border border-gray-200 text-gray-500 group-hover:border-indigo-600 group-hover:text-indigo-600",
                         variant === "correct" && "bg-emerald-500 text-white",
                         variant === "incorrect" && "bg-rose-500 text-white",
                         variant === "dimmed" && "bg-gray-100 text-gray-400"
                       )}>
                         {optionLabel}
                       </span>
                       <span className="text-base font-semibold">{option}</span>
                     </button>
                   );
                 })}
               </div>

               {(mode === 'learning' || (showExplanation && actualIdx === currentIdx)) && q.explanation && (
                  <div className="mt-8 bg-gray-900 text-white p-6 rounded-2xl shadow-lg shadow-gray-200">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 italic">Tutor Insight</h4>
                    <p className="text-base leading-relaxed text-gray-200">{q.explanation}</p>
                  </div>
               )}
             </motion.div>
           );
        })}

        {mode === 'learning' && (
          <div className="pt-12 pb-20 text-center">
            <button
              onClick={() => {
                setIsFinished(true);
                onFinish(score);
              }}
              className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200"
            >
              Finish Learning Session
            </button>
          </div>
        )}
      </div>

      {mode !== 'learning' && (
        <div className="flex items-center justify-between gap-4 sticky bottom-8 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-lg lg:relative lg:bottom-0 lg:bg-transparent lg:border-0 lg:shadow-none">
          <button
            onClick={handlePrevious}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 rounded-xl font-bold border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            {currentIdx < questions.length - 1 ? 'Next' : 'Finish'}
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
