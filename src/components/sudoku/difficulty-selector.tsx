'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Difficulty } from '@/lib/sudoku';

type DifficultySelectorProps = {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
};

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
];

export function DifficultySelector({
  onSelectDifficulty,
  currentDifficulty,
}: DifficultySelectorProps) {
  return (
    <Select
      onValueChange={(value: Difficulty) => onSelectDifficulty(value)}
      defaultValue={currentDifficulty}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent>
        {difficulties.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
