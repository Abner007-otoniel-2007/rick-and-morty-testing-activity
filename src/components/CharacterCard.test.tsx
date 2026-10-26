import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterCard from './CharacterCard';
import { makeCharacter } from '@/test/fixtures';
import type { Character } from '@/types/rickandmorty';

describe('CharacterCard', () => {
  it('muestra nombre, estado, especie y ubicación', () => {
    render(<CharacterCard character={makeCharacter()} />);

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Last known location:')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('enlaza al detalle del personaje', () => {
    render(<CharacterCard character={makeCharacter({ id: 42 })} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/character/42');
  });

  it('renderiza la imagen con src y alt correctos', () => {
    const character = makeCharacter();
    render(<CharacterCard character={character} />);

    const img = screen.getByRole('img', { name: 'Rick Sanchez' });
    expect(img).toHaveAttribute('src', character.image);
  });

  it.each([
    ['Alive', 'bg-green-500'],
    ['Dead', 'bg-red-500'],
    ['unknown', 'bg-gray-500'],
  ] as const)('usa el color correcto para el estado %s', (status, colorClass) => {
    const { container } = render(<CharacterCard character={makeCharacter({ status })} />);

    expect(container.querySelector('span.rounded-full')).toHaveClass(colorClass);
  });

  it('usa gris por defecto cuando el estado no está mapeado', () => {
    const character = makeCharacter({ status: 'Other' as unknown as Character['status'] });
    const { container } = render(<CharacterCard character={character} />);

    expect(container.querySelector('span.rounded-full')).toHaveClass('bg-gray-500');
  });
});