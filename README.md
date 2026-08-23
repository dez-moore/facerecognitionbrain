# Face Recognition Brain

A Vite-powered React and TypeScript frontend that submits image URLs to a face-recognition backend and displays the detected face location.

## Requirements

- Node.js compatible with Vite 8
- npm

## Setup

Install dependencies:

```sh
npm install
```

The app uses the existing hosted backend by default. To use another backend, copy `.env.example` to `.env.local` and set:

```sh
VITE_API_BASE_URL=http://localhost:3001
```

Do not commit credentials or environment-specific secrets.

## Commands

- `npm start` starts the Vite development server. Vite prints the local URL in the terminal.
- `npm run typecheck` runs the strict TypeScript compiler without emitting files.
- `npm test` starts Vitest in watch mode.
- `npm run test:run` runs the test suite once.
- `npm run build` type-checks the project and creates a production bundle in `dist/`.
