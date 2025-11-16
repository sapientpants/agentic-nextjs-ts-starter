function IntroSection() {
  return (
    <section className="intro">
      <p>
        A <strong>batteries-included</strong> Next.js + TypeScript starter template with:
      </p>
      <ul>
        <li>Next.js 16 with App Router</li>
        <li>React 19</li>
        <li>TypeScript 5.9 strict mode</li>
        <li>Node.js 22+</li>
        <li>pnpm 10 package manager</li>
        <li>Comprehensive testing (Vitest + React Testing Library)</li>
        <li>Code quality automation (ESLint, Prettier, Husky)</li>
        <li>Security scanning (CodeQL, OSV, Trivy)</li>
        <li>CI/CD with GitHub Actions</li>
      </ul>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="features">
      <h2>What is Agentic Development?</h2>
      <p>
        <strong>&quot;Agentic&quot; refers to AI-assisted development workflow</strong>, not AI
        agent runtime. This template is designed to work seamlessly with AI development tools like{' '}
        <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer">
          Claude Code
        </a>{' '}
        to enhance your productivity.
      </p>
    </section>
  );
}

function GettingStartedSection() {
  return (
    <section className="getting-started">
      <h2>Getting Started</h2>
      <ol>
        <li>
          Clone this repository:
          <code>git clone https://github.com/sapientpants/agentic-nextjs-ts-starter.git</code>
        </li>
        <li>
          Install dependencies: <code>pnpm install</code>
        </li>
        <li>
          Set up environment: <code>cp .env.local.example .env.local</code>
        </li>
        <li>
          Start development server: <code>pnpm dev</code>
        </li>
        <li>
          Open{' '}
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
            http://localhost:3000
          </a>
        </li>
      </ol>
    </section>
  );
}

function ApiSection() {
  return (
    <section className="api">
      <h2>API Routes</h2>
      <p>
        Try the health check endpoint:{' '}
        <a href="/api/health" target="_blank" rel="noopener noreferrer">
          /api/health
        </a>
      </p>
    </section>
  );
}

function PageFooter() {
  return (
    <footer>
      <p>
        Built with <a href="https://nextjs.org">Next.js</a> •{' '}
        <a href="https://github.com/sapientpants/agentic-nextjs-ts-starter">View on GitHub</a>
      </p>
    </footer>
  );
}

export default function HomePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'agentic-nextjs-ts-starter';

  return (
    <main className="container">
      <h1>Welcome to {appName}</h1>
      <IntroSection />
      <FeaturesSection />
      <GettingStartedSection />
      <ApiSection />
      <PageFooter />
    </main>
  );
}
