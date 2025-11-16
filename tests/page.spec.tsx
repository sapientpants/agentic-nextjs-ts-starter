import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Welcome to/i);
  });

  it('displays the app name from environment variable', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/agentic-nextjs-ts-starter/i);
  });

  it('displays the features section', () => {
    render(<HomePage />);
    expect(screen.getByText(/What is Agentic Development/i)).toBeInTheDocument();
  });

  it('displays getting started instructions', () => {
    render(<HomePage />);
    expect(screen.getByText(/Getting Started/i)).toBeInTheDocument();
    expect(screen.getByText(/pnpm install/i)).toBeInTheDocument();
  });

  it('includes a link to the health check endpoint', () => {
    render(<HomePage />);
    const healthLink = screen.getByRole('link', { name: /\/api\/health/i });
    expect(healthLink).toBeInTheDocument();
    expect(healthLink).toHaveAttribute('href', '/api/health');
  });

  it('includes links to external resources', () => {
    render(<HomePage />);

    // Claude Code link
    const claudeLink = screen.getByRole('link', { name: /Claude Code/i });
    expect(claudeLink).toHaveAttribute('href', 'https://claude.ai/code');
    expect(claudeLink).toHaveAttribute('target', '_blank');
    expect(claudeLink).toHaveAttribute('rel', 'noopener noreferrer');

    // GitHub link
    const githubLink = screen.getByRole('link', { name: /View on GitHub/i });
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/sapientpants/agentic-nextjs-ts-starter',
    );
  });

  it('displays a list of features', () => {
    render(<HomePage />);
    expect(screen.getByText(/Next.js 16 with App Router/i)).toBeInTheDocument();
    expect(screen.getByText(/React 19/i)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript 5\.9 strict mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Node\.js 22\+/i)).toBeInTheDocument();
    expect(screen.getByText(/pnpm 10 package manager/i)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive testing/i)).toBeInTheDocument();
  });
});
