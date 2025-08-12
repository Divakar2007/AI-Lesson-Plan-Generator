import React from 'react';
import type { LessonPlan, Activity, Assessment } from '../types';
import { Save, Printer, Target, Book, Beaker, CheckSquare, Users, Award, Clock, ListChecks } from 'lucide-react';

interface LessonPlanDisplayProps {
  plan: LessonPlan;
  onSave: () => void;
  onPrint: () => void;
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode, className?: string }> = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl p-6 shadow-lg border border-slate-200/80 dark:border-slate-700/80 ${className}`}>
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-lg p-3 shadow-md mr-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h3>
    </div>
    <div className="space-y-3 text-slate-700 dark:text-slate-300 pl-14 text-base">{children}</div>
  </div>
);

const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({ plan, onSave, onPrint }) => {
  return (
    <div className="max-w-4xl mx-auto my-8 p-4 sm:p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700">
      <header className="mb-10 text-center print-break-after">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-3">{plan.title}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-md text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center"><Award className="w-4 h-4 mr-1.5 text-indigo-500" /> {plan.subject}</span>
          <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-indigo-500" /> {plan.gradeLevel}</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-indigo-500" /> {plan.duration}</span>
        </div>
        <div className="mt-8 flex justify-center gap-3 no-print">
          <button onClick={onSave} className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg shadow-sm text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <Save className="w-4 h-4 mr-2" /> Save as .txt
          </button>
          <button onClick={onPrint} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform hover:scale-105 transition-transform">
            <Printer className="w-4 h-4 mr-2" /> Print Plan
          </button>
        </div>
      </header>

      <main className="space-y-8">
        <SectionCard title="Learning Objectives" icon={<Target className="w-7 h-7" />}>
          <ul className="list-disc list-inside space-y-2">
            {plan.objectives.map((obj, i) => <li key={i} className="pl-2">{obj}</li>)}
          </ul>
        </SectionCard>

        <SectionCard title="Materials & Resources" icon={<Beaker className="w-7 h-7" />}>
          <ul className="list-disc list-inside space-y-2">
            {plan.materials.map((mat, i) => <li key={i} className="pl-2">{mat}</li>)}
          </ul>
        </SectionCard>

        <SectionCard title="Lesson Activities" icon={<Book className="w-7 h-7" />}>
          <div className="relative border-l-2 border-indigo-200 dark:border-indigo-800 space-y-8">
            {plan.activities.map((activity: Activity, i: number) => (
              <div key={i} className="relative pl-8">
                <div className="absolute -left-[11px] top-1 h-5 w-5 bg-white dark:bg-slate-600 rounded-full border-4 border-indigo-500"></div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{activity.step}</h4>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-1">{activity.time} minutes</p>
                <p className="text-slate-600 dark:text-slate-300">{activity.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            <SectionCard title="Assessment" icon={<CheckSquare className="w-7 h-7" />}>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{plan.assessment.description}</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    {plan.assessment.items.map((item, i) => <li key={i} className="pl-2">{item}</li>)}
                </ul>
            </SectionCard>
            
            <SectionCard title="Differentiation" icon={<ListChecks className="w-7 h-7" />}>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{plan.differentiation.description}</p>
                 <ul className="list-disc list-inside space-y-2 mt-2">
                    {plan.differentiation.items.map((item, i) => <li key={i} className="pl-2">{item}</li>)}
                </ul>
            </SectionCard>
        </div>
      </main>
    </div>
  );
};

export default LessonPlanDisplay;