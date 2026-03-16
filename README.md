# Yagimail

A mobile-first web email client that connects to IMAP servers (Gmail, Outlook, Yahoo Mail, etc.).

## Tech Stack

### Frontend
- Next.js 15 (App Router) / React 19 / TypeScript
- Tailwind CSS v4
- pnpm

### Backend
- Spring Boot 4.0.1 / Kotlin
- JavaMail (IMAP)- Gradle

## Getting Started

### Prerequisites
- Node.js v24+
- pnpm
- JDK 17+

### Backend

```bash
cd backend
```

Configure IMAP credentials in `src/main/resources/application.properties`:

```properties
MAIL_IMAP_HOST=imap.gmail.com
MAIL_IMAP_USERNAME=your-email@gmail.com
MAIL_IMAP_PASSWORD=your-app-password
```

Start the server:

```bash
./gradlew bootRun
```

The API runs on http://localhost:8080.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The app runs on http://localhost:3000.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/folders` | List mail folders |
| GET | `/api/v1/folders/{folderId}/mails` | List emails in a folder |
| GET | `/api/v1/folders/{folderId}/mails/{mailId}` | Get email detail |

See [docs/openapi.yaml](docs/openapi.yaml) for the full API specification.

## Project Structure

```
yagimail/
├── frontend/           # Next.js web application
│   └── src/
│       ├── app/        # Pages (App Router)
│       ├── components/ # Shared UI components
│       ├── features/   # Feature modules (emails, folders)
│       ├── hooks/      # Custom React hooks
│       ├── types/      # TypeScript type definitions
│       └── utils/      # Utility functions
├── backend/            # Spring Boot API
│   └── src/main/kotlin/com/example/yagimail/
│       ├── controller/ # REST controllers
│       ├── usecase/    # Business logic
│       ├── domain/     # Models and gateway interfaces
│       └── gateways/   # IMAP implementations
└── docs/               # API documentation
```

## Development

```bash
# Lint
pnpm --prefix frontend lint

# Format
pnpm --prefix frontend format

# Type check
pnpm --prefix frontend typecheck
```

CI runs these checks automatically on pushes to `main` and `feature/*` branches via GitHub Actions.

## License

Private
