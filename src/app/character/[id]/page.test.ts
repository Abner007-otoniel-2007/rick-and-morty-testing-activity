import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterPage from './page';
import { getCharacter, getEpisodes } from '@/lib/api';
import { makeCharacter, makeEpisode } from '@/test/fixtures';

vi.mock('@/lib/api');

const mockedGetCharacter = vi.mocked(getCharacter);
const mockedGetEpisodes = vi.mocked(getEpisodes);

const renderPage = async (id = '1') =>
  render(await CharacterPage({ params: Promise.resolve({ id }) }));

describe('CharacterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetCharacter.mockResolvedValue(makeCharacter());
    mockedGetEpisodes.mockResolvedValue([
      makeEpisode({ id: 1, episode: 'S01E01', name: 'Pilot', air_date: 'December 2, 2013' }),
      makeEpisode({ id: 2, episode: 'S01E02', name: 'Lawnmower Dog', air_date: 'December 9, 2013' }),
    ]);
  });

  it('consulta el personaje por id y los episodios por los ids de sus URLs', async () => {
    await renderPage('1');

    expect(mockedGetCharacter).toHaveBeenCalledWith('1');
    expect(mockedGetEpisodes).toHaveBeenCalledWith(['1', '2']);
  });

  it('muestra nombre, estado, especie, género, origen y ubicación', async () => {
    await renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('formatea la fecha de creación', async () => {
    await renderPage();

    expect(screen.getByText('November 4, 2017')).toBeInTheDocument();
  });

  it('muestra "Unknown" cuando el tipo está vacío', async () => {
    await renderPage();

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('muestra el tipo cuando existe', async () => {
    mockedGetCharacter.mockResolvedValue(makeCharacter({ type: 'Genetic experiment' }));

    await renderPage();

    expect(screen.getByText('Genetic experiment')).toBeInTheDocument();
  });

  it('lista los episodios con su contador y título', async () => {
    await renderPage();

    expect(screen.getByText('Episodes (2)')).toBeInTheDocument();
    expect(screen.getByText('S01E01')).toHaveAttribute('title', 'Pilot - December 2, 2013');
    expect(screen.getByText('S01E02')).toHaveAttribute(
      'title',
      'Lawnmower Dog - December 9, 2013',
    );
  });

  it('muestra 0 episodios cuando no hay ninguno', async () => {
    mockedGetCharacter.mockResolvedValue(makeCharacter({ episode: [] }));
    mockedGetEpisodes.mockResolvedValue([]);

    await renderPage();

    expect(screen.getByText('Episodes (0)')).toBeInTheDocument();
  });

  it('incluye un enlace para volver a la lista', async () => {
    await renderPage();

    expect(screen.getByRole('link', { name: /back to characters/i })).toHaveAttribute('href', '/');
  });

  it('renderiza la imagen del personaje', async () => {
    const character = makeCharacter();
    await renderPage();

    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toHaveAttribute('src', character.image);
  });

  it.each([
    ['Alive', 'bg-green-500'],
    ['Dead', 'bg-red-500'],
    ['unknown', 'bg-gray-500'],
  ] as const)('usa el indicador de color correcto para %s', async (status, colorClass) => {
    mockedGetCharacter.mockResolvedValue(makeCharacter({ status }));

    const { container } = await renderPage();

    expect(container.querySelector('span.rounded-full')).toHaveClass(colorClass);
  });

  it('propaga el error si el personaje no se puede cargar', async () => {
    mockedGetCharacter.mockRejectedValue(new Error('Failed to fetch character details'));

    await expect(CharacterPage({ params: Promise.resolve({ id: '999' }) })).rejects.toThrow(
      'Failed to fetch character details',
    );
  });
});