'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { SudokuCell } from './sudoku-cell';
import type { Grid, Cell, Notes } from '@/lib/sudoku';

type SudokuBoardProps = {
  grid: Grid;
  initialGrid: Grid;
  notes: Notes;
  selectedCell: Cell | null;
  conflicts: Record<string, boolean>;
  onCellClick: (row: number, col: number) => void;
  isPaused: boolean;
  hintCell: Cell | null;
};

export function SudokuBoard({
  grid,
  initialGrid,
  notes,
  selectedCell,
  conflicts,
  onCellClick,
  isPaused,
  hintCell,
}: SudokuBoardProps) {
  const getRelatedCells = (row: number, col: number) => {
    if (!selectedCell) return false;
    const { row: selRow, col: selCol } = selectedCell;
    const boxStartRow = Math.floor(selRow / 3) * 3;
    const boxStartCol = Math.floor(selCol / 3) * 3;
    const inBox =
      row >= boxStartRow &&
      row < boxStartRow + 3 &&
      col >= boxStartCol &&
      col < boxStartCol + 3;

    return row === selRow || col === selCol || inBox;
  };

  return (
    <div
      className={cn(
        'relative grid grid-cols-9 aspect-square w-full max-w-md select-none rounded-lg border-2 border-gridlines bg-card shadow-lg',
        'sm:max-w-lg md:max-w-xl lg:border-4'
      )}
    >
      {grid.map((rowValues, rowIndex) =>
        rowValues.map((value, colIndex) => {
          const isSelected =
            selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const isRelated = getRelatedCells(rowIndex, colIndex);
          const isInitial = initialGrid[rowIndex][colIndex] !== 0;
          const hasConflict = conflicts[`${rowIndex}-${colIndex}`];
          const isHinted = hintCell?.row === rowIndex && hintCell?.col === colIndex;

          return (
            <React.Fragment key={`${rowIndex}-${colIndex}`}>
              <SudokuCell
                value={value}
                notes={notes[`${rowIndex}-${colIndex}`] || []}
                isInitial={isInitial}
                isSelected={isSelected}
                isRelated={isRelated}
                hasConflict={hasConflict}
                isHinted={isHinted}
                isPaused={isPaused}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
              {/* Thick grid lines */}
              {colIndex === 2 || colIndex === 5 ? (
                <div className="w-px bg-gridlines lg:w-1" />
              ) : null}
            </React.Fragment>
          );
        })
      )}
      {/* Thick grid lines */}
      {[...Array(8)].map((_, i) => (
        (i + 1) % 3 === 0 && <div key={`hr-${i}`} className="col-span-9 h-px bg-gridlines lg:h-1" />
      ))}
      {isPaused && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <p className="text-2xl font-semibold">Paused</p>
        </div>
      )}
    </div>
  );
}
