'use server';
/**
 * @fileOverview A Genkit flow for recommending activities to students based on MITS PDC categories.
 *
 * - recommendActivities - A function that generates personalized activity recommendations for a student.
 * - StudentActivityRecommendationsInput - The input type for the recommendActivities function.
 * - StudentActivityRecommendationsOutput - The return type for the recommendActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategoryRuleSchema = z.object({
  categoryName: z.string().describe('The name of the activity category.'),
  maxCredits:
    z.number().describe('The maximum credits allowed for this category.'),
  weightage:
    z.number().describe('The weightage of this category in PDC score calculation.'),
});

const StudentActivityRecommendationsInputSchema = z.object({
  currentCreditsByCategory:
    z.record(z.string(), z.number())
      .describe(
        'A map where keys are category names and values are the current credits earned by the student in that category.'
      ),
  categoryRules:
    z.array(CategoryRuleSchema)
      .describe('An array of rules for each activity category.'),
  studentInterests:
    z.array(z.string())
      .describe('A list of activities or subjects the student is interested in.'),
});
export type StudentActivityRecommendationsInput = z.infer<
  typeof StudentActivityRecommendationsInputSchema
>;

const RecommendationSchema = z.object({
  activity:
    z.string().describe('A suggested activity, e.g., "Web Development Workshop".'),
  category:
    z.string().describe('The category this activity belongs to, e.g., "Workshops".'),
  reason:
    z.string()
      .describe(
        'The reason for the recommendation, considering missing credits, category limits, or student interests.'
      ),
});

const StudentActivityRecommendationsOutputSchema = z.object({
  recommendations:
    z.array(RecommendationSchema)
      .describe('A list of recommended activities for the student.'),
});
export type StudentActivityRecommendationsOutput = z.infer<
  typeof StudentActivityRecommendationsOutputSchema
>;

export async function recommendActivities(
  input: StudentActivityRecommendationsInput
): Promise<StudentActivityRecommendationsOutput> {
  return studentActivityRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studentActivityRecommendationsPrompt',
  input: {schema: StudentActivityRecommendationsInputSchema},
  output: {schema: StudentActivityRecommendationsOutputSchema},
  prompt: `You are an AI assistant specialized in academic advising for the PDC evaluation system at MITS Gwalior. Your task is to analyze a student's current credit status and provide personalized activity recommendations to help them reach their maximum PDC points.

**Student's Current Credits by Category:**
{{#each currentCreditsByCategory}}
  - {{ @key }}: {{this}} credits
{{/each}}

**PDC Category Rules:**
{{#each categoryRules}}
  - Category: {{{categoryName}}}, Max Credits: {{{maxCredits}}}
{{/each}}

**Student Interests:**
{{#each studentInterests}}
  - {{{this}}}
{{/each}}

Analyze the provided data and identify categories where the student has not yet reached the maximum allowed credits. 

MITS PDC Categories include:
1. Institute level (C1): Quizzes, extemporary, debate, student volunteers, seminar, industrial visit. (Max 8 pts)
2. State level (C2): Robotics, coding challenge, social welfare, cultural/technical fest, hackathon, sports. (Max 9 pts)
3. National level (C3): Hands-on workshops, national seminars/conferences, model making, Entrepreneurship, youth festival, research, project competitions, GATE/CAT. (Max 10 pts)
4. Department level committees (C4): OBE coordinators, BOS members, placement committee, alumni cell, Class representatives. (Max 5 pts)
5. Institute level committees (C5): Institutional Placement cell, Gender champions, anti-ragging committees, mess committees, innovation/startup cells, Student Mentors, IQAC. (Max 6 pts)
6. MOOCS (C6): Technical certification courses from NPTEL, SWAYAM, EdX, Coursera, etc. (Max 12 pts)

Prioritize recommendations that align with the student's stated interests.

For each recommendation, provide:
1.  A specific 'activity' suggestion.
2.  The 'category' it falls under (exactly as listed in the rules).
3.  A 'reason' explaining how it helps bridge a credit gap and aligns with their interests.

Generate 3 to 5 distinct recommendations.`,
});

const studentActivityRecommendationsFlow = ai.defineFlow(
  {
    name: 'studentActivityRecommendationsFlow',
    inputSchema: StudentActivityRecommendationsInputSchema,
    outputSchema: StudentActivityRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
