'use client';

import React from 'react';
import {
  AlertCircle,
  BrainCircuit,
  RotateCcw,
  Settings,
  Undo,
  Redo,
  Lightbulb,
  Award,
} from 'lucide-react';
import { SudokuBoard } from '@/components/sudoku/sudoku-board';
import { Numpad } from '@/components/sudoku/numpad';
import { Controls } from '@/components/sudoku/controls';
import { ThemeToggle } from '@/components/sudoku/theme-toggle';
import { DifficultySelector } from '@/components/sudoku/difficulty-selector';
import { Timer } from '@/components/sudoku/timer';
import { useSudokuGame } from '@/hooks/use-sudoku-game';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function SudokuPage() {
  const game = useSudokuGame();

  if (!game.isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <BrainCircuit className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }
  
  const progress = game.isComplete
    ? 100
    : Math.round(
        (game.grid.flat().filter(Boolean).length / 81) * 100
      );

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-2 px-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
              Sudoku Genius
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <DifficultySelector
              onSelectDifficulty={game.handleNewGame}
              currentDifficulty={game.difficulty}
            />
            <ThemeToggle />
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Game settings and options will be here.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center p-2 md:p-4">
          <div className="flex w-full max-w-5xl flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
            {/* Left Panel */}
            <div className="flex w-full flex-col gap-4 lg:w-auto lg:max-w-xs">
               <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 text-card-foreground">
                <Timer
                  time={game.time}
                  isPaused={game.isPaused || game.isComplete}
                />
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <Award className="h-5 w-5 text-yellow-500" />
                   Best: {game.bestTime ? new Date(game.bestTime * 1000).toISOString().substr(14, 5) : 'N/A'}
                 </div>
              </div>
              
              <div className="rounded-lg border bg-card p-4 text-card-foreground">
                 <div className="mb-2 flex items-center justify-between text-sm font-medium">
                    <span>Progress</span>
                    <span className="text-primary">{progress}%</span>
                  </div>
                <Progress value={progress} />
              </div>

              {game.isComplete && (
                <Dialog defaultOpen>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl text-success">
                        Puzzle Complete!
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Congratulations! You solved the puzzle in{' '}
                        {new Date(game.time * 1000).toISOString().substr(14, 5)}.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        onClick={() => game.handleNewGame(game.difficulty)}
                        className="w-full"
                      >
                        Play Again
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {game.hint && (
                <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                    <div>
                      <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">AI Hint</h3>
                      <p className="text-sm text-muted-foreground">{game.hint.reasoning}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Center Panel (Sudoku Board) */}
            <div className="relative flex-shrink-0">
               <SudokuBoard
                grid={game.grid}
                initialGrid={game.initialGrid}
                onCellClick={game.handleCellClick}
                selectedCell={game.selectedCell}
                notes={game.notes}
                conflicts={game.conflicts}
                isPaused={game.isPaused}
                hintCell={game.hint ? {row: game.hint.row, col: game.hint.col} : null}
              />
               <Numpad onNumberClick={game.handleNumpadClick} isNotesMode={game.isNotesMode} onToggleNotes={game.toggleNotesMode} />
            </div>

            {/* Right Panel */}
            <div className="flex w-full flex-col gap-4 lg:w-auto lg:max-w-xs">
                <Controls
                    onUndo={game.undo}
                    onRedo={game.redo}
                    canUndo={game.canUndo}
                    canRedo={game.canRedo}
                    onHint={game.getHint}
                    onSolve={game.solvePuzzle}
                    onRestart={game.restartPuzzle}
                    isSolving={game.isSolving}
                />
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
