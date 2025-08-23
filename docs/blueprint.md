# **App Name**: Sudoku Genius AI

## Core Features:

- Interactive Grid: Interactive 9x9 Sudoku grid with cell selection and number input via click/tap or keyboard.
- Notes Mode: Toggleable notes (pencil) mode for placing candidate numbers, with automatic updates on contradictions.
- Highlighting & Validation: Visual highlighting for selected cells, related row/column/box, and instant conflict highlighting.
- Undo/Redo: Unlimited undo and redo functionality for game moves.
- Puzzle Generation & Import: New puzzle generation with multiple difficulty levels (Easy, Medium, Hard, Expert) and guaranteed unique solutions; manual puzzle import also.
- AI Hint System: AI-powered hint system that suggests the next logical move using human-style solving techniques (Naked Single, Hidden Single, etc.) with clear reasoning; AI acts as a tool.
- Save/Resume: Game state persistence using local storage for saving and resuming games, ensuring progress is never lost.
- Timer & Leaderboard: Timer with pause/resume functionality and local storage of best times.
- Restart/New Puzzle: Options to restart the current puzzle or request a new one.
- Settings & Onboarding: Settings panel with customization options (sound, auto-highlight, animations) and clear onboarding tooltips.
- Progress Tracker: Progress tracker showing the percentage of the puzzle solved.
- Solution Display: Option to show the complete solution or a step-by-step AI solve.
- Accessibility Modes: Dark mode, high-contrast mode, and large font mode for improved accessibility.
- Account System: Secure user login using Google Account or Phone Number with OTP, storing profiles in a secure backend, and providing a guest mode.

## Style Guidelines:

- Primary color: Deep blue (#3B82F6) for a calming yet trustworthy feel.
- Background color (Light Mode): Light gray (#F9FAFB) to minimize eye strain.
- Background color (Dark Mode): Dark navy/charcoal (#1E1E2E) to minimize eye strain.
- Text color (Light Mode): Dark gray (#111827) for comfort.
- Text color (Dark Mode): Light gray (#E5E7EB) for readability.
- Accent color (Correct Placement): Green (#10B981) for correct placement feedback.
- Accent color (Error): Red (#EF4444) for incorrect entry.
- Accent color (Hint): Yellow (#FACC15) for hints or warnings.
- Grid Lines (Light Mode): Light gray (#D1D5DB).
- Grid Lines (Dark Mode): Dark gray (#374151).
- Selected Cell (Light Mode): Subtle blue highlight (#E0F2FE).
- Selected Cell (Dark Mode): Dark blue highlight (#334155).
- Glow / pulse for hints (soft green or blue shadow).
- Animation colors for achievements (gold gradient: #F59E0B → #FBBF24).
- Font: 'Roboto', a clean and readable sans-serif font suitable for all UI elements.
- Simple, minimalist icons for toolbar actions (Undo, Redo, Hint, etc.).
- Mobile-first, responsive design that adapts seamlessly to different screen sizes.
- Subtle transitions and animations for cell selection, move confirmation, and hints to enhance user feedback.