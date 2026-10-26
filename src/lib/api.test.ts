import { describe, it, expect, vi } from 'vitest';
import { getCharacters, getCharacter, getEpisodes } from './api';
import { makeCharacter, makeEpisode } from '@/test/fixtures';

const mockFetch = (data: unknown, ok = true) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    json: async () => data,
  } as Response);

describe('getCharacters', () => {
  it('consulta la página 1 por defecto', async () => {
    const payload = { info: { count: 1, pages: 1, next: null, prev: null }, results: [makeCharacter()] };
    const spy = mockFetch(payload);

    const result = await getCharacters();

    expect(spy).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1');
    expect(result).toEqual(payload);
  });

  it('consulta la página indicada', async () => {
    const spy = mockFetch({ info: {}, results: [] });

    await getCharacters(3);

    expect(spy).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=3');
  });

  it('lanza error si la respuesta no es ok', async () => {
    mockFetch(null, false);

    await expect(getCharacters()).rejects.toThrow('Failed to fetch characters');
  });
});

describe('getCharacter', () => {
  it('devuelve el personaje solicitado', async () => {
    const character = makeCharacter({ id: 7 });
    const spy = mockFetch(character);

    const result = await getCharacter('7');

    expect(spy).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/7');
    expect(result).toEqual(character);
  });

  it('lanza error si la respuesta no es ok', async () => {
    mockFetch(null, false);

    await expect(getCharacter('999')).rejects.toThrow('Failed to fetch character details');
  });
});

describe('getEpisodes', () => {
  it('devuelve un arreglo vacío sin llamar a fetch cuando no hay ids', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');

    const result = await getEpisodes([]);

    expect(result).toEqual([]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('une los ids con comas y devuelve el arreglo de episodios', async () => {
    const episodes = [makeEpisode({ id: 1 }), makeEpisode({ id: 2, episode: 'S01E02' })];
    const spy = mockFetch(episodes);

    const result = await getEpisodes(['1', '2']);

    expect(spy).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1,2');
    expect(result).toEqual(episodes);
  });

  it('envuelve en arreglo cuando la API devuelve un solo objeto', async () => {
    const episode = makeEpisode();
    mockFetch(episode);

    const result = await getEpisodes(['1']);

    expect(result).toEqual([episode]);
  });

  it('lanza error si la respuesta no es ok', async () => {
    mockFetch(null, false);

    await expect(getEpisodes(['1'])).rejects.toThrow('Failed to fetch episodes');
  });
});