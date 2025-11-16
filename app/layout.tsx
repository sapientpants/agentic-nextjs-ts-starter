import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agentic Next.js + TypeScript Starter',
  description:
    'A batteries-included Next.js starter template with comprehensive testing, code quality automation, and security scanning. Built for modern Next.js development with AI-assisted (agentic) coding workflow.',
  keywords: [
    'nextjs',
    'typescript',
    'starter',
    'template',
    'agentic',
    'ai-assisted',
    'testing',
    'code-quality',
  ],
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
