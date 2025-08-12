
import { GoogleGenAI, Type } from "@google/genai";
import type { LessonPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative and engaging title for the lesson plan." },
    subject: { type: Type.STRING },
    gradeLevel: { type: Type.STRING },
    duration: { type: Type.STRING },
    objectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-5 clear, measurable learning objectives."
    },
    materials: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of all materials, tools, and resources needed for the lesson."
    },
    activities: {
      type: Type.ARRAY,
      description: "A step-by-step breakdown of lesson activities, from introduction to conclusion.",
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.STRING, description: "The name of the activity step (e.g., 'Introduction', 'Guided Practice', 'Group Work', 'Conclusion')." },
          description: { type: Type.STRING, description: "A detailed description of the teacher and student actions during this step." },
          time: { type: Type.INTEGER, description: "Estimated time in minutes for this activity step." }
        },
        required: ["step", "description", "time"]
      }
    },
    assessment: {
      type: Type.OBJECT,
      description: "Methods for assessing student learning.",
      properties: {
        description: { type: Type.STRING, description: "A brief overview of the assessment strategy (e.g., 'Formative and summative assessments will be used.')." },
        items: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of specific assessment methods (e.g., 'Class discussion', 'Exit ticket questions', 'Worksheet completion')."}
      },
      required: ["description", "items"]
    },
    differentiation: {
        type: Type.OBJECT,
        description: "Strategies to support diverse learners.",
        properties: {
          description: { type: Type.STRING, description: "A brief overview of the differentiation strategy."},
          items: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of specific accommodations for different learning needs (e.g., 'Provide sentence starters for struggling writers', 'Offer extension activities for advanced learners')."}
        },
        required: ["description", "items"]
    }
  },
  required: ["title", "subject", "gradeLevel", "duration", "objectives", "materials", "activities", "assessment", "differentiation"]
};

export const generateLessonPlan = async (
    { subject, gradeLevel, duration, topic }: { subject: string; gradeLevel: string; duration: string; topic: string }
): Promise<LessonPlan> => {
  const prompt = `
    Generate a comprehensive lesson plan for an educator.

    **Instructions:**
    1.  The lesson plan must be detailed, practical, and easy for a teacher to follow.
    2.  The tone should be professional and supportive.
    3.  Create content that is age-appropriate for the specified grade level.
    4.  Ensure the activities logically fit within the specified duration.
    5.  The 'title' should be creative and relevant to the topic.
    
    **Lesson Details:**
    -   **Topic:** ${topic}
    -   **Subject:** ${subject}
    -   **Grade Level:** ${gradeLevel}
    -   **Total Duration:** ${duration}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedPlan: LessonPlan = JSON.parse(jsonText);
    
    // Ensure the generated plan details match the request
    parsedPlan.subject = subject;
    parsedPlan.gradeLevel = gradeLevel;
    parsedPlan.duration = duration;

    return parsedPlan;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
