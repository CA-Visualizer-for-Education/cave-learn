# CAVE Learn

Interactive frontend for learning Clean Architecture — part of the CAVE (CA Visualizer for Education) project.

## Pages

| Route | Description |
|---|---|
| `/` | Home page — hero + two step cards |
| `/diagram` | Interactive Clean Architecture diagram with component sidebar |
| `/exercise` | Drag-and-drop exercise: place components into their correct layers |

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- TypeScript
- Plain CSS with CSS Modules
- Google Fonts: Bricolage Grotesque, Plus Jakarta Sans, JetBrains Mono

## Setting up the repo

**If you are cloning this for the first time:**

```bash
git clone https://github.com/CA-Visualizer-for-Education/cave-learn.git
cd cave-learn
npm install
npm run dev
```

## Getting started

```bash
npm install
npm run dev
```

## Navigating to your page

Once the dev server is running, open your browser to the URL for the page you are working on:

| Page | URL |
|---|---|
| Home | http://localhost:3000 |
| Diagram | http://localhost:3000/diagram |
| Exercise | http://localhost:3000/exercise |

## DEV 

All design tokens (colors, fonts, spacing, radius) are defined as CSS custom properties in [`app/globals.css`](app/globals.css). Read the comments at the top of that file before writing any CSS.

## Project structure

```
app/
  globals.css          ← CAVE design system — read this first
  layout.tsx           ← root layout, loads fonts, renders Navbar
  page.tsx             ← home page (/)
  diagram/page.tsx     ← diagram page (/diagram)
  exercise/page.tsx    ← exercise page (/exercise)

components/
  layout/Navbar.tsx                                                           ← shared top nav bar
  home/HeroSection.tsx                                                        ← home page hero block
  home/StepCard.tsx                                                           ← reusable lesson step card
  diagram/CADiagram.tsx                                                       ← interactive CA diagram canvas
  diagram/DiagramLegend.tsx                                                   ← legend below the diagram
  diagram/ComponentSidebar.tsx                                                ← right panel showing clicked component info
  exercise/ExerciseBoard.tsx                                                  ← drag-and-drop diagram board
  exercise/ComponentPieces/ComponentPieces.tsx                                ← draggable chip pieces panel
  exercise/ComponentPiecesDroppableArea/ComponentPiecesDroppableArea.tsx      ← droppable area for chip pieces
  exercise/ComponentBoard/ComponentBoard.tsx                                  ← image of the CA Diagram and where droppable areas are located
  exercise/ExerciseBoardSidebar/ExerciseBoardSidebar.tsx                      ← location of draggable chips and status
  exercise/ExerciseBoardSubheader/ExerciseBoardSubheader.tsx                  ← location of page title

lib/
  ca-data.ts           ← all CA layers + component data (import from here, never hardcode)
```
