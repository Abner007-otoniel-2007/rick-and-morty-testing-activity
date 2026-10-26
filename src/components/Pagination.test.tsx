import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('muestra la página actual y el total', () => {
    render(<Pagination currentPage={2} totalPages={5} />);

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('en la primera página deshabilita Previous y habilita Next', () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    expect(screen.queryByRole('link', { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.getByText(/previous/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /next/i })).toHaveAttribute('href', '/?page=2');
  });

  it('en una página intermedia habilita ambos enlaces', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    expect(screen.getByRole('link', { name: /previous/i })).toHaveAttribute('href', '/?page=2');
    expect(screen.getByRole('link', { name: /next/i })).toHaveAttribute('href', '/?page=4');
  });

  it('en la última página deshabilita Next y habilita Previous', () => {
    render(<Pagination currentPage={5} totalPages={5} />);

    expect(screen.queryByRole('link', { name: /next/i })).not.toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /previous/i })).toHaveAttribute('href', '/?page=4');
  });

  it('con una sola página deshabilita ambos botones', () => {
    render(<Pagination currentPage={1} totalPages={1} />);

    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});