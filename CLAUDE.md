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
npm install

# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
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
├── components/             # Shared/reusable components
├── features/               # Feature-based modules
├── hooks/                  # Shared custom hooks
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── lib/                    # External library re-exports
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
- **Styling**: Tailwind CSS v4 with PostCSS
- **TypeScript**: Strict mode enabled
- **Fonts**: Geist Sans and Geist Mono (Google Fonts)
- **ESLint**: Next.js TypeScript configuration

### Project Status
- Frontend implements mobile-first email client UI
- Features: Folder list, email list with dynamic routing
- Backend directory exists but contains no files
- Located in Go workspace structure but no Go code present yet

### Key Configuration
- TypeScript path mapping: `@/*` maps to `./src/*`
- ESLint uses Next.js core web vitals and TypeScript rules
- Frontend is private package (not for publishing)