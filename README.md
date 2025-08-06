# Kasigo

A web application with Playwright automation capabilities using a distributed grid.

## Features

- **Todo Management**: Create, toggle, and delete todos
- **Authentication**: User registration and login
- **Distributed Playwright Automation**: Execute automation scripts using a horizontally-scalable browser grid

## Distributed Automation Feature

The application includes a playwright-distributed system that provides:

1. **Horizontal Scaling**: Add/remove browser workers as needed
2. **Warm Browser Instances**: No startup delays for automation
3. **Isolated Contexts**: Each automation gets a fresh browser context
4. **Load Balancing**: Smart worker selection across the grid
5. **Single WebSocket Endpoint**: Connect to all workers through one URL

### Architecture

```
Your App → WebSocket → Proxy → Workers → Redis
```

- **Proxy**: Routes connections and balances load
- **Workers**: Run browser instances and handle automation
- **Redis**: Coordinates worker discovery and health checks

### How to Use

1. **Start the Distributed Grid**:
   ```bash
   # Clone and start playwright-distributed
   git clone https://github.com/mbroton/playwright-distributed.git
   cd playwright-distributed
   docker-compose up -d
   ```

2. **Start the Application**:
   ```bash
   # Terminal 1 - Start backend
   cd apps/server && pnpm dev
   
   # Terminal 2 - Start frontend  
   cd apps/web && pnpm dev
   ```

3. **Test the Grid Connection**:
   ```bash
   # Test the distributed grid connection
   node test-grid-connection.js
   ```

4. **Use the Automation Interface**:
   - Open http://localhost:3001/automation
   - View the grid status (connected/disconnected)
   - Execute automation scripts
   - View results and screenshots

### Current Automation Scripts

#### Hacker News Navigation
- Connects to the distributed grid
- Navigates to https://news.ycombinator.com/
- Captures screenshot and returns page title

#### Custom Scripts
- Support for multiple actions: click, type, wait, navigate, screenshot
- Example: Google search automation
- Extensible for complex automation workflows

### Benefits of Distributed Grid

| Feature | Benefit |
|---------|---------|
| **Horizontal Scaling** | Add workers to increase throughput |
| **Warm Browsers** | No startup delays |
| **Isolated Contexts** | Fresh browser state for each automation |
| **Load Balancing** | Smart worker selection |
| **Stateless Design** | Easy to scale and maintain |

## Development

### Prerequisites

- Node.js
- pnpm
- Docker (for distributed grid)
- Docker Compose

### Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Start the Distributed Grid**:
   ```bash
   # Clone playwright-distributed
   git clone https://github.com/mbroton/playwright-distributed.git
   cd playwright-distributed
   docker-compose up -d
   ```

3. **Start the Database**:
   ```bash
   cd apps/server && pnpm db:start
   ```

4. **Run Migrations**:
   ```bash
   cd apps/server && pnpm db:migrate
   ```

5. **Start the Application**:
   ```bash
   # Terminal 1
   cd apps/server && pnpm dev
   
   # Terminal 2  
   cd apps/web && pnpm dev
   ```

### Testing the Grid

```bash
# Test grid connection
node test-grid-connection.js

# Expected output:
# ✅ Successfully connected to distributed grid
# ✅ Browser context created
# ✅ New page created
# ✅ Successfully navigated to Hacker News
# 📄 Page title: Hacker News
# ✅ Screenshot captured
# ✅ Browser connection closed
# 🎉 All tests passed!
```

### Project Structure

```
kasigo/
├── apps/
│   ├── server/           # Backend with tRPC and Playwright
│   │   ├── src/
│   │   │   ├── routers/
│   │   │   │   └── automation.ts  # Distributed grid automation
│   │   │   └── ...
│   │   └── ...
│   └── web/             # Frontend with React and TanStack Router
│       ├── src/
│       │   ├── routes/
│       │   │   └── automation.tsx  # Automation interface
│       │   └── ...
│       └── ...
├── test-grid-connection.js  # Grid connection test
└── ...
```

### Grid Configuration

The application connects to the distributed grid at `ws://localhost:8080`. You can:

- **Scale Workers**: `docker-compose up -d --scale worker=5`
- **Monitor Health**: Check the automation page for grid status
- **Add Custom Scripts**: Extend the automation router with new procedures

## Technologies Used

- **Backend**: Fastify, tRPC, Drizzle ORM, Playwright
- **Frontend**: React, TanStack Router, Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: Better Auth
- **Distributed Grid**: playwright-distributed (Docker-based)
