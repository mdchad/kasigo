# Kasigo

A web application with Playwright automation capabilities.

## Features

- **Todo Management**: Create, toggle, and delete todos
- **Authentication**: User registration and login
- **Playwright Automation**: Execute automation scripts from the frontend

## Automation Feature

The application includes a Playwright automation system that allows you to:

1. **Execute Automation Scripts**: Run Playwright scripts from the backend
2. **Simple Test Script**: Navigate to Hacker News and capture screenshots
3. **Frontend Interface**: Easy-to-use web interface to trigger automation

### How to Use

1. Start the servers:
   ```bash
   # Terminal 1 - Start backend
   cd apps/server && pnpm dev
   
   # Terminal 2 - Start frontend  
   cd apps/web && pnpm dev
   ```

2. Navigate to the Automation page:
   - Open http://localhost:3001/automation
   - Click "Execute Script" to run the Hacker News navigation test
   - View the results including screenshot and page title

### Current Automation Script

The current script performs a simple test:
- Launches Chromium browser in headless mode
- Navigates to https://news.ycombinator.com/
- Captures a screenshot
- Returns the page title and screenshot as base64

### Adding New Automation Scripts

To add new automation scripts:

1. Add new procedures to `apps/server/src/routers/automation.ts`
2. Create corresponding frontend components in `apps/web/src/routes/automation.tsx`
3. The automation router supports any Playwright operations

## Development

### Prerequisites

- Node.js
- pnpm
- Docker (for database)

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Install Playwright browsers:
   ```bash
   cd apps/server && pnpx playwright install chromium
   ```

3. Start the database:
   ```bash
   cd apps/server && pnpm db:start
   ```

4. Run migrations:
   ```bash
   cd apps/server && pnpm db:migrate
   ```

5. Start the development servers:
   ```bash
   # Terminal 1
   cd apps/server && pnpm dev
   
   # Terminal 2  
   cd apps/web && pnpm dev
   ```

### Project Structure

```
kasigo/
├── apps/
│   ├── server/           # Backend with tRPC and Playwright
│   │   ├── src/
│   │   │   ├── routers/
│   │   │   │   └── automation.ts  # Playwright automation router
│   │   │   └── ...
│   │   └── ...
│   └── web/             # Frontend with React and TanStack Router
│       ├── src/
│       │   ├── routes/
│       │   │   └── automation.tsx  # Automation page
│       │   └── ...
│       └── ...
└── ...
```

## Technologies Used

- **Backend**: Fastify, tRPC, Drizzle ORM, Playwright
- **Frontend**: React, TanStack Router, Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: Better Auth
