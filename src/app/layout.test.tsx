import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('./globals.css', () => ({}));
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist-sans-var' }),
  Geist_Mono: () => ({ variable: 'geist-mono-var' }),
}));

import RootLayout, { metadata } from './layout';

describe('RootLayout', () => {
  it('define los metadatos de la aplicación', () => {
    expect(metadata.title).toBe('Rick and Morty Explorer');
    expect(metadata.description).toBe('Explore the Rick and Morty universe');
  });

  it('renderiza los hijos dentro del layout', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>Contenido de prueba</p>
      </RootLayout>,
    );

    expect(html).toContain('<html lang="en"');
    expect(html).toContain('Contenido de prueba');
  });

  it('incluye el header con navegación y el enlace a la documentación', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <div />
      </RootLayout>,
    );

    expect(html).toContain('Rick &amp; Morty App');
    expect(html).toContain('Characters');
    expect(html).toContain('API Docs');
    expect(html).toContain('https://rickandmortyapi.com/documentation');
  });

  it('incluye el footer con el crédito a la API y aplica las fuentes', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <div />
      </RootLayout>,
    );

    expect(html).toContain('The Rick and Morty API');
    expect(html).toContain('geist-sans-var');
    expect(html).toContain('geist-mono-var');
  });
});