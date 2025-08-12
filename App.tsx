import React, { useState, useCallback, useRef } from 'react';
import type { LessonPlan } from './types';
import { generateLessonPlan } from './services/geminiService';
import Header from './components/Header';
import LessonForm from './components/LessonForm';
import LessonPlanDisplay from './components/LessonPlanDisplay';
import Spinner from './components/Spinner';
import { BookOpen, AlertTriangle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGeneratePlan = useCallback(async (formData: {
    subject: string;
    gradeLevel: string;
    duration: string;
    topic: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setLessonPlan(null);

    // Scroll to results section smoothly
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const plan = await generateLessonPlan(formData);
      setLessonPlan(plan);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Failed to generate lesson plan: ${e.message}. Please check your API key and try again.`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!lessonPlan) return;

    const formatSection = (title: string, items: string[] | { step: string; description: string; time: number }[]) => {
      let content = '';
      if (Array.isArray(items)) {
          if (items.length > 0 && typeof items[0] === 'object' && 'step' in items[0]) {
              content = (items as { step: string; description: string; time: number }[]).map(item => `- ${item.step} (${item.time} mins): ${item.description}`).join('\n');
          } else {
              content = (items as string[]).map(item => `- ${item}`).join('\n');
          }
      }
      return `${title}\n${'='.repeat(title.length)}\n${content}\n\n`;
    };
    
    const formatAssessment = (title: string, assessment: { description: string; items: string[] }) => {
        const itemsContent = assessment.items.map(item => `- ${item}`).join('\n');
        return `${title}\n${'='.repeat(title.length)}\n${assessment.description}\n${itemsContent}\n\n`;
    }

    const textContent = `
${lessonPlan.title.toUpperCase()}
========================================

Subject: ${lessonPlan.subject}
Grade Level: ${lessonPlan.gradeLevel}
Duration: ${lessonPlan.duration}

${formatSection('Learning Objectives', lessonPlan.objectives)}
${formatSection('Materials Needed', lessonPlan.materials)}
${formatSection('Lesson Activities', lessonPlan.activities)}
${formatAssessment('Assessment & Evaluation', lessonPlan.assessment)}
${formatAssessment('Differentiation & Accommodations', lessonPlan.differentiation)}
    `;

    const blob = new Blob([textContent.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonPlan.title.replace(/\s+/g, '_').toLowerCase()}_lesson_plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [lessonPlan]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 antialiased">
      <div className="no-print">
        <Header />
        <main className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full px-4 py-1 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Gemini
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 sm:text-6xl">
              Instant Lesson Plans
            </h1>
            <p className="mt-6 text-lg max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
              Describe your lesson topic, and let AI craft a detailed, ready-to-teach plan in seconds. From objectives to assessments, we've got you covered.
            </p>
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <LessonForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
          </div>
        </main>
      </div>

      <div ref={resultsRef} className="container mx-auto px-4 pb-12 print-container">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-white/50 dark:bg-slate-800/50 shadow-md backdrop-blur-sm">
            <Spinner />
            <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
              Crafting your lesson plan...
            </p>
            <p className="text-slate-500 dark:text-slate-400">The AI is putting on its thinking cap! This may take a moment.</p>
          </div>
        )}
        {error && (
          <div className="max-w-2xl mx-auto p-6 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-200 shadow-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 mr-3 text-red-500" />
              <h3 className="text-lg font-semibold">An Error Occurred</h3>
            </div>
            <p className="mt-2 pl-9">{error}</p>
          </div>
        )}
        {lessonPlan && (
          <LessonPlanDisplay
            plan={lessonPlan}
            onSave={handleSave}
            onPrint={handlePrint}
          />
        )}
        {!isLoading && !error && !lessonPlan && (
           <div className="max-w-2xl mx-auto text-center py-16 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
             <BookOpen className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
            <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-white">Your beautifully crafted lesson plan will appear here</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Fill out the form above to begin the magic.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;