import { beforeEach, describe, expect, it, vi } from 'vitest';
import { detectFace, incrementEntries, register, signIn } from './api';

const validUser = {
  id: 1,
  name: 'Ada',
  email: 'ada@example.com',
  entries: 4,
  joined: '2026-08-23'
};

const jsonResponse = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

describe('api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('signs in with the expected request and validates the user', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(validUser));

    await expect(signIn({ email: 'ada@example.com', password: 'secret' })).resolves.toEqual(validUser);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://salty-escarpment-80825.herokuapp.com/signin',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'ada@example.com', password: 'secret' })
      })
    );
  });

  it('registers a valid user', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(validUser));

    await expect(register({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'secret'
    })).resolves.toEqual(validUser);
  });

  it('extracts normalized coordinates from a face response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
      outputs: [{
        data: {
          regions: [{
            region_info: {
              bounding_box: {
                left_col: 0.1,
                top_row: 0.2,
                right_col: 0.7,
                bottom_row: 0.8
              }
            }
          }]
        }
      }]
    }));

    await expect(detectFace('https://example.com/photo.jpg')).resolves.toEqual({
      leftCol: 0.1,
      topRow: 0.2,
      rightCol: 0.7,
      bottomRow: 0.8
    });
  });

  it('validates an incremented entry count', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(5));
    await expect(incrementEntries(1)).resolves.toBe(5);
  });

  it('rejects malformed and unsuccessful responses', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'wrong' }));
    await expect(signIn({ email: 'ada@example.com', password: 'secret' }))
      .rejects.toThrow('invalid user');

    fetchMock.mockResolvedValueOnce(jsonResponse({}, 500));
    await expect(incrementEntries(1)).rejects.toThrow('could not complete');
  });

  it('turns network failures into a user-safe error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    await expect(detectFace('https://example.com/photo.jpg')).rejects.toThrow('Unable to reach');
  });
});
