import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';

interface LessonFormProps {
  onSubmit: (data: { subject: string; gradeLevel: string; duration: string; topic: string }) => void;
  isLoading: boolean;
}

const gradeLevels = ["Kindergarten", "Grades 1-2", "Grades 3-5", "Middle School (Grades 6-8)", "High School (Grades 9-12)"];
const durations = ["30 minutes", "45 minutes", "60 minutes", "90 minutes"];

const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, isLoading }) => {
  const [subject, setSubject] = useState('Science');
  const [gradeLevel, setGradeLevel] = useState('Grades 3-5');
  const [duration, setDuration] = useState('45 minutes');
  const [topic, setTopic] = useState('The Water Cycle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit({ subject, gradeLevel, duration, topic });
    }
  };

  const inputClasses = "mt-1 block w-full px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500 transition-all duration-150 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="subject" className={labelClasses}>Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClasses}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="gradeLevel" className={labelClasses}>Grade Level</label>
          <select
            id="gradeLevel"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className={inputClasses}
            disabled={isLoading}
          >
            {gradeLevels.map(gl => <option key={gl} value={gl}>{gl}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="duration" className={labelClasses}>Lesson Duration</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={inputClasses}
            disabled={isLoading}
          >
            {durations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="topic" className={labelClasses}>Lesson Topic</label>
        <p className="text-xs text-slate-500 dark:text-slate-400">Be specific! The more detail, the better the plan.</p>
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={`${inputClasses} text-base`}
          placeholder="e.g., Photosynthesis and its importance for life on Earth"
          required
          disabled={isLoading}
        />
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:bg-slate-400 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900 transform hover:scale-[1.02] transition-transform duration-200 ease-in-out"
        >
          {isLoading ? (
            'Generating...'
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Lesson Plan
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LessonForm;