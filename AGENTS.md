# AGENTS.md - Project Context

## Stack & Setup
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Project Type**: Web Application (Tetris Game)

## TanStack CLI Note
The project was built on an existing React + Vite + Tailwind CSS template. The TanStack CLI scaffolding (`npx @tanstack/cli@latest create`) was noted but the existing platform template already provided the required React + Vite + Tailwind stack. TanStack Query was not added as it's not needed for a self-contained Tetris game (no server state management required).

## Architecture
- `src/App.tsx` - Main application component with game layout
- `src/hooks/useTetris.ts` - Core game logic (state management, game loop, collision detection)
- `src/components/Board.tsx` - Game board rendering with ghost piece
- `src/components/NextPiece.tsx` - Next piece preview
- `src/components/ScorePanel.tsx` - Score, level, and lines display
- `src/components/Controls.tsx` - Mobile touch controls
- `src/constants/tetrominos.ts` - Game constants and piece definitions
- `src/types.ts` - TypeScript type definitions

## Key Decisions
- Game state managed entirely in a custom hook (`useTetris`)
- No external state management needed (no TanStack Query required for client-only game)
- Ghost piece shows where the current piece will land
- Wall kick system for rotation near edges
- Responsive design with mobile touch controls
- Keyboard controls: Arrow keys/WASD for movement, Space for hard drop, P/ESC for pause

## Controls
- ← → or A/D: Move left/right
- ↑ or W: Rotate
- ↓ or S: Soft drop
- Space: Hard drop
- P or Escape: Pause/Resume
- Enter: Start/Restart game

## Scoring
- Single line: 100 × (level + 1)
- Double: 300 × (level + 1)
- Triple: 500 × (level + 1)
- Tetris (4 lines): 800 × (level + 1)
- Soft drop: 1 point per cell
- Hard drop: 2 points per cell

## Environment Variables
None required. This is a fully client-side application.

## Deployment
Static site - deploy `dist/` folder to any static hosting (Vercel, Netlify, GitHub Pages, etc.)
