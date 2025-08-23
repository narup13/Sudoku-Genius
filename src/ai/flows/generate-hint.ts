// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating Sudoku hints.
 *
 * - generateHint - A function that takes a Sudoku grid and returns a hint.
 * - GenerateHintInput - The input type for the generateHint function.
 * - GenerateHintOutput - The return type for the generateHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SudokuGridSchema = z.array(z.array(z.number().min(0).max(9))).length(9).element(z.array(z.number().min(0).max(9)).length(9));

const GenerateHintInputSchema = z.object({
  grid: SudokuGridSchema.describe('The current state of the Sudoku grid. Use 0 for empty cells.'),
});
export type GenerateHintInput = z.infer<typeof GenerateHintInputSchema>;

const GenerateHintOutputSchema = z.object({
  row: z.number().min(0).max(8).describe('The row index of the cell to fill (0-indexed).'),
  col: z.number().min(0).max(8).describe('The column index of the cell to fill (0-indexed).'),
  value: z.number().min(1).max(9).describe('The value to place in the cell.'),
  reasoning: z.string().describe('The reasoning behind the hint, explaining the solving technique used.'),
});
export type GenerateHintOutput = z.infer<typeof GenerateHintOutputSchema>;

export async function generateHint(input: GenerateHintInput): Promise<GenerateHintOutput> {
  return generateHintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHintPrompt',
  input: {schema: GenerateHintInputSchema},
  output: {schema: GenerateHintOutputSchema},
  prompt: `You are an expert Sudoku solver. Given the current state of a Sudoku grid, your task is to provide a hint by suggesting the next logical move. The hint should include the row and column of the cell to fill (0-indexed), the value to place in the cell, and a clear explanation of the solving technique used.

Sudoku Grid:
{{#each grid}}
  {{#each this}}
    {{this}} 
  {{/each}}
{{/each}}

Respond in JSON format with 'row', 'col', 'value', and 'reasoning' fields, following the GenerateHintOutputSchema.
`,
});

const generateHintFlow = ai.defineFlow(
  {
    name: 'generateHintFlow',
    inputSchema: GenerateHintInputSchema,
    outputSchema: GenerateHintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
