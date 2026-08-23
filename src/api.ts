import type {
  NormalizedFaceBox,
  RegistrationDetails,
  SignInCredentials,
  User
} from './types';

const DEFAULT_API_BASE_URL = 'https://salty-escarpment-80825.herokuapp.com';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isUser = (value: unknown): value is User =>
  isRecord(value) &&
  typeof value.id === 'number' &&
  typeof value.name === 'string' &&
  typeof value.email === 'string' &&
  typeof value.entries === 'number' &&
  typeof value.joined === 'string';

const parseFace = (value: unknown): NormalizedFaceBox | null => {
  if (!isRecord(value) || !Array.isArray(value.outputs)) {
    return null;
  }

  const output = value.outputs[0];
  if (!isRecord(output) || !isRecord(output.data) || !Array.isArray(output.data.regions)) {
    return null;
  }

  const region = output.data.regions[0];
  if (!isRecord(region) || !isRecord(region.region_info)) {
    return null;
  }

  const box = region.region_info.bounding_box;
  if (
    !isRecord(box) ||
    typeof box.left_col !== 'number' ||
    typeof box.top_row !== 'number' ||
    typeof box.right_col !== 'number' ||
    typeof box.bottom_row !== 'number'
  ) {
    return null;
  }

  return {
    leftCol: box.left_col,
    topRow: box.top_row,
    rightCol: box.right_col,
    bottomRow: box.bottom_row
  };
};

const request = async (path: string, method: 'POST' | 'PUT', body: unknown): Promise<unknown> => {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch {
    throw new ApiError('Unable to reach the server. Please try again.');
  }

  if (!response.ok) {
    throw new ApiError('The server could not complete the request. Please try again.');
  }

  try {
    return await response.json() as unknown;
  } catch {
    throw new ApiError('The server returned an invalid response.');
  }
};

export const signIn = async (credentials: SignInCredentials): Promise<User> => {
  const value = await request('/signin', 'POST', credentials);
  if (!isUser(value)) {
    throw new ApiError('The server returned an invalid user.');
  }
  return value;
};

export const register = async (details: RegistrationDetails): Promise<User> => {
  const value = await request('/register', 'POST', details);
  if (!isUser(value)) {
    throw new ApiError('The server returned an invalid user.');
  }
  return value;
};

export const detectFace = async (input: string): Promise<NormalizedFaceBox> => {
  const value = await request('/image', 'POST', { input });
  const face = parseFace(value);
  if (!face) {
    throw new ApiError('No face data was returned for this image.');
  }
  return face;
};

export const incrementEntries = async (id: number): Promise<number> => {
  const value = await request('/image', 'PUT', { id });
  if (typeof value !== 'number') {
    throw new ApiError('The server returned an invalid entry count.');
  }
  return value;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Something went wrong. Please try again.';
