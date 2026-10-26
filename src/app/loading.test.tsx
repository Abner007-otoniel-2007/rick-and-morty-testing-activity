import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Loading from './loading';

describe('Loading', () => {
  it('renderiza 8 tarjetas skeleton', () => {
    const { container } = render(<Loading />);

    expect(container.querySelectorAll('.h-96.animate-pulse')).toHaveLength(8);
  });

  it('renderiza el título skeleton además de las tarjetas', () => {
    const { container } = render(<Loading />);

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(9);
  });
});