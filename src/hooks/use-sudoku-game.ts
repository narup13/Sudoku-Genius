'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generatePuzzle, checkConflicts, isSolved, Difficulty, Grid, Cell, Notes } from '@/lib/sudoku';
import { generateHint, GenerateHintOutput } from '@/ai/flows/generate-hint';
import { displaySolution } from '@/ai/flows/display-solution';

type GameHistory = {
  grid: Grid;
  notes: Notes;
};

const EMPTY_GRID = Array(9).fill(Array(9).fill(0)) as Grid;

export function useSudokuGame() {
  const [isClient, setIsClient] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [initialGrid, setInitialGrid] = useState<Grid>(EMPTY_GRID);
  const [grid, setGrid] = useState<Grid>(EMPTY_GRID);
  const [notes, setNotes] = useState<Notes>({});
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [hint, setHint] = useState<GenerateHintOutput | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  const { toast } = useToast();

  const conflicts = useMemo(() => checkConflicts(grid), [grid]);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // --- Effects ---
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      loadGame();
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      saveGame();
    }
  }, [grid, notes, time, difficulty, history, historyIndex, isComplete, bestTime]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (!isPaused && !isComplete) {
      timerId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isPaused, isComplete]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell || isComplete) return;

      const { row, col } = selectedCell;
      if (initialGrid[row][col] !== 0) return;

      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10);
        updateCell(row, col, num);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        updateCell(row, col, 0);
      } else if (e.key.toLowerCase() === 'n') {
        toggleNotesMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, isNotesMode, initialGrid, isComplete]);

  // --- Game State Management ---
  const handleNewGame = useCallback((newDifficulty: Difficulty) => {
    const { puzzle } = generatePuzzle(newDifficulty);
    setDifficulty(newDifficulty);
    setInitialGrid(puzzle);
    setGrid(puzzle);
    setNotes({});
    setSelectedCell(null);
    setHistory([{ grid: puzzle, notes: {} }]);
    setHistoryIndex(0);
    setTime(0);
    setIsComplete(false);
    setIsPaused(false);
    setHint(null);
    loadBestTime(newDifficulty);
  }, []);

  const restartPuzzle = () => {
    setGrid(initialGrid);
    setNotes({});
    setHistory([{ grid: initialGrid, notes: {} }]);
    setHistoryIndex(0);
    setTime(0);
    setIsComplete(false);
    setHint(null);
  }

  const checkCompletion = (currentGrid: Grid) => {
    if (isSolved(currentGrid)) {
        setIsComplete(true);
        if(!bestTime || time < bestTime) {
            setBestTime(time);
            toast({
              title: "New Best Time!",
              description: `You solved the ${difficulty} puzzle in ${new Date(time * 1000).toISOString().substr(14, 5)}.`,
            });
        }
    }
  }

  const addToHistory = (newGrid: Grid, newNotes: Notes) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ grid: newGrid, notes: newNotes });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const updateCell = (row: number, col: number, value: number) => {
    if (isNotesMode) {
      const cellKey = `${row}-${col}`;
      const currentNotes = notes[cellKey] || [];
      const newNotes = currentNotes.includes(value)
        ? currentNotes.filter((n) => n !== value)
        : [...currentNotes, value];
      
      const updatedNotes = { ...notes, [cellKey]: newNotes.sort() };
      setNotes(updatedNotes);
      addToHistory(grid, updatedNotes);
    } else {
      const newGrid = grid.map((r, i) =>
        i === row ? r.map((c, j) => (j === col ? value : c)) : r
      );
      setGrid(newGrid);
      addToHistory(newGrid, notes);
      checkCompletion(newGrid);
      setHint(null);
    }
  }

  const undo = () => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevState = history[newIndex];
      setGrid(prevState.grid);
      setNotes(prevState.notes);
    }
  };

  const redo = () => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextState = history[newIndex];
      setGrid(nextState.grid);
      setNotes(nextState.notes);
    }
  };

  // --- User Actions ---
  const handleCellClick = (row: number, col: number) => {
    if (isPaused) return;
    if (initialGrid[row][col] !== 0) {
      setSelectedCell(null);
      return;
    }
    setSelectedCell({ row, col });
  };
  
  const handleNumpadClick = (num: number | 'erase') => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const value = num === 'erase' ? 0 : num;
    updateCell(row, col, value);
  }

  const toggleNotesMode = () => setIsNotesMode(!isNotesMode);

  // --- AI Actions ---
  const getHint = async () => {
    try {
      const hintResult = await generateHint({ grid });
      setHint(hintResult);
      setSelectedCell({row: hintResult.row, col: hintResult.col});
    } catch (error) {
      console.error('Failed to get hint:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch a hint at this time.',
        variant: 'destructive',
      });
    }
  };

  const solvePuzzle = async () => {
    setIsSolving(true);
    try {
      const solutionResult = await displaySolution({ puzzle: initialGrid });
      setGrid(solutionResult.solution);
      setNotes({});
      addToHistory(solutionResult.solution, {});
      checkCompletion(solutionResult.solution);
      setIsComplete(true);
      setHint(null);
    } catch (error) {
       console.error('Failed to solve puzzle:', error);
       toast({
         title: 'Error',
         description: 'Could not solve the puzzle at this time.',
         variant: 'destructive',
       });
    } finally {
      setIsSolving(false);
    }
  };

  // --- Persistence ---
  const saveGame = () => {
    const gameState = {
      difficulty,
      initialGrid,
      grid,
      notes,
      history,
      historyIndex,
      time,
      isComplete,
    };
    localStorage.setItem('sudokuGameState', JSON.stringify(gameState));
    if (bestTime) {
       localStorage.setItem(`sudokuBestTime-${difficulty}`, bestTime.toString());
    }
  };

  const loadGame = () => {
    const savedState = localStorage.getItem('sudokuGameState');
    if (savedState) {
      const { difficulty, initialGrid, grid, notes, history, historyIndex, time, isComplete } = JSON.parse(savedState);
      setDifficulty(difficulty);
      setInitialGrid(initialGrid);
      setGrid(grid);
      setNotes(notes);
      setHistory(history);
      setHistoryIndex(historyIndex);
      setTime(time);
      setIsComplete(isComplete);
      loadBestTime(difficulty);
    } else {
      handleNewGame('easy');
    }
  };
  
  const loadBestTime = (diff: Difficulty) => {
    const savedBestTime = localStorage.getItem(`sudokuBestTime-${diff}`);
    if(savedBestTime) {
      setBestTime(parseInt(savedBestTime, 10));
    } else {
      setBestTime(null);
    }
  };

  return {
    isClient,
    grid,
    initialGrid,
    notes,
    selectedCell,
    isNotesMode,
    history,
    historyIndex,
    time,
    isPaused,
    isComplete,
    difficulty,
    conflicts,
    canUndo,
    canRedo,
    hint,
    isSolving,
    bestTime,
    handleNewGame,
    restartPuzzle,
    handleCellClick,
    handleNumpadClick,
    toggleNotesMode,
    undo,
    redo,
    getHint,
    solvePuzzle,
  };
}
