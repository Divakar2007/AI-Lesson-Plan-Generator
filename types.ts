
export interface Activity {
  step: string;
  description: string;
  time: number;
}

export interface Assessment {
    description: string;
    items: string[];
}

export interface LessonPlan {
  title: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  objectives: string[];
  materials: string[];
  activities: Activity[];
  assessment: Assessment;
  differentiation: Assessment;
}
