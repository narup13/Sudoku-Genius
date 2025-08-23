export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Grid = number[][];
export type Cell = { row: number; col: number };
export type Notes = Record<string, number[]>;

const puzzles: Record<Difficulty, string[]> = {
  easy: [
    '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
  ],
  medium: [
    '003020600900305001001806400008102900700000008006708200002609500800203009005010300',
  ],
  hard: [
    '400000805030000000007000000020000060000080400000010000000603070500200000104000000',
  ],
  expert: [
    '800000000003600000070090200050007000000045700000100030001000068008500010090000400',
  ],
};

const solutions: Record<string, string> = {
    '530070000600195000098000060800060003400803001700020006060000280000419005000080079': '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
};


const stringToGrid = (str: string): Grid => {
  const grid: Grid = [];
  for (let i = 0; i < 9; i++) {
    grid.push(
      str
        .substring(i * 9, i * 9 + 9)
        .split('')
        .map(Number)
    );
  }
  return grid;
};

export const generatePuzzle = (difficulty: Difficulty): { puzzle: Grid, solution: Grid } => {
  const puzzleStr = puzzles[difficulty][0];
  const solutionStr = solutions[puzzleStr];
  return {
    puzzle: stringToGrid(puzzleStr),
    solution: solutionStr ? stringToGrid(solutionStr) : stringToGrid('0'.repeat(81)),
  };
};

export const checkConflicts = (grid: Grid): Record<string, boolean> => {
    const conflicts: Record<string, boolean> = {};
    const hasConflict = (val: number, cells: {r: number, c: number}[]) => {
        const numbers = cells.map(({r,c}) => grid[r][c]).filter(n => n !== 0);
        if (numbers.includes(val)) {
            const firstIndex = numbers.indexOf(val);
            const lastIndex = numbers.lastIndexOf(val);
            if (firstIndex !== lastIndex) {
                cells.forEach(({r, c}) => {
                    if (grid[r][c] === val) {
                        conflicts[`${r}-${c}`] = true;
                    }
                });
            }
        }
    };
    
    // Check rows and columns
    for (let i = 0; i < 9; i++) {
        const rowCells = Array(9).fill(0).map((_, c) => ({r: i, c}));
        const colCells = Array(9).fill(0).map((_, r) => ({r, c: i}));
        for (let j = 0; j < 9; j++) {
            hasConflict(grid[i][j], rowCells);
            hasConflict(grid[j][i], colCells);
        }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            const boxCells: {r: number, c: number}[] = [];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    boxCells.push({r: boxRow*3+r, c: boxCol*3+c});
                }
            }
            boxCells.forEach(({r, c}) => hasConflict(grid[r][c], boxCells));
        }
    }

    return conflicts;
};


export const isSolved = (grid: Grid): boolean => {
  for (let i = 0; i < 9; i++) {
    const row = new Set();
    const col = new Set();
    const box = new Set();
    for (let j = 0; j < 9; j++) {
      // Check for empty cells
      if (grid[i][j] === 0 || grid[j][i] === 0) return false;

      // Check rows and columns
      if (row.has(grid[i][j]) || col.has(grid[j][i])) return false;
      row.add(grid[i][j]);
      col.add(grid[j][i]);
      
      // Check 3x3 boxes
      const boxRow = 3 * Math.floor(i / 3) + Math.floor(j / 3);
      const boxCol = 3 * (i % 3) + (j % 3);
      if (box.has(grid[boxRow][boxCol])) return false;
      box.add(grid[boxRow][boxCol]);
    }
  }
  return true;
};
