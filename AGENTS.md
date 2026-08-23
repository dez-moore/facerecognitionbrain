# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite-powered React frontend. Application code lives in `src/`; `src/index.jsx` mounts the app, while `src/App.jsx` owns routing, user state, and calls to the face-recognition backend. UI features are grouped under `src/components/<Component>/`, with component-specific CSS and images colocated where needed (for example, `src/components/Logo/brain.png`). Global styles are in `src/index.css` and `src/App.css`. Static files copied directly into the build belong in `public/`. Tests currently sit beside source files, as in `src/App.test.jsx`.

## Build, Test, and Development Commands

- `npm install` installs the versions recorded in `package-lock.json`.
- `npm start` launches the development server at `http://localhost:3000` with hot reload and ESLint feedback.
- `npm test` runs Jest through React Scripts in interactive watch mode.
- `npm run test:run` performs a single test run suitable for CI or pre-push checks.
- `npm run build` creates an optimized production bundle in `build/`.

Avoid `npm run eject`; it is irreversible and is not required for normal development.

## Coding Style & Naming Conventions

Follow the existing JavaScript and JSX style: ES modules, semicolons, single-quoted strings, and two-space indentation in new or reformatted code. Name React components and their folders in PascalCase (`FaceRecognition/FaceRecognition.jsx`); use camelCase for variables, state fields, and handlers (`onInputChange`). Keep feature styles beside their component and use `.css` filenames matching the component. Use `.jsx` for files containing JSX and `.js` for plain JavaScript.

## Testing Guidelines

Tests use Vitest with React DOM helpers in jsdom. Name tests `*.test.jsx` and colocate them with the code under test. Add coverage for rendering, route changes, state updates, and mocked `fetch` success/failure paths when changing those behaviors. Run the non-watch test command and a production build before opening a pull request. No numeric coverage threshold is configured; prioritize meaningful regression tests.

## Commit & Pull Request Guidelines

History favors short, imperative, lowercase subjects such as `connect to backend` and `clear state`; dependency updates use `Bump <package> from <old> to <new>`. Keep each commit focused. Pull requests should summarize behavior changes, list verification commands, link relevant issues, and include screenshots for visible UI changes. Call out backend/API contract changes explicitly.

## Security & Configuration

Do not commit credentials, API keys, or real user data. Backend URLs are currently embedded in UI code; when changing environments, prefer `REACT_APP_*` variables and document required values without committing secrets.
