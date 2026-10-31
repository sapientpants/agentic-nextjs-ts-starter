import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import RootLayout, { metadata } from '../app/layout';

describe('RootLayout', () => {
  it('renders an English html document with the children inside body', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>child content</main>
      </RootLayout>,
    );

    // React may emit an empty <head> before <body>; the layout itself adds nothing to it.
    expect(markup).toMatch(/^<html lang="en">(?:<head><\/head>)?<body>/);
    expect(markup).toContain('<body><main>child content</main></body>');
    expect(markup).toMatch(/<\/body><\/html>$/);
  });

  it('renders children exactly once and nothing else inside body', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <p>only child</p>
      </RootLayout>,
    );

    expect(markup).toMatch(
      /^<html lang="en">(?:<head><\/head>)?<body><p>only child<\/p><\/body><\/html>$/,
    );
  });

  it('exports site metadata with a title, description and keywords', () => {
    expect(metadata.title).toBe('Agentic Next.js + TypeScript Starter');
    expect(typeof metadata.description).toBe('string');
    expect(metadata.description).not.toHaveLength(0);
    expect(metadata.keywords).toEqual(expect.arrayContaining(['nextjs', 'typescript', 'agentic']));
  });
});
