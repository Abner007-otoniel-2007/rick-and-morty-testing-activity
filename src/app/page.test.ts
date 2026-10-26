import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';
import { getCharacters } from '@/lib/api';
import { makeCharacter } from '@/test/fixtures';

vi.mock('@/lib/api');

const mockedGetCharacters = vi.mocked(getCharacters);

const response = {
  info: { count: 2, pages: 10, next: null, prev: null },
  results: [
    makeCharacter({ id: 1, name: 'Rick Sanchez' }),
    makeCharacter({ id: 2, name: 'Morty Smith' }),
  ],
};

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetCharacters.mockResolvedValue(response);
  });

  it('usa la página 1 cuando no hay parámetro page', async () => {
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(mockedGetCharacters).toHaveBeenCalledWith(1);
    expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();
  });

  it('usa el número de página indicado en la URL', async () => {
    render(await Home({ searchParams: Promise.resolve({ page: '3' }) }));

    expect(mockedGetCharacters).toHaveBeenCalledWith(3);
    expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
  });

  it('usa la página 1 si page no es un string', async () => {
    render(await Home({ searchParams: Promise.resolve({ page: ['2', '3'] }) }));

    expect(mockedGetCharacters).toHaveBeenCalledWith(1);
  });

  it('renderiza el título y una tarjeta por personaje', async () => {
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Rick and Morty Characters' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('propaga el error si la API falla', async () => {
    mockedGetCharacters.mockRejectedValue(new Error('Failed to fetch characters'));

    await expect(Home({ searchParams: Promise.resolve({}) })).rejects.toThrow(
      'Failed to fetch characters',
    );
  });
});