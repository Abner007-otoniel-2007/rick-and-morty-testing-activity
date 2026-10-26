import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPage from './error';

describe('Error page', () => {
  it('muestra el mensaje de error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ErrorPage error={new Error('boom')} reset={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Something went wrong!' })).toBeInTheDocument();
    expect(screen.getByText(/couldn't load the characters/i)).toBeInTheDocument();
  });

  it('registra el error en consola', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('boom');

    render(<ErrorPage error={error} reset={vi.fn()} />);

    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  it('llama a reset al hacer clic en "Try again"', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reset = vi.fn();
    const user = userEvent.setup();

    render(<ErrorPage error={new Error('boom')} reset={reset} />);
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});