import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// next/image y next/link se simplifican para poder probarlos en jsdom
vi.mock('next/image', async () => {
  const { createElement } = await import('react');
  return {
    default: (props: { src: string; alt: string; className?: string }) =>
      createElement('img', {
        src: props.src,
        alt: props.alt,
        className: props.className,
      }),
  };
});

vi.mock('next/link', async () => {
  const { createElement } = await import('react');
  return {
    default: (props: {
      href: string;
      className?: string;
      children?: React.ReactNode;
    }) =>
      createElement(
        'a',
        { href: props.href, className: props.className },
        props.children,
      ),
  };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});