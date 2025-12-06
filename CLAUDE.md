# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Yagimail is a monorepo with separate frontend and backend directories:

- **Frontend**: Next.js 15 application with React 19, TypeScript, and Tailwind CSS
- **Backend**: Empty directory (backend implementation not yet started)

## Commands

### Frontend Development
```bash
# Navigate to frontend directory first
cd frontend

# Install dependencies
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check code formatting
pnpm format:check

# Type checking
pnpm typecheck
```

### Development Server
- Frontend runs on http://localhost:3000
- Uses Turbopack for faster development builds

## Architecture Guidelines

### Code Organization (Bulletproof React)
This project follows [Bulletproof React](https://github.com/alan2207/bulletproof-react) architecture patterns:

```
frontend/src/
├── app/                    # Next.js App Router pages
│   ├── sp/                 # Mobile-specific pages
│   │   └── folder/         # Email folder structure
│   └── globals.css         # Global styles
├── components/             # Shared/reusable components
│   └── ui/                 # UI components (header, navigation, icons)
├── features/               # Feature-based modules
│   ├── emails/             # Email-related functionality
│   └── folders/            # Folder management
├── hooks/                  # Shared custom hooks
├── contexts/               # React contexts for state management
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── lib/                    # External library re-exports and data
    └── data/               # Mock data for development
```

**Key Rules:**
- **Feature-based architecture**: Group related functionality in `features/` directory
- **Shared resources**: Put reusable components, hooks, types, and utils at root level
- **lib/ directory**: ONLY for re-exporting external libraries with custom configurations
- **Component co-location**: Keep components, their tests, and styles together
- **Barrel exports**: Use `index.ts` files for clean imports

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **React**: Version 19
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4 with PostCSS
- **TypeScript**: Strict mode enabled
- **Code Quality**: ESLint + Prettier with TypeScript configuration
- **Fonts**: Geist Sans and Geist Mono (Google Fonts)

### Project Status
- Frontend implements mobile-first email client UI
- Features: Folder list, email list with dynamic routing, email context management
- UI components: Header, bottom navigation, folder icons, mail icons
- Mock data structure in place for development
- Backend directory exists but contains no files
- Located in Go workspace structure but no Go code present yet
- CI/CD configured with GitHub Actions for linting, formatting, and type checking

### Key Configuration
- TypeScript path mapping: `@/*` maps to `./src/*`
- ESLint uses Next.js core web vitals and TypeScript rules
- Prettier configured with specific formatting rules
- Frontend is private package (not for publishing)
- CI workflow runs on pushes to main and feature branches
- Quality checks: linting, formatting, and type checking enforced