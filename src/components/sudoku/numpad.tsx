'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Pencil } from 'lucide-react';

type NumpadProps = {
  onNumberClick: (num: number | 'erase') => void;
  isNotesMode: boolean;
  onToggleNotes: () => void;
};

export function Numpad({ onNumberClick, isNotesMode, onToggleNotes }: NumpadProps) {
  return (
    <div className="mt-4 grid grid-cols-5 gap-2 lg:hidden">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
        <Button
          key={num}
          variant="outline"
          className="h-14 text-2xl"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </Button>
      ))}
      <Button
        variant={isNotesMode ? 'secondary' : 'outline'}
        className="h-14"
        onClick={onToggleNotes}
      >
        <Pencil className="h-7 w-7" />
      </Button>
      <Button
        variant="outline"
        className="col-span-2 h-14"
        onClick={() => onNumberClick('erase')}
      >
        <Eraser className="h-7 w-7" />
      </Button>
    </div>
  );
}
