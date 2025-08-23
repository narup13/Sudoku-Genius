// Implemented with Genkit v1.x
'use server';
/**
 * @fileOverview AI flow to display the solution to a Sudoku puzzle or provide a step-by-step AI solve.
 *
 * - displaySolution - A function that initiates the solution display process.
 * - DisplaySolutionInput - The input type for the displaySolution function.
 * - DisplaySolutionOutput - The return type for the displaySolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplaySolutionInputSchema = z.object({
  puzzle: z
    .array(z.array(z.number()))
    .describe('The Sudoku puzzle to solve, represented as a 2D array of numbers.'),
  stepByStep: z
    .boolean()
    .optional()
    .describe('Whether to provide a step-by-step solution instead of the complete solution.'),
});
export type DisplaySolutionInput = z.infer<typeof DisplaySolutionInputSchema>;

const DisplaySolutionOutputSchema = z.object({
  solution: z
    .array(z.array(z.number()))
    .describe('The solved Sudoku puzzle, represented as a 2D array of numbers.'),
  steps: z
    .array(z.string())
    .optional()
    .describe('The steps taken to solve the Sudoku puzzle, if stepByStep is true.'),
});
export type DisplaySolutionOutput = z.infer<typeof DisplaySolutionOutputSchema>;

export async function displaySolution(input: DisplaySolutionInput): Promise<DisplaySolutionOutput> {
  return displaySolutionFlow(input);
}

const displaySolutionPrompt = ai.definePrompt({
  name: 'displaySolutionPrompt',
  input: {schema: DisplaySolutionInputSchema},
  output: {schema: DisplaySolutionOutputSchema},
  prompt: `You are an expert Sudoku solver. Given a Sudoku puzzle, you will provide the complete solution or a step-by-step solution based on the user's request.

Puzzle:
{{#each puzzle}}
  {{#each this}}
    {{this}} 
  {{/each}}
{{/each}}

{{#if stepByStep}}
  Provide a step-by-step explanation of how to solve the puzzle using human-like solving techniques (e.g., Naked Single, Hidden Single, etc.).
{{else}}
  Provide the complete solution to the puzzle.
{{/if}}`,
});

const displaySolutionFlow = ai.defineFlow(
  {
    name: 'displaySolutionFlow',
    inputSchema: DisplaySolutionInputSchema,
    outputSchema: DisplaySolutionOutputSchema,
  },
  async input => {
    const {output} = await displaySolutionPrompt(input);
    return output!;
  }
);
