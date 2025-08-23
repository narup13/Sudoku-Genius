'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type SudokuCellProps = {
  value: number;
  notes: number[];
  isInitial: boolean;
  isSelected: boolean;
  isRelated: boolean;
  hasConflict: boolean;
  isHinted: boolean;
  isPaused: boolean;
  onClick: () => void;
};

export function SudokuCell({
  value,
  notes,
  isInitial,
  isSelected,
  isRelated,
  hasConflict,
  isHinted,
  isPaused,
  onClick,
}: SudokuCellProps) {
  const cellClasses = cn(
    'flex items-center justify-center aspect-square text-2xl md:text-3xl font-medium cursor-pointer border-r border-b border-gridlines/30 transition-colors duration-150',
    'last:border-r-0',
    'group-odd:last:border-b-0',
    {
      'bg-background': !isRelated && !isSelected,
      'bg-related': isRelated && !isSelected,
      'bg-selected text-primary-foreground': isSelected,
      'text-foreground/80': isInitial,
      'text-primary': !isInitial && !hasConflict && value !== 0,
      'bg-conflict text-destructive-foreground animate-pulse': hasConflict,
      'ring-2 ring-warning ring-offset-2 ring-offset-background z-10': isHinted,
      'text-transparent': isPaused,
    }
  );
  
  return (
    <div className={cellClasses} onClick={isInitial || isPaused ? undefined : onClick}>
      {value !== 0 ? (
        <span>{value}</span>
      ) : (
        <div className="grid h-full w-full grid-cols-3 grid-rows-3 p-0.5">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((note) => (
            <div
              key={note}
              className={cn(
                'flex items-center justify-center text-[10px] text-muted-foreground',
                { 'invisible': !notes.includes(note) || isPaused }
              )}
            >
              {note}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
