import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi } from 'vitest';
import App from './App';

vi.mock('@tsparticles/react', () => ({
  default: () => null,
  ParticlesProvider: ({ children }) => children
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);

  act(() => root.render(<App />));
  act(() => root.unmount());
});
