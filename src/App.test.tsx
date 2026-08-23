import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { detectFace, incrementEntries, signIn } from './api';

vi.mock('@tsparticles/react', () => ({
  default: () => null,
  ParticlesProvider: ({ children }: { children: ReactNode }) => children
}));

vi.mock('./api', () => ({
  signIn: vi.fn(),
  register: vi.fn(),
  detectFace: vi.fn(),
  incrementEntries: vi.fn(),
  getErrorMessage: (error: unknown) => error instanceof Error ? error.message : 'Something went wrong.'
}));

const user = {
  id: 1,
  name: 'Ada',
  email: 'ada@example.com',
  entries: 4,
  joined: '2026-08-23'
};

const changeInput = (input: HTMLInputElement, value: string) => {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  valueSetter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

describe('App', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.resetAllMocks();
    container = document.createElement('div');
    root = createRoot(container);
    act(() => root.render(<App />));
  });

  it('renders and changes between authentication routes', () => {
    expect(container.textContent).toContain('Sign In');

    const registerButton = Array.from(container.querySelectorAll('button'))
      .find((button) => button.textContent === 'Register');
    act(() => registerButton?.click());

    expect(container.querySelector('legend')?.textContent).toBe('Register');
    act(() => root.unmount());
  });

  it('loads a signed-in user and resets state on sign out', async () => {
    vi.mocked(signIn).mockResolvedValue(user);
    const email = container.querySelector<HTMLInputElement>('#signin-email');
    const password = container.querySelector<HTMLInputElement>('#signin-password');
    const form = container.querySelector('form');

    act(() => {
      if (email && password) {
        changeInput(email, user.email);
        changeInput(password, 'secret');
      }
    });
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Ada, your current rank is...');
    const signOutButton = Array.from(container.querySelectorAll('button'))
      .find((button) => button.textContent === 'Sign Out!');
    act(() => signOutButton?.click());

    expect(container.querySelector('legend')?.textContent).toBe('Sign In');
    expect(container.textContent).not.toContain('Ada, your current rank is...');
    act(() => root.unmount());
  });

  it('shows authentication failures inline', async () => {
    vi.mocked(signIn).mockRejectedValue(new Error('Sign in failed.'));
    const form = container.querySelector('form');

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.querySelector('[role="alert"]')?.textContent).toBe('Sign in failed.');
    act(() => root.unmount());
  });

  it('detects a face after the submitted image loads and updates the entry count', async () => {
    vi.mocked(signIn).mockResolvedValue(user);
    vi.mocked(detectFace).mockResolvedValue({
      leftCol: 0.1,
      topRow: 0.2,
      rightCol: 0.7,
      bottomRow: 0.8
    });
    vi.mocked(incrementEntries).mockResolvedValue(5);

    const email = container.querySelector<HTMLInputElement>('#signin-email');
    const password = container.querySelector<HTMLInputElement>('#signin-password');
    act(() => {
      if (email && password) {
        changeInput(email, user.email);
        changeInput(password, 'secret');
      }
    });
    await act(async () => {
      container.querySelector('form')?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    const imageUrlInput = container.querySelector<HTMLInputElement>('[aria-label="Image URL"]');
    act(() => {
      if (imageUrlInput) {
        changeInput(imageUrlInput, 'https://example.com/photo.jpg');
      }
    });
    const detectButton = Array.from(container.querySelectorAll('button'))
      .find((button) => button.textContent === 'Detect');
    await act(async () => detectButton?.click());

    const image = container.querySelector<HTMLImageElement>('#inputImage');
    expect(image).not.toBeNull();
    if (!image) {
      throw new Error('Submitted image did not render.');
    }
    Object.defineProperty(image, 'width', { configurable: true, value: 500 });
    Object.defineProperty(image, 'height', { configurable: true, value: 250 });
    act(() => image?.dispatchEvent(new Event('load')));

    const faceBox = container.querySelector<HTMLElement>('[data-testid="face-box"]');
    expect(faceBox?.style.left).toBe('50px');
    expect(faceBox?.style.top).toBe('50px');
    expect(faceBox?.style.right).toBe('150px');
    expect(faceBox?.style.bottom).toBe('50px');
    expect(container.textContent).toContain('5');
    act(() => root.unmount());
  });
});
